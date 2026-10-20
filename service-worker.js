/* ============================================================
   SERVICE WORKER — Cache offline per PWA
   Estratègia: xarxa primer (per tenir sempre la versio mes nova)
   i cache com a còpia de seguretat offline.
   ============================================================ */

const CACHE_NAME = 'aventura-palabras-v3';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/estilos.css',
  './css/animaciones.css',
  './css/medallas.css',
  './js/config.js',
  './js/state.js',
  './js/audio.js',
  './js/musica.js',
  './js/fondos.js',
  './js/jugadores.js',
  './js/tablero.js',
  './js/generador_offline.js',
  './js/banco_preguntas.js',
  './js/preguntas.js',
  './js/progreso.js',
  './js/medallas.js',
  './js/online.js',
  './js/pwa.js',
  './js/editor.js',
  './js/ui.js',
  './js/game.js',
  './js/main.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS).catch(err => console.warn('Cache parcial', err)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Només gestiona peticions locals (les online les ignora)
  if (!event.request.url.startsWith(self.location.origin)) return;
  if (event.request.method !== 'GET') return;

  // XARXA PRIMERA: si hi ha internet, sempre la versio mes nova
  // (i es va posant al dia la cache de pas)
  event.respondWith(
    fetch(event.request).then(response => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => {
      // Sense internet → la cache; si tampoc hi és, pantalla inicial
      return caches.match(event.request).then(cached => {
        return cached || caches.match('./index.html');
      });
    })
  );
});
