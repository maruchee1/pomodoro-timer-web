// ===== 설정값 =====
const STORAGE_KEY = "pomodoro:minutes"; // 메인 페이지(script.js)와 공유하는 키
const MIN_MINUTES = 1;
const MAX_MINUTES = 60;
const DEFAULT_MINUTES = 25;

// ===== DOM 요소 =====
const minutesInput = document.getElementById("minutes-input");
const saveBtn = document.getElementById("save-btn");

// ===== 유효성 검사 =====
// 비어 있거나, 정수가 아니거나, 1~60 범위를 벗어나면 false
function isValidMinutes(value) {
  if (value === "") return false;

  const n = Number(value);
  return Number.isInteger(n) && n >= MIN_MINUTES && n <= MAX_MINUTES;
}

function updateSaveButton() {
  saveBtn.disabled = !isValidMinutes(minutesInput.value);
}

// ===== 저장 =====
function saveMinutes() {
  if (!isValidMinutes(minutesInput.value)) return;

  localStorage.setItem(STORAGE_KEY, String(Number(minutesInput.value)));
}

// ===== 초기화: 저장된 값이 있으면 input에 표시 =====
function loadMinutes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  minutesInput.value = isValidMinutes(saved) ? saved : String(DEFAULT_MINUTES);
  updateSaveButton();
}

// ===== 이벤트 핸들러 (onclick 방식) =====
saveBtn.onclick = saveMinutes;
minutesInput.oninput = updateSaveButton;

loadMinutes();
