import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3097";
const edition = process.env.EDITION || "solo";
const output = process.env.OUTPUT_DIR || ".impeccable/review";
const expectedNames = [
  "Xiji Incubator", "Universidad de Sevilla", "Barner Brand", "MongoDB", "Microsoft", "Xiaomi",
];
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = [];

try {
  for (const view of [
    { name: "desktop", width: 1440, height: 900, colorScheme: "light" },
    { name: "mobile", width: 390, height: 844, colorScheme: "light" },
    { name: "dark", width: 1440, height: 900, colorScheme: "dark" },
    { name: "mobile-dark", width: 320, height: 780, colorScheme: "dark" },
  ]) {
    const page = await browser.newPage({
      viewport: { width: view.width, height: view.height },
      colorScheme: view.colorScheme,
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
    assert.equal(response?.status(), 200, `${view.name}: home must return 200`);
    const section = page.getByRole("region", { name: "Supported by", exact: true });
    await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    await section.locator("img").evaluateAll((images) => Promise.all(images.map((img) =>
      img.complete ? Promise.resolve() : new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      })
    )));
    const items = await section.locator("li").evaluateAll((elements) => elements.map((item) => {
      const img = item.querySelector("img");
      const label = item.querySelector("span");
      const itemBox = item.getBoundingClientRect();
      const imageBox = img.getBoundingClientRect();
      return {
        name: label?.textContent || img.alt,
        loaded: img.complete && img.naturalWidth > 0,
        contained: imageBox.left >= itemBox.left - 1 && imageBox.right <= itemBox.right + 1,
      };
    }));
    assert.deepEqual(items.map((item) => item.name), expectedNames, `${view.name}: partner names/order`);
    assert.ok(items.every((item) => item.loaded), `${view.name}: every logo must load`);
    assert.ok(items.every((item) => item.contained), `${view.name}: logos must fit their columns`);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(width <= view.width + 1, `${view.name}: horizontal overflow ${width}`);
    assert.deepEqual(errors, [], `${view.name}: page errors`);
    await section.screenshot({ path: `${output}/${edition}-supported-by-${view.name}.png` });
    report.push({ url: baseUrl, viewport: view.name, status: response.status(), width, items, pageErrors: errors });
    await page.close();
  }
  await writeFile(`${output}/${edition}-supported-by-report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
