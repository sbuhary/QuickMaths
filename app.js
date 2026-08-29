const board = document.querySelector("#board");
const ctx = board.getContext("2d", { willReadFrequently: true });
const questionEl = document.querySelector("#question");
const timerEl = document.querySelector("#timer");
const feedbackEl = document.querySelector("#feedback");
const answerBox = document.querySelector("#answer-box");
const operationEl = document.querySelector("#operation");
const difficultyEl = document.querySelector("#difficulty");
const starsEl = document.querySelector("#stars");
const streakEl = document.querySelector("#streak");
const nextButton = document.querySelector("#next");
const checkButton = document.querySelector("#check");
const clearButton = document.querySelector("#clear");
const undoButton = document.querySelector("#undo");
const eraserButton = document.querySelector("#eraser");
const settingsToggle = document.querySelector("#settings-toggle");
const settingsPanel = document.querySelector("#settings-panel");
const colorButtons = [...document.querySelectorAll(".color")];
const levelButtons = [...document.querySelectorAll(".level-node")];

const settings = {
  starter: { label: "Starter", max: 10, multiplicationMax: 5, divisionMax: 5, unlockAt: 0 },
  explorer: { label: "Explorer", max: 60, multiplicationMax: 10, divisionMax: 10, unlockAt: 6 },
  wizard: { label: "Wizard", max: 250, multiplicationMax: 12, divisionMax: 12, unlockAt: 15 },
};

const digitTemplates = {
  0: ["111", "101", "101", "101", "101", "101", "111"],
  1: ["010", "110", "010", "010", "010", "010", "111"],
  2: ["111", "001", "001", "111", "100", "100", "111"],
  3: ["111", "001", "001", "111", "001", "001", "111"],
  4: ["101", "101", "101", "111", "001", "001", "001"],
  5: ["111", "100", "100", "111", "001", "001", "111"],
  6: ["111", "100", "100", "111", "101", "101", "111"],
  7: ["111", "001", "001", "010", "010", "100", "100"],
  8: ["111", "101", "101", "111", "101", "101", "111"],
  9: ["111", "101", "101", "111", "001", "001", "111"],
};

const state = {
  current: null,
  currentColor: "#1f2937",
  erasing: false,
  drawing: false,
  lastPoint: null,
  paths: [],
  currentPath: null,
  seconds: 0,
  timerId: null,
  progress: loadProgress(),
};

function loadProgress() {
  const fallback = { stars: 0, streak: 0, answered: 0, unlocked: ["starter"] };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem("mathsprout-progress")) };
  } catch {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem("mathsprout-progress", JSON.stringify(state.progress));
}

function updateProgressUi() {
  const unlocked = new Set(state.progress.unlocked);
  starsEl.textContent = `${state.progress.stars} stars`;
  streakEl.textContent = `${state.progress.streak} streak`;
  levelButtons.forEach((button, index) => {
    const level = button.dataset.level;
    const isUnlocked = unlocked.has(level);
    button.disabled = !isUnlocked;
    button.classList.toggle("active", difficultyEl.value === level);
    button.textContent = isUnlocked ? String(index + 1) : "L";
    button.setAttribute("aria-label", `${settings[level].label} level${isUnlocked ? "" : " locked"}`);
  });
}

function unlockEligibleLevels() {
  Object.entries(settings).forEach(([key, config]) => {
    if (state.progress.stars >= config.unlockAt && !state.progress.unlocked.includes(key)) {
      state.progress.unlocked.push(key);
      feedbackEl.textContent += ` ${config.label} unlocked!`;
    }
  });
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeQuestion() {
  const difficulty = settings[difficultyEl.value];
  const operation = operationEl.value;
  let a;
  let b;
  let answer;
  let symbol;

  if (operation === "addition") {
    a = randomInt(1, difficulty.max);
    b = randomInt(1, difficulty.max);
    answer = a + b;
    symbol = "+";
  }

  if (operation === "subtraction") {
    a = randomInt(Math.ceil(difficulty.max / 2), difficulty.max);
    b = randomInt(1, a);
    answer = a - b;
    symbol = "-";
  }

  if (operation === "multiplication") {
    a = randomInt(1, difficulty.multiplicationMax);
    b = randomInt(1, difficulty.multiplicationMax);
    answer = a * b;
    symbol = "x";
  }

  if (operation === "division") {
    b = randomInt(1, difficulty.divisionMax);
    answer = randomInt(1, difficulty.divisionMax);
    a = b * answer;
    symbol = "/";
  }

  return { a, b, answer, symbol };
}

function renderStackedQuestion(question) {
  const digits = Math.max(String(question.a).length, String(question.b).length);
  questionEl.style.setProperty("--digits", `${digits}ch`);
  return `
    <span class="top">${question.a}</span>
    <span class="operator">${question.symbol}</span>
    <span class="bottom-number">${question.b}</span>
    <span class="bar"></span>
  `;
}

function showQuestion() {
  state.current = makeQuestion();
  questionEl.innerHTML = renderStackedQuestion(state.current);
  feedbackEl.textContent = "Write the final answer inside the box.";
  feedbackEl.className = "feedback";
  clearBoard();
  resetTimer();
}

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const rest = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}

function resetTimer() {
  clearInterval(state.timerId);
  state.seconds = 0;
  timerEl.textContent = formatTime(0);
  state.timerId = setInterval(() => {
    state.seconds += 1;
    timerEl.textContent = formatTime(state.seconds);
  }, 1000);
}

function resizeBoard() {
  const snapshot = board.width && board.height ? board.toDataURL() : null;
  const ratio = window.devicePixelRatio || 1;
  const width = board.clientWidth;
  const height = board.clientHeight;
  board.width = Math.max(1, Math.floor(width * ratio));
  board.height = Math.max(1, Math.floor(height * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (snapshot) {
    const image = new Image();
    image.onload = () => ctx.drawImage(image, 0, 0, width, height);
    image.src = snapshot;
  }
}

function getPoint(event) {
  const rect = board.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function getAnswerRect() {
  const boardRect = board.getBoundingClientRect();
  const boxRect = answerBox.getBoundingClientRect();
  return {
    left: boxRect.left - boardRect.left,
    top: boxRect.top - boardRect.top,
    right: boxRect.right - boardRect.left,
    bottom: boxRect.bottom - boardRect.top,
  };
}

function pointInsideRect(point, rect) {
  return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}

function pathsInsideAnswerBox() {
  const rect = getAnswerRect();
  return state.paths
    .filter((path) => !path.erase)
    .map((path) => ({
      ...path,
      points: path.points
        .filter((point) => pointInsideRect(point, rect))
        .map((point) => ({ x: point.x - rect.left, y: point.y - rect.top })),
    }))
    .filter((path) => path.points.length > 1);
}

function drawSegment(from, to, color, size, erase) {
  ctx.globalCompositeOperation = erase ? "destination-out" : "source-over";
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
}

function startDrawing(event) {
  event.preventDefault();
  board.setPointerCapture(event.pointerId);
  state.drawing = true;
  state.lastPoint = getPoint(event);
  state.currentPath = {
    color: state.currentColor,
    erase: state.erasing,
    size: state.erasing ? 24 : 5,
    points: [state.lastPoint],
  };
}

function keepDrawing(event) {
  if (!state.drawing) return;
  event.preventDefault();
  const point = getPoint(event);
  drawSegment(state.lastPoint, point, state.currentPath.color, state.currentPath.size, state.currentPath.erase);
  state.currentPath.points.push(point);
  state.lastPoint = point;
}

function stopDrawing() {
  if (!state.drawing) return;
  state.drawing = false;
  if (state.currentPath.points.length > 1) state.paths.push(state.currentPath);
  state.currentPath = null;
}

function redrawBoard() {
  ctx.clearRect(0, 0, board.clientWidth, board.clientHeight);
  state.paths.forEach((path) => {
    for (let index = 1; index < path.points.length; index += 1) {
      drawSegment(path.points[index - 1], path.points[index], path.color, path.size, path.erase);
    }
  });
}

function clearBoard() {
  state.paths = [];
  ctx.clearRect(0, 0, board.clientWidth, board.clientHeight);
}

function clearBoardWithConfirmation() {
  if (!state.paths.length) return;
  if (window.confirm("Clear all writing on the board?")) {
    clearBoard();
    feedbackEl.textContent = "Board cleared.";
    feedbackEl.className = "feedback";
  }
}

function normalizeAnswer(value) {
  const match = String(value).replace(/[Oo]/g, "0").replace(/[Il]/g, "1").match(/-?\d+/);
  return match ? Number(match[0]) : NaN;
}

function scoreTemplate(grid, template) {
  let hits = 0;
  let expected = 0;
  let extras = 0;
  let ink = 0;

  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const hasInk = grid[row][col] === 1;
      const wantsInk = template[row][col] === "1";
      if (wantsInk) expected += 1;
      if (hasInk) ink += 1;
      if (hasInk && wantsInk) hits += 1;
      if (hasInk && !wantsInk) extras += 1;
    }
  }

  return hits / Math.max(1, expected) - extras / Math.max(1, ink) * 0.38;
}

function answerInkComponents() {
  const rect = getAnswerRect();
  const scaleX = board.width / board.clientWidth;
  const scaleY = board.height / board.clientHeight;
  const sx = Math.max(0, Math.round(rect.left * scaleX));
  const sy = Math.max(0, Math.round(rect.top * scaleY));
  const sw = Math.min(board.width - sx, Math.round((rect.right - rect.left) * scaleX));
  const sh = Math.min(board.height - sy, Math.round((rect.bottom - rect.top) * scaleY));
  if (sw <= 0 || sh <= 0) return [];

  const image = ctx.getImageData(sx, sy, sw, sh);
  const columnInk = Array(sw).fill(0);
  const alphaAt = (x, y) => image.data[(y * sw + x) * 4 + 3];

  for (let y = 0; y < sh; y += 1) {
    for (let x = 0; x < sw; x += 1) {
      if (alphaAt(x, y) > 24) columnInk[x] += 1;
    }
  }

  const threshold = Math.max(2, Math.round(sh * 0.01));
  const ranges = [];
  let start = null;
  let lastInk = -1;
  let blankRun = 0;
  const splitGap = Math.max(12, Math.round(sw * 0.045));

  columnInk.forEach((count, x) => {
    if (count > threshold) {
      if (start === null) start = x;
      lastInk = x;
      blankRun = 0;
      return;
    }

    if (start !== null) {
      blankRun += 1;
      if (blankRun >= splitGap) {
        ranges.push({ minX: start, maxX: lastInk });
        start = null;
        blankRun = 0;
      }
    }
  });

  if (start !== null) ranges.push({ minX: start, maxX: lastInk });

  return ranges.map((range) => {
    let minY = sh;
    let maxY = 0;
    for (let y = 0; y < sh; y += 1) {
      for (let x = range.minX; x <= range.maxX; x += 1) {
        if (alphaAt(x, y) > 24) {
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }
    return { ...range, minY, maxY, image, width: sw, height: sh };
  }).filter((box) => box.maxX - box.minX > 2 && box.maxY - box.minY > 8);
}

function rasterizeInkComponent(component) {
  const grid = Array.from({ length: 7 }, () => Array(3).fill(0));
  const width = Math.max(1, component.maxX - component.minX);
  const height = Math.max(1, component.maxY - component.minY);
  const alphaAt = (x, y) => component.image.data[(y * component.width + x) * 4 + 3];

  for (let y = component.minY; y <= component.maxY; y += 1) {
    for (let x = component.minX; x <= component.maxX; x += 1) {
      if (alphaAt(x, y) <= 24) continue;
      const col = Math.max(0, Math.min(2, Math.round(((x - component.minX) / width) * 2)));
      const row = Math.max(0, Math.min(6, Math.round(((y - component.minY) / height) * 6)));
      grid[row][col] = 1;
    }
  }

  return grid;
}

function recognizeInkComponent(component) {
  const width = Math.max(1, component.maxX - component.minX);
  const height = Math.max(1, component.maxY - component.minY);
  const aspect = width / height;

  if (aspect < 0.42) {
    return { digit: "1", confidence: 0.98 };
  }

  const grid = rasterizeInkComponent(component);
  const ranked = Object.entries(digitTemplates)
    .map(([digit, template]) => ({ digit, score: scoreTemplate(grid, template) }))
    .sort((a, b) => b.score - a.score);
  const top = ranked[0];
  const next = ranked[1] || { score: 0 };
  return { digit: top.digit, confidence: Math.max(0, Math.min(1, top.score - next.score + 0.55)) };
}

function recognizeDigitsLocally() {
  const components = answerInkComponents();
  if (!components.length) return { text: "", status: "empty", confidence: 0 };

  const recognized = components.map(recognizeInkComponent);
  const text = recognized.map((item) => item.digit).join("");
  const confidence = recognized.reduce((sum, item) => sum + item.confidence, 0) / Math.max(1, recognized.length);

  return { text, status: text ? "local" : "unreadable", confidence };
}
async function recognizeWithBrowserApi(paths) {
  const Recognizer = window.HandwritingRecognizer || window.webkitHandwritingRecognizer;
  if (!Recognizer || !window.HandwritingDrawing || !window.HandwritingStroke) {
    return { text: "", status: "unsupported", confidence: 0 };
  }

  try {
    const recognizer = await Recognizer.create({ languages: ["en"], recognitionType: "text" });
    const drawing = new window.HandwritingDrawing();
    paths.forEach((path) => {
      const stroke = new window.HandwritingStroke();
      path.points.forEach((point, index) => stroke.addPoint({ x: point.x, y: point.y, t: index }));
      drawing.addStroke(stroke);
    });
    const predictions = await recognizer.recognize(drawing);
    return { text: predictions?.[0]?.text || "", status: "browser", confidence: 0.7 };
  } catch {
    return { text: "", status: "unsupported", confidence: 0 };
  }
}

async function recognizeWriting() {
  const paths = pathsInsideAnswerBox();
  if (!paths.length) return { text: "", status: "empty", confidence: 0 };

  const local = recognizeDigitsLocally();
  if (local.text && local.confidence >= 0.48) return local;

  const browser = await recognizeWithBrowserApi(paths);
  if (browser.text) return browser;
  return local.text ? local : { text: "", status: "unreadable", confidence: 0 };
}

async function checkAnswer() {
  if (!state.current) showQuestion();
  checkButton.disabled = true;
  feedbackEl.textContent = "Checking the answer box...";

  const recognized = await recognizeWriting();
  const given = normalizeAnswer(recognized.text);
  const correct = given === state.current.answer;

  if (correct) {
    state.progress.streak += 1;
    const streakBonus = state.progress.streak % 3 === 0 ? 2 : 0;
    state.progress.stars += 1 + streakBonus;
    state.progress.answered += 1;
    feedbackEl.textContent = `Correct. I read ${recognized.text}. Time ${formatTime(state.seconds)}.`;
    feedbackEl.className = "feedback correct";
    unlockEligibleLevels();
  } else {
    state.progress.streak = 0;
    if (recognized.status === "empty") {
      feedbackEl.textContent = `Write the final answer inside the box. Correct answer: ${state.current.answer}.`;
    } else if (recognized.status === "unreadable") {
      feedbackEl.textContent = `I could not read it clearly. Correct answer: ${state.current.answer}.`;
    } else {
      feedbackEl.textContent = `I read ${recognized.text || "nothing"}. Correct answer: ${state.current.answer}.`;
    }
    feedbackEl.className = "feedback wrong";
  }

  saveProgress();
  updateProgressUi();
  checkButton.disabled = false;
}

function selectColor(button) {
  state.currentColor = button.dataset.color;
  state.erasing = false;
  eraserButton.classList.remove("selected-tool");
  colorButtons.forEach((item) => item.classList.toggle("selected", item === button));
}

function hideSettings() {
  settingsPanel.hidden = true;
  settingsToggle.setAttribute("aria-expanded", "false");
}

board.addEventListener("pointerdown", startDrawing);
board.addEventListener("pointermove", keepDrawing);
board.addEventListener("pointerup", stopDrawing);
board.addEventListener("pointercancel", stopDrawing);
board.addEventListener("pointerleave", stopDrawing);
window.addEventListener("resize", resizeBoard);

settingsToggle.addEventListener("click", () => {
  settingsPanel.hidden = !settingsPanel.hidden;
  settingsToggle.setAttribute("aria-expanded", String(!settingsPanel.hidden));
});
colorButtons.forEach((button) => button.addEventListener("click", () => selectColor(button)));
eraserButton.addEventListener("click", () => {
  state.erasing = true;
  eraserButton.classList.add("selected-tool");
  colorButtons.forEach((button) => button.classList.remove("selected"));
});
undoButton.addEventListener("click", () => {
  state.paths.pop();
  redrawBoard();
});
clearButton.addEventListener("click", clearBoardWithConfirmation);
nextButton.addEventListener("click", showQuestion);
checkButton.addEventListener("click", checkAnswer);
operationEl.addEventListener("change", () => {
  hideSettings();
  showQuestion();
});
difficultyEl.addEventListener("change", () => {
  hideSettings();
  showQuestion();
});
levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.disabled) return;
    difficultyEl.value = button.dataset.level;
    updateProgressUi();
    showQuestion();
  });
});

resizeBoard();
updateProgressUi();
showQuestion();


