import {
  LINUX_REPOS,
  MAC_REPO,
  WINDOWS_REPOS,
  fallbackRelease,
  type DownloadUrls,
  type FlowSightRelease,
} from "./releases";

type GithubAsset = {
  name: string;
  browser_download_url: string;
};

type GithubRelease = {
  tag_name: string;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string;
  assets: GithubAsset[];
};

type ReleaseSlice = {
  tag: string;
  version: string;
  releasePage: string;
  downloads: DownloadUrls;
};

const revalidateSeconds = 3600;

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "flowsight-individual-landing",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchReleases(repo: string): Promise<GithubRelease[]> {
  const response = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=30`, {
    headers: githubHeaders(),
    next: { revalidate: revalidateSeconds, tags: ["flowsight-releases", `flowsight-releases:${repo}`] },
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} for ${repo}`);
  }

  const releases = (await response.json()) as GithubRelease[];
  return releases.filter((release) => !release.draft && !release.prerelease);
}

function semanticParts(tag: string): [number, number, number] {
  const match = tag.replace(/^v/i, "").match(/^(\d+)\.(\d+)\.(\d+)/);
  return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : [0, 0, 0];
}

function compareReleases(left: GithubRelease, right: GithubRelease): number {
  const a = semanticParts(left.tag_name);
  const b = semanticParts(right.tag_name);

  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return b[index] - a[index];
  }

  return new Date(right.published_at).getTime() - new Date(left.published_at).getTime();
}

function versionFrom(release: GithubRelease): string {
  for (const asset of release.assets) {
    const match = asset.name.match(/_(\d+\.\d+\.\d+)_/);
    if (match) return match[1];
  }
  return release.tag_name.replace(/^v/i, "");
}

function findAsset(release: GithubRelease, pattern: RegExp): string | undefined {
  return release.assets.find((asset) => pattern.test(asset.name))?.browser_download_url;
}

async function candidates(repos: readonly string[]): Promise<GithubRelease[]> {
  const results = await Promise.allSettled(repos.map((repo) => fetchReleases(repo)));
  const available = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  return available.sort(compareReleases);
}

async function resolveWindows(): Promise<ReleaseSlice | null> {
  const pinned = process.env.NEXT_PUBLIC_AGENT_RELEASE_TAG;
  const releases = await candidates(WINDOWS_REPOS);
  const release = releases.find((item) => {
    if (pinned && item.tag_name !== pinned) return false;
    return item.assets.some((asset) => /_x64-(setup|en-US)\.(exe|msi)$/i.test(asset.name));
  });

  if (!release) return null;

  return {
    tag: release.tag_name,
    version: versionFrom(release),
    releasePage: release.html_url,
    downloads: {
      windowsExe: findAsset(release, /_x64-setup\.exe$/i),
      windowsMsi: findAsset(release, /_x64_en-US\.msi$/i),
    },
  };
}

async function resolveMac(): Promise<ReleaseSlice | null> {
  const pinned = process.env.NEXT_PUBLIC_AGENT_MAC_RELEASE_TAG;
  const releases = await candidates([MAC_REPO]);
  const release = releases.find((item) => {
    if (pinned && item.tag_name !== pinned) return false;
    return item.assets.some((asset) => /_(aarch64|x64)\.dmg$/i.test(asset.name));
  });

  if (!release) return null;

  return {
    tag: release.tag_name,
    version: versionFrom(release),
    releasePage: release.html_url,
    downloads: {
      macArm: findAsset(release, /_aarch64\.dmg$/i),
      macIntel: findAsset(release, /_x64\.dmg$/i),
    },
  };
}

async function resolveLinux(): Promise<ReleaseSlice | null> {
  const pinned = process.env.NEXT_PUBLIC_AGENT_LINUX_RELEASE_TAG;
  const releases = await candidates(LINUX_REPOS);
  const release = releases.find((item) => {
    if (pinned && item.tag_name !== pinned) return false;
    const hasLinuxAsset = item.assets.some((asset) => /\.(deb|appimage)$/i.test(asset.name));
    if (!hasLinuxAsset) return false;

    // Old 0.x Linux bundles remain attached to an unrelated desktop tag.
    // They are intentionally excluded from the public download path.
    return !versionFrom(item).startsWith("0.");
  });

  if (!release) return null;

  const preferred = (extension: "deb" | "appimage") => {
    const matches = release.assets.filter((asset) => new RegExp(`\\.${extension}$`, "i").test(asset.name));
    return (
      matches.find((asset) => /amd64|x86_64|x64/i.test(asset.name))?.browser_download_url ||
      matches[0]?.browser_download_url
    );
  };

  return {
    tag: release.tag_name,
    version: versionFrom(release),
    releasePage: release.html_url,
    downloads: {
      linuxDeb: preferred("deb"),
      linuxAppImage: preferred("appimage"),
    },
  };
}

export async function getLatestRelease(): Promise<FlowSightRelease> {
  const fallback = fallbackRelease();
  const [windowsResult, macResult, linuxResult] = await Promise.allSettled([
    resolveWindows(),
    resolveMac(),
    resolveLinux(),
  ]);

  const windows = windowsResult.status === "fulfilled" ? windowsResult.value : null;
  const mac = macResult.status === "fulfilled" ? macResult.value : null;
  const linux = linuxResult.status === "fulfilled" ? linuxResult.value : null;

  return {
    versions: {
      windows: windows?.version || fallback.versions.windows,
      mac: mac?.version || fallback.versions.mac,
      linux: linux?.version || fallback.versions.linux,
    },
    tags: {
      windows: windows?.tag || fallback.tags.windows,
      mac: mac?.tag || fallback.tags.mac,
      linux: linux?.tag || fallback.tags.linux,
    },
    releasePages: {
      windows: windows?.releasePage || fallback.releasePages.windows,
      mac: mac?.releasePage || fallback.releasePages.mac,
      linux: linux?.releasePage || fallback.releasePages.linux,
    },
    downloads: {
      ...fallback.downloads,
      ...windows?.downloads,
      ...mac?.downloads,
      ...linux?.downloads,
    },
  };
}
