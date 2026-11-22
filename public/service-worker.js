const CACHE_NAME = "pave-static-v2",
  OFFLINE_URL = "/offline.html";
const PRECACHE = [
  OFFLINE_URL,
  "/offline.js",
  "/icons/pave-192.png",
  "/icons/pave-512.png",
  "/icons/pave-512-maskable.png",
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)),
  );
});
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") event.waitUntil(self.skipWaiting());
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const current = await caches.open(CACHE_NAME);
      for (const key of keys.filter(
        (name) => name.startsWith("pave-static-") && name !== CACHE_NAME,
      )) {
        const old = await caches.open(key);
        for (const request of await old.keys()) {
          if (!(await current.match(request))) {
            const response = await old.match(request);
            if (response) await current.put(request, response);
          }
        }
        await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(
        async () => (await caches.match(OFFLINE_URL)) || Response.error(),
      ),
    );
    return;
  }
  const path = url.pathname;
  const staticAsset =
    path.startsWith("/assets/") ||
    [
      "/favicon.svg",
      "/pave-logo.png",
      "/icons/pave-192.png",
      "/icons/pave-512.png",
      "/icons/pave-512-maskable.png",
    ].includes(path);
  if (!staticAsset) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok && response.type === "basic")
          await cache.put(request, response.clone());
        return response;
      } catch {
        return Response.error();
      }
    })(),
  );
});
