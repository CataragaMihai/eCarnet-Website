// ── Resize dispatcher ──────────────────────────────────────────────────────
// Every resize-driven measurement funnels through here. A window drag fires the
// native `resize` event dozens of times a second; without this, each of the
// page's handlers would run on every one of those events and synchronously read
// layout (getBoundingClientRect) right after writing styles — the classic
// read→write→read thrash that makes dragging stutter. Instead we register each
// handler once and flush them all together, a single batched pass per animation
// frame. Synthetic `dispatchEvent(new Event('resize'))` calls ride the same rail.
const __resizeHandlers = [];
let __resizeQueued = false;
function onResize(fn) { __resizeHandlers.push(fn); }
function requestResizeFlush() {
  if (__resizeQueued) return;
  __resizeQueued = true;
  requestAnimationFrame(() => {
    __resizeQueued = false;
    for (let i = 0; i < __resizeHandlers.length; i++) __resizeHandlers[i]();
  });
}
window.addEventListener('resize', requestResizeFlush, { passive: true });

document.getElementById('cta-main').addEventListener('click', function (e) {
  e.preventDefault();
  document.getElementById('problema').scrollIntoView({ behavior: 'smooth' });
});

// Stagger delay for grouped animated elements
document.querySelectorAll('.problem-grid, .features-col').forEach(group => {
  group.querySelectorAll('.animate-in').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
  });
});

// Scroll-triggered entrance animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

// Timeline v2: draw-on-scroll animation
const timelineV2 = document.querySelector('.timeline-v2');
if (timelineV2) {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      timelineV2.classList.add('is-visible');
    }
  }, { threshold: 0.3 }).observe(timelineV2);
}

// Nav scroll-spy + sliding underline.
// A single bar glides under the active link (or the hovered one, snapping back
// to the active section on mouse-out) instead of the underline jumping.
const navLinksWrap = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-link');
const linkById = new Map(
  [...navLinks].map(link => [link.getAttribute('href').slice(1), link])
);

// The moving indicator, injected so the markup stays clean.
const indicator = document.createElement('span');
indicator.className = 'nav-underline';
navLinksWrap.appendChild(indicator);

let activeLink = document.querySelector('.nav-link.active') || navLinks[0];

// Position the bar under a given link by measuring against the nav container.
function moveIndicator(link) {
  if (!link) return;
  const wrapRect = navLinksWrap.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  indicator.style.width = `${linkRect.width}px`;
  indicator.style.transform = `translateX(${linkRect.left - wrapRect.left}px)`;
  indicator.classList.add('is-active');
}

// Hover-follow: track the cursor, then snap back to the active section.
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => moveIndicator(link));
});
navLinksWrap.addEventListener('mouseleave', () => moveIndicator(activeLink));

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      activeLink = linkById.get(entry.target.id) || activeLink;
      activeLink?.classList.add('active');
      // Don't yank the bar away while the user is hovering the nav.
      if (!navLinksWrap.matches(':hover')) moveIndicator(activeLink);
    }
  });
}, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

linkById.forEach((_link, id) => {
  const section = document.getElementById(id);
  if (section) spy.observe(section);
});

// Place the bar on load (after fonts settle) and keep it aligned on resize.
window.addEventListener('load', () => moveIndicator(activeLink));
moveIndicator(activeLink);
onResize(() => moveIndicator(activeLink));

// Language switcher: a blue pill slides to the hovered button and rests on the
// active one — same feel as the nav underline. (Actual language switching isn't
// wired up yet; this is just the indicator motion.)
const langSwitcher = document.querySelector('.lang-switcher');
if (langSwitcher) {
  const langBtns = langSwitcher.querySelectorAll('.lang-btn');
  const langIndicator = document.createElement('span');
  langIndicator.className = 'lang-indicator';
  langSwitcher.insertBefore(langIndicator, langSwitcher.firstChild);

  let activeBtn = langSwitcher.querySelector('.lang-btn.active') || langBtns[0];

  function moveLang(btn) {
    if (!btn) return;
    const wrap = langSwitcher.getBoundingClientRect();
    const r = btn.getBoundingClientRect();
    langIndicator.style.width = `${r.width}px`;
    langIndicator.style.transform = `translateX(${r.left - wrap.left}px)`;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applyAndRefit(lang) {
    if (window.applyLanguage) window.applyLanguage(lang);
    // Text widths changed — let the nav underline (and other measurers) re-fit.
    window.dispatchEvent(new Event('resize'));
  }

  function selectLang(btn) {
    if (!btn) return;
    langBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeBtn = btn;
    moveLang(btn); // pill slides immediately so the control stays responsive

    if (reduceMotion) {
      applyAndRefit(btn.dataset.lang);
      return;
    }
    // Refocus: page fades + blurs + scales out, text swaps while invisible,
    // then sharpens back in.
    document.body.classList.add('lang-switching');
    setTimeout(() => {
      applyAndRefit(btn.dataset.lang);
      document.body.classList.remove('lang-switching');
    }, 160);
  }

  // Hover previews the pill; clicking switches language.
  langBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => moveLang(btn));
    btn.addEventListener('click', () => selectLang(btn));
  });
  langSwitcher.addEventListener('mouseleave', () => moveLang(activeBtn));

  // Restore the saved language (default Romanian), then place the pill.
  let savedLang = 'ro';
  try { savedLang = localStorage.getItem('ecarnet-lang') || 'ro'; } catch (e) {}
  const savedBtn = langSwitcher.querySelector('.lang-btn[data-lang="' + savedLang + '"]') || activeBtn;
  langBtns.forEach(b => b.classList.remove('active'));
  savedBtn.classList.add('active');
  activeBtn = savedBtn;
  if (window.applyLanguage) window.applyLanguage(savedLang);

  window.addEventListener('load', () => moveLang(activeBtn));
  moveLang(activeBtn);
  onResize(() => moveLang(activeBtn));
}

// Brand collapse: shrink "eCarnet" to the capped-e once the SECOND section
// (the problem section) reaches the top of the viewport — not right after
// leaving the hero. Reverts when you scroll back up into the hero. rAF-throttled.
const navbar = document.querySelector('.navbar');
if (navbar) {
  let navTicking = false;
  const collapseAt = document.getElementById('problema');

  function updateBrand() {
    // Collapse once the problem section's top crosses just under the navbar,
    // and stay collapsed for everything below it.
    const collapse = collapseAt
      ? collapseAt.getBoundingClientRect().top <= 80
      : window.scrollY > window.innerHeight * 0.6;
    navbar.classList.toggle('scrolled', collapse);
    navTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!navTicking) {
      navTicking = true;
      requestAnimationFrame(updateBrand);
    }
  }, { passive: true });

  updateBrand();
}

// Hide scroll indicator on first scroll
window.addEventListener('scroll', function hideScroll() {
  document.querySelector('.scroll-indicator')?.classList.add('hidden');
  window.removeEventListener('scroll', hideScroll);
});

// Solution icon: drag the icon; the ring trails after it magnetically.
// The icon tracks the pointer immediately on its own layer (.icon-magnet) and
// springs home on release. The ring (.ring-magnet) eases toward the icon's
// target each frame, so it lags slightly — barely there, but felt. Both layers
// sit inside the scroll-animated orbit, so they keep its scroll drift.
const orbit = document.querySelector('.solution-orbit');
const iconMagnet = document.querySelector('.icon-magnet');
const ringMagnet = document.querySelector('.ring-magnet');
const dragHandle = document.querySelector('.solution-icon');

if (orbit && iconMagnet && ringMagnet && dragHandle) {
  let dragging = false;
  let startX = 0, startY = 0;
  let targetX = 0, targetY = 0;   // where the icon is (pointer offset, or 0 at rest)
  let ringX = 0, ringY = 0;       // ring's lagged position
  let rafId = null;

  const LAG = 0.2;                 // lower = more trail; 0.2 reads as "barely there"

  function tick() {
    ringX += (targetX - ringX) * LAG;
    ringY += (targetY - ringY) * LAG;

    if (Math.abs(targetX - ringX) < 0.1 && Math.abs(targetY - ringY) < 0.1) {
      ringX = targetX; ringY = targetY;        // snap to rest, stop the loop
      ringMagnet.style.transform = `translate(${ringX}px, ${ringY}px)`;
      rafId = null;
      return;
    }
    ringMagnet.style.transform = `translate(${ringX}px, ${ringY}px)`;
    rafId = requestAnimationFrame(tick);
  }

  function ensureTick() { if (rafId == null) rafId = requestAnimationFrame(tick); }

  dragHandle.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    iconMagnet.style.transition = 'none';
    orbit.classList.add('dragging');
    dragHandle.setPointerCapture(e.pointerId);
  });

  dragHandle.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    targetX = e.clientX - startX;
    targetY = e.clientY - startY;
    iconMagnet.style.transform = `translate(${targetX}px, ${targetY}px)`;
    ensureTick();
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    orbit.classList.remove('dragging');
    targetX = 0; targetY = 0;
    // Icon springs home; the ring keeps trailing toward home via the rAF loop.
    iconMagnet.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';
    iconMagnet.style.transform = 'translate(0px, 0px)';
    ensureTick();
    try { dragHandle.releasePointerCapture(e.pointerId); } catch (_) {}
  }

  dragHandle.addEventListener('pointerup', endDrag);
  dragHandle.addEventListener('pointercancel', endDrag);
}

// Problem cards: cursor spotlight. Feed the pointer position into CSS vars so
// the ::before glow tracks the mouse. rAF-throttled to one write per frame.
document.querySelectorAll('.problem-card').forEach(card => {
  let frame = null;

  card.addEventListener('mousemove', (e) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
      frame = null;
    });
  });
});

// Dev business card: opens on hover/focus and stays pinned so you can use it.
// Traffic lights behave like macOS — red closes, yellow genie-minimizes into the
// name, green zooms to 1.5×.
const devWrap = document.querySelector('.dev-card-wrap');
const devCard = document.querySelector('.dev-card');
if (devWrap && devCard) {
  let hideTimer = null;
  const open  = () => { clearTimeout(hideTimer); devCard.classList.add('is-open'); };
  const close = () => devCard.classList.remove('is-open', 'is-max', 'is-minimizing');
  // Small delay so the cursor can cross the gap between the name and the card
  // without it closing; landing on either cancels the timer.
  const scheduleClose = () => { clearTimeout(hideTimer); hideTimer = setTimeout(close, 140); };

  // Stay up while hovering the name OR the window; close once the cursor leaves both.
  devWrap.addEventListener('mouseenter', open);
  devWrap.addEventListener('mouseleave', scheduleClose);
  devWrap.addEventListener('focusin', open);
  devWrap.addEventListener('focusout', scheduleClose);

  devCard.querySelector('.dev-dot-red').addEventListener('click', close);

  devCard.querySelector('.dev-dot-green').addEventListener('click', () => {
    devCard.classList.toggle('is-max');
  });

  devCard.querySelector('.dev-dot-yellow').addEventListener('click', () => {
    devCard.classList.remove('is-max');
    devCard.classList.add('is-minimizing');
  });

  // Hide once the minimize animation finishes.
  devCard.addEventListener('animationend', (e) => {
    if (e.animationName === 'dev-minimize') close();
  });
}

// ============================================
// Mobile nav drawer (hamburger). The drawer reuses the desktop .nav-links and
// .lang-switcher elements, so scroll-spy, i18n and the lang pill keep working.
// ============================================
(function () {
  var toggle   = document.getElementById('nav-toggle');
  var drawer   = document.getElementById('nav-drawer');
  var overlay  = document.getElementById('nav-overlay');
  var closeBtn = document.getElementById('nav-drawer-close');
  if (!toggle || !drawer || !overlay || !closeBtn) return;

  function isOpen() { return document.body.classList.contains('drawer-open'); }

  function setOpen(open) {
    document.body.classList.toggle('drawer-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    // The lang pill measures rects; re-measure now that the drawer is visible.
    if (open) window.dispatchEvent(new Event('resize'));
  }

  toggle.addEventListener('click', function () { setOpen(!isOpen()); });
  closeBtn.addEventListener('click', function () { setOpen(false); });
  overlay.addEventListener('click', function () { setOpen(false); });

  // Tapping a section link should close the drawer and let the page scroll.
  drawer.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) { setOpen(false); toggle.focus(); }
  });

  // Growing past the mobile breakpoint must never leave the page scroll-locked.
  onResize(function () {
    if (window.innerWidth > 768 && isOpen()) setOpen(false);
  });
})();

// ============================================
// Floating "E" — draggable email-capture button.
// Hidden over the hero, pops in from the corner once you scroll past it.
// Draggable with magnetic corner-snap; hover/tap opens a signup card that sends
// the email to me via EmailJS.
// ============================================
(function () {
  var EMAILJS_PUBLIC_KEY  = "JcHMwo9MQ774aS1ec";
  var EMAILJS_SERVICE_ID  = "service_ovj1n8b";
  var EMAILJS_TEMPLATE_ID = "template_6en3rbs";

  if (typeof emailjs !== "undefined") {
    try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); }
    catch (err) { console.warn("EmailJS init failed:", err); }
  }

  var floatingE = document.getElementById("floating-e");
  var trigger   = document.getElementById("floating-e-trigger");
  var hero      = document.getElementById("acasa");
  if (!floatingE || !trigger || !hero) return;

  var emailInput = document.getElementById("capture-email");

  // Keep the card open while the email field is focused or has text typed —
  // don't let hover-out or scroll yank it away mid-typing.
  function keepOpen() {
    return !!emailInput && (document.activeElement === emailInput || emailInput.value.trim() !== "");
  }

  var isTouch = window.matchMedia("(hover: none)").matches;

  var SIZE = 60;
  var footer = document.querySelector('.site-footer');
  function margin() { return window.innerWidth < 768 ? 16 : 24; }
  // Bottom resting edge for the button. Normally a margin above the viewport
  // bottom, but once the footer scrolls into view the button rises to sit a
  // margin ABOVE the footer's top edge instead of covering its links.
  function bottomY() {
    var base = window.innerHeight - SIZE - margin();
    if (!footer) return base;
    var footerTop = footer.getBoundingClientRect().top;
    return Math.min(base, footerTop - SIZE - margin());
  }
  function corner() {
    return { x: window.innerWidth - SIZE - margin(), y: bottomY() };
  }
  function anchors() {
    var vW = window.innerWidth, m = margin();
    return [
      { x: vW - SIZE - m, y: bottomY() }     // bottom-right (the only anchor)
    ];
  }
  function nearest(x, y) {
    var a = anchors(), best = a[0], bd = Infinity;
    for (var i = 0; i < a.length; i++) {
      var d = (x - a[i].x) * (x - a[i].x) + (y - a[i].y) * (y - a[i].y);
      if (d < bd) { bd = d; best = a[i]; }
    }
    return best;
  }

  var dragging = false, wasDragged = false, visible = false, isOpen = false;
  var startX = 0, startY = 0, offX = 0, offY = 0, curX = 0, curY = 0;

  function setPos(x, y, animate) {
    curX = x; curY = y;
    floatingE.classList.toggle("snapping", !!animate);
    floatingE.style.transform = "translate(" + x + "px, " + y + "px)";
  }
  function updateSide() {
    floatingE.classList.toggle("menu-flip", curX < window.innerWidth / 2);
  }
  floatingE.addEventListener("transitionend", function (e) {
    if (e.propertyName === "transform") floatingE.classList.remove("snapping", "reanchoring");
  });

  function openMenu()  { isOpen = true;  floatingE.classList.add("is-open"); syncCapture(); }
  function closeMenu() { isOpen = false; floatingE.classList.remove("is-open"); }

  function update() {
    if (dragging) return;
    var hide = hero.getBoundingClientRect().bottom > window.innerHeight * 0.6;
    var c = corner();
    if (hide) {
      if (visible) {
        visible = false;
        closeMenu();
        floatingE.classList.add("snapping");
        floatingE.style.opacity = "0";
        floatingE.style.transform = "translate(" + c.x + "px," + c.y + "px) scale(0.4)";
        setTimeout(function () { floatingE.classList.remove("snapping"); }, 450);
      } else {
        floatingE.style.opacity = "0";
        floatingE.style.transform = "translate(" + c.x + "px," + c.y + "px) scale(0)";
        curX = c.x; curY = c.y;
      }
      return;
    }
    if (!visible) {
      visible = true;
      floatingE.classList.remove("snapping");
      floatingE.style.opacity = "0";
      floatingE.style.transform = "translate(" + c.x + "px," + c.y + "px) scale(0)";
      curX = c.x; curY = c.y;
      void floatingE.offsetWidth; // commit start state
      requestAnimationFrame(function () {
        floatingE.classList.add("snapping");
        floatingE.style.opacity = "1";
        floatingE.style.transform = "translate(" + c.x + "px," + c.y + "px) scale(1)";
        updateSide();
      });
    } else if (!isOpen) {
      // Re-assert the resting corner every scroll frame so the button rides up
      // smoothly as the footer enters view (bottomY tracks it) and eases back
      // down as it leaves. Skipped while the menu is open so it can't drift
      // out from under the cursor mid-interaction.
      var c2 = corner();
      if (c2.x !== curX || c2.y !== curY) setPos(c2.x, c2.y, false);
      updateSide();
    }
  }

  function dragStart(cx, cy) {
    dragging = true; wasDragged = false;
    floatingE.classList.remove("snapping");
    startX = cx; startY = cy; offX = cx - curX; offY = cy - curY;
    trigger.style.cursor = "grabbing";
  }
  function dragMove(cx, cy) {
    if (!dragging) return;
    if (Math.abs(cx - startX) > 4 || Math.abs(cy - startY) > 4) wasDragged = true;
    setPos(
      Math.max(0, Math.min(window.innerWidth  - SIZE, cx - offX)),
      Math.max(0, Math.min(window.innerHeight - SIZE, cy - offY)),
      false
    );
  }
  function dragEnd() {
    if (!dragging) return;
    dragging = false;
    trigger.style.cursor = "";
    var a = nearest(curX, curY);
    setPos(a.x, a.y, true);
    updateSide();
  }

  trigger.addEventListener("mousedown", function (e) { e.preventDefault(); dragStart(e.clientX, e.clientY); });
  document.addEventListener("mousemove", function (e) { if (dragging) dragMove(e.clientX, e.clientY); });
  document.addEventListener("mouseup", dragEnd);
  trigger.addEventListener("touchstart", function (e) { dragStart(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  document.addEventListener("touchmove", function (e) { if (dragging) dragMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  document.addEventListener("touchend", dragEnd);

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (isOpen && !keepOpen()) closeMenu();
    if (!ticking) { ticking = true; requestAnimationFrame(function () { update(); ticking = false; }); }
  }, { passive: true });
  // Resize / zoom: force a clean, authoritative state instead of trusting the
  // stale pixel position. Either hidden (hero genuinely in view) or snapped to
  // the nearest bottom corner, fully visible. Kills all the zoom edge cases.
  function reanchor() {
    if (dragging) return;
    var c = corner();
    var heroInView = hero.getBoundingClientRect().bottom > window.innerHeight * 0.6;
    if (heroInView) {
      visible = false;
      closeMenu();
      floatingE.classList.remove("snapping", "reanchoring");
      floatingE.style.opacity = "0";
      floatingE.style.transform = "translate(" + c.x + "px," + c.y + "px) scale(0)";
      curX = c.x; curY = c.y;
      return;
    }
    visible = true;
    var a = nearest(curX, curY);
    curX = a.x; curY = a.y;
    floatingE.classList.remove("snapping");
    floatingE.classList.add("reanchoring");
    floatingE.style.opacity = "1";
    floatingE.style.transform = "translate(" + a.x + "px," + a.y + "px) scale(1)";
    updateSide();
  }

  // Resize, page zoom and pinch all just re-anchor the button to its corner.
  // (An earlier version hid the button while it thought the page was zoomed,
  // but that detection could misfire on a plain window drag and leave the
  // button stuck-hidden until a refresh.) reanchor() already no-ops mid-drag.
  onResize(reanchor);
  // Pinch-zoom fires on visualViewport, not window — route it through the same
  // per-frame flush so it batches with every other resize handler.
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", requestResizeFlush);
    window.visualViewport.addEventListener("scroll", requestResizeFlush);
  }
  update();

  // Open / close
  var closeTimer = null;
  if (isTouch) {
    trigger.addEventListener("click", function (e) {
      if (wasDragged) return;
      e.stopPropagation();
      isOpen ? closeMenu() : openMenu();
    });
  } else {
    floatingE.addEventListener("mouseenter", function () {
      if (dragging) return;
      clearTimeout(closeTimer);
      openMenu();
    });
    floatingE.addEventListener("mouseleave", function () {
      closeTimer = setTimeout(function () { if (!keepOpen()) closeMenu(); }, 300);
    });
    trigger.addEventListener("click", function (e) { if (wasDragged) return; e.stopPropagation(); });
  }
  document.addEventListener("click", function (e) {
    if (isOpen && !floatingE.contains(e.target)) closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) { closeMenu(); trigger.focus(); }
  });

  // Email capture → EmailJS
  var form    = document.getElementById("capture-form");
  var thanks  = document.getElementById("capture-thanks");
  var errorEl = document.getElementById("capture-error");
  var heading = floatingE.querySelector(".capture-heading");
  var submitted = false;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function syncCapture() {
    if (heading) heading.style.display = submitted ? "none" : "";
    if (form)    form.style.display    = submitted ? "none" : "";
    if (errorEl && submitted) errorEl.hidden = true;
    if (thanks)  thanks.hidden = !submitted;
  }

  // Clear the error as soon as the user edits the field.
  if (emailInput && errorEl) {
    emailInput.addEventListener("input", function () { errorEl.hidden = true; });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = emailInput ? emailInput.value.trim() : "";
      if (!EMAIL_RE.test(email)) {              // not a valid address — flag and bail
        if (errorEl) errorEl.hidden = false;
        if (emailInput) emailInput.focus();
        return;
      }
      if (errorEl) errorEl.hidden = true;
      try {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { email: email, name: "eCarnet Visitor" })
          .catch(function (err) { console.error("EmailJS error:", err); });
      } catch (err) { console.error("EmailJS send exception:", err); }
      submitted = true;
      syncCapture();
    });
  }
})();
