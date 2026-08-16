const CACHE_NAME = "planlayici-cache-v2";

// Aynı köken (GitHub Pages) dosyaları — kurulum sırasında önden önbelleğe alınır.
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Tüm GET isteklerini (kendi dosyalarımız + React/ReactDOM/lucide-react/Babel/Font
// gibi dış CDN kaynakları dahil) "önce ağ, başarısız olursa önbellek" stratejisiyle
// işleriz ve başarılı her yanıtı önbelleğe yazarız. Böylece uygulama bir kez
// (internetli) açıldıktan sonra sonraki açılışlarda tamamen çevrimdışı çalışabilir.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        // Sadece geçerli/başarılı yanıtları önbelleğe alalım.
        if (res && (res.ok || res.type === "opaque")) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Navigasyon isteği (sayfa açma) ve önbellekte hiçbir şey yoksa,
          // en azından uygulama kabuğunu göstermeyi dene.
          if (event.request.mode === "navigate") return caches.match("./index.html");
          return Response.error();
        })
      )
  );
});
