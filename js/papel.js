// js/papel.js
// Dibuja la carta del niño sobre su papel. Es la MISMA maqueta que imprime el backend
// (carta-para-santa-backend/printTemplate.js → childPage): mismo fondo, misma caja de texto
// (assets/papeles/layout.json), mismo cálculo de tamaño de letra y renglones. Así lo que se
// ve en pantalla es lo que llega por correo. Si cambias algo aquí, cámbialo allá también.
//
// La página se arma a tamaño real (8.5 × 11 in = 816 × 1056 px CSS) y se escala con
// transform para que quepa en su contenedor.

(function () {
  var PX = 96;          // px CSS por pulgada
  var PAGE_W = 816;
  var PAGE_H = 1056;
  var layoutPromise = null;

  function loadLayout() {
    if (!layoutPromise) {
      layoutPromise = fetch('assets/papeles/layout.json').then(function (r) { return r.json(); });
    }
    return layoutPromise;
  }

  var r3 = function (n) { return Math.round(n * 1000) / 1000; };

  // Renglones que ocupa un texto con Patrick Hand (≈0.41 em de ancho medio por carácter).
  function lines(text, widthIn, fontPt) {
    var perLine = Math.max(8, Math.floor((widthIn * 72) / (fontPt * 0.41)));
    return String(text || '').split('\n').reduce(function (n, para) {
      return n + Math.max(1, Math.ceil(para.length / perLine));
    }, 0);
  }

  // El saludo es el titular: más grande que el cuerpo, con su propio espacio y sin línea debajo.
  function titleMetrics(pt, lhPx, d) {
    var script = d.greetFont === 'Pinyon Script';
    var titlePt = r3(Math.min(40, Math.max(28, pt * 1.8)) * (script ? 1.35 : 1));
    var needPx = (titlePt * 96) / 72 * 1.6;
    return { titlePt: titlePt, rows: Math.max(2, Math.ceil(needPx / lhPx)) };
  }

  function fitText(c, d) {
    var w = d.textBox.w, h = d.textBox.h;
    function units(pt) {
      var u = titleMetrics(pt, Math.round(pt * (0.5 / 23.5) * 96), d).rows;
      if (c.intro) u += lines(c.intro, w, pt);
      if (c.message) u += lines(c.message, w, pt);
      if (c.gifts.length) u += 1 + c.gifts.reduce(function (n, g) { return n + lines(g, w - 0.35, pt); }, 0);
      if (c.farewell) u += 1;
      return u + 1;
    }
    var pt = 23.5, lh = 0.5;
    while (pt > 10 && units(pt) * lh > h) {
      pt -= 0.5;
      lh = r3(pt * (0.5 / 23.5));
    }
    return { pt: pt, lh: lh };
  }

  function esc(s) { return window.CPS.esc(s); }

  /**
   * c = { design, greeting, intro, message, gifts[], farewell, signature,
   *       placeholders: bool (muestra textos guía atenuados donde falta contenido) }
   * opts = { mini: bool } → solo papel y saludo (miniaturas).
   */
  function pageHtml(layout, c, opts) {
    var d = layout.designs[c.design] || layout.designs.clasica;
    var mini = opts && opts.mini;
    var ph = !!c.placeholders;
    var gifts = (c.gifts || []).filter(Boolean);
    var message = c.message || (ph ? 'Aquí aparecerá tu mensaje para Santa…' : '');
    var signature = c.signature || (ph ? 'Tu nombre' : '');
    var content = mini
      ? { intro: '', message: '', gifts: [], farewell: '' }
      : { intro: c.intro || '', message: message, gifts: gifts.length ? gifts : (ph ? ['(Tu lista aparecerá aquí)'] : []), farewell: c.farewell || '' };

    var fit = fitText(content, d);
    var pt = fit.pt;
    var lhPx = Math.round(fit.lh * PX);
    var tb = d.textBox;
    var top = Math.round(tb.y * PX), left = Math.round(tb.x * PX);
    var width = Math.round(tb.w * PX), height = Math.round(tb.h * PX);
    var title = titleMetrics(pt, lhPx, d);

    var rules = '';
    var n = Math.floor(height / lhPx);
    for (var i = title.rows + 1; i <= n; i++) {
      rules += '<div class="pp-rule" style="left:' + left + 'px;top:' + (top + i * lhPx - 1) + 'px;width:' + width + 'px;background:' + d.line + '"></div>';
    }

    var titlePx = Math.round((title.titlePt * 96) / 72);
    var greetStyle = [
      'position:absolute;left:0;right:0;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
      'bottom:' + Math.round(Math.max(lhPx * 0.3, titlePx * 0.5) - titlePx * (d.greetFont === 'Pinyon Script' ? 0.3 : 0.22)) + 'px',
      "font-family:'" + d.greetFont + "'",
      'font-size:' + title.titlePt + 'pt',
      'line-height:1',
      'color:' + d.greetColor,
      d.greetItalic ? 'font-style:italic' : '',
      d.greetBold ? 'font-weight:700' : '',
      d.greetCenter ? 'text-align:center' : ''
    ].filter(Boolean).join(';');

    function p(txt, extra, dim) {
      return '<p style="margin:0;line-height:' + lhPx + 'px;' + (extra || '') + (dim ? 'opacity:.5;' : '') + '">' + txt + '</p>';
    }

    var body = '<div style="position:relative;height:' + (title.rows * lhPx) + 'px"><p style="' + greetStyle + '">' + esc(c.greeting || 'Querido Santa:') + '</p></div>';
    if (!mini) {
      if (content.intro) body += p(esc(content.intro));
      if (content.message) body += p(esc(content.message), 'white-space:pre-wrap;', ph && !c.message);
      if (content.gifts.length) {
        body += p('Esta es mi lista de regalos:');
        if (gifts.length) {
          gifts.forEach(function (g, k) { body += p((k + 1) + '.&nbsp;' + esc(g), 'padding-left:0.35in;text-indent:-0.22in;'); });
        } else {
          body += p(esc(content.gifts[0]), 'padding-left:0.13in;', true);
        }
      }
      if (content.farewell) body += p(esc(content.farewell));
      if (signature) body += p(esc(signature), 'color:' + d.signColor + ';font-size:' + r3(pt * 1.2) + 'pt;', ph && !c.signature);
    }

    var img = 'assets/papeles/' + d.image.replace('.jpg', mini ? '-mini.jpg' : '.jpg');
    return '<div class="pp-page">' +
      '<img class="pp-bg" src="' + img + '" alt="" draggable="false">' + rules +
      '<div class="pp-text" style="left:' + left + 'px;top:' + top + 'px;width:' + width + 'px;height:' + height + 'px;font-size:' + pt + 'pt;color:' + d.ink + '">' + body + '</div>' +
      '</div>';
  }

  // Escala la página al ancho del contenedor (y la vuelve a escalar si cambia de tamaño).
  function fit(container) {
    var page = container.querySelector('.pp-page');
    if (!page) return;
    var s = container.clientWidth / PAGE_W;
    page.style.transform = 'scale(' + s + ')';
  }

  var observer = window.ResizeObserver ? new ResizeObserver(function (entries) {
    entries.forEach(function (e) { fit(e.target); });
  }) : null;

  function renderPapel(container, c, opts) {
    container.classList.add('pp');
    return loadLayout().then(function (layout) {
      container.innerHTML = pageHtml(layout, c, opts);
      fit(container);
      if (observer && !container._ppObserved) { observer.observe(container); container._ppObserved = true; }
      else if (!observer) window.addEventListener('resize', function () { fit(container); });
    });
  }

  // Estilos del papel (se inyectan una vez para que papel.js funcione solo).
  var css = '.pp{position:relative;width:100%;aspect-ratio:8.5/11;overflow:hidden;border-radius:6px;background:#F3EEE3}' +
    '.pp-page{position:absolute;left:0;top:0;width:' + PAGE_W + 'px;height:' + PAGE_H + 'px;transform-origin:0 0;font-family:"Patrick Hand",cursive;user-select:none;-webkit-user-select:none}' +
    '.pp-bg{position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;display:block}' +
    '.pp-rule{position:absolute;height:1px}' +
    '.pp-text{position:absolute;overflow:hidden;overflow-wrap:anywhere}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  window.renderPapel = renderPapel;
  window.CPS_PAPEL = { fitText: fitText, lines: lines, loadLayout: loadLayout };
})();
