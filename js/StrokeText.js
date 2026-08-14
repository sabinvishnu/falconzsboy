/**
 * StrokeText — Vanilla JS port of the React Bits StrokeText component.
 * Requires GSAP (and optionally ScrollTrigger) loaded before this script.
 *
 * Usage:
 *   initStrokeText('#my-host', { text: 'FALCONZ BOY', trigger: 'loop', ... });
 */
(function () {
  'use strict';

  function initStrokeText(host, opts) {
    const container = typeof host === 'string' ? document.querySelector(host) : host;
    if (!container) return;

    /* ── Config ───────────────────────────────────────────────────── */
    const {
      text          = 'Draw Attention',
      strokeColor   = '#A78BFA',
      fillColor     = '#F8FAFC',
      strokeWidth   = 1.4,
      drawDuration  = 1.6,
      fillDelay     = 0.2,
      repeatDelay   = 2.5,
      stagger       = 0.05,
      ease          = 'power2.out',
      trigger       = 'loop',
      fillMode      = 'wipe',
      fontSize      = 128,
      fontWeight    = 800,
      letterSpacing = -4,
      reverse       = false,
      className     = '',
      style         = {}
    } = opts || {};

    /* Clear any existing content in the host */
    container.innerHTML = '';

    const uid    = Math.random().toString(36).slice(2, 9);
    const wipeId = 'stk-wipe-' + uid;
    const chars  = Array.from(String(text != null ? text : ''));
    const dash   = Math.max(fontSize * 7, 200);
    const NS     = 'http://www.w3.org/2000/svg';

    /* ── Root wrapper ─────────────────────────────────────────────── */
    const root = document.createElement('span');
    root.className = ['stroke-text', trigger === 'hover' ? 'stroke-text--hover' : '', className]
      .filter(Boolean).join(' ');
    root.setAttribute('role', 'img');
    root.setAttribute('aria-label', String(text != null ? text : ''));
    root.style.setProperty('--stroke-text-height', Math.round(fontSize * 1.3) + 'px');
    Object.assign(root.style, style);

    /* ── SVG ──────────────────────────────────────────────────────── */
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'stroke-text__svg');
    svg.setAttribute('xmlns', NS);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('aria-hidden', 'true');
    /* Temporary viewBox so the element has a size for measurement */
    svg.setAttribute('viewBox', '0 ' + (-fontSize) + ' 600 ' + (fontSize * 1.3));

    const fontStyle = 'font-size:' + fontSize + 'px;font-weight:' + fontWeight +
      ';letter-spacing:' + letterSpacing + 'px;font-family:Inter,sans-serif;text-transform:uppercase;';

    /* Stroke text (outline only, fill=none) */
    const strokeEl = document.createElementNS(NS, 'text');
    strokeEl.setAttribute('class', 'stroke-text__stroke');
    strokeEl.setAttribute('x', '0');
    strokeEl.setAttribute('y', '0');
    strokeEl.setAttribute('fill', 'none');
    strokeEl.setAttribute('stroke', strokeColor);
    strokeEl.setAttribute('stroke-width', String(strokeWidth));
    strokeEl.setAttribute('stroke-linejoin', 'round');
    strokeEl.setAttribute('stroke-linecap', 'round');
    strokeEl.setAttribute('style', fontStyle);
    chars.forEach(function (ch) {
      var ts = document.createElementNS(NS, 'tspan');
      ts.setAttribute('data-stroke-char', '');
      ts.textContent = ch;
      strokeEl.appendChild(ts);
    });

    /* Fill text (solid fill, invisible until wipe) */
    var fillEl = document.createElementNS(NS, 'text');
    fillEl.setAttribute('class', 'stroke-text__fill');
    fillEl.setAttribute('x', '0');
    fillEl.setAttribute('y', '0');
    fillEl.setAttribute('fill', fillColor);
    fillEl.setAttribute('stroke', 'none');
    fillEl.setAttribute('style', fontStyle);
    chars.forEach(function (ch) {
      var ts = document.createElementNS(NS, 'tspan');
      ts.setAttribute('data-fill-char', '');
      ts.textContent = ch;
      fillEl.appendChild(ts);
    });

    svg.appendChild(strokeEl);
    svg.appendChild(fillEl);
    root.appendChild(svg);
    container.appendChild(root);

    /* ── Measure → viewBox → animate ─────────────────────────────── */
    function measure() {
      var bbox;
      try { bbox = strokeEl.getBBox(); } catch (e) { return null; }
      if (!bbox || !bbox.width) return null;
      var pad = Math.max(Number(strokeWidth) || 1, fontSize * 0.1);
      return {
        x:      bbox.x - pad,
        y:      bbox.y - pad,
        width:  bbox.width  + pad * 2,
        height: bbox.height + pad * 2
      };
    }

    function applyWipeClip(box) {
      if (fillMode !== 'wipe' || !box) return null;
      var defs   = document.createElementNS(NS, 'defs');
      var clip   = document.createElementNS(NS, 'clipPath');
      clip.setAttribute('id', wipeId);
      clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
      var rect   = document.createElementNS(NS, 'rect');
      rect.setAttribute('x',      String(box.x));
      rect.setAttribute('y',      String(box.y));
      rect.setAttribute('width',  '0');
      rect.setAttribute('height', String(box.height));
      clip.appendChild(rect);
      defs.appendChild(clip);
      svg.insertBefore(defs, svg.firstChild);
      fillEl.setAttribute('clip-path', 'url(#' + wipeId + ')');
      return rect;
    }

    function animate(box) {
      if (!box || typeof gsap === 'undefined') return;

      var wipeRect   = applyWipeClip(box);
      var strokes    = gsap.utils.toArray(root.querySelectorAll('[data-stroke-char]'));
      var fills      = gsap.utils.toArray(root.querySelectorAll('[data-fill-char]'));
      var fillOk     = fillMode !== 'none';
      var useWipe    = fillOk && fillMode === 'wipe';
      var fillDur    = Math.max(0.4, drawDuration * 0.5);
      var staggerCfg = reverse ? { each: stagger, from: 'end' } : stagger;
      var allTargets = strokes.concat(fills).concat(wipeRect ? [wipeRect] : []);

      /* Reduced-motion: show immediately */
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 });
        gsap.set(fills,   { opacity: fillOk ? 1 : 0 });
        if (wipeRect) gsap.set(wipeRect, { attr: { width: box.width } });
        return;
      }

      function setStart() {
        gsap.killTweensOf(allTargets);
        gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });
        gsap.set(fills,   { opacity: useWipe ? 1 : 0 });
        if (wipeRect) gsap.set(wipeRect, { attr: { width: 0 } });
      }

      function build() {
        setStart();
        var tl = gsap.timeline({
          paused:      true,
          repeat:      trigger === 'loop' ? -1  : 0,
          repeatDelay: trigger === 'loop' ? repeatDelay : 0,
          defaults:    { overwrite: 'auto' }
        });

        tl.to(strokes, { strokeDashoffset: 0, duration: drawDuration, ease: ease, stagger: staggerCfg }, 0);

        if (useWipe && wipeRect) {
          tl.to(wipeRect, { attr: { width: box.width }, duration: fillDur, ease: 'power2.inOut' },
            drawDuration + fillDelay);
        } else if (fillOk) {
          tl.to(fills, { opacity: 1, duration: fillDur, ease: 'power2.out', stagger: staggerCfg },
            drawDuration + fillDelay);
        }
        return tl;
      }

      if (trigger === 'hover') {
        gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 });
        gsap.set(fills,   { opacity: fillOk ? 1 : 0 });
        if (wipeRect) gsap.set(wipeRect, { attr: { width: fillOk ? box.width : 0 } });
        root.addEventListener('pointerenter', function () { build().play(0); });
      } else if (trigger === 'scroll' && typeof ScrollTrigger !== 'undefined') {
        if (gsap.registerPlugin) gsap.registerPlugin(ScrollTrigger);
        var tl = build();
        ScrollTrigger.create({ trigger: root, start: 'top 82%', once: true, onEnter: function () { tl.play(0); } });
      } else {
        build().play(0);
      }
    }

    function setup() {
      var box = measure();
      if (box) {
        svg.setAttribute('viewBox', box.x + ' ' + box.y + ' ' + box.width + ' ' + box.height);
        animate(box);
      }
    }

    /* Wait for fonts, then measure + animate */
    function init() {
      /* First pass — fonts may not be ready yet */
      var box = measure();
      if (box && box.width > 10) {
        svg.setAttribute('viewBox', box.x + ' ' + box.y + ' ' + box.width + ' ' + box.height);
        animate(box);
      }
      /* Second pass after fonts.ready — remeasure to catch kerning changes */
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          var box2 = measure();
          if (!box2) return;
          svg.setAttribute('viewBox', box2.x + ' ' + box2.y + ' ' + box2.width + ' ' + box2.height);
          if (!box) animate(box2); /* only animate if first pass failed */
        }).catch(function () {});
      }
    }

    /* Give browser a tick to lay out the SVG in the DOM */
    requestAnimationFrame(function () {
      requestAnimationFrame(init);
    });
  }

  window.initStrokeText = initStrokeText;
})();
