// Guarda la app de compactación en el dispositivo para que abra sin señal.
const CACHE = "compactacion-v1";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("compactacion-") && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Red primero (para recibir mejoras); sin señal, la copia guardada.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin && !/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.host)) return;
  if (u.origin === location.origin && !u.pathname.includes("/compactacion/")) return;
  e.respondWith(
    fetch(u.origin === location.origin ? new Request(e.request, { cache: "no-cache" }) : e.request).then(r => {
      if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html")))
  );
});
