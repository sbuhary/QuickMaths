import { expect, test } from '@playwright/test';

const appUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173/index.html';

async function openStableStage(page) {
  await page.addInitScript(() => {
    Math.random = () => 0.12;
    localStorage.setItem('quickmaths-kid-name', 'Mia');
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
    await page.getByRole('textbox', { name: /Name/i }).fill('Mia');
    await expect(page.locator('#start-screen')).toHaveScreenshot('quickmaths-level-picker.png', { maxDiffPixelRatio: 0.08, timeout: 15000 });
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
    await page.getByRole('button', { name: /Pencil and colors/i }).click();
    await page.getByRole('button', { name: /Thin pen/i }).click();
    await page.getByRole('button', { name: /Medium pen/i }).click();
    await page.evaluate(() => {
      const timer = document.querySelector('#timer');
      if (timer) timer.textContent = '01:00';
    });

    expect(errors).toEqual([]);
    await expect(page).toHaveScreenshot('quickmaths-mobile-board.png', { maxDiffPixelRatio: 0.08, timeout: 15000 });
  });
  test('loads ONNX model and keeps clear handwritten answers correct', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openStableStage(page);

    const result = await page.evaluate(async () => {
      await loadOnnxDigitModel();
      await new Promise<void>((resolve) => {
        const started = Date.now();
        const wait = () => (state.onnxModelReady || Date.now() - started > 20000 ? resolve() : setTimeout(wait, 100));
        wait();
      });
      state.current = { a: 3, b: 2, answer: 5, symbol: '+', plan: currentPlan() };
      questionEl.innerHTML = renderStackedQuestion(state.current);
      renderAnswerDigitBoxes('5');
      clearBoard();
      const rect = answerDigitRects('5')[0];
      const width = rect.right - rect.left;
      const height = rect.bottom - rect.top;
      const points = [[0.6, 0.22], [0.42, 0.22], [0.39, 0.46], [0.57, 0.46], [0.7, 0.66], [0.43, 0.78]].map((point) => ({
        x: rect.left + point[0] * width,
        y: rect.top + point[1] * height,
      }));
      ctx.save();
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index) ctx.lineTo(point.x, point.y);
        else ctx.moveTo(point.x, point.y);
      });
      ctx.stroke();
      ctx.restore();
      state.paths.push({ color: '#1f2937', size: 5, erase: false, points });

      return {
        modelReady: state.onnxModelReady,
        modelError: state.onnxModelError,
        onnx: await recognizeWithOnnx('5'),
        combined: await recognizeWriting('5'),
      };
    });

    expect(result.modelError || "").toBe("");
    expect(result.modelReady).toBe(true);
    expect(result.onnx.status).toBe('onnx');
    expect(result.combined.text).toBe('5');
  });
});
