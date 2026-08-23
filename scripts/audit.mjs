import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3020";
const browser = await chromium.launch({ headless: true });
const failures = [];

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const teamsLinks = await page.locator('a:has-text("For teams")').evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")),
  );
  if (!teamsLinks.length || teamsLinks.some((href) => href !== "https://flowsight.site")) {
    failures.push(`${viewport.name}: For teams must link exactly to https://flowsight.site`);
  }
  const productSectionVisible = await page
    .locator("#product")
    .getByRole("heading", { name: "Built for one person doing real work." })
    .isVisible();
  if (!productSectionVisible) failures.push(`${viewport.name}: product section is not visible`);

  if (viewport.name === "mobile") {
    const menu = page.locator('[aria-controls="mobile-navigation"]');
    await menu.click();
    if ((await menu.getAttribute("aria-expanded")) !== "true") failures.push("mobile: navigation did not open");
  }

  const layout = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    brokenImages: Array.from(document.images)
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.src),
  }));
  const accessibility = await new AxeBuilder({ page }).analyze();
  const serious = accessibility.violations.filter((item) => item.impact === "serious" || item.impact === "critical");

  if (layout.scrollWidth > layout.clientWidth) failures.push(`${viewport.name}: horizontal overflow ${layout.scrollWidth}/${layout.clientWidth}`);
  if (layout.brokenImages.length) failures.push(`${viewport.name}: broken images ${layout.brokenImages.join(", ")}`);
  if (consoleErrors.length) failures.push(`${viewport.name}: console errors ${consoleErrors.join(" | ")}`);
  if (serious.length) {
    const detail = serious
      .flatMap((item) => item.nodes.map((node) => `${item.id} ${node.target.join(" ")} ${node.failureSummary || ""}`))
      .join(" | ");
    failures.push(`${viewport.name}: accessibility ${detail}`);
  }
  await context.close();
}

const reducedContext = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
const reducedPage = await reducedContext.newPage();
const reducedConsoleErrors = [];
reducedPage.on("console", (message) => {
  if (message.type() === "error") reducedConsoleErrors.push(message.text());
});
await reducedPage.goto(baseUrl, { waitUntil: "networkidle" });
await reducedPage.waitForTimeout(300);
const closingHeadingVisible = await reducedPage.getByRole("heading", { name: "Make your work visible to you." }).isVisible();
const hiddenReducedMotionElements = await reducedPage.evaluate(() =>
  Array.from(document.querySelectorAll(".motion-reveal, .motion-hero, .motion-view"))
    .filter((element) => Number.parseFloat(getComputedStyle(element).opacity) < 0.5)
    .length,
);
if (!closingHeadingVisible) failures.push("reduced motion: closing content is hidden");
if (hiddenReducedMotionElements) failures.push(`reduced motion: ${hiddenReducedMotionElements} motion elements remain hidden`);
if (reducedConsoleErrors.length) failures.push(`reduced motion: console errors ${reducedConsoleErrors.join(" | ")}`);
await reducedContext.close();

await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Landing audit passed at desktop and mobile sizes.");
