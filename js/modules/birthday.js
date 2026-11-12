/* ============================================
   IMPORTS
============================================ */

import { toJalaali } from "./calendar/calendar-utils.js";

/* ============================================
   CONSTANTS
============================================ */

const birthdayMonth = 8;
const birthdayDay = 22;

const welcomeMessages = [
  "Welcome, angel. 💗",
  "Hello, beautiful soul. ✨",
  "Welcome back, sunshine. ☀️",
  "You make this world brighter. 🌷",
  "Sending you a little love today. 💕",
  "Hello, my favorite person. 🌸",
  "A beautiful day starts with you. 💖",
];

const confettiColors = [
  "#FF6B81",
  "#FFD166",
  "#06D6A0",
  "#118AB2",
  "#C77DFF",
  "#FF9F1C",
];

/* ============================================
   DATE CHECK
============================================ */

const isBirthday = () => {
  const { jm, jd } = toJalaali(new Date());

  const isValidBirthday = jm === birthdayMonth && jd === birthdayDay;

  return isValidBirthday;
};

/* ============================================
   WELCOME MESSAGE
============================================ */

const getRandomWelcomeMessage = () => {
  const randomIndex = Math.floor(Math.random() * welcomeMessages.length);

  return welcomeMessages[randomIndex];
};

/* ============================================
   GREETING UI
============================================ */

const showGreeting = (message, birthday = false) => {
  const greetingEl = document.createElement("div");

  greetingEl.classList.add("birthday-greeting");

  if (birthday) {
    greetingEl.classList.add("birthday-greeting--special");
  }

  greetingEl.setAttribute("role", "status");
  greetingEl.setAttribute("aria-live", "polite");

  const messageEl = document.createElement("p");

  messageEl.classList.add("birthday-greeting__message");
  messageEl.textContent = message;

  const closeBtnEl = document.createElement("button");
  closeBtnEl.classList.add("birthday-greeting__close");
  closeBtnEl.type = "button";
  closeBtnEl.textContent = "×";
  closeBtnEl.setAttribute("aria-label", "Close greeting");

  // -- CLOSE BUTTON

  closeBtnEl.addEventListener("click", () => {
    greetingEl.remove();
  });

  greetingEl.append(messageEl, closeBtnEl);

  document.body.appendChild(greetingEl);

  // -- Automatically close the greeting after 6 seconds.

  setTimeout(() => {
    greetingEl.remove();
  }, 6000);
};

/* ============================================
   CONFETTI ANIMATION
============================================ */

const createConfetti = () => {
  const confettiContainer = document.createElement("div");

  confettiContainer.classList.add("birthday-confetti");
  confettiContainer.setAttribute("aria-hidden", "true");

  const confettiCount = 70;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("span");

    confetti.classList.add("birthday-confetti__piece");

    const randomColor =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];

    const randomLeft = Math.random() * 100;
    const randomDuration = 3 + Math.random() * 3;
    const randomDelay = Math.random() * 1.5;
    const randomRotation = Math.random() * 360;

    confetti.style.left = `${randomLeft}%`;
    confetti.style.backgroundColor = randomColor;
    confetti.style.animationDuration = `${randomDuration}s`;
    confetti.style.animationDelay = `${randomDelay}s`;
    confetti.style.transform = `rotate(${randomRotation}deg)`;

    confettiContainer.appendChild(confetti);
  }

  document.body.appendChild(confettiContainer);

  // Remove confetti elements after the animation.
  setTimeout(() => {
    confettiContainer.remove();
  }, 7500);
};

/* ============================================
   BIRTHDAY CELEBRATION
============================================ */

const celebrateBirthday = () => {
  showGreeting("Happy Birthday, Mom! ❤️", true);

  createConfetti();
};

/* ============================================
   INITIALIZATION
============================================ */

export const initBirthday = () => {
  if (isBirthday()) {
    celebrateBirthday();
    return;
  }

  showGreeting(getRandomWelcomeMessage());
};
