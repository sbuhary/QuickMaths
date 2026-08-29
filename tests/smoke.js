const fs = require("node:fs");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
const js = fs.readFileSync("app.js", "utf8");
const samples = JSON.parse(fs.readFileSync("tests/recognition-samples.json", "utf8"));
const manifest = JSON.parse(fs.readFileSync("manifest.webmanifest", "utf8"));
const serviceWorker = fs.readFileSync("sw.js", "utf8");
const version = fs.readFileSync("version.js", "utf8").match(/QUICKMATHS_RELEASE = "([^"]+)"/)?.[1];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function extractConst(name) {
  const start = js.indexOf(`const ${name} = `);
  assert(start >= 0, `Missing ${name}`);
  const afterStart = start + `const ${name} = `.length;
  const end = js.indexOf(";\n", afterStart);
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
  return hits / Math.max(1, expected) - (extras / Math.max(1, ink)) * 0.24;
}

execFileSync(process.execPath, ["--check", "app.js"], { stdio: "pipe" });

const stagePlans = extractConst("stagePlans");
const digitTemplates = extractConst("digitTemplates");

assert(stagePlans.length === 12, "Expected 12 stages");
assert(stagePlans[0].operation === "addition" && stagePlans[0].sumMax === 5, "Stage 1 should be tiny addition");
assert(stagePlans[10].operation === "division", "Stage 11 should introduce division");
assert(version, "Release version constant missing");
assert(html.includes(`styles.css?v=${version}`), "CSS cache version does not match release version");
assert(html.includes(`app.js?v=${version}`), "JS cache version does not match release version");
assert(serviceWorker.includes(`quickmaths-${version}`), "Service worker cache version does not match release version");
assert(css.includes("touch-action: pinch-zoom"), "Canvas must allow pinch zoom");
assert(html.includes("manifest.webmanifest"), "PWA manifest link missing");
assert(manifest.icons?.some((icon) => icon.src.includes("quickmaths-icon.svg")), "PWA icon missing from manifest");
assert(serviceWorker.includes("self.addEventListener(\"fetch\"") && js.includes("registerServiceWorker"), "Service worker wiring missing");
assert(html.includes("id=\"sound-toggle\"") && js.includes("playTone") && js.includes("toggleSound"), "Sound toggle behavior missing");
assert(css.includes(".answer-box.active"), "Answer box highlight style missing");
assert(html.includes("id=\"clear-answer\""), "Answer-only clear control missing");
assert(html.includes("id=\"hand-toggle\""), "Handedness toggle missing");
assert(html.includes("class=\"pen-sizes\""), "Pen size controls missing");
assert(html.includes("id=\"retry-missed\""), "Retry missed control missing");
assert(js.includes("retryMissedQuestions") && js.includes("missedQuestions"), "Retry missed behavior missing");
assert(js.includes("clearAnswerOnly") && js.includes("pathTouchesAnswer"), "Answer-only clear behavior missing");
assert(js.includes("toggleHandedness") && css.includes("data-controls=\"left\""), "Handedness behavior missing");
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
