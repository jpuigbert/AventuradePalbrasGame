/* ============================================================
   MAIN.JS — Punt d'entrada: inicialitza tots els mòduls
   ============================================================ */

(function initApp() {
  // 1. Configuració desada (sons, música, fons, llargada)
  State.loadSettings();

  // 2. Aplica el fons triat la última vegada
  Fondos.applySaved();

  // 3. Marca les medalles que ja estaven disponibles (per dades antigues)
  const pending = Medallas.evaluateAll();
  if (pending.length) console.log('Medalles ja disponibles:', pending.map(m => m.name));

  // 4. Munt la interfície i els esdeveniments
  UI.init();

  // 5. Si la música estava activada, arrenca després del primer clic
  //    (els navegadors bloquegen l'àudio abans d'un gest de l'usuari)
  if (State.settings.musicOn) {
    window.addEventListener('pointerdown', function startMusic() {
      Audio.unlock();
      Musica.start();
      UI.updateAudioButtons();
      window.removeEventListener('pointerdown', startMusic);
    }, { once: true });
  }

  console.log('%c🌈 Aventura de Palabras llesta! Offline:', 'color:#FF6B9D;font-weight:bold', navigator.onLine ? 'NO' : 'SÍ');
})();
