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
      { id: 'juguetes', name: 'Juguetes en acuarela', blurb: 'Juguetes pintados a mano' }
    ],

    LIMITS: { childName: 30, greeting: 40, message: 700, gifts: 12, gift: 60, farewell: 40, signature: 30, ageMin: 1, ageMax: 17 },

    IDEAS: ['Este año me porté muy bien.', 'Ayudé mucho en casa.', 'Aprendí algo nuevo en la escuela.', '¿Cómo están los renos?', 'Te dejaré galletas y leche.'],

    emptyDraft: function () {
      return { step: 1, design: 'clasica', childName: '', childAge: '', greeting: 'Querido Santa:', message: '', gifts: [], giftDraft: '', farewell: 'Con mucho cariño,', signature: '' };
    },

    // El borrador vive solo en este navegador hasta que el adulto paga.
    loadDraft: function () {
      try {
        var raw = localStorage.getItem(CPS.DRAFT_KEY);
        if (!raw) return null;
        var d = JSON.parse(raw);
        return Object.assign(CPS.emptyDraft(), d, { gifts: Array.isArray(d.gifts) ? d.gifts.slice(0, CPS.LIMITS.gifts) : [] });
      } catch (e) { return null; }
    },
    saveDraft: function (d) {
      try { localStorage.setItem(CPS.DRAFT_KEY, JSON.stringify(d)); } catch (e) { /* modo privado: seguimos sin guardar */ }
    },
    clearDraft: function () {
      try { localStorage.removeItem(CPS.DRAFT_KEY); } catch (e) {}
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

  window.CPS = CPS;
})();
