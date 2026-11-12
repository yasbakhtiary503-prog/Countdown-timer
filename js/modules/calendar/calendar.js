/* ============================================
   IMPORTS
============================================ */

import { setCountdownTarget } from "../timer.js";

import {
  jalaaliMonths,
  STORAGE_KEY,
  toJalaali,
  jalaaliMonthLength,
  toGregorian,
} from "./calendar-utils.js";

import { renderCalendar, updateCalendarTitle } from "./calendar-render.js";

/* ============================================
   DOM ELEMENTS
============================================ */
const calendarBodyEl = document.querySelector(".js-calendar__body");
const selectDateBtnEl = document.querySelector(".js-date-picker__trigger");
const calendarEl = document.querySelector(".js-calendar");

const prevMonthBtnEl = document.querySelector(".js-calendar-prev");
const nextMonthBtnEl = document.querySelector(".js-calendar-next");

const selectedDateEl = document.querySelector(".calendar__footer-date");
const datePickerTextEl = document.querySelector(".date-picker__text");

/* ============================================
   STATE
============================================ */

let currentYear;
let currentMonth;
let todayJalaali;

let selectedDate = null;

/* ============================================
   DATE SELECTION
============================================ */

const selectDate = (year, month, day, dayButton) => {
  // Remove the previous selected state.
  const previousSelectedDay = calendarBodyEl.querySelector(
    ".calendar__day--selected",
  );

  if (previousSelectedDay) {
    previousSelectedDay.classList.remove("calendar__day--selected");
  }

  // Highlight the newly selected date.
  dayButton.classList.add("calendar__day--selected");

  // Store the selected Jalaali date.
  selectedDate = { year, month, day };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedDate));

  // Convert the selected Jalaali date to Gregorian.
  const { gy, gm, gd } = toGregorian(year, month, day);

  // Set the countdown target to the end of the selected day.
  const targetDate = new Date(gy, gm - 1, gd, 23, 59, 59, 999);

  // Start the countdown.
  setCountdownTarget(targetDate);

  // Format the selected date for display.
  const formattedDate = `${day} ${jalaaliMonths[month - 1]} ${year}`;

  // Update the calendar footer.
  selectedDateEl.textContent = formattedDate;

  // Update the date picker trigger text.
  datePickerTextEl.textContent = formattedDate;

  // Close the calendar after selection.
  calendarEl.classList.remove("is-open");
};

/* ============================================
   CALENDAR RENDERING
============================================ */

const updateCalendar = () => {
  updateCalendarTitle(currentYear, currentMonth);

  renderCalendar(
    currentYear,
    currentMonth,
    todayJalaali,
    selectedDate,
    selectDate,
  );
};

/* ============================================
   LOCAL STORAGE
============================================ */

const restoreSavedDate = () => {
  const savedDate = localStorage.getItem(STORAGE_KEY);

  if (!savedDate) return;

  try {
    const parsedDate = JSON.parse(savedDate);
    const { year, month, day } = parsedDate;

    // Validate the saved Jalaali date.
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day) ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > jalaaliMonthLength(year, month)
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    // Check whether the saved date has already passed.
    const today = todayJalaali;

    const isPast =
      year < today.jy ||
      (year === today.jy && month < today.jm) ||
      (year === today.jy && month === today.jm && day < today.jd);

    if (isPast) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    // Restore the selected date.
    selectedDate = { year, month, day };

    // Format the restored date.
    const formattedDate = `${day} ${jalaaliMonths[month - 1]} ${year}`;

    // Update the date picker UI.
    selectedDateEl.textContent = formattedDate;
    datePickerTextEl.textContent = formattedDate;

    // Convert the restored Jalaali date to Gregorian.
    const { gy, gm, gd } = toGregorian(year, month, day);

    // Set the countdown target to the end of the selected day.
    const targetDate = new Date(gy, gm - 1, gd, 23, 59, 59, 999);

    // Resume the countdown.
    setCountdownTarget(targetDate);

    // Restore the selected month in the calendar.
    currentYear = year;
    currentMonth = month;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
};

/* ============================================
   MONTH NAVIGATION
============================================ */

const changeMonth = (direction) => {
  currentMonth += direction;

  // Move to the next year when necessary.
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
  }

  // Move to the previous year when necessary.
  if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
  }

  // Refresh the calendar.
  updateCalendar();
};

/* ============================================
   CALENDAR INITIALIZATION
============================================ */

export const initCalendar = () => {
  // Get the current Jalaali date.
  const { jy, jm } = toJalaali(new Date());

  currentYear = jy;
  currentMonth = jm;

  todayJalaali = toJalaali(new Date());

  // Restore the saved date, if available.
  restoreSavedDate();

  // Render the initial calendar.
  updateCalendar();
};

/* ============================================
   EVENT HANDLERS
============================================ */

const selectDateBtnElHandler = () => {
  calendarEl.classList.toggle("is-open");
};

const documentHandler = (event) => {
  const clickedInsideCalendar = calendarEl.contains(event.target);
  const clickedOnTrigger = selectDateBtnEl.contains(event.target);

  const clickedOutside = !clickedInsideCalendar && !clickedOnTrigger;

  if (clickedOutside) {
    calendarEl.classList.remove("is-open");
  }
};

/* ============================================
   EVENT LISTENERS
============================================ */

selectDateBtnEl.addEventListener("click", selectDateBtnElHandler);

document.addEventListener("click", documentHandler);

prevMonthBtnEl.addEventListener("click", () => {
  changeMonth(-1);
});

nextMonthBtnEl.addEventListener("click", () => {
  changeMonth(1);
});
