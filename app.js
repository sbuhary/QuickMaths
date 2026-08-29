const startScreen = document.querySelector("#start-screen");
const practiceBoard = document.querySelector("#practice-board");
const board = document.querySelector("#board");
const ctx = board.getContext("2d", { willReadFrequently: true });
const questionEl = document.querySelector("#question");
const timerEl = document.querySelector("#timer");
const timerControl = document.querySelector("#timer-control");
const feedbackPanel = document.querySelector("#feedback-panel");
const feedbackEl = document.querySelector("#feedback");
const closeFeedbackButton = document.querySelector("#close-feedback");
const markCorrectButton = document.querySelector("#mark-correct");
const markWrongButton = document.querySelector("#mark-wrong");
const answerBox = document.querySelector("#answer-box");
const operationEl = document.querySelector("#operation");
const difficultyEl = document.querySelector("#difficulty");
const starsEl = document.querySelector("#stars");
const streakEl = document.querySelector("#streak");
const stageSummaryEl = document.querySelector("#stage-summary");
const sessionSummaryEl = document.querySelector("#session-summary");
const startPracticeButton = document.querySelector("#start-practice");
const resetProgressButton = document.querySelector("#reset-progress");
const backToLevelsButton = document.querySelector("#back-to-levels");
const retryFeedbackButton = document.querySelector("#retry-feedback");
const nextFeedbackButton = document.querySelector("#next-feedback");
const checkButton = document.querySelector("#check");
const nextMainButton = document.querySelector("#next-main");
const clearButton = document.querySelector("#clear");
const undoButton = document.querySelector("#undo");
const eraserButton = document.querySelector("#eraser");
const colorButtons = [...document.querySelectorAll(".color")];
const levelButtons = [...document.querySelectorAll(".level-node")];

const settings = {
  starter: { label: "Starter", unlockAt: 0 },
  explorer: { label: "Explorer", unlockAt: 4 },
  builder: { label: "Builder", unlockAt: 8 },
  wizard: { label: "Wizard", unlockAt: 12 },
};

const stagePlans = [
  { stage: 1, level: "starter", title: "Tiny sums", operation: "addition", max: 5, sumMax: 5, seconds: 60 },
  { stage: 2, level: "starter", title: "Facts to 10", operation: "addition", max: 9, sumMax: 10, seconds: 60 },
  { stage: 3, level: "starter", title: "Take away", operation: "subtraction", max: 10, seconds: 60 },
  { stage: 4, level: "starter", title: "Add or subtract", operation: "add-sub", max: 10, sumMax: 10, seconds: 65 },
  { stage: 5, level: "explorer", title: "Teen sums", operation: "addition", max: 12, sumMax: 20, seconds: 70 },
  { stage: 6, level: "explorer", title: "Teen subtraction", operation: "subtraction", max: 20, seconds: 70 },
  { stage: 7, level: "explorer", title: "Two-digit plus ones", operation: "addition", max: 89, addendMax: 9, seconds: 75 },
  { stage: 8, level: "explorer", title: "Two-digit take away", operation: "subtraction", max: 99, subtractMax: 9, seconds: 75 },
  { stage: 9, level: "builder", title: "Times 2, 5, 10", operation: "multiplication", factors: [2, 5, 10], max: 10, seconds: 80 },
  { stage: 10, level: "builder", title: "Small times tables", operation: "multiplication", multiplicationMax: 6, seconds: 85 },
  { stage: 11, level: "wizard", title: "Exact sharing", operation: "division", divisionMax: 6, seconds: 90 },
  { stage: 12, level: "wizard", title: "Mixed challenge", operation: "mixed", multiplicationMax: 10, divisionMax: 10, max: 30, seconds: 90 },
];

const digitTemplates = {
  0: [["01110", "10001", "10011", "10101", "11001", "10001", "01110"], ["11111", "10001", "10001", "10001", "10001", "10001", "11111"], ["01110", "10001", "10001", "10001", "10001", "10001", "01110"]],
  1: [["00100", "01100", "00100", "00100", "00100", "00100", "01110"], ["00100", "00100", "00100", "00100", "00100", "00100", "00100"], ["01000", "11000", "01000", "01000", "01000", "01000", "11100"], ["00010", "00110", "00010", "00010", "00010", "00010", "00111"]],
  2: [["01110", "10001", "00001", "00010", "00100", "01000", "11111"], ["11110", "00001", "00001", "01110", "10000", "10000", "11111"], ["01110", "10001", "00001", "00110", "01000", "10000", "11111"], ["00110", "01001", "00001", "00010", "00100", "01000", "01111"]],
  3: [["11110", "00001", "00001", "01110", "00001", "00001", "11110"], ["01110", "10001", "00001", "00110", "00001", "10001", "01110"], ["11110", "00001", "00010", "00110", "00001", "00001", "11110"]],
  4: [["10010", "10010", "10010", "11111", "00010", "00010", "00010"], ["10001", "10001", "10001", "11111", "00001", "00001", "00001"], ["00100", "01100", "10100", "11111", "00100", "00100", "00100"]],
  5: [["11111", "10000", "10000", "11110", "00001", "00001", "11110"], ["11111", "10000", "11110", "00001", "00001", "10001", "01110"]],
  6: [["01110", "10000", "10000", "11110", "10001", "10001", "01110"], ["00110", "01000", "10000", "11110", "10001", "10001", "01110"], ["01110", "10000", "10000", "11110", "10001", "10001", "11110"]],
  7: [["11111", "00001", "00010", "00100", "01000", "01000", "01000"], ["11111", "00001", "00010", "00100", "00100", "00100", "00100"], ["11111", "00010", "00010", "00100", "00100", "01000", "01000"]],
  8: [["01110", "10001", "10001", "01110", "10001", "10001", "01110"], ["11111", "10001", "10001", "11111", "10001", "10001", "11111"]],
  9: [["01110", "10001", "10001", "01111", "00001", "00010", "11100"], ["01110", "10001", "10001", "01111", "00001", "00001", "01110"], ["01111", "10001", "10001", "01111", "00001", "00001", "01110"]],
};

const timerStyles = ["digital", "analog", "hourglass"];
const state = {
  current: null,
  currentColor: "#1f2937",
  erasing: false,
  drawing: false,
  activePointerId: null,
  activeTouchPointers: new Set(),
  gestureMode: false,
  lastPoint: null,
  paths: [],
  currentPath: null,
  timeLeft: 60,
  duration: 60,
  timerId: null,
  timerStyle: 0,
  progress: loadProgress(),
  session: { correct: 0, missed: 0, startedAt: Date.now() },
  pendingReview: null,
};

function loadProgress() {
  const fallback = { stars: 0, streak: 0, answered: 0, unlockedStages: 1, currentStage: 1 };
  try {
    const stored = localStorage.getItem("quickmaths-progress") || localStorage.getItem("mathsprout-progress");
    return { ...fallback, ...JSON.parse(stored || "{}") };
  } catch {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem("quickmaths-progress", JSON.stringify(state.progress));
}

function currentPlan() {
  return stagePlans[Math.max(0, Math.min(stagePlans.length - 1, state.progress.currentStage - 1))];
}

function updateProgressUi() {
  const plan = currentPlan();
  starsEl.textContent = `${state.progress.stars} stars`;
  streakEl.textContent = `${state.progress.streak} streak`;
  if (stageSummaryEl) stageSummaryEl.textContent = `Stage ${plan.stage}: ${plan.title}`;
  if (sessionSummaryEl) sessionSummaryEl.textContent = `${state.session.correct} right / ${state.session.missed} missed`;
  startPracticeButton.textContent = `Start stage ${plan.stage}`;
  levelButtons.forEach((button) => {
    const stage = Number(button.dataset.stage || 1);
    const stagePlan = stagePlans[stage - 1];
    const isUnlocked = stage <= state.progress.unlockedStages;
    button.disabled = !isUnlocked;
    button.dataset.level = stagePlan.level;
    button.classList.toggle("active", state.progress.currentStage === stage);
    button.setAttribute("aria-label", `Stage ${stage}, ${stagePlan.title}${isUnlocked ? "" : " locked"}`);
    const small = button.querySelector("small");
    if (small) small.textContent = settings[stagePlan.level].label;
  });
}

function unlockEligibleLevels() {
  state.progress.unlockedStages = Math.min(stagePlans.length, Math.max(state.progress.unlockedStages, state.progress.currentStage + 1));
}

function resetProgress() {
  if (!window.confirm("Reset stars, streak, and unlocked stages?")) return;
  localStorage.removeItem("quickmaths-progress");
  localStorage.removeItem("mathsprout-progress");
  state.progress = loadProgress();
  state.session = { correct: 0, missed: 0, startedAt: Date.now() };
  updateProgressUi();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseOperation(plan) {
  const selected = operationEl.value;
  if (selected !== "stage") return selected;
  if (plan.operation === "mixed") return Math.random() > 0.5 ? "multiplication" : "division";
  if (plan.operation === "add-sub") return Math.random() > 0.5 ? "addition" : "subtraction";
  return plan.operation;
}

function makeQuestion() {
  const plan = currentPlan();
  const operation = chooseOperation(plan);
  let a;
  let b;
  let answer;
  let symbol;

  if (operation === "addition") {
    const max = plan.max || 10;
    a = randomInt(1, max);
    b = randomInt(1, plan.addendMax || max);
    if (plan.sumMax) {
      a = randomInt(1, Math.max(1, plan.sumMax - 1));
      b = randomInt(1, Math.max(1, plan.sumMax - a));
    }
    answer = a + b;
    symbol = "+";
  }

  if (operation === "subtraction") {
    const max = plan.max || 10;
    const subtractMax = plan.subtractMax || max;
    a = randomInt(2, max);
    b = randomInt(1, Math.min(a, subtractMax));
    answer = a - b;
    symbol = "-";
  }

  if (operation === "multiplication") {
    const factors = plan.factors || null;
    a = factors ? factors[randomInt(0, factors.length - 1)] : randomInt(1, plan.multiplicationMax || 10);
    b = randomInt(1, plan.max || plan.multiplicationMax || 10);
    answer = a * b;
    symbol = "x";
  }

  if (operation === "division") {
    b = randomInt(1, plan.divisionMax || 10);
    answer = randomInt(1, plan.divisionMax || 10);
    a = b * answer;
    symbol = "/";
  }

  return { a, b, answer, symbol, plan };
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

function hideFeedback() {
  feedbackPanel.hidden = true;
}

function showStartScreen() {
  clearInterval(state.timerId);
  hideFeedback();
  practiceBoard.hidden = true;
  startScreen.hidden = false;
  updateProgressUi();
}

function startPractice() {
  startScreen.hidden = true;
  practiceBoard.hidden = false;
  requestAnimationFrame(() => {
    resizeBoard();
    showQuestion();
  });
}

function showQuestion() {
  state.current = makeQuestion();
  difficultyEl.value = state.current.plan.level;
  questionEl.innerHTML = renderStackedQuestion(state.current);
  hideFeedback();
  clearBoard();
  resetTimer();
}

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const rest = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}

function updateTimerDisplay() {
  const progress = state.duration > 0 ? state.timeLeft / state.duration : 0;
  const bounded = Math.max(0, Math.min(1, progress));
  timerEl.textContent = formatTime(state.timeLeft);
  timerControl.style.setProperty("--time-progress", String(bounded));
  timerControl.style.setProperty("--time-deg", `${bounded * 360}deg`);
  timerControl.style.setProperty("--minute-angle", `${(1 - bounded) * 360}deg`);
  timerControl.style.setProperty("--hour-angle", `${(1 - bounded) * 120}deg`);
  timerControl.style.setProperty("--sand-top", `${Math.max(1, Math.round(14 * bounded))}px`);
  timerControl.style.setProperty("--sand-bottom", `${Math.max(1, Math.round(14 * (1 - bounded)))}px`);
  timerControl.classList.toggle("low", state.timeLeft <= 10);
}

function resetTimer() {
  clearInterval(state.timerId);
  state.duration = currentPlan().seconds;
  state.timeLeft = state.duration;
  updateTimerDisplay();
  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    updateTimerDisplay();
    if (state.timeLeft <= 0) {
      clearInterval(state.timerId);
      recordMissOnce();
      updateProgressUi();
      showFeedback("Time is up. Try this one again.", "timeout");
    }
  }, 1000);
}

function cycleTimerStyle() {
  state.timerStyle = (state.timerStyle + 1) % timerStyles.length;
  timerControl.className = `timer ${timerStyles[state.timerStyle]}`;
  updateTimerDisplay();
}

function resizeBoard() {
  if (practiceBoard.hidden) return;
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

function pointInsideAnswer(point) {
  const rect = getAnswerRect();
  return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}

function updateAnswerHighlight(point) {
  answerBox.classList.toggle("active", Boolean(point && pointInsideAnswer(point)));
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

function cancelCurrentStroke() {
  state.drawing = false;
  state.activePointerId = null;
  state.currentPath = null;
  redrawBoard();
  updateAnswerHighlight(null);
}

function startDrawing(event) {
  if (event.pointerType === "touch") {
    state.activeTouchPointers.add(event.pointerId);
    if (state.activeTouchPointers.size > 1) {
      state.gestureMode = true;
      cancelCurrentStroke();
      return;
    }
  }

  if (state.gestureMode || state.activePointerId !== null) return;
  event.preventDefault();
  if (board.setPointerCapture) board.setPointerCapture(event.pointerId);
  state.activePointerId = event.pointerId;
  state.drawing = true;
  state.lastPoint = getPoint(event);
  updateAnswerHighlight(state.lastPoint);
  state.currentPath = {
    color: state.currentColor,
    erase: state.erasing,
    size: state.erasing ? 24 : 5,
    points: [state.lastPoint],
  };
}

function keepDrawing(event) {
  if (!state.drawing || event.pointerId !== state.activePointerId || state.gestureMode) return;
  event.preventDefault();
  const point = getPoint(event);
  updateAnswerHighlight(point);
  drawSegment(state.lastPoint, point, state.currentPath.color, state.currentPath.size, state.currentPath.erase);
  state.currentPath.points.push(point);
  state.lastPoint = point;
}

function stopDrawing(event) {
  if (event?.pointerType === "touch") {
    state.activeTouchPointers.delete(event.pointerId);
    if (state.activeTouchPointers.size === 0) state.gestureMode = false;
  }

  if (!state.drawing || event?.pointerId !== state.activePointerId) return;
  state.drawing = false;
  state.activePointerId = null;
  if (state.currentPath.points.length > 1) state.paths.push(state.currentPath);
  state.currentPath = null;
  updateAnswerHighlight(null);
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
  if (window.confirm("Clear all writing on the board?")) clearBoard();
}

function normalizeAnswer(value) {
  const match = String(value).replace(/[Oo]/g, "0").replace(/[Il|]/g, "1").match(/-?\d+/);
  return match ? Number(match[0]) : NaN;
}

function scoreTemplate(grid, template) {
  let hits = 0;
  let expected = 0;
  let extras = 0;
  let ink = 0;
  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const hasInk = grid[row][col] === 1;
      const wantsInk = template[row][col] === "1";
      if (wantsInk) expected += 1;
      if (hasInk) ink += 1;
      if (hasInk && wantsInk) hits += 1;
      if (hasInk && !wantsInk) extras += 1;
    }
  }
  return hits / Math.max(1, expected) - (extras / Math.max(1, ink)) * 0.24;
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

  const threshold = Math.max(2, Math.round(sh * 0.008));
  const ranges = [];
  let start = null;
  let lastInk = -1;
  let blankRun = 0;
  const splitGap = Math.max(8, Math.round(sw * 0.025));
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

function cloneComponent(component, minX, maxX) {
  return { ...component, minX, maxX };
}

function splitWidestComponent(components) {
  const sorted = [...components].sort((a, b) => (b.maxX - b.minX) - (a.maxX - a.minX));
  const target = sorted[0];
  if (!target || target.maxX - target.minX < 20) return components;
  const middle = Math.round((target.minX + target.maxX) / 2);
  const replacement = [cloneComponent(target, target.minX, middle - 2), cloneComponent(target, middle + 2, target.maxX)];
  return components.flatMap((component) => (component === target ? replacement : [component]));
}

function normalizeComponentsForExpected(components, expectedText) {
  let normalized = [...components].sort((a, b) => a.minX - b.minX);
  const expectedLength = expectedText.length;
  while (normalized.length < expectedLength) {
    const next = splitWidestComponent(normalized);
    if (next.length === normalized.length) break;
    normalized = next.sort((a, b) => a.minX - b.minX);
  }
  while (normalized.length > expectedLength && normalized.length > 1) {
    let mergeIndex = 0;
    let smallestGap = Infinity;
    for (let index = 0; index < normalized.length - 1; index += 1) {
      const gap = normalized[index + 1].minX - normalized[index].maxX;
      if (gap < smallestGap) {
        smallestGap = gap;
        mergeIndex = index;
      }
    }
    const merged = {
      ...normalized[mergeIndex],
      maxX: normalized[mergeIndex + 1].maxX,
      minY: Math.min(normalized[mergeIndex].minY, normalized[mergeIndex + 1].minY),
      maxY: Math.max(normalized[mergeIndex].maxY, normalized[mergeIndex + 1].maxY),
    };
    normalized.splice(mergeIndex, 2, merged);
  }
  return normalized;
}

function rasterizeInkComponent(component) {
  const grid = Array.from({ length: 7 }, () => Array(5).fill(0));
  const width = Math.max(1, component.maxX - component.minX);
  const height = Math.max(1, component.maxY - component.minY);
  const alphaAt = (x, y) => component.image.data[(y * component.width + x) * 4 + 3];
  for (let y = component.minY; y <= component.maxY; y += 1) {
    for (let x = component.minX; x <= component.maxX; x += 1) {
      if (alphaAt(x, y) <= 24) continue;
      const col = Math.max(0, Math.min(4, Math.round(((x - component.minX) / width) * 4)));
      const row = Math.max(0, Math.min(6, Math.round(((y - component.minY) / height) * 6)));
      grid[row][col] = 1;
    }
  }
  return grid;
}

function gridInkCount(grid, rowStart, rowEnd, colStart, colEnd) {
  let count = 0;
  for (let row = rowStart; row <= rowEnd; row += 1) {
    for (let col = colStart; col <= colEnd; col += 1) count += grid[row]?.[col] ? 1 : 0;
  }
  return count;
}

function scoreDigit(component, digit) {
  const grid = rasterizeInkComponent(component);
  const width = Math.max(1, component.maxX - component.minX);
  const height = Math.max(1, component.maxY - component.minY);
  const aspect = width / height;
  const topInk = gridInkCount(grid, 0, 1, 0, 4);
  const middleInk = gridInkCount(grid, 2, 4, 0, 4);
  const bottomInk = gridInkCount(grid, 5, 6, 0, 4);
  const leftInk = gridInkCount(grid, 0, 6, 0, 1);
  const centerInk = gridInkCount(grid, 0, 6, 2, 2);
  const rightInk = gridInkCount(grid, 0, 6, 3, 4);
  let score = Math.max(...digitTemplates[digit].map((template) => scoreTemplate(grid, template)));
  if (digit === "1" && aspect < 0.5 && centerInk >= 4 && leftInk <= 4 && rightInk <= 4) score += 0.32;
  if (digit === "2" && topInk >= 1 && middleInk >= 2 && bottomInk >= 2 && leftInk >= 1 && rightInk >= 1) score += 0.24;
  if (digit === "3" && rightInk >= 3 && middleInk >= 2 && leftInk <= 5) score += 0.1;
  if (digit === "4" && middleInk >= 3 && rightInk >= 3 && topInk >= 1) score += 0.18;
  if (digit === "0" && topInk >= 2 && bottomInk >= 2 && leftInk >= 2 && rightInk >= 2 && middleInk <= 9) score += 0.12;
  if (digit === "8" && topInk >= 2 && middleInk >= 3 && bottomInk >= 2 && leftInk >= 2 && rightInk >= 2) score += 0.14;
  if (digit === "7" && topInk >= 3 && bottomInk <= 2 && leftInk <= 4) score += 0.16;
  return score;
}

function recognizeInkComponent(component) {
  const ranked = Object.keys(digitTemplates)
    .map((digit) => ({ digit, score: scoreDigit(component, digit) }))
    .sort((a, b) => b.score - a.score);
  const top = ranked[0];
  const next = ranked[1] || { score: 0 };
  return { digit: top.digit, score: top.score, confidence: Math.max(0, Math.min(1, top.score - next.score + 0.55)) };
}

function scoreExpected(components, expectedText) {
  const normalized = normalizeComponentsForExpected(components, expectedText);
  if (normalized.length !== expectedText.length) return null;
  const scores = normalized.map((component, index) => scoreDigit(component, expectedText[index]));
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return { average, min: Math.min(...scores), components: normalized };
}

function recognizeDigitsLocally(expectedText = "") {
  const components = answerInkComponents();
  if (!components.length) return { text: "", status: "empty", confidence: 0 };

  const expected = /^\d+$/.test(expectedText) ? scoreExpected(components, expectedText) : null;
  const componentsForReading = expected?.components || components;
  const recognized = componentsForReading.map(recognizeInkComponent);
  const bestScore = recognized.reduce((sum, item) => sum + item.score, 0) / recognized.length;

  if (expected && expected.average > 0.4 && expected.min > 0.12 && expected.average >= bestScore - 0.18) {
    return { text: expectedText, status: "local", confidence: Math.max(0.7, expected.average) };
  }

  const text = recognized.map((item) => item.digit).join("");
  const confidence = recognized.reduce((sum, item) => sum + item.confidence, 0) / Math.max(1, recognized.length);
  return { text, status: text ? "local" : "unreadable", confidence };
}

function pathsInsideAnswerBox() {
  const rect = getAnswerRect();
  return state.paths
    .map((path) => ({
      ...path,
      points: path.points.filter((point) => point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom),
    }))
    .filter((path) => path.points.length > 1 && !path.erase);
}

async function recognizeWithBrowserApi(paths) {
  const Recognizer = window.HandwritingRecognizer || window.webkitHandwritingRecognizer;
  if (!Recognizer || !window.HandwritingDrawing || !window.HandwritingStroke) return { text: "", status: "unsupported", confidence: 0 };
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

async function recognizeWriting(expectedText) {
  if (!answerInkComponents().length) return { text: "", status: "empty", confidence: 0 };
  const local = recognizeDigitsLocally(expectedText);
  if (local.text && local.confidence >= 0.42) return local;
  const browser = await recognizeWithBrowserApi(pathsInsideAnswerBox());
  if (browser.text) return browser;
  return local.text ? local : { text: "", status: "unreadable", confidence: 0 };
}

function showFeedback(message, type) {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${type}`;
  feedbackPanel.className = `feedback-panel ${type}`;
  feedbackPanel.hidden = false;
  retryFeedbackButton.hidden = type === "correct" || type === "review";
  nextFeedbackButton.hidden = type !== "correct";
  closeFeedbackButton.hidden = type !== "correct";
  markCorrectButton.hidden = type !== "review";
  markWrongButton.hidden = type !== "review";
  if (window.lucide) window.lucide.createIcons();
}

function recordMissOnce() {
  if (!state.current || state.current.missedRecorded) return;
  state.current.missedRecorded = true;
  state.session.missed += 1;
}

function awardCorrectAnswer(readText) {
  state.progress.streak += 1;
  const streakBonus = state.progress.streak % 3 === 0 ? 2 : 0;
  state.progress.stars += 1 + streakBonus;
  state.progress.answered += 1;
  state.session.correct += 1;
  state.pendingReview = null;
  unlockEligibleLevels();
  clearInterval(state.timerId);
  saveProgress();
  updateProgressUi();
  showFeedback(`Correct. I read ${readText}. ${formatTime(state.timeLeft)} left.`, "correct");
}

function askForRecognitionReview(recognized) {
  state.pendingReview = recognized;
  showFeedback(`I think it says ${recognized.text}. Is that right?`, "review");
}

async function checkAnswer() {
  if (!state.current) showQuestion();
  checkButton.disabled = true;
  const expectedText = String(state.current.answer);
  const recognized = await recognizeWriting(expectedText);
  const given = normalizeAnswer(recognized.text);
  const correct = given === state.current.answer;

  if (recognized.text && recognized.confidence < 0.62) {
    askForRecognitionReview(recognized);
    checkButton.disabled = false;
    return;
  }

  if (correct) {
    awardCorrectAnswer(recognized.text);
  } else {
    state.progress.streak = 0;
    recordMissOnce();
    const message = recognized.status === "empty"
      ? "Write the final answer inside the box, then try again."
      : `I read ${recognized.text || "nothing"}. Try this one again.`;
    showFeedback(message, "wrong");
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

board.addEventListener("pointerdown", startDrawing);
board.addEventListener("pointermove", keepDrawing);
board.addEventListener("pointerup", stopDrawing);
board.addEventListener("pointercancel", stopDrawing);
board.addEventListener("pointerleave", stopDrawing);
window.addEventListener("resize", resizeBoard);
timerControl.addEventListener("click", cycleTimerStyle);
startPracticeButton.addEventListener("click", startPractice);
resetProgressButton.addEventListener("click", resetProgress);
backToLevelsButton.addEventListener("click", showStartScreen);
closeFeedbackButton.addEventListener("click", hideFeedback);
retryFeedbackButton.addEventListener("click", () => {
  hideFeedback();
  clearBoard();
  resetTimer();
});
nextFeedbackButton.addEventListener("click", showQuestion);
markCorrectButton.addEventListener("click", () => awardCorrectAnswer(state.pendingReview?.text || String(state.current.answer)));
markWrongButton.addEventListener("click", () => {
  state.pendingReview = null;
  state.progress.streak = 0;
  recordMissOnce();
  saveProgress();
  updateProgressUi();
  showFeedback("Try this one again.", "wrong");
});
nextMainButton.addEventListener("click", showQuestion);
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
checkButton.addEventListener("click", checkAnswer);
operationEl.addEventListener("change", () => {
  if (!practiceBoard.hidden) showQuestion();
});
levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.disabled) return;
    state.progress.currentStage = Number(button.dataset.stage || 1);
    saveProgress();
    updateProgressUi();
  });
});

updateProgressUi();
if (window.lucide) window.lucide.createIcons();
showStartScreen();
