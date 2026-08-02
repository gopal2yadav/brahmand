const CACHE = "brahmand-v1";
const CORE = [
  "/", "/index.html", "/ask-bhagwan.html", "/bhagavad-gita.html", "/vedas.html",
  "/puranas.html", "/upanishads.html", "/scriptures.html", "/meditation.html",
  "/daily-wisdom.html", "/cosmic-dashboard.html", "/community.html", "/about.html",
  "/privacy.html", "/terms.html", "/404.html", "/assets/css/styles.css",
  "/assets/js/app.js", "/assets/images/shiva-cosmic-hero.webp",
  "/assets/images/shiva-cosmic-card.webp", "/data/scriptures.json", "/favicon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).pathname.startsWith("/api/")) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match("/404.html")))
  );
});
