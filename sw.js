const CACHE_VERSION = "quickmaths-20260902-gameplay-7";
const APP_SHELL = [
  "./",
  "./index.html",
  "./assets/css/styles.css?v=20260902-gameplay-7",
  "./assets/js/version.js",
  "./assets/js/icons.js?v=20260902-gameplay-7",
  "./assets/js/app.js?v=20260902-gameplay-7",
  "./manifest.webmanifest",
  "./assets/icons/quickmaths-icon.svg",
  "./assets/backgrounds/levels.svg",
  "./assets/models/mnist-8.onnx"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
