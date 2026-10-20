/* ============================================================
   PWA.JS — Service Worker i instal·lació com a app
   ============================================================ */

let deferredPrompt = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log('✅ Service Worker registrat'))
      .catch(err => console.warn('⚠️ Error Service Worker:', err));
  });
}

// Detecta si es pot instal·lar com a app
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  mostrarBotoInstalar();
});

function mostrarBotoInstalar() {
  // Afegeix botó d'instal·lar al menú principal
  const menu = document.querySelector('#startScreen .menu-row');
  if (!menu || document.getElementById('installBtn')) return;

  const btn = document.createElement('button');
  btn.className = 'small-btn';
  btn.id = 'installBtn';
  btn.textContent = '📲 Instal·lar com a app';
  btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      UI.toast('🎉 Instal·lat! Busca-ho al teu escriptori', 'success');
    }
    deferredPrompt = null;
    btn.remove();
  });
  menu.appendChild(btn);
}

// Detecta si ja està instal·lada
window.addEventListener('appinstalled', () => {
  UI.toast('🎉 Aventura instal·lada! Ja pots obrir-la des de l\'escriptori', 'success');
});

// Mostra si està en mode standalone (app instal·lada)
if (window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true) {
  document.body.classList.add('standalone');
}
