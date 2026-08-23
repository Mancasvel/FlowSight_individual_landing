export const WINDOWS_REPOS = ["Mancasvel/FlowSight.AI", "Mancasvel/FlowSight_linux"] as const;
export const MAC_REPO = "Mancasvel/FlowSight_Mac" as const;
export const LINUX_REPOS = ["Mancasvel/FlowSight_linux", "Mancasvel/FlowSight.AI"] as const;

export type DownloadUrls = {
  windowsExe?: string;
  windowsMsi?: string;
  macArm?: string;
  macIntel?: string;
  linuxDeb?: string;
  linuxAppImage?: string;
};

export type FlowSightRelease = {
  versions: {
    windows: string;
    mac: string;
    linux: string;
  };
  tags: {
    windows: string;
    mac: string;
    linux: string;
  };
  releasePages: {
    windows: string;
    mac: string;
    linux: string;
  };
  downloads: DownloadUrls;
};

const fallback = {
  windowsTag: "v3.6.0",
  macTag: "v3.6.0",
  linuxTag: "v3.5.0",
} as const;

function releaseAsset(repo: string, tag: string, name: string): string {
  return `https://github.com/${repo}/releases/download/${tag}/${name}`;
}

export function fallbackRelease(): FlowSightRelease {
  return {
    versions: { windows: "3.6.0", mac: "3.6.0", linux: "3.5.0" },
    tags: {
      windows: fallback.windowsTag,
      mac: fallback.macTag,
      linux: fallback.linuxTag,
    },
    releasePages: {
      windows: `https://github.com/${WINDOWS_REPOS[0]}/releases/tag/${fallback.windowsTag}`,
      mac: `https://github.com/${MAC_REPO}/releases/tag/${fallback.macTag}`,
      linux: `https://github.com/${LINUX_REPOS[0]}/releases/tag/${fallback.linuxTag}`,
    },
    downloads: {
      windowsExe: releaseAsset(
        WINDOWS_REPOS[0],
        fallback.windowsTag,
        "FlowSight.Agent_3.6.0_x64-setup.exe",
      ),
      windowsMsi: releaseAsset(
        WINDOWS_REPOS[0],
        fallback.windowsTag,
        "FlowSight.Agent_3.6.0_x64_en-US.msi",
      ),
      macArm: releaseAsset(
        MAC_REPO,
        fallback.macTag,
        "FlowSight.Agent_3.6.0_aarch64.dmg",
      ),
    },
  };
}
