// js/pueblo.js
// Dibuja la portada: estrellas, montañas, el pueblo del Polo Norte (capa fija con
// efecto acuarela) y encima la capa viva (duendes, renos, humo, luces), más la nieve.
// La capa fija lleva el filtro de acuarela y no se anima: así el navegador no tiene que
// recalcular el filtro en cada cuadro y la animación va fluida en el celular.
(function () {
  var hero = document.querySelector('.hero');
  if (!hero) return;
  var NS = 'http://www.w3.org/2000/svg';
  var W = 1440, H = 340;

  // ---------- utilidades ----------
  function hex(c) { c = c.replace('#', ''); return [parseInt(c.substr(0, 2), 16), parseInt(c.substr(2, 2), 16), parseInt(c.substr(4, 2), 16)]; }
  function shade(c, p) {
    var r = hex(c).map(function (v) { return Math.max(0, Math.min(255, Math.round(p < 0 ? v * (1 + p) : v + (255 - v) * p))); });
    return '#' + r.map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join('');
  }
  function f(n) { return Math.round(n * 10) / 10; }
  var seed = 7;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }

  function svg(viewBox, aspect, inner) {
    return '<svg xmlns="' + NS + '" viewBox="' + viewBox + '" preserveAspectRatio="' + aspect + '" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }
  function capa(cls, html) {
    var d = document.createElement('div');
    d.className = 'capa ' + cls;
    d.innerHTML = html;
    hero.insertBefore(d, hero.firstChild);
    return d;
  }

  // Filtro acuarela: bordes irregulares + pigmento desigual. Solo se usa en capas fijas.
  var ACUARELA =
    '<filter id="ID" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="n"/>' +
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="SC" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="9" result="g"/>' +
    '<feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.55 1.12" result="ga"/>' +
    '<feComposite in="d" in2="ga" operator="in"/>' +
    '</filter>';
  function filtro(id, sc) { return ACUARELA.replace('ID', id).replace('SC', sc); }

  // ---------- estrellas ----------
  var est = '';
  for (var i = 0; i < 46; i++) {
    var x = rnd() * 1440, y = rnd() * 300, r = 0.6 + rnd() * 1.5;
    est += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + f(r) + '" fill="#FFF8E7"' +
      (i % 3 === 0 ? ' class="tw" style="animation-delay:-' + f(Math.round(rnd() * 6) / 2) + 's"' : ' opacity="' + f(0.35 + rnd() * 0.5) + '"') + '/>';
  }
  var estrellasEl = capa('capa-estrellas', svg('0 0 1440 360', 'xMidYMin slice', est));
  estrellasEl.querySelector('svg').style.overflow = 'hidden';

  // ---------- montañas (fijas, acuarela) ----------
  var mont =
    '<defs>' + filtro('wcm', 9) +
    '<linearGradient id="m1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCE9F3"/><stop offset="1" stop-color="#9DBBD6"/></linearGradient>' +
    '<linearGradient id="m2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF5FA"/><stop offset="1" stop-color="#BCD3E6"/></linearGradient></defs>' +
    '<g filter="url(#wcm)">' +
    '<path d="M0 250 L110 170 L190 214 L320 120 L440 210 L560 150 L690 230 L820 132 L960 214 L1090 140 L1210 206 L1330 158 L1440 214 L1440 400 L0 400 Z" fill="url(#m1)" opacity=".8"/>' +
    '<path d="M320 120 L294 148 L314 142 L330 156 L346 138 L360 146 Z M820 132 L794 160 L812 154 L828 168 L844 150 L858 158 Z M1090 140 L1066 166 L1084 160 L1098 172 L1112 156 L1126 162 Z" fill="#FFFFFF" opacity=".9"/>' +
    '<path d="M0 280 C 160 236, 300 262, 460 246 S 760 214, 940 248 S 1240 228, 1440 252 L1440 400 L0 400 Z" fill="url(#m2)"/>' +
    '</g>';
  capa('capa-montes', svg('0 0 1440 400', 'xMidYMax slice', mont));

  // ---------- pueblo ----------
  var cabins = [
    { x: 70, y: 196, w: 104, h: 62, c: '#8F5A3C', back: 1 },
    { x: 412, y: 192, w: 112, h: 66, c: '#A24A31', back: 1 },
    { x: 760, y: 190, w: 96, h: 58, c: '#8A573A', back: 1 },
    { x: 1150, y: 194, w: 116, h: 66, c: '#9B4E33', back: 1 },
    { x: 165, y: 262, w: 160, h: 98, c: '#B3452F' },
    { x: 545, y: 266, w: 150, h: 92, c: '#8E5638', taller: 1 },
    { x: 1235, y: 262, w: 152, h: 96, c: '#9A5A38' }
  ];
  var trees = [
    { x: 300, y: 196, h: 78, back: 1 }, { x: 560, y: 192, h: 70, back: 1 }, { x: 640, y: 190, h: 86, back: 1 },
    { x: 1050, y: 190, h: 92, back: 1 }, { x: 1320, y: 194, h: 82, back: 1 }, { x: 20, y: 196, h: 70, back: 1 },
    { x: 40, y: 262, h: 128 }, { x: 368, y: 264, h: 146 }, { x: 470, y: 266, h: 104 }, { x: 728, y: 266, h: 118 },
    { x: 870, y: 264, h: 156 }, { x: 990, y: 272, h: 182, big: 1 }, { x: 1112, y: 264, h: 132 }, { x: 1415, y: 262, h: 150 }
  ];

  var vida = ''; // lo que se anima, en la capa de arriba (mismas coordenadas)

  function cabin(o) {
    var x = o.x, y = o.y, w = o.w, h = o.h, c = o.c, rh = h * 0.6, ov = 12, px = x + w / 2;
    var dark = shade(c, -0.3), s = '';
    var chx = x + w * 0.66, chw = w * 0.12, cht = y - h - rh * 0.72;
    s += '<rect x="' + f(chx) + '" y="' + f(cht) + '" width="' + f(chw) + '" height="' + f(rh * 0.8) + '" fill="#7A4535" stroke="#4E2A20" stroke-opacity=".4"/>';
    s += '<rect x="' + f(chx - 3) + '" y="' + f(cht - 6) + '" width="' + f(chw + 6) + '" height="8" rx="4" fill="#F7FAFC"/>';
    s += '<rect x="' + x + '" y="' + f(y - h) + '" width="' + w + '" height="' + h + '" fill="' + c + '" stroke="' + dark + '" stroke-opacity=".5" stroke-width="2"/>';
    s += '<rect x="' + x + '" y="' + f(y - h) + '" width="' + w + '" height="' + f(h * 0.45) + '" fill="' + shade(c, 0.12) + '" opacity=".5"/>';
    for (var i = 1; i < 6; i++) s += '<line x1="' + x + '" x2="' + (x + w) + '" y1="' + f(y - h + i * h / 6) + '" y2="' + f(y - h + i * h / 6 + 1.5) + '" stroke="' + dark + '" stroke-opacity=".35" stroke-width="1.6"/>';
    s += '<path d="M' + (x - ov) + ' ' + f(y - h + 4) + ' L' + f(px) + ' ' + f(y - h - rh) + ' L' + (x + w + ov) + ' ' + f(y - h + 4) + ' Z" fill="#6A372A"/>';
    // techo de nieve con goteras
    var d = 'M' + (x - ov - 5) + ' ' + f(y - h + 3) + ' L' + f(px) + ' ' + f(y - h - rh - 7) + ' L' + (x + w + ov + 5) + ' ' + f(y - h + 3);
    var steps = 7, sw = (w + 2 * ov + 10) / steps;
    for (var k = 0; k < steps; k++) {
      var xa = x + w + ov + 5 - k * sw;
      d += ' Q' + f(xa - sw * 0.25) + ' ' + f(y - h + 9 + (k % 2) * 6) + ' ' + f(xa - sw * 0.5) + ' ' + f(y - h + 4) + ' Q' + f(xa - sw * 0.75) + ' ' + f(y - h + 7) + ' ' + f(xa - sw) + ' ' + f(y - h + 3);
    }
    s += '<path d="' + d + ' Z" fill="#F7FAFC" stroke="#BFD4E6" stroke-width="1.5"/>';
    s += '<path d="M' + f(px) + ' ' + f(y - h - rh - 2) + ' L' + (x + w + ov) + ' ' + f(y - h + 2) + '" stroke="#C9DCEB" stroke-width="5" stroke-opacity=".6"/>';
    // puerta con corona
    var dw = w * 0.2;
    s += '<path d="M' + f(px - dw / 2) + ' ' + y + ' v' + f(-h * 0.52) + ' q' + f(dw / 2) + ' ' + f(-dw * 0.45) + ' ' + f(dw) + ' 0 v' + f(h * 0.52) + 'z" fill="#5A2E1D" stroke="#3C1E13" stroke-opacity=".5"/>';
    s += '<circle cx="' + f(px) + '" cy="' + f(y - h * 0.38) + '" r="' + f(dw * 0.26) + '" fill="none" stroke="#2F6B4A" stroke-width="' + f(dw * 0.13) + '"/>';
    s += '<circle cx="' + f(px) + '" cy="' + f(y - h * 0.38 + dw * 0.26) + '" r="' + f(dw * 0.07) + '" fill="#C8372D"/>';
    // ventanas (vidrio cálido fijo; el halo que respira va en la capa viva)
    var ww = w * 0.2, wh = h * 0.3, wy = y - h * 0.68;
    [x + w * 0.2 - ww / 2, x + w * 0.8 - ww / 2].forEach(function (wx) {
      s += '<rect x="' + f(wx) + '" y="' + f(wy) + '" width="' + f(ww) + '" height="' + f(wh) + '" rx="2" fill="#FFD27A"/>';
      s += '<path d="M' + f(wx + ww / 2) + ' ' + f(wy) + ' v' + f(wh) + ' M' + f(wx) + ' ' + f(wy + wh / 2) + ' h' + f(ww) + '" stroke="#E9D3B0" stroke-width="2.2"/>';
      s += '<rect x="' + f(wx) + '" y="' + f(wy) + '" width="' + f(ww) + '" height="' + f(wh) + '" rx="2" fill="none" stroke="#E9D3B0" stroke-width="3"/>';
      s += '<rect x="' + f(wx - 3) + '" y="' + f(wy + wh) + '" width="' + f(ww + 6) + '" height="5" rx="2.5" fill="#F7FAFC"/>';
      vida += '<circle class="halo" style="animation-delay:-' + f(rnd() * 5) + 's" cx="' + f(wx + ww / 2) + '" cy="' + f(wy + wh / 2) + '" r="' + f(ww * 1.3) + '" fill="url(#halo)"/>';
    });
    s += '<path d="M' + (x - 8) + ' ' + (y + 2) + ' q' + f(w * 0.3) + ' -10 ' + f(w * 0.6) + ' -2 q' + f(w * 0.3) + ' -8 ' + f(w * 0.4 + 16) + ' 2 z" fill="#F7FAFC"/>';
    // humo de la chimenea
    for (var p = 0; p < 3; p++) {
      vida += '<circle class="humo" style="animation-delay:-' + f(p * 2.3 + rnd()) + 's" cx="' + f(chx + chw / 2) + '" cy="' + f(cht - 10) + '" r="' + f(5 + (o.back ? 0 : 2)) + '" fill="#EEF3F8"/>';
    }
    return s;
  }

  function tree(o) {
    var x = o.x, y = o.y, h = o.h, k = o.big ? 5 : 3, trunk = h * 0.1, hc = h - trunk, wb = h * (o.big ? 0.6 : 0.64);
    var seg = hc / (k * 0.72 + 0.28), s = '';
    s += '<rect x="' + f(x - h * 0.04) + '" y="' + f(y - trunk - 2) + '" width="' + f(h * 0.08) + '" height="' + f(trunk + 2) + '" fill="#6B4430"/>';
    var greens = ['#2C6646', '#357A52', '#2A5E41', '#3B8458', '#2E6B49'];
    for (var i = 0; i < k; i++) {
      var yt = y - h + i * seg * 0.72, yb = yt + seg, wi = wb * (0.42 + 0.58 * (i + 1) / k), g = greens[(i + Math.round(x)) % greens.length];
      s += '<path d="M' + f(x) + ' ' + f(yt) + ' L' + f(x + wi / 2) + ' ' + f(yb) + ' Q' + f(x + wi / 4) + ' ' + f(yb + 6) + ' ' + f(x) + ' ' + f(yb - 2) + ' Q' + f(x - wi / 4) + ' ' + f(yb + 6) + ' ' + f(x - wi / 2) + ' ' + f(yb) + ' Z" fill="' + g + '" stroke="' + shade(g, -0.35) + '" stroke-opacity=".45" stroke-width="1.5"/>';
      s += '<path d="M' + f(x) + ' ' + f(yt + 2) + ' L' + f(x - wi * 0.44) + ' ' + f(yb - 2) + ' L' + f(x - wi * 0.1) + ' ' + f(yb - seg * 0.3) + ' Z" fill="' + shade(g, 0.18) + '" opacity=".55"/>';
      s += '<path d="M' + f(x + wi * 0.46) + ' ' + f(yb - 1) + ' Q' + f(x + wi * 0.22) + ' ' + f(yb + 4) + ' ' + f(x) + ' ' + f(yb - 4) + ' Q' + f(x - wi * 0.22) + ' ' + f(yb + 4) + ' ' + f(x - wi * 0.48) + ' ' + f(yb - 1) +
        ' L' + f(x - wi * 0.34) + ' ' + f(yb - seg * 0.2) + ' Q' + f(x) + ' ' + f(yb - seg * 0.08) + ' ' + f(x + wi * 0.32) + ' ' + f(yb - seg * 0.22) + ' Z" fill="#F4F8FB" opacity=".92"/>';
      if (!o.back) {
        // lucecitas que titilan, sobre el borde de cada piso
        var n = o.big ? 6 : 3;
        for (var j = 0; j < n; j++) {
          var t = (j + 0.5) / n, lx = x - wi * 0.42 + wi * 0.84 * t, ly = yb - seg * 0.28 + Math.sin(t * Math.PI) * seg * 0.12;
          var col = ['#F4C74F', '#E5533D', '#7FC4F0', '#8ED07A'][(i + j) % 4];
          vida += '<circle class="luz" style="animation-delay:-' + f(rnd() * 2) + 's" cx="' + f(lx) + '" cy="' + f(ly) + '" r="' + (o.big ? 3.4 : 2.4) + '" fill="' + col + '"/>';
        }
      }
    }
    s += '<path d="M' + f(x) + ' ' + f(y - h - 2) + ' l' + f(-wb * 0.12) + ' ' + f(seg * 0.3) + ' q' + f(wb * 0.12) + ' -' + f(seg * 0.08) + ' ' + f(wb * 0.24) + ' 0 z" fill="#F7FAFC"/>';
    if (o.big) {
      // guirnaldas doradas y adornos fijos
      for (var g2 = 1; g2 < k; g2++) {
        var yy = y - h + g2 * seg * 0.72 + seg * 0.55, ww2 = wb * (0.42 + 0.58 * (g2 + 0.6) / k);
        s += '<path d="M' + f(x - ww2 * 0.38) + ' ' + f(yy - 8) + ' Q' + f(x) + ' ' + f(yy + 10) + ' ' + f(x + ww2 * 0.4) + ' ' + f(yy - 10) + '" fill="none" stroke="#E7C463" stroke-width="2.2" stroke-dasharray="1 5" stroke-linecap="round"/>';
      }
      vida += '<g class="estrella-arbol"><circle cx="' + f(x) + '" cy="' + f(y - h - 6) + '" r="18" fill="url(#halo)"/>' +
        '<path d="M' + f(x) + ' ' + f(y - h - 20) + ' l4.4 9.6 10.4 1.2 -7.8 7 2.2 10.2 -9.2 -5.2 -9.2 5.2 2.2 -10.2 -7.8 -7 10.4 -1.2z" fill="#F4C74F" stroke="#C9973A" stroke-width="1"/></g>';
    }
    return s;
  }

  function regalo(x, y, w, h, c, cinta) {
    return '<rect x="' + f(x) + '" y="' + f(y - h) + '" width="' + w + '" height="' + h + '" rx="2" fill="' + c + '" stroke="' + shade(c, -0.35) + '" stroke-opacity=".5"/>' +
      '<rect x="' + f(x + w / 2 - 2) + '" y="' + f(y - h) + '" width="4" height="' + h + '" fill="' + cinta + '"/>' +
      '<rect x="' + f(x) + '" y="' + f(y - h * 0.62) + '" width="' + w + '" height="3.5" fill="' + cinta + '"/>' +
      '<path d="M' + f(x + w / 2) + ' ' + f(y - h) + ' q-7 -8 -9 -2 q2 4 9 2 q7 -8 9 -2 q-2 4 -9 2z" fill="' + cinta + '"/>';
  }

  function corral(x, y, w) {
    var s = '';
    for (var i = 0; i <= 6; i++) s += '<rect x="' + f(x + i * w / 6) + '" y="' + f(y - 26) + '" width="5" height="28" rx="1.5" fill="#8A5A3A"/><rect x="' + f(x + i * w / 6 - 1) + '" y="' + f(y - 30) + '" width="7" height="5" rx="2.5" fill="#F7FAFC"/>';
    s += '<rect x="' + x + '" y="' + f(y - 21) + '" width="' + w + '" height="4" fill="#9B6A45"/><rect x="' + x + '" y="' + f(y - 11) + '" width="' + w + '" height="4" fill="#9B6A45"/>';
    return s;
  }

  // ---------- duendes y renos (capa viva) ----------
  function elfo(c) {
    // origen = entre los pies; mide ~46 de alto
    var sk = '#F2C7A5';
    return '<g class="paso">' +
      '<g class="pierna"><rect x="-6" y="-15" width="5" height="14" rx="2" fill="#2F6B4A"/><rect x="-6" y="-10" width="5" height="3" fill="#F3EDE2"/><path d="M-8 0 h8 q2 0 1 -3 h-8z" fill="#5A2E1D"/></g>' +
      '<g class="pierna b"><rect x="1" y="-15" width="5" height="14" rx="2" fill="#2F6B4A"/><rect x="1" y="-10" width="5" height="3" fill="#F3EDE2"/><path d="M0 0 h9 q2 0 0 -4 l-1 1 h-8z" fill="#5A2E1D"/></g>' +
      '<g class="brazo"><rect x="-11" y="-29" width="4.5" height="12" rx="2" fill="' + c.tunic + '"/><circle cx="-8.7" cy="-16.5" r="2.4" fill="' + sk + '"/></g>' +
      '<path d="M-9 -14 L-7 -31 h14 L9 -14 l-3 3 -3 -3 -3 3 -3 -3 -3 3 z" fill="' + c.tunic + '" stroke="' + shade(c.tunic, -0.35) + '" stroke-opacity=".5"/>' +
      '<path d="M-7 -31 l7 6 7 -6 z" fill="' + c.collar + '"/>' +
      '<rect x="-8" y="-21" width="16" height="3" fill="#3B2416"/><rect x="-2" y="-21.5" width="4" height="4" fill="none" stroke="#E7C463" stroke-width="1.2"/>' +
      '<path d="M-6 -37 l-6 -4 4 7z M6 -37 l6 -4 -4 7z" fill="' + sk + '"/>' +
      '<circle cx="0" cy="-36" r="6.4" fill="' + sk + '"/>' +
      '<circle cx="-2.4" cy="-36.5" r=".9" fill="#3B2416"/><circle cx="2.4" cy="-36.5" r=".9" fill="#3B2416"/>' +
      '<circle cx="-3.6" cy="-34" r="1.4" fill="#F09A8A" opacity=".7"/><circle cx="3.6" cy="-34" r="1.4" fill="#F09A8A" opacity=".7"/>' +
      '<path d="M-2 -33 q2 1.6 4 0" stroke="#8A4A3A" stroke-width=".9" fill="none"/>' +
      '<path d="M-7.5 -39 q7.5 -6 15 0 q-3 -7 -1 -15 q-4 2 -7 6 q-4 4 -7 9z" fill="' + c.hat + '" stroke="' + shade(c.hat, -0.35) + '" stroke-opacity=".5"/>' +
      '<rect x="-8" y="-41" width="16" height="3.5" rx="1.7" fill="#F7FAFC"/>' +
      '<circle cx="6.8" cy="-54" r="2.8" fill="#F7FAFC"/>' +
      (c.carga || '') +
      '<g class="brazo" style="animation-direction:alternate"><rect x="6.5" y="-29" width="4.5" height="12" rx="2" fill="' + c.tunic + '"/><circle cx="8.7" cy="-16.5" r="2.4" fill="' + sk + '"/></g>' +
      '</g>';
  }
  var CAJA_R = '<g transform="translate(6,-30)">' + regalo(0, 14, 14, 13, '#C8372D', '#E7C463') + '</g>';
  var CAJA_V = '<g transform="translate(5,-28)">' + regalo(0, 12, 12, 11, '#3E8A4E', '#E5533D') + '</g>';
  var CAJA_A = '<g transform="translate(5,-29)">' + regalo(0, 13, 13, 12, '#5C8FC6', '#F7FAFC') + '</g>';

  function caminante(dir, d, del, x0, y, c, sc) {
    var flip = dir === 'izq' ? ' scale(-1,1)' : '';
    return '<g transform="translate(0,' + y + ')"><g class="camina ' + (dir === 'izq' ? 'izq' : '') + '" style="--d:' + d + 's;--del:-' + del + 's;--x0:' + x0 + 'px">' +
      '<g transform="scale(' + (sc || 1) + ')' + flip + '">' + elfo(c) + '</g></g></g>';
  }
  function trineoPequeno() {
    return '<g transform="translate(-58,-2)"><path d="M0 0 h40 q8 0 10 -6" fill="none" stroke="#7A4A2A" stroke-width="2.5"/>' +
      '<rect x="4" y="-12" width="32" height="9" rx="3" fill="#B3452F"/>' + regalo(8, -12, 10, 10, '#3E8A4E', '#F4C74F') + regalo(20, -12, 12, 14, '#5C8FC6', '#F7FAFC') +
      '<path d="M48 -6 L62 -16" stroke="#7A4A2A" stroke-width="1.5"/></g>';
  }

  function reno(x, y, sc, flip) {
    var b = '#9B6A43';
    return '<g transform="translate(' + x + ',' + y + ') scale(' + (flip ? -sc : sc) + ',' + sc + ')">' +
      '<rect x="-24" y="-22" width="5" height="22" rx="2" fill="' + shade(b, -0.15) + '"/><rect x="-14" y="-22" width="5" height="22" rx="2" fill="' + b + '"/>' +
      '<rect x="10" y="-22" width="5" height="22" rx="2" fill="' + shade(b, -0.15) + '"/><rect x="19" y="-22" width="5" height="22" rx="2" fill="' + b + '"/>' +
      '<ellipse cx="0" cy="-28" rx="29" ry="13" fill="' + b + '" stroke="' + shade(b, -0.35) + '" stroke-opacity=".5"/>' +
      '<ellipse cx="2" cy="-22" rx="20" ry="6" fill="#E9D6BC" opacity=".85"/>' +
      '<path d="M-28 -34 q-6 -2 -6 4 q4 2 6 0z" fill="#F7FAFC"/>' +
      '<g class="pasta"><path d="M20 -34 q8 -14 14 -18 l6 4 q-6 6 -10 18z" fill="' + b + '"/>' +
      '<ellipse cx="38" cy="-52" rx="10" ry="7" fill="' + b + '" stroke="' + shade(b, -0.35) + '" stroke-opacity=".5"/>' +
      '<ellipse cx="46" cy="-50" rx="5" ry="4" fill="#C79A72"/><circle cx="50" cy="-51" r="2.2" fill="#3B2416"/>' +
      '<circle cx="37" cy="-55" r="1.4" fill="#2A1A10"/>' +
      '<path d="M32 -57 q-6 -10 -2 -20 M31 -66 q-6 -2 -9 -8 M30 -60 l-8 -3 M40 -58 q2 -10 8 -16 M44 -66 q6 -2 8 -8" stroke="#6B4A2E" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M22 -38 q8 4 16 -2" stroke="#C8372D" stroke-width="3" fill="none"/><circle cx="31" cy="-35" r="3" fill="#E7C463"/></g>' +
      '</g>';
  }

  // ---------- armar capa fija ----------
  var fijo = '';
  fijo += '<path d="M0 214 C 180 176, 360 200, 540 186 S 900 170, 1080 188 S 1300 178, 1440 190 L1440 340 L0 340 Z" fill="#E4EEF6"/>';
  var back = '', front = '';
  trees.filter(function (t) { return t.back; }).forEach(function (t) { back += tree(t); });
  cabins.filter(function (c) { return c.back; }).forEach(function (c) { back += cabin(c); });
  fijo += '<g opacity=".78">' + back + '</g>';
  fijo += '<path d="M0 214 C 180 176, 360 200, 540 186 S 900 170, 1080 188 S 1300 178, 1440 190 L1440 340 L0 340 Z" fill="#DCE8F2" opacity=".35"/>';
  fijo += '<path d="M0 248 C 200 232, 420 246, 640 238 S 1060 226, 1240 240 S 1380 236, 1440 238 L1440 340 L0 340 Z" fill="#F7FAFC"/>';
  fijo += '<path d="M0 282 C 240 272, 520 288, 760 278 S 1200 270, 1440 280" stroke="#D6E5F0" stroke-width="22" fill="none" opacity=".75"/>';
  var items = [];
  trees.filter(function (t) { return !t.back; }).forEach(function (t) { items.push({ y: t.y, s: tree(t) }); });
  cabins.filter(function (c) { return !c.back; }).forEach(function (c) { items.push({ y: c.y, s: cabin(c) }); });
  items.sort(function (a, b) { return a.y - b.y; }).forEach(function (it) { front += it.s; });
  fijo += front;
  // mesa de trabajo junto al taller
  fijo += '<rect x="706" y="246" width="54" height="7" rx="2" fill="#8A5A3A"/><rect x="710" y="252" width="5" height="16" fill="#6B4430"/><rect x="751" y="252" width="5" height="16" fill="#6B4430"/>';
  fijo += regalo(718, 246, 12, 10, '#E5533D', '#F4C74F');
  // regalos bajo el árbol grande
  fijo += regalo(938, 274, 22, 18, '#C8372D', '#E7C463') + regalo(962, 276, 16, 13, '#5C8FC6', '#F7FAFC') + regalo(1012, 275, 24, 20, '#3E8A4E', '#E5533D') + regalo(1038, 276, 14, 11, '#E7C463', '#C8372D');
  // corral de los renos
  fijo += corral(790, 272, 120);
  // faroles
  [445, 1180].forEach(function (lx) {
    fijo += '<rect x="' + (lx - 2) + '" y="226" width="4" height="48" fill="#3E3A3A"/><rect x="' + (lx - 7) + '" y="214" width="14" height="14" rx="2" fill="#FFD27A" stroke="#3E3A3A" stroke-width="2"/><path d="M' + (lx - 9) + ' 214 h18 l-9 -7z" fill="#3E3A3A"/>';
    vida += '<circle class="halo" cx="' + lx + '" cy="221" r="26" fill="url(#halo)"/>';
  });

  var pueblo = capa('capa-pueblo', svg('0 0 ' + W + ' ' + H, 'xMidYMax slice', '<defs>' + filtro('wcp', 5) + '</defs><g filter="url(#wcp)">' + fijo + '</g>'));

  // ---------- capa viva ----------
  // renos en el corral
  vida += reno(822, 270, 0.62, false) + reno(888, 274, 0.58, true);
  // duende con martillo en la mesa
  vida += '<g transform="translate(700,268)">' + elfo({ tunic: '#3E8A4E', hat: '#C8372D', collar: '#E7C463' }).replace(/class="paso"/, 'class=""').replace(/class="pierna( b)?"/g, 'class=""').replace(/class="brazo"( style="[^"]*")?/g, 'class=""') + '</g>';
  vida += '<g transform="translate(708,241)"><g class="martillo"><rect x="0" y="-2" width="20" height="3.4" rx="1.5" fill="#8A5A3A"/><rect x="17" y="-6" width="7" height="11" rx="1.5" fill="#6E6E78"/></g></g>';
  vida += '<g class="chispazo" style="transform-origin:732px 238px"><path d="M732 230 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill="#F4C74F"/></g>';
  // duende envolviendo regalos junto al árbol
  vida += '<g transform="translate(1068,276)">' + elfo({ tunic: '#C8372D', hat: '#3E8A4E', collar: '#F7FAFC' }).replace(/class="paso"/, 'class=""').replace(/class="pierna( b)?"/g, 'class=""') + '</g>';
  vida += '<g class="envuelve" style="transform-origin:1088px 276px">' + regalo(1080, 276, 15, 13, '#B79BE6', '#F4C74F') + '</g>';
  // duendes caminando por el sendero
  vida += caminante('der', 30, 0, 260, 274, { tunic: '#C8372D', hat: '#3E8A4E', collar: '#F7FAFC', carga: CAJA_R });
  vida += caminante('izq', 30, 15, 640, 279, { tunic: '#3E8A4E', hat: '#C8372D', collar: '#E7C463', carga: CAJA_V });
  vida += caminante('der', 60, 25, 1040, 284, { tunic: '#5C8FC6', hat: '#C8372D', collar: '#F7FAFC', carga: CAJA_A }, 1.05);
  vida += '<g transform="translate(0,282)"><g class="camina izq" style="--d:60s;--del:-52s;--x0:480px"><g transform="scale(-1,1)">' + elfo({ tunic: '#C8372D', hat: '#2F6B4A', collar: '#E7C463' }) + trineoPequeno() + '</g></g></g>';
  // chispitas mágicas
  [[320, 120], [600, 150], [930, 60], [1150, 120], [1330, 150], [180, 140], [780, 130]].forEach(function (p, i) {
    vida += '<path class="chispa" style="animation-delay:-' + (i * 0.7) + 's;transform-origin:' + p[0] + 'px ' + p[1] + 'px" d="M' + p[0] + ' ' + (p[1] - 6) + ' l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6z" fill="#FFF3C4"/>';
  });

  var defs = '<defs><radialGradient id="halo"><stop offset="0" stop-color="#FFE29A" stop-opacity=".75"/><stop offset=".5" stop-color="#FFD27A" stop-opacity=".25"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/></radialGradient></defs>';
  var vivaEl = document.createElement('div');
  vivaEl.className = 'capa capa-vida';
  vivaEl.innerHTML = svg('0 0 ' + W + ' ' + H, 'xMidYMax slice', defs + vida);
  pueblo.parentNode.insertBefore(vivaEl, pueblo.nextSibling);

  var velo = document.createElement('div');
  velo.className = 'velo';
  hero.insertBefore(velo, hero.querySelector('.wrap'));

  // ---------- trineo en el cielo ----------
  var tr = document.createElement('div');
  tr.className = 'trineo';
  var renos = '';
  for (var q = 0; q < 4; q++) {
    renos += '<g transform="translate(' + (120 + q * 34) + ',' + (18 - q * 3) + ') scale(.32)">' + reno(0, 0, 1, false).replace(/class="pasta"/, '') + '</g>';
  }
  tr.innerHTML = '<svg viewBox="0 0 280 70" aria-hidden="true">' +
    '<path d="M10 52 C 40 50, 70 46, 100 40" stroke="#FFF3C4" stroke-width="2" stroke-dasharray="1 6" stroke-linecap="round" fill="none" opacity=".8"/>' +
    '<path d="M60 44 L120 22" stroke="#E7C463" stroke-width="1.2" opacity=".8"/>' +
    '<path d="M40 52 h44 q10 0 12 -10" fill="none" stroke="#E7C463" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M44 48 q-4 -14 6 -18 h30 q8 0 10 8 l-2 10z" fill="#B3452F" stroke="#7A2A1E" stroke-width="1"/>' +
    regalo(50, 31, 10, 9, '#3E8A4E', '#F4C74F') +
    '<circle cx="74" cy="22" r="7" fill="#C8372D"/><circle cx="76" cy="15" r="4.5" fill="#F2C7A5"/><path d="M71 13 q5 -8 11 -2 l3 4z" fill="#C8372D"/><circle cx="85" cy="15" r="2" fill="#F7FAFC"/><path d="M73 17 q3 6 7 0" fill="#F7FAFC"/>' +
    renos + '</svg>';
  hero.insertBefore(tr, pueblo);

  // ---------- nieve irregular (canvas) ----------
  var cv = document.createElement('canvas');
  cv.className = 'nieve';
  cv.setAttribute('aria-hidden', 'true');
  hero.insertBefore(cv, vivaEl.nextSibling);
  var ctx = cv.getContext('2d'), Wc = 0, Hc = 0, flakes = [], t = 0, last = 0, running = true, visible = true;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T = 60, TAU = Math.PI * 2;
  // Cada copo cae un número entero de veces por minuto y se mece con frecuencias que caben
  // exactas en un minuto: así la nieve se repite sin saltos, como un loop.
  function make() {
    var dpt = Math.random();
    return {
      x0: Math.random(), y0: Math.random(), r: 0.6 + dpt * dpt * 3.4,
      n: 1 + Math.floor(dpt * 3 + Math.random() * 1.2), // caídas por minuto (más cerca = más rápido)
      amp: 6 + Math.random() * 24, k: 2 + Math.floor(Math.random() * 9), ph: Math.random() * TAU,
      a: 0.35 + dpt * 0.6, d: dpt
    };
  }
  function resize() {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    Wc = cv.clientWidth; Hc = cv.clientHeight;
    cv.width = Math.round(Wc * dpr); cv.height = Math.round(Hc * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.min(260, Math.round(Wc * Hc / 7000));
    while (flakes.length < n) flakes.push(make());
    flakes.length = n;
    if (reduce) draw(0);
  }
  // Desplazamiento por el viento: suma de senos con período 60 s (ráfagas que van y vienen).
  function drift(tt) {
    var w = TAU / T;
    return 70 * Math.sin(w * tt) + 34 * Math.sin(3 * w * tt + 1.3) + 18 * Math.sin(7 * w * tt + 2.1);
  }
  function draw() {
    ctx.clearRect(0, 0, Wc, Hc);
    var span = Hc + 40, dr = drift(t), spanX = Wc + 40;
    ctx.fillStyle = '#FFFFFF';
    for (var i = 0; i < flakes.length; i++) {
      var p = flakes[i];
      var y = ((p.y0 + p.n * t / T) % 1) * span - 20;
      var x = p.x0 * spanX + dr * (0.3 + p.d) + Math.sin(TAU * p.k * t / T + p.ph) * p.amp;
      x = ((x % spanX) + spanX) % spanX - 20;
      if (p.r > 2.4) { ctx.globalAlpha = p.a * 0.35; ctx.beginPath(); ctx.arc(x, y, p.r * 1.8, 0, TAU); ctx.fill(); }
      ctx.globalAlpha = p.a;
      ctx.beginPath(); ctx.arc(x, y, p.r, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function loop(ts) {
    if (!running) return;
    var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
    last = ts; t = (t + dt) % T;
    draw();
    requestAnimationFrame(loop);
  }
  function setRun() {
    var should = visible && !document.hidden && !reduce;
    if (should && !running) { running = true; last = 0; requestAnimationFrame(loop); }
    else if (!should) running = false;
  }
  resize();
  window.addEventListener('resize', resize);
  if (!reduce) requestAnimationFrame(loop); else running = false;
  document.addEventListener('visibilitychange', setRun);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; setRun(); }).observe(hero);
  }
})();
