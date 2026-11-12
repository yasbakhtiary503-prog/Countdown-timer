
/* ============================================
   IMPORTS
============================================ */

import {
  jalaaliMonths,
  getDaysInMonth,
  getFirstDayOfMonth,
} from "./calendar-utils.js";


/* ============================================
   DOM ELEMENTS
============================================ */

const calendarTitleEl = document.querySelector(".js-calendar__title");
const calendarBodyEl = document.querySelector(".js-calendar__body");


/* ============================================
   CALENDAR TITLE
============================================ */

// Updates the calendar heading based on the current Jalaali date.
export const updateCalendarTitle = (year, month) => {
  calendarTitleEl.textContent = `${jalaaliMonths[month - 1]} ${year}`;
};


/* ============================================
   CALENDAR RENDERING
============================================ */

// Renders the calendar days and updates their visual states.
export const renderCalendar = (
  year,
  month,
  todayJalaali,
  selectedDate,
  onSelect,
) => {
  const firstDayIndex = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);

  let row = document.createElement("tr");
  row.classList.add("calendar__row");

  let cellCount = 0;

  // Clear the previous calendar content.
  calendarBodyEl.innerHTML = "";

  // Add empty cells before the first day of the month.
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement("td");
    emptyCell.classList.add("calendar__cell");

    row.appendChild(emptyCell);
    cellCount++;
  }

  // Generate all days of the current month.
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("td");
    cell.classList.add("calendar__cell");

    const dayButton = document.createElement("button");
    dayButton.classList.add("calendar__day");
    dayButton.type = "button";
    dayButton.textContent = day;

    // Highlight today's date.
    const isToday =
      year === todayJalaali.jy &&
      month === todayJalaali.jm &&
      day === todayJalaali.jd;

    if (isToday) {
      dayButton.classList.add("calendar__day--today");
    }

    // Highlight the currently selected date.
    const isSelected =
      selectedDate &&
      year === selectedDate.year &&
      month === selectedDate.month &&
      day === selectedDate.day;

    if (isSelected) {
      dayButton.classList.add("calendar__day--selected");
    }

    // Disable dates that have already passed.
    const isPast =
      year < todayJalaali.jy ||
      (year === todayJalaali.jy && month < todayJalaali.jm) ||
      (year === todayJalaali.jy &&
        month === todayJalaali.jm &&
        day < todayJalaali.jd);

    if (isPast) {
      dayButton.disabled = true;
    }

    // Handle date selection through the callback.
    dayButton.addEventListener("click", () => {
      onSelect(year, month, day, dayButton);
    });

    cell.appendChild(dayButton);
    row.appendChild(cell);

    cellCount++;

    // Append the row whenever it contains seven cells.
    if (cellCount === 7) {
      calendarBodyEl.appendChild(row);

      row = document.createElement("tr");
      row.classList.add("calendar__row");

      cellCount = 0;
    }
  }

  // Append the final row if it contains fewer than seven cells.
  if (cellCount > 0) {
    calendarBodyEl.appendChild(row);
  }
};
