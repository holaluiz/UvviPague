import { chromium } from '@playwright/test';

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
});
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true
});

await page.addInitScript(() => {
  window.__FORCE_WEBGL__ = true;
});

await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });

for (let i = 0; i < 30; i++) {
  await page.waitForTimeout(1000);
  const status = await page.evaluate(() => {
    const v = document.querySelector('#vehicle');
    return v ? v.className : '';
  });
  if (status.includes('ready')) break;
}

// Scroll to hero scene
await page.locator('.hero-scene').scrollIntoViewIfNeeded();

for (let ch = 0; ch < 5; ch++) {
  await page.locator(`[data-chapter="${ch}"]`).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `qa/mobile-chapter-${ch}.png` });
  console.log(`Saved qa/mobile-chapter-${ch}.png`);
}

await browser.close();
