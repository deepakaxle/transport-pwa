// sw.js — GitHub Pages friendly PWA SW
const CACHE_NAME = "transport-cache-v2"; // bump when you change this file
const CACHE_NAME = "transport-cache-v2";
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./offline.html",
  "./styles/app.css",
  "./scripts/app.js",
  "./manifest.webmanifest"
];


self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((n) => (n !== CACHE_NAME ? caches.delete(n) : null)))
    )
  );
  self.clients.claim();
});

// Prefer: offline fallback for navigations; cache-first for assets
self.addEventListener("fetch", (event) => {
  // Navigation requests → offline.html fallback
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./offline.html"))
    );
    return;
  }

  // Other requests → cache-first, then network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return res;
      });
    })
  );
});
