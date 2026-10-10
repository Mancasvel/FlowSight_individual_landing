import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const browser = await chromium.launch({ headless: true });
const baseUrl = process.env.BASE_URL || "http://localhost:3020";
const failures = [];
const headers = process.env.VERCEL_REVIEW_ACCESS ? { "x-vercel-protection-bypass": process.env.VERCEL_REVIEW_ACCESS } : {};
for (const variant of [
  { name: "desktop", viewport: { width: 1440, height: 1000 }, colorScheme: "light" },
  { name: "mobile", viewport: { width: 390, height: 844 }, colorScheme: "light" },
  { name: "dark", viewport: { width: 1280, height: 900 }, colorScheme: "dark" },
]) {
  const context = await browser.newContext({ viewport: variant.viewport, colorScheme: variant.colorScheme, reducedMotion: "reduce", extraHTTPHeaders: headers });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const form = page.locator('form[action="/api/purchase/checkout"]');
  await form.scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Buy the official installer for €20 total" }).click();
  if (!page.url().startsWith(baseUrl)) failures.push(`${variant.name}: empty form was accepted`);
  if (await form.evaluate(f => f.checkValidity())) failures.push(`${variant.name}: missing business identity accepted`);
  await page.getByLabel("Legal business name").fill("FlowSight checkout verification");
  await page.getByLabel("Fiscal or business registration ID").fill("CHECKONLY123");
  await page.getByRole("checkbox").check();
  if (!await form.evaluate(f => f.checkValidity())) failures.push(`${variant.name}: completed form fails validation`);
  const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth, broken: [...document.images].some(i => i.complete && !i.naturalWidth) }));
  if (layout.overflow || layout.broken) failures.push(`${variant.name}: layout or image failure`);
  const axe = await new AxeBuilder({ page }).analyze();
  failures.push(...axe.violations.filter(v => ["critical", "serious"].includes(v.impact)).map(v => `${variant.name}: ${v.id} ${v.nodes.map(n=>n.target.join(' ')).join(', ')}`));
  if (process.env.CAPTURE_DIR) await form.screenshot({ path: `${process.env.CAPTURE_DIR}/offer-${variant.name}.png` });
  if (variant.name === "desktop" && process.env.VERIFY_CHECKOUT === "true") {
    const responsePromise = page.waitForResponse(r => r.url().includes("/api/purchase/checkout") && r.request().method() === "POST", { timeout: 30000 });
    await page.getByRole("button", { name: "Buy the official installer for €20 total" }).click();
    const response = await responsePromise;
    if (response.status() !== 303) failures.push(`Checkout returned ${response.status()}: ${await response.text()}`);
    else console.log(`Checkout redirect: ${new URL(response.headers().location).origin}`);
  }
  await context.close();
}
await browser.close();
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log("Business purchase UI, required fields, layout and accessibility passed.");
