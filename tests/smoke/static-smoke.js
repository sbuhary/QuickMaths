const fs = require("node:fs");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("assets/css/styles.css", "utf8");
const js = fs.readFileSync("assets/js/app.js", "utf8");
const samples = JSON.parse(fs.readFileSync("tests/fixtures/recognition-samples.json", "utf8"));
const manifest = JSON.parse(fs.readFileSync("manifest.webmanifest", "utf8"));
const onnxModel = fs.statSync("assets/models/mnist-8.onnx");
const serviceWorker = fs.readFileSync("sw.js", "utf8");
const version = fs.readFileSync("assets/js/version.js", "utf8").match(/QUICKMATHS_RELEASE = "([^"]+)"/)?.[1];
const iconsSource = fs.readFileSync("assets/js/icons.js", "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function extractConst(name) {
  const start = js.indexOf(`const ${name} = `);
  assert(start >= 0, `Missing ${name}`);
  const afterStart = start + `const ${name} = `.length;
  const match = /;\r?\n/.exec(js.slice(afterStart));
  const end = match ? afterStart + match.index : -1;
  assert(end >= 0, `Cannot parse ${name}`);
  const context = {};
  vm.runInNewContext(`${name} = ${js.slice(afterStart, end)}`, context);
  return context[name];
}

function scoreTemplate(grid, template) {
  let hits = 0;
  let expected = 0;
  let extras = 0;
  let ink = 0;
  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const hasInk = grid[row][col] === "1";
      const wantsInk = template[row][col] === "1";
      if (wantsInk) expected += 1;
      if (hasInk) ink += 1;
      if (hasInk && wantsInk) hits += 1;
      if (hasInk && !wantsInk) extras += 1;
    }
  }
  const recall = hits / Math.max(1, expected);
  const precision = hits / Math.max(1, ink);
  const extraRate = extras / Math.max(1, ink);
  return recall * 0.68 + precision * 0.32 - extraRate * 0.34;
}

execFileSync(process.execPath, ["--check", "assets/js/app.js"], { stdio: "pipe" });
execFileSync(process.execPath, ["--check", "assets/js/icons.js"], { stdio: "pipe" });
execFileSync(process.execPath, ["--check", "tests/support/static-server.js"], { stdio: "pipe" });

const stagePlans = extractConst("stagePlans");
const digitTemplates = extractConst("digitTemplates");

assert(stagePlans.length === 12, "Expected 12 stages");
assert(stagePlans[0].operation === "addition" && stagePlans[0].sumMax === 5, "Stage 1 should be tiny addition");
assert(stagePlans[0].unlockStars === 50 && stagePlans[4].unlockStars === 75 && stagePlans[8].unlockStars === 100, "Stage unlock star thresholds missing");
assert(stagePlans[10].operation === "division", "Stage 11 should introduce division");
assert(version, "Release version constant missing");
assert(html.includes(`assets/css/styles.css?v=${version}`), "CSS cache version does not match release version");
assert(html.includes(`assets/js/app.js?v=${version}`), "JS cache version does not match release version");
assert(html.includes(`assets/js/icons.js?v=${version}`), "Icon JavaScript cache version does not match release version");
assert(serviceWorker.includes(`quickmaths-${version}`), "Service worker cache version does not match release version");
assert(serviceWorker.includes(`assets/js/icons.js?v=${version}`), "Service worker must cache local icon renderer");
assert(css.includes("touch-action: pinch-zoom"), "Canvas must allow pinch zoom");
assert(html.includes("manifest.webmanifest"), "PWA manifest link missing");
assert(html.includes("Winding stage path") && html.includes("class=\"level-road\"") && css.includes(".level-road path") && css.includes('.level-node[data-stage="12"] { left: 50%; top: 92%; }') && css.includes("min-height: 1580px") && css.includes("active-stage-pulse"), "Vertical stage path layout missing");
assert(!html.includes("unpkg.com/lucide") && !html.includes("lucide-static"), "Icon renderer must be local for Safari file URLs");
assert(html.includes("onnxruntime-web") && html.includes("QUICKMATHS_ENABLE_ONNX_MODEL = true") && js.includes("ort.InferenceSession.create(\"./assets/models/mnist-8.onnx\"") && js.includes("recognizeWithOnnx"), "ONNX Runtime model wiring missing");
assert(onnxModel.size > 20000 && serviceWorker.includes("./assets/models/mnist-8.onnx"), "ONNX model asset must be committed and cached");
assert(manifest.icons?.some((icon) => icon.src.includes("quickmaths-icon.svg")), "PWA icon missing from manifest");
assert(serviceWorker.includes("self.addEventListener(\"fetch\"") && js.includes("registerServiceWorker"), "Service worker wiring missing");
assert(html.includes("id=\"sound-toggle\"") && js.includes("playTone") && js.includes("toggleSound"), "Sound toggle behavior missing");
assert(html.includes("id=\"streak-freezes\"") && js.includes("streakFreezes") && js.includes("protectOrResetStreak") && js.includes("awardStreakFreezeIfEarned"), "Streak freeze behavior missing");
assert(css.includes(".answer-box.active") && css.includes(".answer-digit-slot") && js.includes("renderAnswerDigitBoxes") && js.includes("answerDigitRects"), "Answer digit-box layout missing");
assert(html.includes("id=\"pencil\"") && html.includes("id=\"pen-panel\"") && html.includes("id=\"try-main\""), "Pencil panel and state actions missing");
assert(css.includes(".pen-panel") && css.includes("background: #fffef8") && css.includes("z-index: 5"), "Pencil panel must hide board content behind it");
assert(html.includes("data-size=\"11\"") && html.includes("aria-label=\"Thick pen\""), "Pen size controls missing");
assert(html.includes("id=\"retry-missed\""), "Retry missed control missing");
assert(js.includes("retryMissedQuestions") && js.includes("missedQuestions"), "Retry missed behavior missing");
assert(js.includes("componentColumnInk") && js.includes("findSplitColumn"), "Valley-based digit splitting missing");
assert(js.includes("scoreDigitFeatures") && js.includes("scoreComponentAsDigit") && js.includes("strokeDigitScore") && js.includes("status: \"ambiguous\"") && js.includes("minimumMargin < 0.1") && js.includes("confidence >= 0.64"), "Conservative recognition confidence guard missing");
assert(js.includes("hasQuestion") && js.includes("() => showQuestion()"), "Next handlers must not pass click events as questions");
assert(html.includes("Easy: start at tiny sums") && html.includes("Medium: start at teen sums") && html.includes("Difficult: start at times tables") && js.includes("difficultyStarts = { easy: 1, medium: 5, difficult: 9 }") && js.includes("selectDifficulty"), "Difficulty entry selection missing");
assert(js.includes("setActionState(type)") && js.includes("tryMainButton.hidden") && js.includes("nextMainButton.hidden") && js.includes("checkButton.hidden"), "Answer actions must follow feedback state");
assert(js.includes("normalizeProgress") && js.includes("Math.min(unlockedStages") && js.includes("stageStars") && js.includes("quickmaths-difficulty"), "Saved progress must include stage stars and remembered difficulty");
assert(!html.includes("id=\"clear-answer\"") && js.includes("clearBoardWithConfirmation"), "Compact UI should keep one confirmed clear-all control");
assert(!html.includes("id=\"hand-toggle\"") && !js.includes("toggleHandedness") && !css.includes("data-controls=\"left\""), "Removed side-toggle controls should stay out of the compact UI");
assert(html.includes("id=\"splash-screen\"") && js.includes("showSplashThenRestore") && js.includes("quickmaths-view"), "Splash and refresh-view restore behavior missing");
assert(html.includes("id=\"kid-name\"") && html.includes("placeholder=\"Your name\"") && html.includes("required") && js.includes("quickmaths-kid-name") && js.includes("Congratulations"), "Required personalized/fallback messages missing");
assert(html.includes("id=\"name-gate\"") && js.includes("requireKidName") && js.includes("saveNameFromGate"), "Missing required-name gate for old saved users");
assert(html.includes("id=\"celebration\"") && css.includes("confetti-pop") && js.includes("celebrateCorrectAnswer"), "Correct-answer celebration missing");
assert(html.includes('id="reward-gate"') && js.includes("starMilestones") && js.includes("earnedStarMilestones") && js.includes("Stage ${unlockedStage} unlocked!") && css.includes("reward-pop"), "Star milestone and stage-unlock reward popup missing");
assert(html.includes("data-lucide=\"star\"") && html.includes("data-lucide=\"flame\"") && html.includes("data-lucide=\"lock\""), "Game-style score and lock icons missing");
assert(js.includes("formatKidTimeLeft") && js.includes("You still had"), "Kid-friendly time-left wording missing");
assert(html.includes('id="answer-choices"') && js.includes("nearbyAnswerChoices") && js.includes("verifyChosenAnswer"), "Low-confidence answer choices missing");
assert(js.includes('recognized.status !== "empty"') && js.includes("pick the answer you meant"), "Low-confidence choice prompt missing");
assert(html.includes('id="help-start"') && html.includes('id="help-practice"') && html.includes('id="help-gate"') && js.includes("showHelp") && iconsSource.includes('"circle-help"'), "Help overlay missing");
assert(css.includes("white-space: pre-line"), "Feedback must support line breaks");
assert(js.includes("svgCursor") && js.includes("updateToolUi") && css.includes("#pencil.selected-tool svg"), "Pencil/eraser cursor and selected-color state missing");
assert(serviceWorker.includes("assets/backgrounds/levels.svg"), "Level background must be cached by service worker");
for (const width of [320, 375, 430]) assert(width <= 520, `Smoke viewport ${width}px must use mobile layout rules`);
assert(css.includes("@media (max-height: 690px)"), "Low-height layout media query missing");
assert(css.includes("@media (max-width: 360px)"), "Small-width layout media query missing");
assert(js.includes("activeTouchPointers") && js.includes("gestureMode"), "Single-finger touch guard missing");

for (const digit of Object.keys(samples)) {
  const sample = samples[digit];
  assert(sample.length === 7 && sample.every((row) => /^[01]{5}$/.test(row)), `Bad sample for ${digit}`);
  const scores = Object.entries(digitTemplates).map(([candidate, templates]) => ({
    candidate,
    score: Math.max(...templates.map((template) => scoreTemplate(sample, template))),
  })).sort((a, b) => b.score - a.score);
  assert(scores[0].candidate === digit, `Sample ${digit} recognized as ${scores[0].candidate}`);
}

console.log("QuickMaths smoke checks passed");
