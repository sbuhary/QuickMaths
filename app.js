const board = document.querySelector("#board");
const ctx = board.getContext("2d", { willReadFrequently: true });
const questionEl = document.querySelector("#question");
const timerEl = document.querySelector("#timer");
const feedbackEl = document.querySelector("#feedback");
const answerEl = document.querySelector("#answer");
const operationEl = document.querySelector("#operation");
const difficultyEl = document.querySelector("#difficulty");
const starsEl = document.querySelector("#stars");
const streakEl = document.querySelector("#streak");
const nextButton = document.querySelector("#next");
const checkButton = document.querySelector("#check");
const clearButton = document.querySelector("#clear");
const undoButton = document.querySelector("#undo");
const eraserButton = document.querySelector("#eraser");
const colorButtons = [...document.querySelectorAll(".color")];
const levelButtons = [...document.querySelectorAll(".level-node")];

const settings = {
  starter: { label: "Starter", max: 10, multiplicationMax: 5, divisionMax: 5, unlockAt: 0 },
  explorer: { label: "Explorer", max: 60, multiplicationMax: 10, divisionMax: 10, unlockAt: 6 },
  wizard: { label: "Wizard", max: 250, multiplicationMax: 12, divisionMax: 12, unlockAt: 15 },
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
    button.textContent = isUnlocked ? String(index + 1) : "Lock";
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
  return `
    <span class="row top">${question.a}</span>
    <span class="row bottom"><span>${question.symbol}</span><span>${question.b}</span></span>
    <span class="bar"></span>
    <span class="equals">= ?</span>
  `;
}
function showQuestion() {
  state.current = makeQuestion();
  questionEl.innerHTML = renderStackedQuestion(state.current);
  feedbackEl.textContent = "Use the board for your working, then check.";
  feedbackEl.className = "feedback";
  answerEl.value = "";
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

function normalizeAnswer(value) {
  const match = String(value).replace(/[Oo]/g, "0").replace(/[Il]/g, "1").match(/-?\d+/);
  return match ? Number(match[0]) : NaN;
}

async function recognizeWriting() {
  const Recognizer = window.HandwritingRecognizer || window.webkitHandwritingRecognizer;
  if (!Recognizer || !window.HandwritingDrawing || !window.HandwritingStroke || state.paths.length === 0) return "";

  try {
    const recognizer = await Recognizer.create({ languages: ["en"], recognitionType: "text" });
    const drawing = new window.HandwritingDrawing();
    state.paths.filter((path) => !path.erase).forEach((path) => {
      const stroke = new window.HandwritingStroke();
      path.points.forEach((point, index) => stroke.addPoint({ x: point.x, y: point.y, t: index }));
      drawing.addStroke(stroke);
    });
    const predictions = await recognizer.recognize(drawing);
    return predictions?.[0]?.text || "";
  } catch {
    return "";
  }
}

async function checkAnswer() {
  if (!state.current) showQuestion();
  checkButton.disabled = true;
  feedbackEl.textContent = "Checking...";

  const recognized = await recognizeWriting();
  if (!answerEl.value && recognized) answerEl.value = recognized;

  const given = normalizeAnswer(answerEl.value || recognized);
  const correct = given === state.current.answer;

  if (correct) {
    state.progress.streak += 1;
    const streakBonus = state.progress.streak % 3 === 0 ? 2 : 0;
    state.progress.stars += 1 + streakBonus;
    state.progress.answered += 1;
    feedbackEl.textContent = `Correct! Answer ${state.current.answer}. Time ${formatTime(state.seconds)}.`;
    feedbackEl.className = "feedback correct";
    unlockEligibleLevels();
  } else {
    state.progress.streak = 0;
    feedbackEl.textContent = Number.isNaN(given)
      ? `I could not read an answer yet. The correct answer is ${state.current.answer}.`
      : `Nice try. The correct answer is ${state.current.answer}.`;
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

board.addEventListener("pointerdown", startDrawing);
board.addEventListener("pointermove", keepDrawing);
board.addEventListener("pointerup", stopDrawing);
board.addEventListener("pointercancel", stopDrawing);
board.addEventListener("pointerleave", stopDrawing);
window.addEventListener("resize", resizeBoard);

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
clearButton.addEventListener("click", clearBoard);
nextButton.addEventListener("click", showQuestion);
checkButton.addEventListener("click", checkAnswer);
operationEl.addEventListener("change", showQuestion);
difficultyEl.addEventListener("change", showQuestion);
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

