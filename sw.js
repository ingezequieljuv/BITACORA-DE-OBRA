// Guarda la bitácora en el teléfono para que abra sin señal en la obra.
const CACHE = "bitacora-v5";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon.svg", "icon-180.png", "icon-192.png",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js", "logo-juvisa.jpg", "ver.html", "og.jpg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Red primero (para recibir mejoras), y si no hay señal, la copia guardada.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  // Solo la app y sus librerías; los registros compartidos, GitHub y los mapas van directo a internet.
  if (u.origin !== location.origin && !/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.host)) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});
