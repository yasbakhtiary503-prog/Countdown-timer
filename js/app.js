/* ============================================
   IMPORTS
============================================ */

import { initCalendar } from "./modules/calendar/calendar.js";
import { initBirthday } from "./modules/birthday.js";

/* ============================================
   INITIALIZATION
============================================ */

// --Initialize calendar.

initCalendar();

// --Initialize welcome and birthday experience.

initBirthday();

// ============================================
// PWA SERVICE WORKER
// ============================================

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        console.log("ChronoBloom PWA is ready:", registration.scope);
      })
      .catch((error) => {
        console.error("PWA registration failed:", error);
      });
  });
}
