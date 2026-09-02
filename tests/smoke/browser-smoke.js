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
  const candidatePolicy = await page.evaluate(() => answerChoicesFromRecognition({ text: "8", candidateTexts: ["5", "8"] }, 5));
  if (candidatePolicy.includes("7") || candidatePolicy.includes("9") || !candidatePolicy.includes("5") || !candidatePolicy.includes("8")) throw new Error(`Answer choices should come from handwriting candidates plus the correct answer: ${candidatePolicy.join(",")}`);
  await page.getByRole("button", { name: /Change timer style/i }).click();
  await page.getByRole("button", { name: /Mute sounds/i }).click();
  await page.locator("#help-practice").click();
  await page.locator("#close-help").click();
  await page.getByRole("button", { name: /Pencil and colors/i }).click();
  await page.getByRole("button", { name: /Medium pen/i }).click();

  const strokeResults = await page.evaluate(async () => {
    function drawDigit(strokes, size = 6) {
      renderAnswerDigitBoxes(String(state.current.answer));
      const rect = answerDigitRects(String(state.current.answer))[0];
      const width = rect.right - rect.left;
      const height = rect.bottom - rect.top;
      ctx.save();
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      strokes.forEach((stroke) => {
        const points = stroke.map((point) => ({ x: rect.left + point[0] * width, y: rect.top + point[1] * height }));
        ctx.beginPath();
        points.forEach((point, index) => {
          if (index) ctx.lineTo(point.x, point.y);
          else ctx.moveTo(point.x, point.y);
        });
        ctx.stroke();
        state.paths.push({ color: "#1f2937", size, erase: false, points });
      });
      ctx.restore();
    }

    const digits = {
      0: [[[0.45, 0.18], [0.32, 0.25], [0.29, 0.5], [0.34, 0.76], [0.5, 0.84], [0.66, 0.76], [0.7, 0.5], [0.65, 0.24], [0.45, 0.18]]],
      1: [[[0.5, 0.18], [0.5, 0.82]], [[0.42, 0.28], [0.5, 0.18]], [[0.42, 0.82], [0.6, 0.82]]],
      2: [[[0.34, 0.28], [0.47, 0.18], [0.65, 0.25], [0.65, 0.39], [0.5, 0.52], [0.34, 0.72], [0.68, 0.72]]],
      3: [[[0.34, 0.22], [0.65, 0.22], [0.5, 0.47], [0.65, 0.47], [0.66, 0.7], [0.42, 0.78]]],
      4: [[[0.62, 0.82], [0.62, 0.18]], [[0.34, 0.55], [0.68, 0.55]], [[0.34, 0.55], [0.58, 0.18]]],
      5: [[[0.66, 0.22], [0.4, 0.22], [0.38, 0.45], [0.6, 0.45], [0.7, 0.57], [0.63, 0.76], [0.39, 0.76]]],
      6: [[[0.64, 0.22], [0.43, 0.3], [0.34, 0.56], [0.43, 0.77], [0.64, 0.72], [0.64, 0.55], [0.45, 0.52]]],
      7: [[[0.34, 0.22], [0.68, 0.22], [0.5, 0.82]]],
      8: [[[0.5, 0.48], [0.35, 0.34], [0.44, 0.19], [0.62, 0.24], [0.62, 0.39], [0.5, 0.48], [0.36, 0.6], [0.42, 0.79], [0.62, 0.75], [0.66, 0.58], [0.5, 0.48]]],
      9: [[[0.62, 0.5], [0.44, 0.5], [0.35, 0.36], [0.45, 0.2], [0.66, 0.25], [0.66, 0.58], [0.54, 0.76], [0.38, 0.82]]],
    };

    const results = [];
    for (const [digit, strokes] of Object.entries(digits)) {
      state.current = { a: Number(digit), b: 0, answer: Number(digit), symbol: "+", plan: currentPlan() };
      questionEl.innerHTML = renderStackedQuestion(state.current);
      clearBoard();
      setActionState("ready");
      clearInterval(state.timerId);
      drawDigit(strokes);
      results.push({ digit, ...(await recognizeWriting(digit)) });
    }
    return results;
  });
  const directDigits = new Set(["1", "2", "7"]);
  const weakStrokes = strokeResults.filter((result) => directDigits.has(result.digit) && (result.text !== result.digit || result.status !== "local" || result.confidence < 0.64));
  const unsafeStrokes = strokeResults.filter((result) => !directDigits.has(result.digit) && result.text !== result.digit && result.status !== "ambiguous");
  if (weakStrokes.length || unsafeStrokes.length) throw new Error(`Stroke digits failed recognition policy: ${JSON.stringify({ weakStrokes, unsafeStrokes })}`);

  const guardedResults = await page.evaluate(async () => {
    function drawCase(strokes, expected) {
      state.current = { a: Number(expected), b: 0, answer: Number(expected), symbol: "+", plan: currentPlan() };
      questionEl.innerHTML = renderStackedQuestion(state.current);
      clearBoard();
      setActionState("ready");
      clearInterval(state.timerId);
      renderAnswerDigitBoxes(String(state.current.answer));
      const rect = answerDigitRects(String(state.current.answer))[0];
      const width = rect.right - rect.left;
      const height = rect.bottom - rect.top;
      strokes.forEach((stroke) => {
        const points = stroke.map((point) => ({ x: rect.left + point[0] * width, y: rect.top + point[1] * height }));
        ctx.save();
        ctx.strokeStyle = "#1f2937";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        points.forEach((point, index) => {
          if (index) ctx.lineTo(point.x, point.y);
          else ctx.moveTo(point.x, point.y);
        });
        ctx.stroke();
        ctx.restore();
        state.paths.push({ color: "#1f2937", size: 5, erase: false, points });
      });
    }
    const shapes = {
      five: [[[0.52, 0.15], [0.46, 0.15], [0.45, 0.35], [0.63, 0.35], [0.78, 0.52], [0.75, 0.75], [0.5, 0.77]]],
      four: [[[0.5, 0.15], [0.37, 0.55], [0.72, 0.55]], [[0.62, 0.2], [0.62, 0.86]]],
      six: [[[0.61, 0.16], [0.44, 0.3], [0.43, 0.65], [0.58, 0.8], [0.72, 0.65], [0.65, 0.45], [0.48, 0.45]]],
      three: [[[0.34, 0.22], [0.65, 0.22], [0.5, 0.47], [0.65, 0.47], [0.66, 0.7], [0.42, 0.78]]],
      zero: [[[0.45, 0.18], [0.32, 0.25], [0.29, 0.5], [0.34, 0.76], [0.5, 0.84], [0.66, 0.76], [0.7, 0.5], [0.65, 0.24], [0.45, 0.18]]],
      eight: [[[0.5, 0.48], [0.35, 0.34], [0.44, 0.19], [0.62, 0.24], [0.62, 0.39], [0.5, 0.48], [0.36, 0.6], [0.42, 0.79], [0.62, 0.75], [0.66, 0.58], [0.5, 0.48]]],
      nine: [[[0.62, 0.5], [0.44, 0.5], [0.35, 0.36], [0.45, 0.2], [0.66, 0.25], [0.66, 0.58], [0.54, 0.76], [0.38, 0.82]]],
    };
    const cases = [
      ["correct5", shapes.five, "5"],
      ["correct4", shapes.four, "4"],
      ["correct6", shapes.six, "6"],
      ["wrong3as5", shapes.three, "5"],
      ["wrong0as6", shapes.zero, "6"],
      ["wrong8as6", shapes.eight, "6"],
      ["wrong9as4", shapes.nine, "4"],
    ];
    const results = [];
    for (const [name, strokes, expected] of cases) {
      drawCase(strokes, expected);
      results.push({ name, expected, ...(await recognizeWriting(expected)) });
    }
    return results;
  });
  const missedCorrect = guardedResults.filter((result) => result.name.startsWith("correct") && result.text !== result.expected && !(result.name === "correct5" && result.confidence < 0.64));
  const acceptedWrong = guardedResults.filter((result) => result.name.startsWith("wrong") && result.text === result.expected && result.status !== "ambiguous");
  if (missedCorrect.length || acceptedWrong.length) throw new Error(`Guarded recognition failed: ${JSON.stringify({ missedCorrect, acceptedWrong, guardedResults })}`);
  await page.evaluate(async () => {
    state.current = { a: 3, b: 2, answer: 5, symbol: "+", plan: currentPlan() };
    questionEl.innerHTML = renderStackedQuestion(state.current);
    clearBoard();
    setActionState("ready");
    clearInterval(state.timerId);
    state.timeLeft = 49;
    updateTimerDisplay();
    renderAnswerDigitBoxes(String(state.current.answer));
      const rect = answerDigitRects(String(state.current.answer))[0];
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const points = [[0.6, 0.22], [0.42, 0.22], [0.39, 0.46], [0.57, 0.46], [0.7, 0.66], [0.43, 0.78]].map((point) => ({ x: rect.left + point[0] * width, y: rect.top + point[1] * height }));
    ctx.save();
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index) ctx.lineTo(point.x, point.y);
      else ctx.moveTo(point.x, point.y);
    });
    ctx.stroke();
    ctx.restore();
    state.paths.push({ color: "#1f2937", size: 5, erase: false, points });
    await checkAnswer();
  });
  const feedback = await page.locator("#feedback").textContent();
  if (!/I read 5|pick the answer you meant/.test(feedback || "")) throw new Error(`Expected handwritten 5 to be accepted or reviewed, got: ${feedback}`);

  await page.evaluate(async () => {
    state.current = { a: 2, b: 1, answer: 3, symbol: "+", plan: currentPlan() };
    questionEl.innerHTML = renderStackedQuestion(state.current);
    clearBoard();
    setActionState("ready");
    clearInterval(state.timerId);
    state.timeLeft = 49;
    updateTimerDisplay();
    renderAnswerDigitBoxes(String(state.current.answer));
      const rect = answerDigitRects(String(state.current.answer))[0];
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const points = [[0.6, 0.22], [0.42, 0.22], [0.39, 0.46], [0.57, 0.46], [0.7, 0.66], [0.43, 0.78]].map((point) => ({ x: rect.left + point[0] * width, y: rect.top + point[1] * height }));
    ctx.save();
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index) ctx.lineTo(point.x, point.y);
      else ctx.moveTo(point.x, point.y);
    });
    ctx.stroke();
    ctx.restore();
    state.paths.push({ color: "#1f2937", size: 5, erase: false, points });
    await checkAnswer();
  });
  const wrongFeedback = await page.locator("#feedback").textContent();
  if (/Great work|Congratulations/.test(wrongFeedback || "")) throw new Error(`Wrong handwritten answer was accepted: ${wrongFeedback}`);

  const freezeResult = await page.evaluate(() => {
    state.progress.streak = 4;
    state.progress.streakFreezes = 0;
    state.current = { a: 2, b: 3, answer: 5, symbol: "+", plan: currentPlan() };
    awardCorrectAnswer("5");
    const earned = { streak: state.progress.streak, freezes: state.progress.streakFreezes };
    state.progress.streak = 9;
    state.progress.streakFreezes = 3;
    awardCorrectAnswer("10");
    const capped = { streak: state.progress.streak, freezes: state.progress.streakFreezes };
    state.progress.streak = 8;
    state.progress.streakFreezes = 2;
    const protectedStreak = protectOrResetStreak();
    const protectedState = { protectedStreak, streak: state.progress.streak, freezes: state.progress.streakFreezes };
    state.progress.streak = 8;
    state.progress.streakFreezes = 0;
    const resetStreak = protectOrResetStreak();
    return { earned, capped, protectedState, reset: { resetStreak, streak: state.progress.streak, freezes: state.progress.streakFreezes } };
  });
  if (freezeResult.earned.freezes !== 1 || freezeResult.capped.freezes !== 3 || !freezeResult.protectedState.protectedStreak || freezeResult.protectedState.streak !== 8 || freezeResult.protectedState.freezes !== 1 || freezeResult.reset.resetStreak || freezeResult.reset.streak !== 0) {
    throw new Error(`Streak freeze policy failed: ${JSON.stringify(freezeResult)}`);
  }

  const repeatedQuestions = await page.evaluate(() => {
    const originalRandom = Math.random;
    Math.random = () => 0.12;
    state.session.seenQuestions = [];
    state.progress.currentStage = 1;
    const questions = [];
    for (let index = 0; index < 4; index += 1) {
      showQuestion();
      questions.push(questionKey(state.current));
      clearInterval(state.timerId);
    }
    Math.random = originalRandom;
    return questions;
  });
  if (new Set(repeatedQuestions).size < 3) throw new Error(`Question repeat guard failed: ${JSON.stringify(repeatedQuestions)}`);

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
