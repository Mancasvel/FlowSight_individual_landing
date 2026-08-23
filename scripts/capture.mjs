import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL || "http://localhost:3020";
const shots = [
  { name: "desktop", width: 1440, height: 1000, colorScheme: "light" },
  { name: "mobile", width: 390, height: 844, colorScheme: "light" },
  { name: "dark", width: 1440, height: 1000, colorScheme: "dark" },
];

await mkdir("artifacts", { recursive: true });

const browser = await chromium.launch({ headless: true });

for (const shot of shots) {
  const page = await browser.newPage({
    viewport: { width: shot.width, height: shot.height },
    colorScheme: shot.colorScheme,
  });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  });
  await page.waitForTimeout(500);

  const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const increment = Math.max(500, shot.height * 0.7);
  for (let y = 0; y < totalHeight; y += increment) {
    await page.evaluate((value) => window.scrollTo(0, value), y);
    await page.waitForTimeout(220);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `artifacts/landing-${shot.name}.png`, fullPage: true });
  await page.close();
}

await browser.close();
