/* global caches, fetch, self, setTimeout, URL */

const CACHE_PREFIX = "merodin-public-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const OFFLINE_PAGE = "/offline.html";
const PUBLIC_PAGE =
  /^\/$|^\/(?:calendar|nepali-calendar|bs-to-ad|ad-to-bs|date-converter|calculators|festivals|holidays)\/?$|^\/(?:calculators|festivals|holidays)\/[a-z0-9-]+\/?$/;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll([
          OFFLINE_PAGE,
          "/icon.svg",
          "/icon-192.png",
          "/icon-512.png",
        ]),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (
    url.pathname.startsWith("/_next/static/") ||
    /^\/icon(?:-\d+)?\.(?:png|svg)$/.test(url.pathname) ||
    url.pathname === OFFLINE_PAGE
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      }),
    );
    return;
  }

  if (
    request.mode !== "navigate" ||
    url.search ||
    !PUBLIC_PAGE.test(url.pathname)
  ) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const response = await Promise.race([
          fetch(request),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Navigation timed out")), 3500),
          ),
        ]);
        if (
          response.ok &&
          response.headers.get("content-type")?.includes("text/html")
        ) {
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        return (
          (await cache.match(request)) ?? (await cache.match(OFFLINE_PAGE))
        );
      }
    }),
  );
});
