/* ============================================================
   ONLINE.JS — Cerca de preguntes a una API HTTP/HTTPS (OPCIONAL)
   Per defecte: Open Trivia DB en castellà; l'usuari pot posar la
   URL que vulga (camp prop de l'editor).
   Si no hi ha internet, falla silenciosament: el joc segueix offline.
   ============================================================ */

const Online = (() => {
  // api_sp.php = versio en CASTELLA de Open Trivia DB (api.php retorna anglès)
  const DEFAULT_BASE = 'https://opentdb.com/api_sp.php';
  // Categoria 18 = "General Knowledge" — la mes apta per a ninos
  const DEFAULT_URLS = (amount) => [
    `${DEFAULT_BASE}?category=18&amount=${amount}&type=multiple`,
    `${DEFAULT_BASE}?amount=${amount}&type=multiple`
  ];

  // Decodifica entitats HTML (&quot;, &aacute;, &laquo;...) sense injectar res al DOM
  const ENTITIES = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
    '&apos;': "'", '&#039;': "'", '&nbsp;': ' '
  };
  const htmlParser = ('DOMParser' in window) ? new DOMParser() : null;

  function decode(str) {
    const s = String(str);
    if (htmlParser) {
      // parsejat a document aïllat (mai tocat el document real) i en llig el text pla
      try {
        return htmlParser.parseFromString(s.replace(/</g, '&lt;'), 'text/html')
                                        .documentElement.textContent;
      } catch (e) { /* si falla, caiguem a la taula bàsica */ }
    }
    return s.replace(/&(?:#(\d+)|[a-zA-Z0-9]+);/g, (m, num) => {
      if (num) return String.fromCharCode(parseInt(num, 10));
      return ENTITIES[m] !== undefined ? ENTITIES[m] : m;
    });
  }

  function fetchWithTimeout(url, ms = 6000) {
    const ctrl = ('AbortController' in window) ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), ms) : null;
    return fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(r => {
      if (timer) clearTimeout(timer);
      return r;
    });
  }

  function request(url) {
    return fetchWithTimeout(url)
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(json => {
        const list = parseJson(json);
        if (!list.length) throw new Error('buit');
        return list;
      });
  }

  /* Detecta el format del JSON i el converteix a preguntes del joc */
  function parseJson(json) {
    if (!json) return [];
    const raw = Array.isArray(json) ? json
              : (json.results || json.questions || json.data || json.trivia_questions || []);
    return raw.map(normalizeItem).filter(Boolean);
  }

  /* Un item de qualsevol API → format del joc (text + options + correct) */
  function normalizeItem(item) {
    if (!item || typeof item !== 'object') return null;
    const text = decode(item.question || item.text || item.pregunta || '');
    if (!text) return null;

    let options, correctValue;
    if (Array.isArray(item.incorrect_answers)) {           // format Open Trivia DB
      correctValue = decode(item.correct_answer);
      options = item.incorrect_answers.map(decode);
      options.push(correctValue);
      for (let i = options.length - 1; i > 0; i--) {       // barreja
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
    } else {
      options = (item.options || item.answers || item.opcions || item.choices || []).map(decode);
      correctValue = item.correct !== undefined ? item.correct
                   : item.answer !== undefined ? item.answer
                   : item.resposta;
    }
    if (options.length < 2) return null;

    // `correct` pot ser un índex (number) o el valor de la resposta (string)
    let correct = 0;
    if (typeof correctValue === 'number') {
      correct = Math.max(0, Math.min(correctValue, options.length - 1));
    } else if (typeof correctValue === 'string') {
      const i = options.indexOf(decode(correctValue));
      if (i >= 0) correct = i;
    }

    return { category: 'comunicacion', text, options, correct, source: 'online' };
  }

  function isValidUrl(u) {
    return /^https?:\/\/.{4,}/i.test(u);
  }

  /* Cerca `amount` preguntes. Si `customUrl` ve donat (i és vàlid) s'usa
     eixa URL; si no, es prova la d'Open Trivia per defecte en castellà. */
  function search(amount = 5, customUrl = '') {
    if (!('fetch' in window)) return Promise.reject(new Error('Sense fetch'));

    const u = String(customUrl || '').trim();

    if (u && u !== DEFAULT_BASE && !u.startsWith(DEFAULT_BASE + '?')) {
      // URL totalment personalitzada de l'usuari
      if (!isValidUrl(u)) return Promise.reject(new Error('URL no vàlida'));
      return request(u);
    }

    // Per defecte (o URL parcial de opentdb sense paràmetres): prova amb/sense categoria
    return request(DEFAULT_URLS(amount)[0]).catch(() => request(DEFAULT_URLS(amount)[1]));
  }

  return { search, DEFAULT_BASE, isValidUrl };
})();
