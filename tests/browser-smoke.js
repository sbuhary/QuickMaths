const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

async function main() {
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch {
    console.log("Playwright is not installed; skipping optional browser smoke test.");
    process.exit(0);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });
  const fileUrl = pathToFileURL(path.resolve("index.html")).href;
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.stack || error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(fileUrl);
  await page.evaluate(() => localStorage.removeItem("quickmaths-kid-name"));
  await page.reload();
  await page.locator("#help-start").click();
  await page.locator("#close-help").click();
  await page.getByRole("button", { name: /Start stage 1/i }).click();
  await page.locator("#gate-name").fill("Mia");
  await page.locator("#save-name").click();
  await page.getByRole("button", { name: /Change timer style/i }).click();
  await page.getByRole("button", { name: /Mute sounds/i }).click();
  await page.locator("#help-practice").click();
  await page.locator("#close-help").click();
  await page.getByRole("button", { name: /Pencil and colors/i }).click();
  await page.getByRole("button", { name: /Medium pen/i }).click();

  await page.evaluate(async () => {
    state.current = { a: 3, b: 2, answer: 5, symbol: "+", plan: currentPlan() };
    questionEl.innerHTML = renderStackedQuestion(state.current);
    clearBoard();
    setActionState("ready");
    clearInterval(state.timerId);
    state.timeLeft = 49;
    updateTimerDisplay();
    const rect = getAnswerRect();
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    ctx.save();
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(rect.left + width * 0.6, rect.top + height * 0.22);
    ctx.lineTo(rect.left + width * 0.42, rect.top + height * 0.22);
    ctx.lineTo(rect.left + width * 0.39, rect.top + height * 0.46);
    ctx.lineTo(rect.left + width * 0.57, rect.top + height * 0.46);
    ctx.quadraticCurveTo(rect.left + width * 0.72, rect.top + height * 0.48, rect.left + width * 0.7, rect.top + height * 0.66);
    ctx.quadraticCurveTo(rect.left + width * 0.66, rect.top + height * 0.83, rect.left + width * 0.43, rect.top + height * 0.78);
    ctx.stroke();
    ctx.restore();
    await checkAnswer();
  });
  const feedback = await page.locator("#feedback").textContent();
  if (!/I read 5/.test(feedback || "")) throw new Error(`Expected handwritten 5 to be recognized, got: ${feedback}`);

  await page.evaluate(async () => {
    state.current = { a: 2, b: 1, answer: 3, symbol: "+", plan: currentPlan() };
    questionEl.innerHTML = renderStackedQuestion(state.current);
    clearBoard();
    setActionState("ready");
    clearInterval(state.timerId);
    state.timeLeft = 49;
    updateTimerDisplay();
    const rect = getAnswerRect();
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    ctx.save();
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(rect.left + width * 0.6, rect.top + height * 0.22);
    ctx.lineTo(rect.left + width * 0.42, rect.top + height * 0.22);
    ctx.lineTo(rect.left + width * 0.39, rect.top + height * 0.46);
    ctx.lineTo(rect.left + width * 0.57, rect.top + height * 0.46);
    ctx.quadraticCurveTo(rect.left + width * 0.72, rect.top + height * 0.48, rect.left + width * 0.7, rect.top + height * 0.66);
    ctx.quadraticCurveTo(rect.left + width * 0.66, rect.top + height * 0.83, rect.left + width * 0.43, rect.top + height * 0.78);
    ctx.stroke();
    ctx.restore();
    await checkAnswer();
  });
  const wrongFeedback = await page.locator("#feedback").textContent();
  if (/Great work|Congratulations/.test(wrongFeedback || "")) throw new Error(`Wrong handwritten answer was accepted: ${wrongFeedback}`);

  const canvas = await page.locator("#board").boundingBox();
  if (!canvas) throw new Error("Canvas not visible");
  await page.mouse.move(canvas.x + 80, canvas.y + 420);
  await page.mouse.down();
  await page.mouse.move(canvas.x + 130, canvas.y + 450);
  await page.mouse.up();

  await page.evaluate(() => {
    window.eval('state.progress.stageStars[1] = 49; awardCorrectAnswer("5");');
  });
  await page.locator("#reward-gate").waitFor({ state: "visible" });
  const rewardTitle = await page.locator("#reward-title").textContent();
  if (!/Stage 2 unlocked/.test(rewardTitle || "")) throw new Error(`Unexpected reward title: ${rewardTitle}`);
  await page.locator("#reward-ok").click();

  if (errors.length) throw new Error(errors.join("\n"));
  await browser.close();
  console.log("QuickMaths browser smoke checks passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
