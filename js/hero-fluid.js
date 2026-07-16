// Liquid fill for the hero's accent word ("eCarnet?").
//
// Adapted from the classic ogl Flowmap demo, which distorts a photograph and
// punches a wordmark through it with a full-viewport white div in
// mix-blend-mode: screen. That trick whites out everything behind it, so it can
// only ever be the whole page. Here the word is rendered into an *alpha texture*
// and multiplied into the fragment shader instead, so the effect is confined to
// the letterforms and nothing else on the hero is touched.
//
// The fill is an animated fbm noise field mapped onto the brand blues, built in
// the shader — no image asset, no cross-origin fetch. It has to be a *textured*
// field: the demo advects a photograph, and displacing something that smooth (a
// two-stop gradient) moves no pixels you can see. The letters stay sharp; only
// the fill is dragged, and the RGB channels are sampled at slightly different
// offsets so movement leaves a chromatic wake.
//
// The DOM span stays exactly where it was. It keeps [data-i18n] and it is still
// part of the <h1>, so screen readers and the language switcher are unaffected —
// it is only made transparent once the canvas is live.
import { Renderer, Program, Mesh, Geometry, Texture, Vec2, Flowmap } from 'ogl';

const wrap = document.querySelector('.headline-gradient-wrap');
const word = document.querySelector('.headline-gradient');
const hero = document.querySelector('.hero');

// Same guards hero3d.js uses. On a phone this is a second WebGL context competing
// with the 3D phone for a much weaker GPU, and it needs a pointer to drive it.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width: 768px)').matches;

function hasWebGL() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch (e) {
    return false;
  }
}

if (wrap && word && hero && !reduced && !small && hasWebGL()) {
  document.fonts.ready.then(init).catch(() => {});
}

function init() {
  // How far the canvas overhangs the word's box, as a share of its height. The
  // flowmap pushes pixels outward; without slack the ripple clips at the edge.
  const BLEED = 0.28;
  // Displacement of the fill, per channel — the original demo's values. They work
  // again now that the fill is a noise field with detail to displace.
  const SHIFT = [0.18, 0.15, 0.14];
  // Extra sheen where the fluid moves fastest. The noise carries the effect now,
  // so this is a garnish rather than the whole trick.
  const WAKE = 0.35;
  // How far the LETTERFORMS themselves ripple with the flow. This was deliberately
  // 0 (the glyphs stayed frozen) because it's an h1 and legibility outranks the
  // effect — turned back on now, but kept small: past ~0.1 the word smears.
  const WARP = 0.06;
  // Cursor velocity multiplier. Turn up if the fluid feels sluggish.
  const SPEED = 1.0;

  const vertex = /* glsl */ `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0, 1);
    }
  `;

  const fragment = /* glsl */ `
    precision highp float;
    uniform sampler2D tText;
    uniform sampler2D tFlow;
    uniform vec2 uBox;      // word box as a fraction of the canvas (bleed removed)
    uniform float uTime;
    uniform float uWake;
    uniform float uWarp;
    uniform vec3 uShift;
    varying vec2 vUv;

    // The brand ramp, deep → core → bright → sheen.
    const vec3 DEEP   = vec3(0.016, 0.180, 0.478);
    const vec3 CORE   = vec3(0.000, 0.447, 0.824);   // #0072D2
    const vec3 BRIGHT = vec3(0.000, 0.745, 1.000);   // #00BEFF
    const vec3 SHEEN  = vec3(0.700, 0.937, 1.000);

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);            // smoothstep the cell
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Four octaves is where this stops looking like static and starts looking
    // like liquid. It is also the whole reason the flow is visible at all.
    float fbm(vec2 p) {
      float v = 0.0;
      float amp = 0.5;
      for (int i = 0; i < 4; i++) {
        v += amp * noise(p);
        p *= 2.02;
        amp *= 0.5;
      }
      return v;
    }

    // Two octaves, only ever used to bend the coordinates fed to fbm above.
    float fbm2(vec2 p) {
      return 0.5 * noise(p) + 0.25 * noise(p * 2.02);
    }

    // Scalar field inside the word's box. Drifts on its own so the word is alive
    // before you ever touch it; the radial term keeps the centre near CORE and
    // the outside near BRIGHT, so it still reads as the original gradient.
    float field(vec2 uv) {
      vec2 p = (uv - 0.5) / uBox;
      float t = uTime * 0.06;

      // Domain warp: bend the coordinates with noise before sampling noise. This
      // is what folds the field into itself and makes it read as a liquid rather
      // than as clouds sliding past.
      vec2 q = vec2(
        fbm2(p * 7.0 + vec2(t, 0.0)),
        fbm2(p * 7.0 + vec2(5.2, -t * 0.8))
      );

      // p spans ~1.17 units across the word, so this puts ~16 noise cells across
      // it — one or two per letter. At 2.6 it was three cells TOTAL: flat, and
      // nothing the flowmap displaced was visible.
      float f = fbm(p * 14.0 + q * 1.6);
      float radial = clamp(length(p) * 2.0, 0.0, 1.0);
      return clamp(f * 0.75 + radial * 0.40, 0.0, 1.0);
    }

    vec3 ramp(float t) {
      vec3 c = mix(DEEP, CORE, smoothstep(0.0, 0.45, t));
      c = mix(c, BRIGHT, smoothstep(0.40, 0.80, t));
      c = mix(c, SHEEN, smoothstep(0.86, 1.0, t));
      return c;
    }

    void main() {
      // rg = flow direction, b = velocity magnitude
      vec3 flow = texture2D(tFlow, vUv).rgb;

      // Only the FILL is dragged, one sample per channel, each pulled a little
      // further than the last — that split is the chromatic wake.
      float r = ramp(field(vUv - flow.xy * uShift.x)).r;
      float g = ramp(field(vUv - flow.xy * uShift.y)).g;
      float b = ramp(field(vUv - flow.xy * uShift.z)).b;
      vec3 col = vec3(r, g, b);

      // Wet sheen where the fluid is actually moving.
      col = mix(col, SHEEN, clamp(flow.b * 1.6, 0.0, 1.0) * uWake);

      // Sampled straight: the letterforms never move. It's an <h1>.
      // The letterforms now ride the flow too, not just their fill. Sampled at a
      // smaller displacement than the colour so the glyph edges ripple rather than
      // tear. uWarp 0 restores the frozen-letter behaviour.
      float a = texture2D(tText, vUv - flow.xy * uWarp).a;

      gl_FragColor = vec4(col, a);
    }
  `;

  const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);

  const canvas = gl.canvas;
  canvas.className = 'fluid-word';
  // Set inline, not left to the stylesheet. A canvas is a replaced element: if it
  // ever lands in flow it adds its full height to the line box and shoves the
  // headline apart. Taking it out of flow is a correctness requirement of
  // mounting it, so it cannot be allowed to depend on style.css having loaded.
  canvas.style.position = 'absolute';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '2';
  wrap.appendChild(canvas);

  // The word, painted white into a 2D canvas. Only its alpha is ever read.
  const glyphs = document.createElement('canvas');
  const ctx = glyphs.getContext('2d');
  const texture = new Texture(gl, { image: glyphs, minFilter: gl.LINEAR, magFilter: gl.LINEAR });

  // dissipation is how much of the flow field survives each frame — the single
  // biggest lever on how "liquid" it feels. 0.96 lets a swirl live ~2s instead of
  // ~0.6s, so strokes pool and overlap instead of snapping back.
  const flowmap = new Flowmap(gl, { falloff: 0.32, dissipation: 0.96, alpha: 0.5 });

  const geometry = new Geometry(gl, {
    position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
    uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
  });

  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    uniforms: {
      tText: { value: texture },
      tFlow: flowmap.uniform,
      uBox: { value: [1, 1] },
      uTime: { value: 0 },
      uWake: { value: WAKE },
      uWarp: { value: WARP },
      uShift: { value: SHIFT },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  let box = { w: 0, h: 0, padX: 0, padY: 0 };

  function layout() {
    const rect = word.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;

    const padX = rect.height * BLEED;
    const padY = rect.height * BLEED;
    const w = rect.width + padX * 2;
    const h = rect.height + padY * 2;
    box = { w, h, padX, padY };

    renderer.setSize(w, h);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    // Centre the (larger) canvas on the word's box.
    canvas.style.left = -padX + 'px';
    canvas.style.top = -padY + 'px';

    program.uniforms.uBox.value = [rect.width / w, rect.height / h];
    flowmap.aspect = w / h;

    paintGlyphs(rect, padX, padY, w, h);
    return true;
  }

  // Redrawn on resize, on font load, and whenever i18n swaps the word.
  function paintGlyphs(rect, padX, padY, w, h) {
    const dpr = Math.min(window.devicePixelRatio, 2);
    glyphs.width = Math.ceil(w * dpr);
    glyphs.height = Math.ceil(h * dpr);

    const cs = getComputedStyle(word);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} / normal ${cs.fontFamily}`;
    // Chrome/Safari only; without it the tracking drifts from the DOM text.
    if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    const text = word.textContent;
    const m = ctx.measureText(text);
    // The span's box top sits fontBoundingBoxAscent above the baseline, so this
    // lands the glyphs exactly where the DOM text was.
    ctx.fillText(text, padX, padY + m.fontBoundingBoxAscent);

    texture.image = glyphs;
    texture.needsUpdate = true;
  }

  if (!layout()) return;
  wrap.classList.add('is-fluid');

  // ── pointer ──────────────────────────────────────────────
  // Driven from the whole hero, not just the word: a cursor that has to land on
  // the glyphs to do anything would almost never fire.
  const mouse = new Vec2(-1);
  const velocity = new Vec2();
  let lastTime;
  const lastMouse = new Vec2();

  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    mouse.set((x - rect.left) / rect.width, 1 - (y - rect.top) / rect.height);

    if (!lastTime) {
      lastTime = performance.now();
      lastMouse.set(x, y);
    }
    const dx = x - lastMouse.x;
    const dy = y - lastMouse.y;
    lastMouse.set(x, y);

    const now = performance.now();
    const dt = Math.max(10.4, now - lastTime);
    lastTime = now;

    // Raw px/ms, as the original demo. Scaling this down by the canvas width was
    // damping the flow to ~40% before it ever reached the shader.
    velocity.x = (dx / dt) * SPEED;
    velocity.y = (dy / dt) * SPEED;
    velocity.needsUpdate = true;
  }

  hero.addEventListener('mousemove', onMove, { passive: true });

  // ── loop ─────────────────────────────────────────────────
  // Idle whenever the hero is offscreen or the tab is hidden.
  let onscreen = true;
  new IntersectionObserver(([entry]) => (onscreen = entry.isIntersecting)).observe(hero);

  let raf = 0;
  function frame(t = 0) {
    raf = requestAnimationFrame(frame);
    if (!onscreen || document.hidden) return;

    program.uniforms.uTime.value = t * 0.001;   // seconds

    if (!velocity.needsUpdate) {
      mouse.set(-1);
      velocity.set(0);
    }
    velocity.needsUpdate = false;

    flowmap.mouse.copy(mouse);
    // Chases the cursor briskly, but coasts to a stop — the slow fade is what
    // sells the inertia of a liquid.
    flowmap.velocity.lerp(velocity, velocity.len() ? 0.15 : 0.06);
    flowmap.update();

    renderer.render({ scene: mesh });
  }
  frame();

  // ── keep in sync ─────────────────────────────────────────
  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 120);
  });

  // i18n rewrites textContent on language switch.
  new MutationObserver(layout).observe(word, { childList: true, characterData: true, subtree: true });
}
