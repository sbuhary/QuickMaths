const questionEl = document.querySelector("#question");
const timerEl = document.querySelector("#timer");
const feedbackEl = document.querySelector("#feedback");

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const rest = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${rest}`;
}

timerEl.textContent = formatTime(0);
questionEl.textContent = "7 + 5 = ?";
feedbackEl.textContent = "Choose a level, write on the board, then check your answer.";
