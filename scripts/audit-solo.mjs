import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
const sharp = createRequire(createRequire(import.meta.url).resolve('next/package.json'))('sharp');

const baseUrl = process.env.BASE_URL || 'http://localhost:3040';
const evidenceDir = process.env.SOLO_REVIEW_DIR || path.resolve('..', 'review');
await mkdir(evidenceDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
const failures = [];
const variants = [
  { name: 'desktop', width: 1440, height: 1000, colorScheme: 'light' },
  { name: 'mobile', width: 390, height: 844, colorScheme: 'light' },
  { name: 'desktop-dark', width: 1440, height: 1000, colorScheme: 'dark' },
  { name: 'mobile-dark', width: 390, height: 844, colorScheme: 'dark' },
  { name: 'tablet', width: 768, height: 1024, colorScheme: 'light' },
  { name: 'small-reduced', width: 320, height: 720, colorScheme: 'light', reducedMotion: 'reduce' },
];
try {
  for (const variant of variants) {
    const context = await browser.newContext({ viewport: { width: variant.width, height: variant.height }, colorScheme: variant.colorScheme, reducedMotion: variant.reducedMotion || 'no-preference' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    try {
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      assert(await page.getByRole('heading', { level: 1, name: 'Understand your work.' }).isVisible(), 'Hero missing');
      assert(await page.getByText('Checkout not open yet.', { exact: false }).first().isVisible(), 'Prelaunch status missing');
      assert.equal(await page.locator('form[action="/api/purchase/checkout"]').count(), 0, 'Checkout exposed without configuration');
      assert(await page.getByRole('link', { name: '€25, once' }).isVisible(), 'Confirmed EUR 25 offer missing');
      assert(!(await page.locator('body').innerText()).includes('€20'), 'Previous EUR 20 price leaked into the new landing');
      assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute('href')).href, 'https://solo.flowsight.site/', 'Canonical changed');
      assert(!(await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'), 'Homepage is noindex');
      const appearance = await page.locator('main').evaluate(el => ({ bg: getComputedStyle(el.parentElement).backgroundColor, grid: getComputedStyle(el.parentElement).backgroundImage, scheme: getComputedStyle(el.parentElement).colorScheme }));
      assert.equal(appearance.bg, 'rgb(251, 252, 251)', 'Landing must stay white in either OS theme');
      assert.equal(appearance.scheme, 'light', 'Light appearance not enforced');
      assert(appearance.grid.includes('linear-gradient'), 'Requested FlowSight grid missing');
      assert.equal(await page.locator('header a[aria-label="FlowSight Solo home"]').innerText(), 'FlowSightSolo', 'Brand capitalization changed');
      for (const heading of ['A plan built around your actual day.', 'Your week. With perspective.', 'Total focus, on your terms', 'Reports you can keep', 'Private leagues with friends']) {
        assert(await page.getByRole('heading', { name: heading }).isVisible(), `Missing capability: ${heading}`);
      }
      for (const removed of ['Turn an insight into a choice.', 'From intention to your next decision.', 'Your work. Your device.']) {
        assert.equal(await page.getByRole('heading', { name: removed }).count(), 0, `Removed section still present: ${removed}`);
      }
      assert.equal(await page.locator('#privacy, a[href="#privacy"], a[href*="ratio.visualizevalue"]').count(), 0, 'Obsolete link or section remains');
      assert(await page.getByRole('columnheader', { name: 'Competitors Common approaches' }).isVisible(), 'Generic comparison missing');
      assert.equal(await page.locator('#features img, #reports img').count(), 0, 'Calendar and report must be native components');
      assert(await page.getByText('Illustrative calendar · example data', { exact: true }).isVisible(), 'Calendar example label missing');
      assert(await page.getByText('Illustrative report · example data, not a live analysis', { exact: true }).isVisible(), 'Report example label missing');
      const sectionRules = await page.locator('main > section, header').evaluateAll(elements => elements.filter(el => {
        const style = getComputedStyle(el);
        return parseFloat(style.borderTopWidth) > 0 || parseFloat(style.borderBottomWidth) > 0;
      }).map(el => el.id || el.tagName));
      assert.deepEqual(sectionRules, [], 'Extra section separators remain');
      const demo = page.getByRole('group', { name: 'Compare activity views' });
      await demo.getByRole('button', { name: 'App activity', exact: true }).click();
      assert(await page.getByText('Time spent in your browser', { exact: true }).isVisible(), 'App view does not work');
      await demo.getByRole('button', { name: 'With FlowSight AI' }).click();
      await page.getByRole('button', { name: 'Researching 34 min' }).click();
      assert(await page.getByText('Comparing design approaches', { exact: true }).isVisible(), 'Research context does not change');
      await page.getByRole('button', { name: 'Planning 18 min' }).click();
      assert(await page.getByText('Planning the next release', { exact: true }).isVisible(), 'Planning context does not change');
      await page.getByRole('button', { name: 'Building 52 min' }).click();
      const insights = page.getByRole('tab', { name: 'Understand your day' });
      await insights.focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.getByRole('tab', { name: 'Shape your day' }).getAttribute('aria-selected'), 'true', 'Keyboard tabs do not work');
      assert(await page.locator('#panel-today img').isVisible(), 'Today capture missing');
      await page.keyboard.press('Home');
      assert(await page.locator('#panel-insights img').isVisible(), 'Insights capture missing');
      const featureDetail = page.locator('details').filter({ hasText: 'Requires the paired FlowSight Browser Controls extension.' });
      await featureDetail.locator('summary').click();
      assert.equal(await featureDetail.getAttribute('open'), '', 'Capability details do not expand');
      await featureDetail.locator('summary').click();
      const question = page.locator('summary').filter({ hasText: 'Does the AI need the cloud?' });
      await question.click();
      assert.equal(await question.locator('..').getAttribute('open'), '', 'FAQ does not expand');
      await question.click();
      const layout = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        overflow: [...document.querySelectorAll('main *')].filter((e) => e.getBoundingClientRect().width && e.getBoundingClientRect().right > innerWidth + 1).map((e) => e.tagName + '.' + e.className).slice(0, 12),
        images: [...document.images].filter((i) => i.offsetWidth && (!i.complete || i.naturalWidth === 0)).map((i) => i.src),
      }));
      assert(layout.scroll <= layout.width && !layout.overflow.length, `Overflow: ${JSON.stringify(layout)}`);
      assert.equal(layout.images.length, 0, 'Broken image');
      const accessibility = await new AxeBuilder({ page }).analyze();
      const serious = accessibility.violations.filter((v) => ['critical', 'serious'].includes(v.impact));
      assert.equal(serious.length, 0, JSON.stringify(serious.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))));
      assert.equal(errors.length, 0, errors.join('\n'));
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      const fullCapture = await page.screenshot({ path: path.join(evidenceDir, `${variant.name}.png`), fullPage: true, animations: 'disabled' });
      if (variant.name === 'desktop' || variant.name === 'mobile') await page.screenshot({ path: path.join(evidenceDir, `${variant.name}-hero.png`), animations: 'disabled' });
      if (variant.name === 'desktop' || variant.name === 'mobile') {
        const crop = async (locator, name) => {
          const rect = await locator.evaluate(el => { const r = el.getBoundingClientRect(); return {left: Math.ceil(r.left), top: Math.ceil(r.top + window.scrollY), width: Math.floor(r.width), height: Math.floor(r.height)}; });
          await sharp(fullCapture).extract(rect).png().toFile(path.join(evidenceDir, `${variant.name}-${name}.png`));
        };
        for (const id of ['product', 'reports', 'difference', 'connections', 'offer']) await crop(page.locator(`#${id}`), id);
        await crop(page.locator('#features'), 'planner');
      }
      results.push({ variant: variant.name, pass: true, accessibility: 'no serious or critical violations', interactions: 'AI view, all example blocks, keyboard tabs, FAQ' });
    } catch (error) { failures.push(`${variant.name}: ${error.message}`); }
    await context.close();
  }
  const page = await browser.newPage();
  await page.goto(new URL('/offer-preview', baseUrl).href, { waitUntil: 'networkidle' });
  assert((await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'), 'Preview must remain noindex');
  assert(await page.getByRole('heading', { level: 1, name: 'Understand your work.' }).isVisible(), 'Preview mismatch');
} catch (error) { failures.push(error.message); }
finally { await browser.close(); }
await writeFile(path.join(evidenceDir, 'audit.json'), JSON.stringify({ baseUrl, results, failures }, null, 2));
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Solo audit passed: ${results.length} viewports/themes, interactive demo, keyboard tabs, FAQ, prelaunch and indexing.`);
