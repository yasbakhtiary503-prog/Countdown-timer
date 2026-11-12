import { playAlarm } from "./alarm.js";

/* ============================================
   DOM ELEMENTS
============================================ */

const daysEl = document.querySelector(".js-clock__counter-days");
const hoursEl = document.querySelector(".js-clock__counter-hours");
const minutesEl = document.querySelector(".js-clock__counter-minutes");
const secondsEl = document.querySelector(".js-clock__counter-seconds");

const startBtnEl = document.querySelector(".js-clock-button-start");

const resetBtnEl = document.querySelector(".js-clock-button-reset");

/* ============================================
   STATE
============================================ */

let timeIntervalId = null;
let targetDate = null;

/* ============================================
   TIMER DISPLAY
============================================ */

const resetCountdownDisplay = () => {
  daysEl.textContent = "0";
  hoursEl.textContent = "00";
  minutesEl.textContent = "00";
  secondsEl.textContent = "00";
};

const updateCountdownDisplay = () => {
  const t = calculateTimeRemaining(targetDate);

  daysEl.textContent = t.days;
  hoursEl.textContent = String(t.hours).padStart(2, "0");
  minutesEl.textContent = String(t.minutes).padStart(2, "0");
  secondsEl.textContent = String(t.seconds).padStart(2, "0");

  // Stop the interval when the countdown reaches zero.
  if (t.total <= 0) {
    clearInterval(timeIntervalId);

    playAlarm();
    timeIntervalId = null;
    return;
  }
};

/* ============================================
   TIME CALCULATION
============================================ */

const calculateTimeRemaining = (targetDate) => {
  const total = targetDate.getTime() - Date.now();

  const totalSeconds = Math.max(0, Math.floor(total / 1000));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};

/* ============================================
   SET COUNTDOWN TARGET
============================================ */

export const setCountdownTarget = (date) => {
  clearInterval(timeIntervalId);
  timeIntervalId = null;

  targetDate = date;

  // Keep the countdown stopped until Start is clicked.
  resetCountdownDisplay();
};

/* ============================================
   START COUNTDOWN
============================================ */

export const startCountdown = () => {
  if (!targetDate) return;

  // Prevent multiple active intervals.
  clearInterval(timeIntervalId);
  timeIntervalId = null;

  // Display the initial countdown values.
  updateCountdownDisplay();

  // Start counting only if the target date is still in the future.
  if (targetDate.getTime() > Date.now()) {
    timeIntervalId = setInterval(updateCountdownDisplay, 1000);
  }
};

/* ============================================
   RESET COUNTDOWN
============================================ */

export const resetCountdown = () => {
  clearInterval(timeIntervalId);
  timeIntervalId = null;

  // Reset the timer display.
  resetCountdownDisplay();

  // Keep the selected target date for a future restart.
};

/* ============================================
   EVENT LISTENERS
============================================ */

// Start countdown.
startBtnEl.addEventListener("click", startCountdown);

// Reset countdown.
resetBtnEl.addEventListener("click", resetCountdown);
