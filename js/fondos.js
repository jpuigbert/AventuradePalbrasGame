/* ============================================================
   FONDOS.JS — 5 fons dinàmics per el joc
   ============================================================ */

const Fondos = (() => {
  const FONDOS = [
    { id: 'cielo',    label: '☁️ Cielo',        cssClass: 'fondo-cielo',    color: '#87CEEB' },
    { id: 'bosque',   label: '🌲 Bosque',       cssClass: 'fondo-bosque',   color: '#2E8B57' },
    { id: 'mar',      label: '🌊 Mar',          cssClass: 'fondo-mar',      color: '#1E90FF' },
    { id: 'desierto', label: '🏜️ Desierto',     cssClass: 'fondo-desierto', color: '#ECAA55' },
    { id: 'espacio',  label: '🚀 Espacio',      cssClass: 'fondo-espacio',  color: '#2b1b52' }
  ];

  function apply(id) {
    const f = FONDOS.find(x => x.id === id) || FONDOS[0];
    FONDOS.forEach(x => document.body.classList.remove(x.cssClass));
    document.body.classList.add(f.cssClass);
    State.settings.fondo = f.id;
    State.saveSettings();
    Progreso.markFondoUsed(f.id);   // per la medalla Explorador
  }

  return {
    list: FONDOS,
    apply,
    applySaved() { apply(State.settings.fondo); }
  };
})();
