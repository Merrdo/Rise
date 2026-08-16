
https://merrdo.github.io/Rise/

# Günlük Planlayıcı — PWA

Derleme (build) aracı gerekmeyen, doğrudan GitHub Pages'te çalışan statik bir PWA.

## Dosyalar
- `index.html` — **tek dosyalık uygulama.** React/ReactDOM/lucide-react'i CDN'den (esm.sh) modül olarak yükler, JSX'i Babel standalone ile tarayıcıda anlık çevirir. Bileşenin tüm kodu bu dosyanın içine gömülüdür.
- `manifest.webmanifest` — PWA meta bilgisi (isim, renkler, ikonlar).
- `sw.js` — service worker; app kabuğunu **ve** React/ReactDOM/lucide-react/Babel/Font gibi CDN kaynaklarını önbelleğe alır.
- `icons/` — uygulama ikonları (192, 512, maskable 512).

## Çevrimdışı (offline) çalışma — nasıl işliyor?
Herhangi bir web uygulamasında olduğu gibi **ilk açılış internet gerektirir** (dosyaları ve CDN kütüphanelerini indirmek için). `sw.js` bu ilk açılışta indirilen her şeyi (React, ReactDOM, lucide-react, Babel, fontlar dahil) otomatik olarak önbelleğe alır. Bundan sonra:
- Uçak modunda / internetsiz açtığınızda uygulama önbellekten çalışır.
- "Ana ekrana ekle" ile kurduğunuzda tam ekran, internetsiz açılan gerçek bir uygulama gibi davranır.

Önbelleği temizlerseniz (tarayıcı verilerini silme, vs.) bir sonraki açılışta yine internet gerekir.

## GitHub Pages'e yayınlama
1. Bu klasördeki tüm dosyaları bir GitHub reposuna yükleyin (kök dizine veya `/docs` klasörüne).
2. Repo → **Settings → Pages** → "Build and deployment" → **Source: Deploy from a branch** seçin, ilgili branch/klasörü işaretleyip kaydedin.
3. Birkaç dakika içinde `https://kullanici-adiniz.github.io/repo-adi/` adresinden erişilebilir olur.
4. Telefonda bu adresi açıp (internetliyken, en az bir kez) tarayıcı menüsünden **"Ana ekrana ekle" / "Add to Home Screen"** diyin — sonrasında internetsiz de çalışır.

> Not: GitHub Pages HTTPS ile servis eder, bu yüzden service worker ve "ana ekrana ekleme" sorunsuz çalışır.

## Önemli notlar
- **Veri saklama:** Orijinal Claude Artifact'teki `window.storage` API'si burada **localStorage** ile taklit edildi (`index.html` başındaki shim). Veriler yalnızca o tarayıcıda/cihazda saklanır; cihazlar arası senkronizasyon yoktur.
- **localStorage limiti:** Tarayıcılar genelde ~5-10 MB localStorage sınırı koyar. Spor hareketlerine çok sayıda büyük video/görsel eklerseniz bu sınıra takılabilirsiniz.
- **İkonlar:** `icons/` klasöründeki 3 PNG basit, uygulamanın renk paletiyle uyumlu placeholder ikonlardır — dilerseniz kendi logonuzla değiştirebilirsiniz (aynı dosya adları ve boyutları kullanmanız yeterli).

## Yerelde test etme
Modül importları (`type="module"`) `file://` üzerinden çalışmadığı için basit bir yerel sunucu gerekir:
```bash
npx serve .
# veya
python3 -m http.server 8080
```
