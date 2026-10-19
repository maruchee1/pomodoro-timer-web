// ===== 설정값 =====
const STORAGE_KEY = "pomodoro:minutes"; // 설정 페이지(settings.js)와 공유하는 키
const DEFAULT_MINUTES = 25;             // 저장된 값이 없을 때 기본 집중 시간(분)
const MIN_MINUTES = 1;
const MAX_MINUTES = 60;

// localStorage에 저장된 분 단위 설정을 읽어온다. 없거나 잘못된 값이면 기본값 사용
function loadMinutes() {
  const n = Number(localStorage.getItem(STORAGE_KEY));
  if (Number.isInteger(n) && n >= MIN_MINUTES && n <= MAX_MINUTES) return n;
  return DEFAULT_MINUTES;
}

// ===== 상태 =====
let totalSeconds = loadMinutes() * 60;  // 설정된 집중 시간(초)
let remainingSeconds = totalSeconds;    // 현재 남은 시간(초)
let timerId = null;                     // setInterval 핸들. null이면 정지 상태

// ===== DOM 요소 =====
const timeDisplay = document.getElementById("time-display");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const resetBtn = document.getElementById("reset-btn");
const clockDisplay = document.getElementById("clock");

// ===== 화면 갱신 =====
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function render() {
  timeDisplay.textContent = formatTime(remainingSeconds);
}

// ===== 타이머 동작 =====
function tick() {
  remainingSeconds -= 1;
  render();

  if (remainingSeconds <= 0) {
    stopTimer();
  }
}

function startTimer() {
  // 이미 동작 중이거나 남은 시간이 없으면 무시
  if (timerId !== null || remainingSeconds <= 0) return;

  timerId = setInterval(tick, 1000);
}

function stopTimer() {
  if (timerId === null) return;

  clearInterval(timerId);
  timerId = null;
}

function resetTimer() {
  stopTimer();
  remainingSeconds = totalSeconds;
  render();
}

// 설정값이 바뀌었을 때 타이머에 반영 (동작 중이면 멈추고 새 시간으로 초기화)
function applySettings() {
  totalSeconds = loadMinutes() * 60;
  resetTimer();
}

// ===== 이벤트 핸들러 (onclick 방식) =====
startBtn.onclick = startTimer;
stopBtn.onclick = stopTimer;
resetBtn.onclick = resetTimer;

// 다른 탭의 설정 페이지에서 저장하면 이 탭에도 즉시 반영
window.onstorage = function (event) {
  if (event.key === STORAGE_KEY) applySettings();
};

// ===== 현재 시간 표시 =====
function renderClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  clockDisplay.textContent = `${hh}:${mm}:${ss}`;
}

// 초기 화면 표시
render();
renderClock();
setInterval(renderClock, 1000); // 1초마다 현재 시간 갱신
