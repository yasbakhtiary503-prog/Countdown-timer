/* ============================================
   IMPORTS
============================================ */

import {
  toJalaali,
  jalaaliMonthLength,
  toGregorian,
} from "https://esm.sh/jalaali-js@2.0.1";

/* ============================================
   CONSTANTS
============================================ */

// -- Jalaali month names.

export const jalaaliMonths = [
  "Farvardin",
  "Ordibehesht",
  "Khordad",
  "Tir",
  "Mordad",
  "Shahrivar",
  "Mehr",
  "Aban",
  "Azar",
  "Dey",
  "Bahman",
  "Esfand",
];

// -- Local storage key for the selected date.

export const STORAGE_KEY = "chronobloom-selected-date";

/* ============================================
   DATE CONVERSION
============================================ */

// -- Re-export Jalaali date conversion utilities.

export { toJalaali, jalaaliMonthLength, toGregorian };

/* ============================================
   DATE HELPERS
============================================ */

// -- Returns the number of days in a Jalaali month.

export const getDaysInMonth = (year, month) => {
  return jalaaliMonthLength(year, month);
};

// -- Returns the weekday index of the first day of a Jalaali month.
// -- The calendar starts on Saturday.

export const getFirstDayOfMonth = (year, month) => {
  const { gy, gm, gd } = toGregorian(year, month, 1);

  const firstDay = new Date(gy, gm - 1, gd);
  const dayOfWeek = firstDay.getDay();

  return (dayOfWeek + 1) % 7;
};
