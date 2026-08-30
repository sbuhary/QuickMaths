import { expect, test } from '@playwright/test';

const appUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173/index.html';

async function openStableStage(page) {
  await page.addInitScript(() => {
    Math.random = () => 0.12;
  });
  await page.goto(appUrl);
  await page.getByRole('button', { name: /Start stage 1/i }).click();
  await page.evaluate(() => {
    for (let id = 1; id < 1000; id += 1) window.clearInterval(id);
    const timer = document.querySelector('#timer');
    if (timer) timer.textContent = '01:00';
  });
}

test.describe('QuickMaths app', () => {
  test('renders level picker and starts practice on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(appUrl);
    await expect(page).toHaveTitle(/QuickMaths/);
    await expect(page.getByRole('heading', { name: 'Pick a math path' })).toBeVisible();
    await expect(page.locator('#start-screen')).toHaveScreenshot('quickmaths-level-picker.png', { maxDiffPixelRatio: 0.08 });
    await page.getByRole('button', { name: /Start stage 1/i }).click();
    await expect(page.getByLabel('Math practice whiteboard')).toBeVisible();
    await expect(page.getByRole('button', { name: /Change timer style/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Check$/i })).toBeVisible();
  });

  test('supports core board controls without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await openStableStage(page);
    await page.getByRole('button', { name: /Change timer style/i }).click();
    await page.getByRole('button', { name: /Mute sounds/i }).click();
    await page.getByRole('button', { name: /Thin pen/i }).click();
    await page.getByRole('button', { name: /Medium pen/i }).click();
    await page.getByRole('button', { name: /Clear answer only/i }).click();
    await page.getByRole('button', { name: /Move controls/i }).click();
    await page.getByRole('button', { name: /^Next$/i }).click();
    await page.evaluate(() => {
      const timer = document.querySelector('#timer');
      if (timer) timer.textContent = '01:00';
    });

    expect(errors).toEqual([]);
    await expect(page).toHaveScreenshot('quickmaths-mobile-board.png', { maxDiffPixelRatio: 0.08 });
  });
});
