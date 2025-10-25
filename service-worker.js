// 🌐 Oleg & Neuro Code Studio — Offline Magic ✨

const CACHE_NAME = "bookshop-cache-v1";
const URLS_TO_CACHE = [
  "/", // главная страница
  "/index.html",
  "/brand/index.html",
  "/assets/favicon.png",
  "/assets/logo_neon_holo.png",
  "/assets/logo_primary.png",
  "/assets/logo_white_mono.png",
  "/assets/qr_neon.png",
  "/assets/qr_flat.png",
  "/bundle.js",
  "/styles.css",
];

// 🧱 Установка Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching app shell...");
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ⚡ Активация и очистка старого кэша
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("🧹 Clearing old cache:", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 🚀 Интерсепт всех запросов
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Если есть в кэше — возвращаем
      if (response) return response;

      // Если нет — тянем из сети и кэшируем
      return fetch(event.request)
        .then((res) => {
          if (!res || res.status !== 200 || res.type !== "basic") return res;

          const responseToCache = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return res;
        })
        .catch(() => caches.match("/index.html")); // fallback
    })
  );
});
