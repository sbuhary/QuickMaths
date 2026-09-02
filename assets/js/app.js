const splashScreen = document.querySelector("#splash-screen");
const startScreen = document.querySelector("#start-screen");
const splashGreetingEl = document.querySelector("#splash-greeting");
const practiceBoard = document.querySelector("#practice-board");
const board = document.querySelector("#board");
const ctx = board.getContext("2d", { willReadFrequently: true });
const questionEl = document.querySelector("#question");
const timerEl = document.querySelector("#timer");
const timerControl = document.querySelector("#timer-control");
const soundToggleButton = document.querySelector("#sound-toggle");
const feedbackPanel = document.querySelector("#feedback-panel");
const feedbackEl = document.querySelector("#feedback");
const answerChoicesEl = document.querySelector("#answer-choices");
const closeFeedbackButton = document.querySelector("#close-feedback");
const markCorrectButton = document.querySelector("#mark-correct");
const markWrongButton = document.querySelector("#mark-wrong");
const answerBox = document.querySelector("#answer-box");
const celebrationEl = document.querySelector("#celebration");
const operationEl = document.querySelector("#operation");
const difficultyEl = document.querySelector("#difficulty");
const kidNameEl = document.querySelector("#kid-name");
const playerGreetingEl = document.querySelector("#player-greeting");
const settingsNameButton = document.querySelector("#settings-name");
const nameGate = document.querySelector("#name-gate");
const gateNameEl = document.querySelector("#gate-name");
const saveNameButton = document.querySelector("#save-name");
const helpGate = document.querySelector("#help-gate");
const helpStartButton = document.querySelector("#help-start");
const helpPracticeButton = document.querySelector("#help-practice");
const closeHelpButton = document.querySelector("#close-help");
const rewardGate = document.querySelector("#reward-gate");
const rewardTitleEl = document.querySelector("#reward-title");
const rewardMessageEl = document.querySelector("#reward-message");
const rewardOkButton = document.querySelector("#reward-ok");
const rewardNextButton = document.querySelector("#reward-next");
const starsEl = document.querySelector("#stars");
const streakEl = document.querySelector("#streak");
const streakFreezesEl = document.querySelector("#streak-freezes");
const stageSummaryEl = document.querySelector("#stage-summary");
const sessionSummaryEl = document.querySelector("#session-summary");
const sessionDetailEl = document.querySelector("#session-detail");
const startPracticeButton = document.querySelector("#start-practice");
const resetProgressButton = document.querySelector("#reset-progress");
const retryMissedButton = document.querySelector("#retry-missed");
const backToLevelsButton = document.querySelector("#back-to-levels");
const retryFeedbackButton = document.querySelector("#retry-feedback");
const nextFeedbackButton = document.querySelector("#next-feedback");
const checkButton = document.querySelector("#check");
const nextMainButton = document.querySelector("#next-main");
const tryMainButton = document.querySelector("#try-main");
const pencilButton = document.querySelector("#pencil");
const penPanel = document.querySelector("#pen-panel");
const clearButton = document.querySelector("#clear");
const undoButton = document.querySelector("#undo");
const eraserButton = document.querySelector("#eraser");
const colorButtons = [...document.querySelectorAll(".color")];
const sizeButtons = [...document.querySelectorAll(".size")];
const levelPathEl = document.querySelector(".level-path");
let levelButtons = [...document.querySelectorAll(".level-node")];
const difficultyStarts = { easy: 1, medium: 7, difficult: 13 };

const settings = {
  starter: { label: "Starter", unlockAt: 0 },
  explorer: { label: "Explorer", unlockAt: 4 },
  builder: { label: "Builder", unlockAt: 8 },
  wizard: { label: "Wizard", unlockAt: 12 },
};

const stagePlans = [
  { stage: 1, level: "starter", title: "Tiny sums", operation: "addition", max: 5, sumMax: 5, seconds: 60, unlockStars: 50 },
  { stage: 2, level: "starter", title: "Count up", operation: "ascending", sequenceMax: 9, stepMax: 1, seconds: 60, unlockStars: 50 },
  { stage: 3, level: "starter", title: "Facts to 10", operation: "addition", max: 9, sumMax: 10, seconds: 60, unlockStars: 50 },
  { stage: 4, level: "starter", title: "Missing addends", operation: "missing-addend", max: 9, sumMax: 10, seconds: 65, unlockStars: 50 },
  { stage: 5, level: "starter", title: "Take away", operation: "subtraction", max: 10, seconds: 65, unlockStars: 50 },
  { stage: 6, level: "starter", title: "Add or subtract", operation: "add-sub", max: 10, sumMax: 10, seconds: 65, unlockStars: 60 },
  { stage: 7, level: "explorer", title: "Teen sums", operation: "addition", max: 12, sumMax: 20, seconds: 70, unlockStars: 75 },
  { stage: 8, level: "explorer", title: "Count down", operation: "descending", sequenceMax: 20, stepMax: 2, seconds: 70, unlockStars: 75 },
  { stage: 9, level: "explorer", title: "Teen subtraction", operation: "subtraction", max: 20, seconds: 70, unlockStars: 75 },
  { stage: 10, level: "explorer", title: "Make 20", operation: "missing-addend", max: 20, sumMax: 20, seconds: 75, unlockStars: 75 },
  { stage: 11, level: "explorer", title: "Two-digit plus ones", operation: "addition", max: 89, addendMax: 9, seconds: 75, unlockStars: 80 },
  { stage: 12, level: "explorer", title: "Two-digit take away", operation: "subtraction", max: 99, subtractMax: 9, seconds: 75, unlockStars: 80 },
  { stage: 13, level: "builder", title: "Skip count", operation: "ascending", sequenceMax: 60, stepMin: 2, stepMax: 10, seconds: 80, unlockStars: 100 },
  { stage: 14, level: "builder", title: "Times 2, 5, 10", operation: "multiplication", factors: [2, 5, 10], max: 10, seconds: 80, unlockStars: 100 },
  { stage: 15, level: "builder", title: "Small times tables", operation: "multiplication", multiplicationMax: 6, seconds: 85, unlockStars: 100 },
  { stage: 16, level: "wizard", title: "Exact sharing", operation: "division", divisionMax: 6, seconds: 90, unlockStars: 100 },
  { stage: 17, level: "wizard", title: "Bigger sharing", operation: "division", divisionMax: 10, seconds: 90, unlockStars: 120 },
  { stage: 18, level: "wizard", title: "Mixed challenge", operation: "mixed", multiplicationMax: 10, divisionMax: 10, max: 30, seconds: 90, unlockStars: 0 },
];
const digitTemplates = {
  0: [["01110", "10001", "10011", "10101", "11001", "10001", "01110"], ["11111", "10001", "10001", "10001", "10001", "10001", "11111"], ["01110", "10001", "10001", "10001", "10001", "10001", "01110"]],
  1: [["00100", "01100", "00100", "00100", "00100", "00100", "01110"], ["00100", "00100", "00100", "00100", "00100", "00100", "00100"], ["01000", "11000", "01000", "01000", "01000", "01000", "11100"], ["00010", "00110", "00010", "00010", "00010", "00010", "00111"]],
  2: [["01110", "10001", "00001", "00010", "00100", "01000", "11111"], ["11110", "00001", "00001", "01110", "10000", "10000", "11111"], ["01110", "10001", "00001", "00110", "01000", "10000", "11111"], ["00110", "01001", "00001", "00010", "00100", "01000", "01111"]],
  3: [["11110", "00001", "00001", "01110", "00001", "00001", "11110"], ["01110", "10001", "00001", "00110", "00001", "10001", "01110"], ["11110", "00001", "00010", "00110", "00001", "00001", "11110"]],
  4: [["10010", "10010", "10010", "11111", "00010", "00010", "00010"], ["10001", "10001", "10001", "11111", "00001", "00001", "00001"], ["00100", "01100", "10100", "11111", "00100", "00100", "00100"]],
  5: [["11111", "10000", "10000", "11110", "00001", "00001", "11110"], ["11111", "10000", "11110", "00001", "00001", "10001", "01110"], ["01111", "01000", "01000", "01110", "00001", "00001", "11110"], ["11110", "10000", "10000", "11110", "00001", "00001", "01110"], ["01110", "10000", "10000", "11110", "00001", "00001", "01110"]],
  6: [["01110", "10000", "10000", "11110", "10001", "10001", "01110"], ["00110", "01000", "10000", "11110", "10001", "10001", "01110"], ["01110", "10000", "10000", "11110", "10001", "10001", "11110"]],
  7: [["11111", "00001", "00010", "00100", "01000", "01000", "01000"], ["11111", "00001", "00010", "00100", "00100", "00100", "00100"], ["11111", "00010", "00010", "00100", "00100", "01000", "01000"]],
  8: [["01110", "10001", "10001", "01110", "10001", "10001", "01110"], ["11111", "10001", "10001", "11111", "10001", "10001", "11111"]],
  9: [["01110", "10001", "10001", "01111", "00001", "00010", "11100"], ["01110", "10001", "10001", "01111", "00001", "00001", "01110"], ["01111", "10001", "10001", "01111", "00001", "00001", "01110"]],
};

const timerStyles = ["digital", "analog", "hourglass"];
const starMilestones = [5, 10, 20, 30, 50, 75, 100, 150, 200];
const state = {
  current: null,
  currentColor: "#1f2937",
  currentSize: 5,
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
  session: { correct: 0, missed: 0, starsEarned: 0, missedQuestions: [], seenQuestions: [], startedAt: Date.now() },
  pendingReview: null,
  soundEnabled: localStorage.getItem("quickmaths-sound") !== "off",
  audioContext: null,
  answerState: "ready",
  kidName: localStorage.getItem("quickmaths-kid-name") || "",
  pendingNameAction: null,
  onnxModel: null,
  onnxModelReady: false,
  onnxModelTried: false,
  onnxModelError: "",
};

function cleanKidName(value) {
  return String(value || "").replace(/[^a-zA-Z0-9 .'-]/g, "").trim().slice(0, 24);
}

function updatePersonalGreeting() {
  state.kidName = cleanKidName(state.kidName);
  if (kidNameEl && kidNameEl.value !== state.kidName) kidNameEl.value = state.kidName;
  if (splashGreetingEl) splashGreetingEl.textContent = state.kidName ? `Hi, ${state.kidName}!` : "Ready?";
  if (playerGreetingEl) playerGreetingEl.textContent = state.kidName ? `Hi, ${state.kidName}!` : "Ready to play?";
}
function namePrefix(fallback) {
  return state.kidName ? `${fallback}, ${state.kidName}!` : `${fallback}!`;
}

function saveKidName() {
  state.kidName = cleanKidName(kidNameEl?.value || "");
  if (state.kidName) localStorage.setItem("quickmaths-kid-name", state.kidName);
  else localStorage.removeItem("quickmaths-kid-name");
  updatePersonalGreeting();
}

function hasKidName() {
  return Boolean(cleanKidName(state.kidName));
}

function showNameGate(action) {
  state.pendingNameAction = action;
  nameGate.hidden = false;
  gateNameEl.value = cleanKidName(kidNameEl?.value || state.kidName);
  if (saveNameButton) saveNameButton.textContent = action === "settings" ? "Save" : "Start";
  gateNameEl.classList.remove("invalid");
  window.setTimeout(() => gateNameEl.focus(), 30);
}
function closeNameGate() {
  nameGate.hidden = true;
  gateNameEl.classList.remove("invalid");
}

function saveNameFromGate() {
  state.kidName = cleanKidName(gateNameEl.value);
  if (!state.kidName) {
    gateNameEl.classList.add("invalid");
    gateNameEl.focus();
    return;
  }
  localStorage.setItem("quickmaths-kid-name", state.kidName);
  closeNameGate();
  updatePersonalGreeting();
  if (state.pendingNameAction === "settings") {
    state.pendingNameAction = null;
    updateProgressUi();
    return;
  }
  if (state.pendingNameAction === "retry") retryMissedQuestions();
  else startPractice();
}
function requireKidName(action) {
  saveKidName();
  if (hasKidName()) return true;
  showNameGate(action);
  return false;
}

function showHelp() {
  closePenPanel();
  helpGate.hidden = false;
}

function hideHelp() {
  helpGate.hidden = true;
}

function addChoiceText(target, value) {
  const normalized = normalizeAnswer(value);
  if (Number.isFinite(normalized) && normalized >= 0) target.add(String(normalized));
}

function answerChoicesFromRecognition(recognized, correctAnswer) {
  const correctText = String(correctAnswer);
  const choices = new Set();
  addChoiceText(choices, recognized.text);
  addChoiceText(choices, recognized.visualText);
  addChoiceText(choices, recognized.localText);
  addChoiceText(choices, recognized.onnxText);
  addChoiceText(choices, recognized.browserText);
  (recognized.candidateTexts || []).forEach((value) => addChoiceText(choices, value));
  (recognized.candidates || []).forEach((value) => addChoiceText(choices, value));
  addChoiceText(choices, correctText);
  const scored = [...choices]
    .filter((value) => value.length <= Math.max(correctText.length + 1, correctText.length))
    .map((value) => ({ value, isCorrect: value === correctText, isRead: value === String(recognized.text || "") }))
    .sort((a, b) => Number(b.isCorrect) - Number(a.isCorrect) || Number(b.isRead) - Number(a.isRead) || a.value.length - b.value.length || Number(a.value) - Number(b.value));
  const limited = scored.slice(0, 4).map((item) => item.value);
  if (!limited.includes(correctText)) limited[Math.max(0, limited.length - 1)] = correctText;
  return [...new Set(limited)].sort((a, b) => Number(a) - Number(b));
}

function combineCandidateDigits(candidateLists, limit = 6) {
  if (!candidateLists.length) return [];
  let combos = [{ text: "", score: 1 }];
  candidateLists.forEach((list) => {
    const candidates = list.slice(0, 3);
    combos = combos.flatMap((combo) => candidates.map((candidate) => ({
      text: combo.text + candidate.digit,
      score: combo.score * Math.max(0.01, candidate.score || candidate.confidence || 0.01),
    })));
  });
  return combos
    .sort((a, b) => b.score - a.score)
    .map((combo) => combo.text)
    .filter((value, index, all) => all.indexOf(value) === index)
    .slice(0, limit);
}
function renderAnswerDigitBoxes(expectedText = state.current ? String(state.current.answer) : "") {
  const text = String(expectedText || "");
  const digits = Math.max(1, text.length);
  const resultDigits = Math.max(digits, Number(answerBox.style.getPropertyValue("--result-digits")) || digits);
  const start = resultDigits - digits;
  answerBox.style.setProperty("--answer-digits", String(digits));
  answerBox.style.setProperty("--result-digits", String(resultDigits));
  [...answerBox.querySelectorAll(".answer-digit-slot")].forEach((slot) => slot.remove());
  for (let index = 0; index < digits; index += 1) {
    const slot = document.createElement("i");
    slot.className = "answer-digit-slot";
    slot.style.gridColumn = String(2 + start + index);
    slot.setAttribute("aria-hidden", "true");
    answerBox.appendChild(slot);
  }
}

function answerDigitRects(expectedText = state.current ? String(state.current.answer) : "") {
  let slots = [...answerBox.querySelectorAll(".answer-digit-slot")];
  const expectedLength = Math.max(1, String(expectedText || "").length);
  if (slots.length !== expectedLength) {
    renderAnswerDigitBoxes(expectedText);
    slots = [...answerBox.querySelectorAll(".answer-digit-slot")];
  }
  const boardRect = board.getBoundingClientRect();
  return slots.map((slot) => {
    const rect = slot.getBoundingClientRect();
    return {
      left: rect.left - boardRect.left,
      top: rect.top - boardRect.top,
      right: rect.right - boardRect.left,
      bottom: rect.bottom - boardRect.top,
    };
  });
}

function showAnswerChoices(choices) {
  answerChoicesEl.replaceChildren();
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "answer-choice";
    button.type = "button";
    button.textContent = String(choice);
    button.setAttribute("aria-label", `Use ${choice} as the answer`);
    button.addEventListener("click", () => verifyChosenAnswer(choice));
    answerChoicesEl.appendChild(button);
  });
  answerChoicesEl.hidden = false;
}

function hideAnswerChoices() {
  answerChoicesEl.hidden = true;
  answerChoicesEl.replaceChildren();
}

function verifyChosenAnswer(value) {
  hideAnswerChoices();
  if (Number(value) === state.current.answer) {
    awardCorrectAnswer(String(value));
    return;
  }
  const streakProtected = protectOrResetStreak();
  recordMissOnce();
  saveProgress();
  updateProgressUi();
  playTone("wrong");
  showFeedback((state.kidName ? `You picked ${value}. Try again, ${state.kidName}.` : `You picked ${value}. Try this one again.`) + (streakProtected ? freezeMessage() : ""), "wrong");
}
function formatKidTimeLeft(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  if (safeSeconds < 60) return `You still had ${safeSeconds} second${safeSeconds === 1 ? "" : "s"}.`;
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;
  if (!rest) return `You still had ${minutes} minute${minutes === 1 ? "" : "s"}.`;
  return `You still had ${minutes} minute${minutes === 1 ? "" : "s"} and ${rest} second${rest === 1 ? "" : "s"}.`;
}

function svgCursor(shape, color) {
  const stroke = color || "#1f2937";
  const svg = shape === "eraser"
    ? `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M7 21l11-11 7 7-8 8H10l-3-4z' fill='white' stroke='#1f2937' stroke-width='3' stroke-linejoin='round'/><path d='M16 12l7 7' stroke='#1f2937' stroke-width='3'/></svg>`
    : `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><path d='M23 3l6 6-17 17H6v-6L23 3z' fill='white' stroke='${stroke}' stroke-width='3' stroke-linejoin='round'/><path d='M19 7l6 6' stroke='${stroke}' stroke-width='3'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 4 28, ${shape === "eraser" ? "cell" : "crosshair"}`;
}

function updateToolUi() {
  practiceBoard.dataset.tool = state.erasing ? "eraser" : "pencil";
  pencilButton.style.setProperty("--tool-color", state.currentColor);
  board.style.cursor = state.erasing ? svgCursor("eraser") : svgCursor("pencil", state.currentColor);
}
function celebrateCorrectAnswer() {
  if (!celebrationEl) return;
  celebrationEl.hidden = false;
  celebrationEl.classList.remove("burst");
  void celebrationEl.offsetWidth;
  celebrationEl.classList.add("burst");
  window.setTimeout(() => {
    celebrationEl.hidden = true;
    celebrationEl.classList.remove("burst");
  }, 1100);
}
function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

function updateSoundButton() {
  soundToggleButton.classList.toggle("muted", !state.soundEnabled);
  soundToggleButton.setAttribute("aria-label", state.soundEnabled ? "Mute sounds" : "Turn sounds on");
  const icon = soundToggleButton.querySelector("i");
  if (icon) icon.setAttribute("data-lucide", state.soundEnabled ? "volume-2" : "volume-x");
  localStorage.setItem("quickmaths-sound", state.soundEnabled ? "on" : "off");
  if (window.lucide) window.lucide.createIcons();
}

function playTone(type) {
  if (!state.soundEnabled || !(window.AudioContext || window.webkitAudioContext)) return;
  const AudioEngine = window.AudioContext || window.webkitAudioContext;
  if (!state.audioContext) state.audioContext = new AudioEngine();
  const now = state.audioContext.currentTime;
  const tones = {
    correct: [523, 659, 784],
    wrong: [220, 180],
    timeout: [160, 140],
  }[type] || [440];
  tones.forEach((frequency, index) => {
    const oscillator = state.audioContext.createOscillator();
    const gain = state.audioContext.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.001, now + index * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.08, now + index * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.16);
    oscillator.connect(gain).connect(state.audioContext.destination);
    oscillator.start(now + index * 0.08);
    oscillator.stop(now + index * 0.08 + 0.18);
  });
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  updateSoundButton();
}
function formatElapsed(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function normalizeDifficulty(value) {
  return Object.prototype.hasOwnProperty.call(difficultyStarts, value) ? value : "easy";
}

function normalizeStageStars(value) {
  const source = value && typeof value === "object" ? value : {};
  return stagePlans.reduce((map, plan) => {
    map[plan.stage] = Math.max(0, Number(source[plan.stage]) || 0);
    return map;
  }, {});
}

function baseUnlockedForDifficulty(difficulty) {
  return difficultyStarts[normalizeDifficulty(difficulty)] || 1;
}

function normalizeProgress(progress) {
  const maxStage = stagePlans.length;
  const difficulty = normalizeDifficulty(progress.difficulty);
  const baseUnlocked = baseUnlockedForDifficulty(difficulty);
  const unlockedStages = Math.max(baseUnlocked, Math.min(maxStage, Number(progress.unlockedStages) || baseUnlocked));
  const currentStage = Math.max(1, Math.min(unlockedStages, Number(progress.currentStage) || baseUnlocked));
  return {
    stars: Math.max(0, Number(progress.stars) || 0),
    stageStars: normalizeStageStars(progress.stageStars),
    streak: Math.max(0, Number(progress.streak) || 0),
    streakFreezes: Math.max(0, Math.min(3, Number(progress.streakFreezes) || 0)),
    answered: Math.max(0, Number(progress.answered) || 0),
    celebratedMilestones: Array.isArray(progress.celebratedMilestones) ? progress.celebratedMilestones.map(Number).filter(Number.isFinite) : [],
    difficulty,
    unlockedStages,
    currentStage,
  };
}

function loadProgress() {
  const fallback = { stars: 0, stageStars: {}, streak: 0, streakFreezes: 0, answered: 0, celebratedMilestones: [], difficulty: localStorage.getItem("quickmaths-difficulty") || "easy", unlockedStages: 1, currentStage: 1 };
  try {
    const stored = localStorage.getItem("quickmaths-progress") || localStorage.getItem("mathsprout-progress");
    return normalizeProgress({ ...fallback, ...JSON.parse(stored || "{}") });
  } catch {
    return normalizeProgress(fallback);
  }
}

function saveProgress() {
  state.progress = normalizeProgress(state.progress);
  localStorage.setItem("quickmaths-progress", JSON.stringify(state.progress));
  localStorage.setItem("quickmaths-difficulty", state.progress.difficulty);
}

function currentPlan() {
  state.progress = normalizeProgress(state.progress);
  return stagePlans[state.progress.currentStage - 1];
}

function ensureLevelButtons() {
  if (!levelPathEl) return;
  stagePlans.forEach((plan, index) => {
    let button = levelPathEl.querySelector(`.level-node[data-stage="${plan.stage}"]`);
    if (!button) {
      button = document.createElement("button");
      button.className = "level-node";
      button.type = "button";
      button.dataset.stage = String(plan.stage);
      button.innerHTML = `<i class="level-lock" data-lucide="lock"></i><span>${plan.stage}</span><small>${settings[plan.level]?.label || plan.level}</small>`;
      levelPathEl.appendChild(button);
    }
    const offset = index % 2 === 0 ? -11 : 11;
    button.style.left = `calc(50% + ${offset}px)`;
    button.style.top = `${70 + index * 104}px`;
  });
  levelPathEl.style.setProperty("--path-height", `${Math.max(1180, 180 + stagePlans.length * 104)}px`);
  levelButtons = [...levelPathEl.querySelectorAll(".level-node")];
  if (window.lucide) window.lucide.createIcons();
}
function stageProgressText(plan, compact = false) {
  if (!plan.unlockStars) return compact ? "Final" : "Final stage";
  const earned = state.progress.stageStars[plan.stage] || 0;
  return compact ? `${earned}/${plan.unlockStars}` : `${earned}/${plan.unlockStars} stars in this stage`;
}

function updateProgressUi() {
  ensureLevelButtons();
  const plan = currentPlan();
  starsEl.textContent = String(state.progress.stars);
  streakEl.textContent = String(state.progress.streak);
  if (streakFreezesEl) streakFreezesEl.textContent = String(state.progress.streakFreezes);
  if (difficultyEl) difficultyEl.value = state.progress.difficulty;
  if (stageSummaryEl) stageSummaryEl.textContent = `Stage ${plan.stage}: ${plan.title}`;
  if (sessionSummaryEl) sessionSummaryEl.textContent = `${state.session.correct} right / ${state.session.missed} missed`;
  if (sessionDetailEl) sessionDetailEl.textContent = `${stageProgressText(plan)} / ${formatElapsed(Date.now() - state.session.startedAt)} practiced`;
  if (retryMissedButton) retryMissedButton.disabled = state.session.missedQuestions.length === 0;
  startPracticeButton.textContent = `Start stage ${plan.stage}`;
  levelButtons.forEach((button) => {
    const stage = Number(button.dataset.stage || 1);
    const stagePlan = stagePlans[stage - 1];
    if (!stagePlan) return;
    const isUnlocked = stage <= state.progress.unlockedStages;
    button.disabled = !isUnlocked;
    button.dataset.level = stagePlan.level;
    button.classList.toggle("active", state.progress.currentStage === stage);
    button.setAttribute("aria-label", `Stage ${stage}, ${stagePlan.title}${isUnlocked ? `, ${stageProgressText(stagePlan)}` : " locked"}`);
    const small = button.querySelector("small");
    if (small) small.textContent = isUnlocked ? stageProgressText(stagePlan, true) : "Locked";
  });
}

function unlockEligibleLevels() {
  const plan = currentPlan();
  const previousUnlocked = state.progress.unlockedStages;
  const earned = state.progress.stageStars[plan.stage] || 0;
  if (plan.unlockStars && earned >= plan.unlockStars) {
    state.progress.unlockedStages = Math.min(stagePlans.length, Math.max(state.progress.unlockedStages, state.progress.currentStage + 1));
  }
  return state.progress.unlockedStages > previousUnlocked ? state.progress.unlockedStages : null;
}

function earnedStarMilestones(previousStars, nextStars) {
  const celebrated = new Set(state.progress.celebratedMilestones || []);
  const reached = starMilestones.filter((milestone) => milestone > previousStars && milestone <= nextStars && !celebrated.has(milestone));
  state.progress.celebratedMilestones = [...celebrated, ...reached].sort((a, b) => a - b);
  return reached;
}

function showRewardPopup(details) {
  const { earnedStars, milestones, unlockedStage } = details;
  const starWord = earnedStars === 1 ? "star" : "stars";
  const player = state.kidName || "You";
  const topMilestone = milestones[milestones.length - 1];
  const milestoneText = topMilestone ? ` You reached ${topMilestone} stars.` : "";
  if (unlockedStage) {
    const stage = stagePlans[unlockedStage - 1];
    rewardTitleEl.textContent = `Stage ${unlockedStage} unlocked!`;
    rewardMessageEl.textContent = `${player} earned ${earnedStars} ${starWord}.${milestoneText} You can play ${stage.title} now.`;
  } else {
    rewardTitleEl.textContent = `${topMilestone} stars!`;
    rewardMessageEl.textContent = `${player} reached ${topMilestone} stars. Keep going!`;
  }
  rewardGate.hidden = false;
  if (window.lucide) window.lucide.createIcons();
}

function hideRewardPopup() {
  rewardGate.hidden = true;
}

function resetProgress() {
  if (!window.confirm("Reset stars, streak, and unlocked stages?")) return;
  localStorage.removeItem("quickmaths-progress");
  localStorage.removeItem("mathsprout-progress");
  state.progress = loadProgress();
  state.session = { correct: 0, missed: 0, starsEarned: 0, missedQuestions: [], seenQuestions: [], startedAt: Date.now() };
  updateProgressUi();
}

function selectDifficulty() {
  const difficulty = normalizeDifficulty(difficultyEl.value);
  const startStage = baseUnlockedForDifficulty(difficulty);
  state.progress.difficulty = difficulty;
  state.progress.unlockedStages = Math.max(state.progress.unlockedStages, startStage);
  state.progress.currentStage = startStage;
  saveProgress();
  updateProgressUi();
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseOperation(plan) {
  const selected = operationEl.value;
  if (selected !== "stage") return selected;
  if (plan.operation === "mixed") return ["addition", "subtraction", "multiplication", "division"][randomInt(0, 3)];
  if (plan.operation === "add-sub") return Math.random() > 0.5 ? "addition" : "subtraction";
  return plan.operation;
}

function operationsForPlan(plan) {
  const selected = operationEl.value;
  if (selected !== "stage") return [selected];
  if (plan.operation === "mixed") return ["addition", "subtraction", "multiplication", "division"];
  if (plan.operation === "add-sub") return ["addition", "subtraction"];
  return [plan.operation];
}
function buildSequenceQuestion(plan, direction, start, step) {
  const terms = direction === "descending"
    ? [start, start - step, start - step * 2, start - step * 3]
    : [start, start + step, start + step * 2, start + step * 3];
  const answer = direction === "descending" ? start - step * 4 : start + step * 4;
  return { kind: "sequence", direction, terms, answer, symbol: direction === "descending" ? "down" : "up", plan };
}

function buildMissingAddendQuestion(plan, a, answer, total) {
  return { kind: "missing-addend", a, b: answer, total, answer, symbol: "?", plan };
}

function buildQuestionsForOperation(plan, operation) {
  const questions = [];
  if (operation === "addition") {
    const max = plan.max || 10;
    for (let a = 1; a <= max; a += 1) {
      const maxB = plan.sumMax ? Math.max(0, plan.sumMax - a) : (plan.addendMax || max);
      for (let b = 1; b <= maxB; b += 1) questions.push({ a, b, answer: a + b, symbol: "+", plan });
    }
  }
  if (operation === "subtraction") {
    const max = plan.max || 10;
    const subtractMax = plan.subtractMax || max;
    for (let a = 2; a <= max; a += 1) {
      for (let b = 1; b <= Math.min(a, subtractMax); b += 1) questions.push({ a, b, answer: a - b, symbol: "-", plan });
    }
  }
  if (operation === "multiplication") {
    const factors = plan.factors || Array.from({ length: plan.multiplicationMax || 10 }, (_, index) => index + 1);
    const maxB = plan.max || plan.multiplicationMax || 10;
    factors.forEach((a) => {
      for (let b = 1; b <= maxB; b += 1) questions.push({ a, b, answer: a * b, symbol: "x", plan });
    });
  }
  if (operation === "division") {
    const max = plan.divisionMax || 10;
    for (let b = 1; b <= max; b += 1) {
      for (let answer = 1; answer <= max; answer += 1) questions.push({ a: b * answer, b, answer, symbol: "/", plan });
    }
  }
  if (operation === "ascending" || operation === "descending") {
    const max = plan.sequenceMax || 20;
    const minStep = plan.stepMin || 1;
    const maxStep = plan.stepMax || 1;
    for (let step = minStep; step <= maxStep; step += 1) {
      const minStart = operation === "descending" ? step * 4 : 1;
      const maxStart = operation === "descending" ? max : Math.max(1, max - step * 4);
      for (let start = minStart; start <= maxStart; start += 1) questions.push(buildSequenceQuestion(plan, operation, start, step));
    }
  }
  if (operation === "missing-addend") {
    const max = plan.max || 10;
    const sumMax = plan.sumMax || max * 2;
    for (let total = 2; total <= sumMax; total += 1) {
      for (let a = 1; a <= Math.min(max, total - 1); a += 1) {
        const answer = total - a;
        if (answer > 0 && answer <= max) questions.push(buildMissingAddendQuestion(plan, a, answer, total));
      }
    }
  }
  return questions;
}
function questionPool(plan) {
  return operationsForPlan(plan).flatMap((operation) => buildQuestionsForOperation(plan, operation));
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

  if (operation === "ascending" || operation === "descending") {
    const step = randomInt(plan.stepMin || 1, plan.stepMax || 1);
    const max = plan.sequenceMax || 20;
    const start = operation === "descending" ? randomInt(step * 4, max) : randomInt(1, Math.max(1, max - step * 4));
    return buildSequenceQuestion(plan, operation, start, step);
  }

  if (operation === "missing-addend") {
    const max = plan.max || 10;
    const total = randomInt(2, plan.sumMax || max * 2);
    a = randomInt(1, Math.min(max, total - 1));
    answer = Math.max(1, Math.min(max, total - a));
    return buildMissingAddendQuestion(plan, a, answer, a + answer);
  }

  return { a, b, answer, symbol, plan };
}
function questionKey(question) {
  if (question.kind === "sequence") return `${state.progress.currentStage}:sequence:${question.direction}:${question.terms.join(",")}`;
  if (question.kind === "missing-addend") return `${state.progress.currentStage}:missing:${question.a}:${question.total}`;
  return `${state.progress.currentStage}:${question.symbol}:${question.a}:${question.b}`;
}

function estimatedQuestionPool(plan) {
  if (plan.operation === "add-sub") return Math.max(8, (plan.sumMax || plan.max || 10) * 2);
  if (plan.operation === "mixed") return Math.max(30, (plan.multiplicationMax || 10) * (plan.divisionMax || 10));
  if (plan.operation === "ascending" || plan.operation === "descending") return Math.max(8, (plan.sequenceMax || 20) * (plan.stepMax || 1));
  if (plan.operation === "missing-addend") return Math.max(8, plan.sumMax || (plan.max || 10) * 2);
  if (plan.operation === "addition") return Math.max(5, plan.sumMax ? Math.round((plan.sumMax * plan.sumMax) / 2) : (plan.max || 10) * (plan.addendMax || plan.max || 10));
  if (plan.operation === "subtraction") return Math.max(5, (plan.max || 10) * (plan.subtractMax || plan.max || 10) / 2);
  if (plan.operation === "multiplication") return Math.max(5, (plan.factors?.length || plan.multiplicationMax || 10) * (plan.max || plan.multiplicationMax || 10));
  if (plan.operation === "division") return Math.max(5, (plan.divisionMax || 10) * (plan.divisionMax || 10));
  return 10;
}
function rememberQuestion(question) {
  const key = questionKey(question);
  const limit = Math.max(3, Math.min(40, Math.floor(estimatedQuestionPool(question.plan) * 0.75)));
  state.session.seenQuestions = (state.session.seenQuestions || []).filter((item) => item !== key);
  state.session.seenQuestions.push(key);
  if (state.session.seenQuestions.length > limit) state.session.seenQuestions.splice(0, state.session.seenQuestions.length - limit);
}

function makeFreshQuestion() {
  const plan = currentPlan();
  const pool = questionPool(plan);
  if (!pool.length) return makeQuestion();
  let seen = new Set(state.session.seenQuestions || []);
  let unseen = pool.filter((question) => !seen.has(questionKey(question)));
  if (!unseen.length) {
    state.session.seenQuestions = [];
    seen = new Set();
    unseen = pool;
  }
  return unseen[randomInt(0, unseen.length - 1)];
}
function renderNumberCells(value, row, resultDigits, className) {
  const text = String(value);
  const start = resultDigits - text.length;
  return [...text].map((digit, index) => `<span class="${className} digit-cell" style="grid-row:${row};grid-column:${2 + start + index}">${digit}</span>`).join("");
}

function renderOperator(symbol) {
  if (symbol === "/") return `<span class="operator division-symbol" aria-label="divided by"><i></i></span>`;
  return `<span class="operator">${symbol === "x" ? "x" : symbol}</span>`;
}

function renderStackedQuestion(question) {
  const resultDigits = Math.max(String(question.a).length, String(question.b).length, String(question.answer).length);
  questionEl.style.setProperty("--result-digits", String(resultDigits));
  answerBox.style.setProperty("--result-digits", String(resultDigits));
  return `
    ${renderNumberCells(question.a, 1, resultDigits, "top")}
    ${renderOperator(question.symbol)}
    ${renderNumberCells(question.b, 2, resultDigits, "bottom-number")}
    <span class="bar"></span>
  `;
}

function renderSequenceQuestion(question) {
  questionEl.style.removeProperty("--result-digits");
  answerBox.style.setProperty("--result-digits", String(Math.max(1, String(question.answer).length)));
  const prompt = question.direction === "descending" ? "Count down" : "Count up";
  return `<span class="sequence-title">${prompt}. What comes next?</span><span class="sequence-row">${question.terms.map((term) => `<b>${term}</b>`).join(" ")} <b class="blank-term">?</b></span>`;
}
function renderMissingAddendQuestion(question) {
  questionEl.style.removeProperty("--result-digits");
  answerBox.style.setProperty("--result-digits", String(Math.max(1, String(question.answer).length)));
  return `<span class="fill-row"><b>${question.a}</b><b>+</b><b class="blank-term">?</b><b>=</b><b>${question.total}</b></span>`;
}

function renderQuestion(question) {
  questionEl.classList.toggle("sequence-question", question.kind === "sequence");
  questionEl.classList.toggle("fill-question", question.kind === "missing-addend");
  if (question.kind === "sequence") return renderSequenceQuestion(question);
  if (question.kind === "missing-addend") return renderMissingAddendQuestion(question);
  return renderStackedQuestion(question);
}
function hideFeedback() {
  feedbackPanel.hidden = true;
  hideAnswerChoices();
  hideRewardPopup();
  if (celebrationEl) {
    celebrationEl.hidden = true;
    celebrationEl.classList.remove("burst");
  }
}

function setActionState(mode) {
  state.answerState = mode;
  checkButton.hidden = mode !== "ready" && mode !== "checking";
  tryMainButton.hidden = mode !== "wrong" && mode !== "timeout";
  nextMainButton.hidden = mode !== "correct";
  checkButton.disabled = mode === "checking";
}

function closePenPanel() {
  penPanel.hidden = true;
}

function usePencil() {
  state.erasing = false;
  pencilButton.classList.add("selected-tool");
  eraserButton.classList.remove("selected-tool");
  updateToolUi();
}

function togglePenPanel() {
  usePencil();
  penPanel.hidden = !penPanel.hidden;
}

function rememberView(view) {
  localStorage.setItem("quickmaths-view", view);
  localStorage.setItem("quickmaths-last-seen", String(Date.now()));
}

function routeToRememberedView() {
  const view = localStorage.getItem("quickmaths-view") === "practice" ? "practice" : "levels";
  if (view === "practice") startPractice();
  else showStartScreen();
}

function showSplashThenRestore() {
  splashScreen.hidden = false;
  startScreen.hidden = true;
  practiceBoard.hidden = true;
  window.setTimeout(() => {
    splashScreen.hidden = true;
    routeToRememberedView();
  }, 850);
}
function showStartScreen() {
  rememberView("levels");
  clearInterval(state.timerId);
  hideFeedback();
  closePenPanel();
  splashScreen.hidden = true;
  practiceBoard.hidden = true;
  startScreen.hidden = false;
  updateProgressUi();
}

function startPractice() {
  if (!requireKidName("start")) return;
  rememberView("practice");
  splashScreen.hidden = true;
  startScreen.hidden = true;
  practiceBoard.hidden = false;
  requestAnimationFrame(() => {
    resizeBoard();
    showQuestion();
  });
}

function showQuestion(question = null) {
  const hasQuestion = question && typeof question === "object" && Number.isFinite(question.answer);
  state.current = hasQuestion ? { plan: currentPlan(), ...question } : makeFreshQuestion();
  rememberQuestion(state.current);
  questionEl.innerHTML = renderQuestion(state.current);
  renderAnswerDigitBoxes(String(state.current.answer));
  hideFeedback();
  closePenPanel();
  clearBoard();
  setActionState("ready");
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
      const streakProtected = protectOrResetStreak();
      recordMissOnce();
      saveProgress();
      updateProgressUi();
      playTone("timeout");
      showFeedback((state.kidName ? `Time is up, ${state.kidName}. Try this one again.` : "Time is up. Try this one again.") + (streakProtected ? freezeMessage() : ""), "timeout");
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
  return pointInsideRect(point, rect);
}

function pointInsideRect(point, rect) {
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
    size: state.erasing ? 24 : state.currentSize,
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
  updateAnswerHighlight(null);
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
  const recall = hits / Math.max(1, expected);
  const precision = hits / Math.max(1, ink);
  const extraRate = extras / Math.max(1, ink);
  return recall * 0.68 + precision * 0.32 - extraRate * 0.34;
}
function answerInkComponents(rectOverride = null) {
  const rect = rectOverride || getAnswerRect();
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

function mergeComponents(components) {
  if (!components.length) return null;
  return components.reduce((merged, component) => ({
    ...merged,
    minX: Math.min(merged.minX, component.minX),
    maxX: Math.max(merged.maxX, component.maxX),
    minY: Math.min(merged.minY, component.minY),
    maxY: Math.max(merged.maxY, component.maxY),
  }), { ...components[0] });
}

function expectedDigitComponents(expectedText = "") {
  if (!/^\d+$/.test(expectedText)) return answerInkComponents();
  const rects = answerDigitRects(expectedText);
  const components = rects.map((rect) => mergeComponents(answerInkComponents(rect)));
  return components.every(Boolean) ? components : answerInkComponents();
}
function cloneComponent(component, minX, maxX) {
  return { ...component, minX, maxX };
}

function componentColumnInk(component) {
  const alphaAt = (x, y) => component.image.data[(y * component.width + x) * 4 + 3];
  const columns = [];
  for (let x = component.minX; x <= component.maxX; x += 1) {
    let ink = 0;
    for (let y = component.minY; y <= component.maxY; y += 1) {
      if (alphaAt(x, y) > 24) ink += 1;
    }
    columns.push({ x, ink });
  }
  return columns;
}

function findSplitColumn(component) {
  const columns = componentColumnInk(component);
  const width = Math.max(1, component.maxX - component.minX);
  const leftLimit = component.minX + width * 0.28;
  const rightLimit = component.minX + width * 0.72;
  const candidates = columns.filter((column) => column.x >= leftLimit && column.x <= rightLimit);
  if (!candidates.length) return Math.round((component.minX + component.maxX) / 2);
  const valley = candidates.reduce((best, column) => (column.ink < best.ink ? column : best), candidates[0]);
  return valley.x;
}

function splitWidestComponent(components) {
  const sorted = [...components].sort((a, b) => (b.maxX - b.minX) - (a.maxX - a.minX));
  const target = sorted[0];
  if (!target || target.maxX - target.minX < 20) return components;
  const splitX = findSplitColumn(target);
  if (splitX - target.minX < 6 || target.maxX - splitX < 6) return components;
  const replacement = [cloneComponent(target, target.minX, splitX - 1), cloneComponent(target, splitX + 1, target.maxX)];
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
function clampScore(value) {
  return Math.max(0, Math.min(1, value));
}

function averageScores(values) {
  return values.reduce((sum, value) => sum + clampScore(value), 0) / Math.max(1, values.length);
}

function digitShapeFeatures(component) {
  const grid = rasterizeInkComponent(component);
  const width = Math.max(1, component.maxX - component.minX);
  const height = Math.max(1, component.maxY - component.minY);
  return {
    grid,
    aspect: width / height,
    top: gridInkCount(grid, 0, 1, 0, 4) / 10,
    middle: gridInkCount(grid, 2, 4, 0, 4) / 15,
    bottom: gridInkCount(grid, 5, 6, 0, 4) / 10,
    upperLeft: gridInkCount(grid, 0, 3, 0, 1) / 8,
    lowerLeft: gridInkCount(grid, 3, 6, 0, 1) / 8,
    upperRight: gridInkCount(grid, 0, 3, 3, 4) / 8,
    lowerRight: gridInkCount(grid, 3, 6, 3, 4) / 8,
    center: gridInkCount(grid, 0, 6, 2, 2) / 7,
  };
}

function scoreDigitFeatures(component, digit) {
  const f = digitShapeFeatures(component);
  const narrow = 1 - Math.min(1, f.aspect / 0.78);
  const lowLeft = 1 - Math.min(1, (f.upperLeft + f.lowerLeft) / 1.15);
  const lowBottom = 1 - Math.min(1, f.bottom * 1.35);
  const openCenter = 1 - Math.min(1, f.center * 0.8);
  const scores = {
    0: averageScores([f.top, f.bottom, f.upperLeft, f.lowerLeft, f.upperRight, f.lowerRight, openCenter]) - f.middle * 0.12,
    1: averageScores([f.center, narrow, 1 - f.upperLeft * 0.45, 1 - f.lowerLeft * 0.35, 1 - f.upperRight * 0.35]),
    2: averageScores([f.top, f.upperRight, f.middle, f.lowerLeft, f.bottom]) - f.lowerRight * 0.08,
    3: averageScores([f.top, f.middle, f.bottom, f.upperRight, f.lowerRight, lowLeft]) - f.lowerLeft * 0.1,
    4: averageScores([f.upperLeft, f.middle, f.upperRight, f.lowerRight, lowBottom]) - f.bottom * 0.12,
    5: averageScores([f.top, f.upperLeft, f.middle, f.lowerRight, f.bottom]) - f.upperRight * 0.06,
    6: averageScores([f.top, f.upperLeft, f.lowerLeft, f.middle, f.lowerRight, f.bottom]) - f.upperRight * 0.05,
    7: averageScores([f.top, f.upperRight, f.center, lowBottom, lowLeft]) - f.lowerLeft * 0.1,
    8: averageScores([f.top, f.middle, f.bottom, f.upperLeft, f.lowerLeft, f.upperRight, f.lowerRight]),
    9: averageScores([f.top, f.middle, f.upperLeft, f.upperRight, f.lowerRight, f.bottom]) - f.lowerLeft * 0.08,
  };
  return clampScore(scores[digit] || 0);
}

function scoreComponentAsDigit(component, digit) {
  const templateScore = scoreDigit(component, digit);
  const featureScore = scoreDigitFeatures(component, digit);
  return templateScore * 0.72 + featureScore * 0.28;
}
function answerStrokePoints() {
  return pathsInsideAnswerBox().flatMap((path) => path.points);
}

function normalizeStrokePoints(points) {
  if (!points.length) return [];
  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  return points.map((point) => ({ x: (point.x - minX) / width, y: (point.y - minY) / height }));
}

function scoreFiveStroke(points) {
  const normalized = normalizeStrokePoints(points);
  if (normalized.length < 5) return 0;
  const first = normalized[0];
  const last = normalized[normalized.length - 1];
  const firstThird = normalized.slice(0, Math.max(2, Math.floor(normalized.length / 3)));
  const secondHalf = normalized.slice(Math.floor(normalized.length / 2));
  const minEarlyX = Math.min(...firstThird.map((point) => point.x));
  const maxLateX = Math.max(...secondHalf.map((point) => point.x));
  const lowestLateY = Math.max(...secondHalf.map((point) => point.y));
  const leftWall = normalized.some((point) => point.x < 0.25 && point.y > 0.24 && point.y < 0.62);
  const topStart = first.y < 0.28;
  const topMovesLeft = first.x - minEarlyX > 0.18;
  const hasFiveCorner = topMovesLeft || leftWall;
  const dropsDown = lowestLateY > 0.72;
  const swingsRight = maxLateX - minEarlyX > 0.34;
  const endsLow = last.y > 0.56;
  const endsLeftOfRightSwing = last.x < maxLateX - 0.08;
  return [topStart, hasFiveCorner, leftWall, dropsDown, swingsRight, endsLow, endsLeftOfRightSwing].filter(Boolean).length / 7;
}

function strokeDigitScore(digit) {
  const points = answerStrokePoints();
  if (digit === "5") return scoreFiveStroke(points);
  return 0;
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
  const upperLeftInk = gridInkCount(grid, 0, 3, 0, 1);
  const upperRightInk = gridInkCount(grid, 0, 3, 3, 4);
  const lowerLeftInk = gridInkCount(grid, 3, 6, 0, 1);
  let score = Math.max(...digitTemplates[digit].map((template) => scoreTemplate(grid, template)));
  if (digit === "1" && aspect < 0.5 && centerInk >= 4 && leftInk <= 4 && rightInk <= 4) score += 0.3;
  if (digit === "2" && topInk >= 1 && middleInk >= 2 && bottomInk >= 2 && leftInk >= 1 && rightInk >= 1) score += 0.2;
  if (digit === "2" && aspect < 0.55 && centerInk >= 4) score -= 0.24;
  if (digit === "3" && rightInk >= 3 && middleInk >= 2 && leftInk <= 5) score += 0.24;
  if (digit === "3" && lowerLeftInk >= 3) score -= 0.14;
  if (digit === "4" && middleInk >= 3 && rightInk >= 3 && topInk >= 1 && bottomInk <= 4) score += 0.06;
  if (digit === "4" && (bottomInk > 7 || (leftInk < 2 && aspect > 0.55))) score -= 0.18;
  if (digit === "0" && topInk >= 2 && bottomInk >= 2 && leftInk >= 2 && rightInk >= 2 && middleInk <= 9) score += 0.18;
  if (digit === "5" && topInk >= 2 && middleInk >= 2 && bottomInk >= 1 && leftInk >= 2 && rightInk >= 1 && aspect >= 0.42) score += 0.12;
  if (digit === "5" && leftInk >= rightInk && topInk >= 2 && middleInk >= 2 && bottomInk >= 1) score += 0.05;
  if (digit === "5" && aspect > 1.15 && topInk >= 2 && middleInk >= 2 && bottomInk >= 2 && upperLeftInk >= 3) score += 0.22;
  if (digit === "5" && lowerLeftInk >= 3 && upperRightInk >= 3) score -= 0.34;
  if (digit === "5" && upperLeftInk < 2) score -= 0.22;
  if (digit === "5" && bottomInk < 2) score -= 0.2;
  if (digit === "8" && topInk >= 2 && middleInk >= 3 && bottomInk >= 2 && leftInk >= 2 && rightInk >= 2) score += 0.12;
  if (digit === "8" && (leftInk < 3 || bottomInk < 2)) score -= 0.16;
  if (digit === "8" && lowerLeftInk < 2) score -= 0.22;
  if (digit === "8" && aspect > 1.45) score -= 0.3;
  if (digit === "7" && topInk >= 3 && bottomInk <= 2 && leftInk <= 4) score += 0.22;
  if (digit === "7" && bottomInk >= 4) score -= 0.18;
  return score;
}

function recognizeInkComponent(component) {
  const ranked = Object.keys(digitTemplates)
    .map((digit) => ({
      digit,
      templateScore: scoreDigit(component, digit),
      featureScore: scoreDigitFeatures(component, digit),
    }))
    .map((item) => ({ ...item, score: item.templateScore * 0.72 + item.featureScore * 0.28 }))
    .sort((a, b) => b.score - a.score);
  const top = ranked[0];
  const next = ranked[1] || { score: 0, digit: "" };
  const margin = top.score - next.score;
  const signalAgreement = top.templateScore > 0.62 && top.featureScore > 0.5;
  const confidence = Math.max(0, Math.min(1, top.score * 0.48 + margin * 1.25 + (signalAgreement ? 0.12 : 0)));
  return { digit: top.digit, score: top.score, confidence, margin, nextDigit: next.digit || "", templateScore: top.templateScore, featureScore: top.featureScore, alternatives: ranked.slice(0, 4).map((item) => ({ digit: item.digit, score: item.score })) };
}


/*
  ONNX Runtime Web digit model setup:
  1. Download a browser-safe MNIST/EMNIST ONNX model and place it at ./assets/models/mnist-8.onnx.
  2. Load ONNX Runtime Web in index.html from jsDelivr or unpkg.
  3. The app preprocesses each answer digit slot into [1, 1, 28, 28] grayscale floats.
  4. For a stronger child-handwriting model, train/fine-tune with QuickMaths samples, export to ONNX, and replace this file.
*/
async function loadOnnxDigitModel() {
  state.onnxModelTried = true;
  if (!window.QUICKMATHS_ENABLE_ONNX_MODEL) return null;
  if (!window.ort?.InferenceSession || window.location.protocol === "file:") return null;
  try {
    state.onnxModel = await window.ort.InferenceSession.create("./assets/models/mnist-8.onnx", { executionProviders: ["wasm"] });
    state.onnxModelReady = true;
    state.onnxModelError = "";
    return state.onnxModel;
  } catch (error) {
    state.onnxModel = null;
    state.onnxModelReady = false;
    state.onnxModelError = error?.message || String(error || "Unknown ONNX load error");
    return null;
  }
}

function softmax(values) {
  const max = Math.max(...values);
  const exps = values.map((value) => Math.exp(value - max));
  const total = exps.reduce((sum, value) => sum + value, 0) || 1;
  return exps.map((value) => value / total);
}

function digitImageCanvasFromRect(rect, size = 28) {
  const strokes = pathsInRect(rect).filter((path) => !path.erase);
  const points = strokes.flatMap((path) => path.points.filter((point) => pointInsideRect(point, rect)));
  if (points.length < 2) return null;

  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  const inkWidth = Math.max(1, maxX - minX);
  const inkHeight = Math.max(1, maxY - minY);
  const scale = Math.min(20 / inkWidth, 20 / inkHeight);
  const offsetX = (size - inkWidth * scale) / 2;
  const offsetY = (size - inkHeight * scale) / 2;

  const target = document.createElement("canvas");
  target.width = size;
  target.height = size;
  const targetCtx = target.getContext("2d", { willReadFrequently: true });
  targetCtx.fillStyle = "black";
  targetCtx.fillRect(0, 0, size, size);
  targetCtx.strokeStyle = "white";
  targetCtx.lineCap = "round";
  targetCtx.lineJoin = "round";
  strokes.forEach((path) => {
    const slotPoints = path.points.filter((point) => pointInsideRect(point, rect));
    if (slotPoints.length < 2) return;
    targetCtx.lineWidth = Math.max(2, Math.min(4, path.size * scale));
    targetCtx.beginPath();
    slotPoints.forEach((point, index) => {
      const x = offsetX + (point.x - minX) * scale;
      const y = offsetY + (point.y - minY) * scale;
      if (index) targetCtx.lineTo(x, y);
      else targetCtx.moveTo(x, y);
    });
    targetCtx.stroke();
  });
  return target;
}

function onnxTensorFromCanvas(canvas) {
  const image = canvas.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, 28, 28);
  const input = new Float32Array(28 * 28);
  for (let index = 0; index < input.length; index += 1) {
    const offset = index * 4;
    input[index] = (0.299 * image.data[offset] + 0.587 * image.data[offset + 1] + 0.114 * image.data[offset + 2]) / 255;
  }
  return new window.ort.Tensor("float32", input, [1, 1, 28, 28]);
}

async function recognizeWithOnnx(expectedText = "") {
  if (!/^\d+$/.test(expectedText)) return { text: "", status: "onnx-skipped", confidence: 0 };
  if (!window.ort?.InferenceSession) return { text: "", status: "onnx-unavailable", confidence: 0 };
  if (!state.onnxModelTried) await loadOnnxDigitModel();
  if (!state.onnxModelReady || !state.onnxModel) return { text: "", status: "onnx-missing", confidence: 0 };

  try {
    const rects = answerDigitRects(expectedText);
    const digits = [];
    const confidences = [];
    const margins = [];
    const candidateLists = [];
    for (const rect of rects) {
      const canvas = digitImageCanvasFromRect(rect, 28);
      if (!canvas) return { text: "", status: "empty", confidence: 0 };
      const inputName = state.onnxModel.inputNames?.[0] || "Input3";
      const outputName = state.onnxModel.outputNames?.[0];
      const outputMap = await state.onnxModel.run({ [inputName]: onnxTensorFromCanvas(canvas) });
      const outputTensor = outputName ? outputMap[outputName] : Object.values(outputMap)[0];
      const probabilities = softmax(Array.from(outputTensor.data));
      const ranked = probabilities.map((score, digit) => ({ digit: String(digit), score })).sort((a, b) => b.score - a.score);
      digits.push(ranked[0]?.digit || "");
      confidences.push(ranked[0]?.score || 0);
      margins.push((ranked[0]?.score || 0) - (ranked[1]?.score || 0));
      candidateLists.push(ranked.slice(0, 4));
    }
    const text = digits.join("");
    return { text, status: "onnx", confidence: Math.min(...confidences), margin: Math.min(...margins), candidateTexts: combineCandidateDigits(candidateLists) };
  } catch {
    return { text: "", status: "onnx-error", confidence: 0 };
  }
}

function scoreExpected(components, expectedText) {
  const normalized = normalizeComponentsForExpected(components, expectedText);
  if (normalized.length !== expectedText.length) return null;
  const scores = normalized.map((component, index) => scoreComponentAsDigit(component, expectedText[index]));
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return { average, min: Math.min(...scores), components: normalized };
}

function recognizeDigitsLocally(expectedText = "") {
  const components = expectedDigitComponents(expectedText);
  const strokeScore = expectedText.length === 1 ? strokeDigitScore(expectedText) : 0;
  if (!components.length) {
    if (strokeScore > 0.82) return { text: expectedText, status: "local", confidence: strokeScore, strokeScore };
    return { text: "", status: "empty", confidence: 0 };
  }

  const expected = /^\d+$/.test(expectedText) ? scoreExpected(components, expectedText) : null;
  const componentsForReading = expected?.components || components;
  const recognized = componentsForReading.map(recognizeInkComponent);
  const candidateTexts = combineCandidateDigits(recognized.map((item) => item.alternatives || [{ digit: item.digit, score: item.score }]));
  const bestScore = recognized.reduce((sum, item) => sum + item.score, 0) / recognized.length;
  const text = recognized.map((item) => item.digit).join("");
  const confidence = recognized.reduce((sum, item) => sum + item.confidence, 0) / Math.max(1, recognized.length);
  const minimumMargin = Math.min(...recognized.map((item) => item.margin ?? 0));

  if (expected) {
    const expectedCloseToBest = expected.average >= bestScore - 0.1;
    const expectedCompetitive = expected.average >= bestScore - 0.28;
    const expectedStrong = ((expected.average > 0.78 && expected.min > 0.52) || (text === expectedText && strokeScore > 0.82 && expected.average > 0.58)) && (expectedText !== "5" || strokeScore > 0.82);
    const expectedReadable = expected.average > 0.66 && expected.min > 0.42;
    const expectedPlausible = text === expectedText && expectedText.length <= 2 && expected.average > 0.58 && expected.min > 0.34 && expectedCompetitive && (expectedText !== "5" || strokeScore > 0.82);
    if ((expectedStrong && expectedCloseToBest) || expectedPlausible) {
      return { text: expectedText, status: "local", confidence: Math.min(0.9, Math.max(0.66, confidence, expected.average - 0.02, strokeScore)), expectedScore: expected.average, visualText: text, strokeScore, candidateTexts };
    }
    if (text !== expectedText && expected.average > 0.55 && expected.average >= bestScore - 0.34) {
      return { text, status: "ambiguous", confidence: Math.min(0.56, confidence), expectedScore: expected.average, visualText: text, candidateTexts };
    }
  }

  const adjustedConfidence = minimumMargin < 0.1 ? Math.min(confidence, 0.58) : confidence;
  if (expected && text === expectedText && expected.average > 0.62 && bestScore > 0.6 && minimumMargin > 0.01 && (expectedText !== "5" || strokeScore > 0.82)) {
    return { text, status: "local", confidence: Math.max(0.64, adjustedConfidence, strokeScore), expectedScore: expected.average, visualText: text, strokeScore, candidateTexts };
  }
  if (expected && expectedText === "5" && text === expectedText && strokeScore <= 0.82) {
    return { text, status: "ambiguous", confidence: Math.min(0.56, adjustedConfidence), expectedScore: expected.average, visualText: text, strokeScore, candidateTexts };
  }
  return { text, status: text ? "local" : "unreadable", confidence: adjustedConfidence, candidateTexts };
}

function pathsInRect(rect) {
  return state.paths
    .map((path) => ({
      ...path,
      points: path.points.filter((point) => pointInsideRect(point, rect)),
    }))
    .filter((path) => path.points.length > 1 && !path.erase);
}

function pathsInsideAnswerBox() {
  return pathsInRect(getAnswerRect());
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
  if (!answerInkComponents().length && !pathsInsideAnswerBox().length) return { text: "", status: "empty", confidence: 0 };
  const local = recognizeDigitsLocally(expectedText);
  const expectedLocalScore = Number(local.expectedScore || 0);
  if (local.text === expectedText && local.confidence >= 0.7) return local;

  const onnx = await recognizeWithOnnx(expectedText);
  const onnxTrusted = onnx.text === expectedText && onnx.confidence >= 0.62 && onnx.margin >= 0.1 && (local.text === expectedText || expectedLocalScore >= 0.48 || !local.text);
  if (onnxTrusted) {
    return {
      text: expectedText,
      status: "onnx",
      confidence: Math.max(0.68, Math.min(0.92, onnx.confidence)),
      margin: onnx.margin,
      localText: local.text,
      expectedScore: expectedLocalScore,
      candidateTexts: [...new Set([...(local.candidateTexts || []), ...(onnx.candidateTexts || []), local.text, onnx.text].filter(Boolean))],
    };
  }
  if (onnx.text && local.text && onnx.text !== local.text && onnx.confidence >= 0.52) {
    return {
      ...local,
      status: "ambiguous",
      confidence: Math.min(0.56, local.confidence || onnx.confidence),
      onnxText: onnx.text,
      onnxConfidence: onnx.confidence,
      candidateTexts: [...new Set([...(local.candidateTexts || []), ...(onnx.candidateTexts || []), local.text, onnx.text].filter(Boolean))],
    };
  }
  if (local.status === "ambiguous" && local.text && local.text !== expectedText) return local;
  if (local.status === "ambiguous") return local;
  if (local.text && local.confidence >= 0.64) return local;
  const browser = await recognizeWithBrowserApi(pathsInsideAnswerBox());
  if (browser.text && browser.confidence > local.confidence) return { ...browser, browserText: browser.text, candidateTexts: [...new Set([...(local.candidateTexts || []), browser.text].filter(Boolean))] };
  return local.text ? local : { text: "", status: "unreadable", confidence: 0 };
}
function showFeedback(message, type) {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${type}`;
  feedbackPanel.className = `feedback-panel ${type}`;
  feedbackPanel.hidden = false;
  retryFeedbackButton.hidden = true;
  nextFeedbackButton.hidden = true;
  closeFeedbackButton.hidden = true;
  markCorrectButton.hidden = true;
  markWrongButton.hidden = true;
  if (type !== "choices") hideAnswerChoices();
  setActionState(type);
  if (window.lucide) window.lucide.createIcons();
}


function awardStreakFreezeIfEarned() {
  if (state.progress.streak <= 0 || state.progress.streak % 5 !== 0 || state.progress.streakFreezes >= 3) return false;
  state.progress.streakFreezes += 1;
  return true;
}

function protectOrResetStreak() {
  if (state.progress.streakFreezes > 0 && state.progress.streak > 0) {
    state.progress.streakFreezes -= 1;
    return true;
  }
  state.progress.streak = 0;
  return false;
}

function freezeMessage() {
  return state.kidName ? ` A freeze saved your streak, ${state.kidName}.` : " A freeze saved your streak.";
}
function recordMissOnce() {
  if (!state.current || state.current.missedRecorded) return;
  state.current.missedRecorded = true;
  state.session.missed += 1;
  state.session.missedQuestions.push({
    a: state.current.a,
    b: state.current.b,
    answer: state.current.answer,
    symbol: state.current.symbol,
    plan: state.current.plan,
  });
}

function awardCorrectAnswer(readText) {
  const previousStars = state.progress.stars;
  state.progress.streak += 1;
  const earnedFreeze = awardStreakFreezeIfEarned();
  const streakBonus = state.progress.streak % 3 === 0 ? 2 : 0;
  const earnedStars = 1 + streakBonus;
  state.progress.stars += earnedStars;
  state.progress.stageStars[state.progress.currentStage] = (state.progress.stageStars[state.progress.currentStage] || 0) + earnedStars;
  state.session.starsEarned += earnedStars;
  state.progress.answered += 1;
  state.session.correct += 1;
  state.pendingReview = null;
  const milestones = earnedStarMilestones(previousStars, state.progress.stars);
  const unlockedStage = unlockEligibleLevels();
  clearInterval(state.timerId);
  saveProgress();
  updateProgressUi();
  playTone("correct");
  celebrateCorrectAnswer();
  showFeedback(`${namePrefix(state.kidName ? "Great work" : "Congratulations")} I read ${readText}.` + (earnedFreeze ? " You earned a streak freeze." : "") + "\n" + formatKidTimeLeft(state.timeLeft), "correct");
  if (unlockedStage || milestones.length) showRewardPopup({ earnedStars, milestones, unlockedStage });
}
function askForRecognitionReview(recognized) {
  state.pendingReview = recognized;
  const choices = answerChoicesFromRecognition(recognized, state.current.answer);
  showFeedback(state.kidName ? `${state.kidName}, pick the answer you meant.` : "Pick the answer you meant.", "choices");
  showAnswerChoices(choices);
}

async function checkAnswer() {
  if (!state.current) showQuestion();
  setActionState("checking");
  const expectedText = String(state.current.answer);
  const recognized = await recognizeWriting(expectedText);
  const given = normalizeAnswer(recognized.text);
  const correct = given === state.current.answer;

  if (recognized.status !== "empty" && (recognized.status === "ambiguous" || recognized.confidence < 0.64)) {
    askForRecognitionReview(recognized);
    return;
  }

  if (correct) {
    awardCorrectAnswer(recognized.text);
  } else {
    const streakProtected = protectOrResetStreak();
    recordMissOnce();
    const message = recognized.status === "empty"
      ? state.kidName ? `Write the final answer inside the box, ${state.kidName}.` : "Write the final answer inside the box, then try again."
      : state.kidName ? `I read ${recognized.text || "nothing"}. Try again, ${state.kidName}.` : `I read ${recognized.text || "nothing"}. Try this one again.`;
    playTone("wrong");
    showFeedback(message + (streakProtected ? freezeMessage() : ""), "wrong");
  }

  saveProgress();
  updateProgressUi();
}

function tryAgainCurrentQuestion() {
  hideFeedback();
  clearBoard();
  setActionState("ready");
  resetTimer();
}
function retryMissedQuestions() {
  if (!requireKidName("retry")) return;
  const missed = state.session.missedQuestions.shift();
  if (!missed) return;
  rememberView("practice");
  splashScreen.hidden = true;
  startScreen.hidden = true;
  practiceBoard.hidden = false;
  requestAnimationFrame(() => {
    resizeBoard();
    showQuestion({ ...missed, missedRecorded: false });
    updateProgressUi();
  });
}

function selectSize(button) {
  state.currentSize = Number(button.dataset.size || 5);
  usePencil();
  sizeButtons.forEach((item) => item.classList.toggle("selected-size", item === button));
}

function selectColor(button) {
  state.currentColor = button.dataset.color;
  usePencil();
  updateToolUi();
  colorButtons.forEach((item) => item.classList.toggle("selected", item === button));
  closePenPanel();
}

board.addEventListener("pointerdown", startDrawing);
board.addEventListener("pointermove", keepDrawing);
board.addEventListener("pointerup", stopDrawing);
board.addEventListener("pointercancel", stopDrawing);
board.addEventListener("pointerleave", stopDrawing);
window.addEventListener("resize", resizeBoard);
timerControl.addEventListener("click", cycleTimerStyle);
soundToggleButton.addEventListener("click", toggleSound);
startPracticeButton.addEventListener("click", startPractice);
resetProgressButton.addEventListener("click", resetProgress);
retryMissedButton.addEventListener("click", retryMissedQuestions);
backToLevelsButton.addEventListener("click", showStartScreen);
closeFeedbackButton.addEventListener("click", hideFeedback);
retryFeedbackButton.addEventListener("click", tryAgainCurrentQuestion);
tryMainButton.addEventListener("click", tryAgainCurrentQuestion);
nextFeedbackButton.addEventListener("click", () => showQuestion());
markCorrectButton.addEventListener("click", () => awardCorrectAnswer(state.pendingReview?.text || String(state.current.answer)));
markWrongButton.addEventListener("click", () => {
  state.pendingReview = null;
  const streakProtected = protectOrResetStreak();
  recordMissOnce();
  saveProgress();
  updateProgressUi();
  playTone("wrong");
  showFeedback((state.kidName ? `Try this one again, ${state.kidName}.` : "Try this one again.") + (streakProtected ? freezeMessage() : ""), "wrong");
});
nextMainButton.addEventListener("click", () => showQuestion());
pencilButton.addEventListener("click", togglePenPanel);
colorButtons.forEach((button) => button.addEventListener("click", () => selectColor(button)));
sizeButtons.forEach((button) => button.addEventListener("click", () => selectSize(button)));
eraserButton.addEventListener("click", () => {
  closePenPanel();
  state.erasing = true;
  eraserButton.classList.add("selected-tool");
  pencilButton.classList.remove("selected-tool");
  colorButtons.forEach((button) => button.classList.remove("selected"));
  updateToolUi();
});
undoButton.addEventListener("click", () => {
  state.paths.pop();
  redrawBoard();
});
clearButton.addEventListener("click", clearBoardWithConfirmation);
checkButton.addEventListener("click", checkAnswer);
if (kidNameEl) kidNameEl.addEventListener("input", saveKidName);
if (settingsNameButton) settingsNameButton.addEventListener("click", () => showNameGate("settings"));
gateNameEl.addEventListener("input", () => gateNameEl.classList.remove("invalid"));
gateNameEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveNameFromGate();
});
saveNameButton.addEventListener("click", saveNameFromGate);
helpStartButton.addEventListener("click", showHelp);
helpPracticeButton.addEventListener("click", showHelp);
closeHelpButton.addEventListener("click", hideHelp);
rewardOkButton.addEventListener("click", hideRewardPopup);
rewardNextButton.addEventListener("click", () => { hideRewardPopup(); showQuestion(); });
rewardGate.addEventListener("click", (event) => {
  if (event.target === rewardGate) hideRewardPopup();
});
helpGate.addEventListener("click", (event) => {
  if (event.target === helpGate) hideHelp();
});
nameGate.addEventListener("click", (event) => {
  if (event.target === nameGate && state.pendingNameAction === "settings") closeNameGate();
});
document.addEventListener("pointerdown", (event) => {
  if (penPanel.hidden) return;
  if (penPanel.contains(event.target) || pencilButton.contains(event.target)) return;
  closePenPanel();
});
operationEl.addEventListener("change", () => {
  if (!practiceBoard.hidden) showQuestion();
});
difficultyEl.addEventListener("change", selectDifficulty);
levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.disabled) return;
    state.progress.currentStage = Number(button.dataset.stage || 1);
    saveProgress();
    updateProgressUi();
  });
});

registerServiceWorker();
updatePersonalGreeting();
updateToolUi();
updateSoundButton();
updateProgressUi();
if (window.lucide) window.lucide.createIcons();
showSplashThenRestore();