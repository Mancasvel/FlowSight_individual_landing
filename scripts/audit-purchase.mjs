import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3020";
const browser = await chromium.launch({ headless: true });
const failures = [];

for (const variant of [
  { name: "desktop", width: 1440, height: 900, colorScheme: "light" },
  { name: "mobile", width: 390, height: 844, colorScheme: "light" },
  { name: "dark", width: 1280, height: 900, colorScheme: "dark" },
]) {
  const context = await browser.newContext({
    viewport: { width: variant.width, height: variant.height },
    colorScheme: variant.colorScheme,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  const response = await page.goto(new URL("/purchase/success", baseUrl).toString(), { waitUntil: "networkidle" });
  if (!response?.headers()["x-robots-tag"]?.includes("noindex")) failures.push(`${variant.name}: missing noindex response header`);
  if (!(await page.getByRole("heading", { name: "We cannot show the download yet." }).isVisible())) failures.push(`${variant.name}: missing invalid-link state`);
  if (await page.locator('a[href^="/api/purchase/download"]').count()) failures.push(`${variant.name}: unauthenticated installer link shown`);

  const layout = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    brokenImages: Array.from(document.images).filter((item) => item.complete && item.naturalWidth === 0).length,
  }));
  if (layout.scrollWidth > layout.clientWidth) failures.push(`${variant.name}: horizontal overflow`);
  if (layout.brokenImages) failures.push(`${variant.name}: broken image`);
  if (errors.length) failures.push(`${variant.name}: console errors ${errors.join(" | ")}`);

  const results = await new AxeBuilder({ page }).analyze();
  for (const violation of results.violations.filter((item) => item.impact === "serious" || item.impact === "critical")) {
    failures.push(`${variant.name}: ${violation.id} at ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`);
  }
  await context.close();
}

await browser.close();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Purchase page audit passed for unverified links on desktop, mobile, and dark mode.");
