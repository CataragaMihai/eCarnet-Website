// Hero iPhone — the "physical carnet becomes a digital credential" moment.
//
// The phone drops in, settles, and *then* the screen powers on. The screen is
// the payoff, so nothing else on the page should move while it happens.
//
// Notes on this specific model (apple_iphone_15_pro_max_black, Sketchfab export,
// optimised to assets/iphone.glb):
//   - Material names are obfuscated. The screen is `pIJKfZsazmcpEiU`, not "Screen".
//   - Its baseColorFactor is pure black and it is lit entirely by emissive, so the
//     custom texture must go on `emissiveMap`. Assigning `.map` renders it black.
//   - Its UVs want flipY = true. flipY = false renders the screen upside-down.
//   - assets/iphone.glb has the original emissive texture stripped; we supply it.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const SCREEN_MATERIAL = 'pIJKfZsazmcpEiU';
const MODEL = 'assets/iphone.glb';
const SCREEN_TEXTURE = 'assets/app-intro-screen.png';

const stage = document.getElementById('hero-stage');
const canvas = document.getElementById('hero-canvas');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = window.matchMedia('(max-width: 768px)').matches;

// Bail to the poster on phones, on reduced-motion, and when WebGL is missing.
// The poster is already in the DOM, so "bail" simply means: never light the canvas.
function webglOK() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch (e) { return false; }
}
// Release the load gate. Safe to call more than once; safe if the gate never ran.
function releaseGate() {
  if (window.__heroModelDone) window.__heroModelDone();
}

if (small || reduced || !webglOK()) {
  stage.classList.add('is-poster');
  releaseGate();   // nothing to wait for — the poster is the final state here
} else {
  init();
}

function init() {
  // Opaque canvas. With alpha:true the phone's stacked transparent layers (its
  // glass cover is black at 0.6 alpha) eat the framebuffer alpha and the lit
  // screen composites down to rgb(11,25,50) instead of rgb(42,128,255).
  // The hero background is flat navy, so clearing to it is free.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0A1428');   // must match --navy
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);

  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(4, 8, 10);
  scene.add(key);
  // Cold rim light picks out the titanium edge against the navy.
  const rim = new THREE.DirectionalLight(0x86c7ff, 1.4);
  rim.position.set(-6, 2, -6);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  const pivot = new THREE.Group();   // owns the entrance + idle transform
  scene.add(pivot);

  // ── glow ──────────────────────────────────────────────────────────────
  // A soft blue halo behind the phone. It has to be IN the 3D scene, not a CSS
  // layer: the canvas is opaque (clears to navy, see above), so anything behind
  // the canvas is hidden. An additive sprite adds light onto the navy instead.
  // It lives on the scene, not the pivot, so dragging the phone doesn't drag the
  // glow with it — the halo stays put and the phone turns inside it.
  const glowTex = (() => {
    const s = 256;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    // Softer, wider falloff — a broad wash, not a hot core. The old ramp put
    // near-white at the centre and blew out the whole middle of the hero.
    g.addColorStop(0.0, 'rgba(45, 140, 240, 0.8)');
    g.addColorStop(0.30, 'rgba(30, 110, 220, 0.34)');
    g.addColorStop(0.65, 'rgba(18, 70, 150, 0.12)');
    g.addColorStop(1.0, 'rgba(10, 40, 90, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();

  const glowMat = new THREE.SpriteMaterial({
    map: glowTex,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    depthTest: false,   // always paints, never z-fights the phone
    opacity: 0,         // faded in once the phone lands
  });
  const glow = new THREE.Sprite(glowMat);
  glow.position.set(0, 0, -6);   // behind the phone (which sits near z=0)
  glow.scale.setScalar(52);      // wide, so it reads as ambient light not a spotlight
  glow.renderOrder = -1;         // drawn before the phone, so it reads as behind
  scene.add(glow);

  let screenMat = null;
  let ready = false;
  const clock = new THREE.Clock();
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  // ── grab-to-spin ──────────────────────────────────────────────────────
  // Hit-testing is done against the model's bounding box PROJECTED to screen
  // pixels, not with a Raycaster. A raycast needs the pointer to land on an
  // actual triangle and needs world matrices to be fresh; when it misses, it
  // fails silently and the phone just feels dead. A projected rect can't.
  let model = null;
  let dragging = false;
  let userY = 0;           // rotation the user has added, radians
  let userX = 0;
  let spin = 0;            // angular velocity, carried after release
  const last = { x: 0, y: 0 };

  const DRAG_Y = 0.009;    // radians per pixel, horizontal
  const DRAG_X = 0.005;    // radians per pixel, vertical
  const TILT_LIMIT = 0.45; // don't let it flip onto its back
  const FRICTION = 0.95;   // how quickly a flick coasts to rest
  const HIT_PAD = 14;      // px of slop around the phone, so the edge is grabbable

  const hit = { x: 0, y: 0, w: 0, h: 0, ok: false };
  const _box = new THREE.Box3();
  const _v = new THREE.Vector3();

  function updateHit() {
    if (!model) return;
    _box.setFromObject(model);
    if (_box.isEmpty()) return;

    const r = canvas.getBoundingClientRect();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < 8; i++) {
      _v.set(i & 1 ? _box.max.x : _box.min.x,
             i & 2 ? _box.max.y : _box.min.y,
             i & 4 ? _box.max.z : _box.min.z).project(camera);
      const sx = (_v.x * 0.5 + 0.5) * r.width + r.left;
      const sy = (-_v.y * 0.5 + 0.5) * r.height + r.top;
      if (sx < minX) minX = sx;
      if (sx > maxX) maxX = sx;
      if (sy < minY) minY = sy;
      if (sy > maxY) maxY = sy;
    }
    hit.x = minX - HIT_PAD;
    hit.y = minY - HIT_PAD;
    hit.w = (maxX - minX) + HIT_PAD * 2;
    hit.h = (maxY - minY) + HIT_PAD * 2;
    hit.ok = true;
  }

  const overPhone = (e) => hit.ok &&
    e.clientX >= hit.x && e.clientX <= hit.x + hit.w &&
    e.clientY >= hit.y && e.clientY <= hit.y + hit.h;

  canvas.addEventListener('pointerdown', (e) => {
    if (!ready || !overPhone(e)) return;   // presses off the phone do nothing

    // Grabbing during the entrance ENDS the entrance rather than fighting it.
    // The old code ignored the press entirely, which felt exactly like a bug.
    const t = clock.getElapsedTime() + timeOffset;
    if (t < ENTRANCE) timeOffset += ENTRANCE - t;

    dragging = true;
    spin = 0;
    last.x = e.clientX;
    last.y = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
    e.preventDefault();
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    canvas.style.cursor = 'grab';
  }
  // On window, not the canvas: releasing outside the canvas must still end the drag.
  addEventListener('pointerup', endDrag);
  addEventListener('pointercancel', endDrag);

  // Fraction of the hero's height the phone occupies. The CSS mirrors this in
  // --phone-fill to reserve the west column, so the two must stay in sync.
  const PHONE_FILL = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--phone-fill')
  ) || 0.58;

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Frame the phone so it fills PHONE_FILL of the section height at any aspect.
    const PHONE_H = 20;
    const vFit = (PHONE_H / PHONE_FILL) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
    camera.position.set(0, 0, vFit);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }

  const texLoader = new THREE.TextureLoader();
  const screenTex = texLoader.load(SCREEN_TEXTURE);
  screenTex.flipY = true;                       // this model's UVs, verified
  screenTex.colorSpace = THREE.SRGBColorSpace;  // colour data, not linear
  screenTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  new GLTFLoader().load(MODEL, (gltf) => {
    const root = gltf.scene;

    root.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = o.receiveShadow = false;
      if (o.material && o.material.name === SCREEN_MATERIAL) {
        screenMat = o.material;
        screenMat.emissiveMap = screenTex;
        screenMat.emissive = new THREE.Color(0xffffff);
        screenMat.emissiveIntensity = 0;   // powers on after the phone lands
        screenMat.toneMapped = false;      // keep the UI colours true
        screenMat.needsUpdate = true;
      }
    });

    if (!screenMat) {
      // Loud, because a silent miss here is exactly the bug in the snippet
      // this file replaces: the phone would render with a dead screen.
      console.error(`[hero3d] screen material "${SCREEN_MATERIAL}" not found — did the model change?`);
    }

    // Normalise: 20 world-units tall, centred on the origin, facing the camera.
    root.scale.setScalar(20 / new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3()).y);
    const box = new THREE.Box3().setFromObject(root);
    root.position.sub(box.getCenter(new THREE.Vector3()));
    root.rotation.y = Math.PI;
    pivot.add(root);
    model = root;   // hit-test target for grab-to-spin

    resize();
    ready = true;

    // Did the user ever actually see the poster? That decides everything below.
    if (document.body.classList.contains('is-loaded')) {
      // Yes — we missed the gate's 3s safety net and the poster has been on
      // screen, showing a landed phone with a lit screen. Cross-fade to the
      // canvas and SKIP the entrance: re-animating a phone the user has already
      // seen standing still reads as a glitch, and starting from
      // emissiveIntensity 0 is what makes the lit screen dip to black.
      timeOffset = ENTRANCE;
      stage.classList.add('is-live');
      start();
      releaseGate();
    } else {
      // No — the skeleton is still up, so there is nothing to cross-fade from.
      // Swap to the canvas instantly and let the entrance be the reveal.
      stage.classList.add('is-instant', 'is-live');
      document.addEventListener('hero:reveal', start, { once: true });
      releaseGate();
    }
  }, undefined, (err) => {
    console.error('[hero3d] model failed to load, staying on poster', err);
    stage.classList.add('is-poster');
    releaseGate();
  });

  // Clock starts when the phone is on screen, not when its bytes arrive.
  function start() {
    clock.start();
    renderer.setAnimationLoop(frame);
  }

  // ── motion ────────────────────────────────────────────────────────────
  const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

  const ENTRANCE = 2.0;               // seconds
  const ENTER_RISE = -26;             // world units below rest — starts off-frame
  const ENTER_SPIN = Math.PI * 2;     // one full turn, unwound on the way up
  const ENTER_TILT = 0.38;            // rad, leans back and rights itself
  const ENTER_SCALE = 0.82;           // grows into place as it lands

  // The payoff beat. Kept at ~62% of the entrance: late enough that the phone has
  // essentially arrived, early enough that it isn't a separate event.
  const POWER_ON_AT = 1.25;
  const POWER_ON_OVER = 0.65;

  // The halo rises alongside the screen waking, so light and glow read as one
  // event, and finishes just as the phone settles.
  const GLOW_AT = 1.35;
  const GLOW_OVER = 0.85;
  const GLOW_MAX = 0.5;

  // Added to the clock. Set to ENTRANCE to start already settled and lit, on the
  // path where the poster was on screen and an entrance would be incoherent.
  let timeOffset = 0;

  addEventListener('resize', resize);
  addEventListener('pointermove', (e) => {
    if (dragging) {
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last.x = e.clientX;
      last.y = e.clientY;

      userY += dx * DRAG_Y;
      spin = dx * DRAG_Y;   // last frame's delta becomes the throw velocity
      userX = THREE.MathUtils.clamp(userX + dy * DRAG_X, -TILT_LIMIT, TILT_LIMIT);
      return;               // while dragging, the cursor is not a parallax input
    }

    // -1..1 across the viewport; the phone leans toward the cursor.
    pointer.tx = (e.clientX / innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / innerHeight) * 2 - 1;

    // Only advertise grabbing when the pointer is actually over the phone.
    if (ready) canvas.style.cursor = overPhone(e) ? 'grab' : '';
  }, { passive: true });

  function frame() {
    if (!ready) return;
    const t = clock.getElapsedTime() + timeOffset;

    // Entrance: rise from off-frame, unwind a full turn, grow, settle.
    // Exponential ease-out, no bounce — the spin decelerates hard into rest, so
    // the last quarter-turn reads as the phone catching itself rather than stopping.
    const p = Math.min(t / ENTRANCE, 1);
    const e = easeOutQuint(p);
    const enterY = (1 - e) * ENTER_RISE;
    const enterSpin = (1 - e) * ENTER_SPIN;
    const enterTilt = (1 - e) * ENTER_TILT;
    pivot.scale.setScalar(ENTER_SCALE + (1 - ENTER_SCALE) * e);

    // Idle: a slow breath once the entrance is done, scaled in so it never pops.
    const idle = e;
    const floatY = Math.sin(t * 0.7) * 0.35 * idle;
    const driftX = Math.sin(t * 0.45) * 0.05 * idle;

    // Pointer parallax, critically damped toward the target. Faded out while the
    // phone is held, so the lean doesn't fight the drag.
    const grabbed = dragging ? 0 : 1;
    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;

    if (!dragging) {
      // A flick keeps spinning and coasts down. The tilt, unlike the spin, eases
      // back to rest — a phone left face-down reads as broken, not as a toy.
      userY += spin;
      spin *= FRICTION;
      userX *= 0.96;
    }

    pivot.position.y = enterY + floatY;
    pivot.rotation.y = enterSpin + userY + pointer.x * 0.32 * idle * grabbed;
    pivot.rotation.x = enterTilt + userX + driftX + pointer.y * 0.16 * idle * grabbed;

    // The payoff: the screen wakes only after the phone has essentially landed.
    if (screenMat) {
      const w = THREE.MathUtils.clamp((t - POWER_ON_AT) / POWER_ON_OVER, 0, 1);
      screenMat.emissiveIntensity = easeOutQuint(w);
    }

    // Halo fades in with the screen, then breathes — a touch brighter as the phone
    // floats up, dimmer as it sinks, so the light feels alive rather than static.
    const gIn = easeOutQuint(THREE.MathUtils.clamp((t - GLOW_AT) / GLOW_OVER, 0, 1));
    const breath = 0.9 + 0.1 * Math.sin(t * 0.7);   // in phase with floatY
    glowMat.opacity = gIn * GLOW_MAX * breath;
    // Drifts with the phone's parallax lean, kept subtle so it never detaches.
    glow.position.x = pointer.x * 0.6;
    glow.position.y = floatY * 0.5;

    renderer.render(scene, camera);

    // After the render, so the world matrices the projection reads are this
    // frame's. The phone floats and the page scrolls, so the rect moves.
    updateHit();
  }
}
