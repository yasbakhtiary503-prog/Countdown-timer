const CACHE_NAME = "chronobloom-v1";

const APP_FILES = [
  "./",
  "./index.html",

  "./css/reset.css",
  "./css/base.css",
  "./css/style.css",
  "./css/responsive.css",

  "./js/app.js",
  "./js/modules/timer.js",
  "./js/modules/alarm.js",
  "./js/modules/birthday.js",
  "./js/modules/navigation.js",

  "./js/modules/calendar/calendar.js",
  "./js/modules/calendar/calendar-utils.js",
  "./js/modules/calendar/calendar-render.js",

  "./audio/alarm.mp3",

  "./manifest.webmanifest",
  "./image/pwa-icon-192.png",
  "./image/pwa-icon-512.png",
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    }),
  );

  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    }),
  );

  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseCopy = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseCopy);
          });
        }

        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
          return cachedResponse;
        }

        if (request.mode === "navigate") {
          return caches.match("./index.html");
        }

        return new Response("Offline", {
          status: 503,
          statusText: "Service Unavailable",
        });
      }),
  );
});
