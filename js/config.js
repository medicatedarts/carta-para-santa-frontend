// js/config.js
// Constantes y utilidades compartidas por todas las páginas. Los límites deben ser
// los mismos de carta-para-santa-backend/validate.js (con ellos cada carta cabe en una hoja).

(function () {
  var local = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(location.hostname) || location.protocol === 'file:';

  var CPS = {
    BACKEND_URL: local ? 'http://localhost:4000' : 'https://api.cartaparasanta.com',
    CONTACT_EMAIL: 'hola@cartaparasanta.com',
    // Días hábiles entre el pago y la llegada (Lob imprime en 1–2 días y USPS First Class tarda 3–5).
    DELIVERY_TEXT: '4 a 7 días hábiles',
    DRAFT_KEY: 'cps_borrador',

    DESIGNS: [
      { id: 'clasica', name: 'Correo aéreo clásico', blurb: 'Rayas rojas y verdes, sellos del Polo Norte' },
      { id: 'taller', name: 'Taller de los duendes', blurb: 'Madera, guirnaldas y lucecitas' },
      { id: 'estrellas', name: 'Noche de estrellas', blurb: 'Pingüinos, galletas y estrellas' },
      { id: 'polonorte', name: 'Cielo del Polo Norte', blurb: 'Adornos colgantes y nieve' },
      { id: 'juguetes', name: 'Juguetes en acuarela', blurb: 'Juguetes pintados a mano' },
      { id: 'duendes', name: 'Duendes y renos', blurb: 'Duendes traviesos, renos y luces' },
      { id: 'dulces', name: 'Dulces navideños', blurb: 'Roscón, galletas y turrones' },
      { id: 'cascanueces', name: 'El cascanueces', blurb: 'Soldaditos, tambores y bailarina' }
    ],

    LIMITS: { childName: 30, greeting: 40, message: 700, gifts: 12, gift: 60, farewell: 40, signature: 30, ageMin: 1, ageMax: 17 },

    IDEAS: ['Este año me porté muy bien.', 'Ayudé mucho en casa.', 'Aprendí algo nuevo en la escuela.', '¿Cómo están los renos?', 'Te dejaré galletas y leche.'],

    emptyDraft: function () {
      return { step: 1, design: 'clasica', childName: '', childAge: '', greeting: 'Querido Santa:', message: '', gifts: [], giftDraft: '', farewell: 'Con mucho cariño,', signature: '' };
    },

    // Combo de hermanitos: hasta MAX_LETTERS cartas en una compra (la primera a precio normal
    // y las demás a precio de hermanito). Debe coincidir con MAX_LETTERS_PER_ORDER del backend;
    // el backend manda el valor real en /api/config (maxLetters).
    MAX_LETTERS: 4,
    LETTERS_KEY: 'cps_cartas',

    // Las cartas viven solo en este navegador hasta que el adulto paga:
    // { list: [borrador, …], active: índice de la que se está escribiendo }.
    // Antes del combo había un solo borrador en DRAFT_KEY; si existe, se convierte.
    _readLetters: function () {
      var store = null;
      try { store = JSON.parse(localStorage.getItem(CPS.LETTERS_KEY) || 'null'); } catch (e) {}
      if (!store || !Array.isArray(store.list)) {
        store = { list: [], active: 0 };
        try {
          var old = JSON.parse(localStorage.getItem(CPS.DRAFT_KEY) || 'null');
          if (old) store.list.push(old);
        } catch (e) {}
      }
      store.list = store.list.slice(0, CPS.MAX_LETTERS).map(function (d) {
        return Object.assign(CPS.emptyDraft(), d, { gifts: Array.isArray(d.gifts) ? d.gifts.slice(0, CPS.LIMITS.gifts) : [] });
      });
      if (!(store.active >= 0 && store.active < store.list.length)) store.active = 0;
      return store;
    },
    _writeLetters: function (store) {
      try {
        localStorage.setItem(CPS.LETTERS_KEY, JSON.stringify(store));
        localStorage.removeItem(CPS.DRAFT_KEY);
      } catch (e) { /* modo privado: seguimos sin guardar */ }
    },
    loadLetters: function () { return CPS._readLetters(); },
    // ¿La carta tiene algo que enviar? (mensaje o al menos un regalo)
    letterReady: function (d) { return !!(d && (String(d.message || '').trim() || (d.gifts || []).length)); },
    // Añade una carta vacía y la deja activa. Devuelve su índice o -1 si ya hay el máximo.
    addLetter: function () {
      var store = CPS._readLetters();
      if (store.list.length >= CPS.MAX_LETTERS) return -1;
      var d = CPS.emptyDraft();
      // El diseño de la carta anterior como punto de partida (se puede cambiar en el paso 1).
      if (store.list.length) d.design = store.list[store.list.length - 1].design;
      store.list.push(d);
      store.active = store.list.length - 1;
      CPS._writeLetters(store);
      return store.active;
    },
    setActiveLetter: function (i) {
      var store = CPS._readLetters();
      if (i >= 0 && i < store.list.length) { store.active = i; CPS._writeLetters(store); }
    },
    removeLetter: function (i) {
      var store = CPS._readLetters();
      if (i < 0 || i >= store.list.length) return;
      store.list.splice(i, 1);
      if (store.active >= store.list.length) store.active = Math.max(0, store.list.length - 1);
      CPS._writeLetters(store);
    },
    // Total de lista de N cartas: la primera a precio normal y las demás a precio de hermanito.
    lettersTotal: function (cfg, n) {
      if (!cfg || !n) return 0;
      var extra = Math.min(cfg.extraPriceCents > 0 ? cfg.extraPriceCents : cfg.priceCents, cfg.priceCents);
      return cfg.priceCents + extra * (n - 1);
    },

    // La carta que se está escribiendo (carta.html la usa como antes).
    loadDraft: function () {
      var store = CPS._readLetters();
      return store.list.length ? store.list[store.active] : null;
    },
    saveDraft: function (d) {
      var store = CPS._readLetters();
      if (!store.list.length) store.list.push(d); else store.list[store.active] = d;
      CPS._writeLetters(store);
    },
    // Después de pagar: se borran todas las cartas de este dispositivo.
    clearDraft: function () {
      try { localStorage.removeItem(CPS.DRAFT_KEY); localStorage.removeItem(CPS.LETTERS_KEY); } catch (e) {}
    },

    designName: function (id) {
      var d = CPS.DESIGNS.filter(function (x) { return x.id === id; })[0];
      return d ? d.name : CPS.DESIGNS[0].name;
    },

    introLine: function (name, age) {
      name = (name || '').trim();
      age = String(age || '').trim();
      if (name && age) return 'Me llamo ' + name + ' y tengo ' + age + ' años.';
      if (name) return 'Me llamo ' + name + '.';
      if (age) return 'Tengo ' + age + ' años.';
      return '';
    },

    money: function (cents, currency) {
      try {
        return new Intl.NumberFormat('es-PR', { style: 'currency', currency: (currency || 'usd').toUpperCase() }).format(cents / 100);
      } catch (e) { return '$' + (cents / 100).toFixed(2); }
    },

    // "2026-12-10" → "10 de diciembre" (sin convertir zonas horarias).
    longDate: function (iso) {
      var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
      if (!m) return '';
      var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      return Number(m[3]) + ' de ' + meses[Number(m[2]) - 1];
    },

    _config: null,
    getConfig: function () {
      if (!CPS._config) {
        CPS._config = fetch(CPS.BACKEND_URL + '/api/config')
          .then(function (r) { if (!r.ok) throw new Error('config'); return r.json(); })
          .catch(function () { CPS._config = null; return null; });
      }
      return CPS._config;
    },

    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
  };

  // Clic de un anuncio de Meta: si la URL trae ?fbclid=..., se guarda SOLO en este
  // navegador (almacenamiento propio, no es una cookie de terceros ni código de Meta) y
  // se manda al backend únicamente cuando el adulto paga, para saber qué anuncio funcionó.
  // Se borra solo a los 90 días. Ver privacidad.html §5 y metaCapi.js en el backend.
  var FBC_KEY = 'cps_fbc';
  var FBC_DAYS = 90;
  try {
    var fbclid = new URLSearchParams(location.search).get('fbclid');
    if (fbclid && /^[A-Za-z0-9_\-.]{8,250}$/.test(fbclid)) {
      localStorage.setItem(FBC_KEY, JSON.stringify({ v: 'fb.1.' + Date.now() + '.' + fbclid, t: Date.now() }));
    }
  } catch (e) { /* modo privado: seguimos sin guardar */ }
  CPS.getFbc = function () {
    try {
      var saved = JSON.parse(localStorage.getItem(FBC_KEY) || 'null');
      if (saved && saved.v && Date.now() - saved.t < FBC_DAYS * 864e5) return saved.v;
      localStorage.removeItem(FBC_KEY);
    } catch (e) {}
    return undefined;
  };

  window.CPS = CPS;
})();
