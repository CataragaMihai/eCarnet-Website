// ============================================
// eCarnet — Main JS
// Mobile menu, navbar state, scroll reveal,
// active section tracking
// ============================================

(function () {
  "use strict";

  // ---- DOM ----
  var navbar      = document.querySelector(".navbar");
  var hamburger   = document.querySelector(".hamburger");
  var navLinks    = document.querySelector(".nav-links");
  var overlay     = document.querySelector(".mobile-overlay");
  var allNavLinks = document.querySelectorAll(".nav-link");
  var sections    = document.querySelectorAll("section[id]");

  // ---- Mobile Menu ----
  function openMenu() {
    hamburger.classList.add("open");
    navLinks.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Închide meniu");
  }

  function closeMenu() {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Deschide meniu");
  }

  if (hamburger) {
    hamburger.addEventListener("click", function (e) {
      e.stopPropagation();
      if (navLinks.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  // Close on link click
  allNavLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (navLinks.classList.contains("open")) {
        closeMenu();
      }
    });
  });

  // Clean URL hash after any anchor click so shared links open at the top
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      setTimeout(function () {
        history.replaceState(null, "", window.location.pathname);
      }, 50);
    });
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks && navLinks.classList.contains("open")) {
      closeMenu();
    }
  });

  // ---- Navbar: light-section detection (desktop only) ----
  var isMobile = window.matchMedia("(max-width: 767px)");
  var lightSections = document.querySelectorAll(".concept, .features");
  var navHeight = 64;
  var lightTicking = false;

  function checkNavbarLight() {
    lightTicking = false;
    if (isMobile.matches) {
      navbar.classList.remove("is-light-section");
      return;
    }
    var anyLight = false;
    lightSections.forEach(function (s) {
      var rect = s.getBoundingClientRect();
      if (rect.top < navHeight && rect.bottom > navHeight) anyLight = true;
    });
    navbar.classList.toggle("is-light-section", anyLight);
  }

  window.addEventListener("scroll", function () {
    if (!lightTicking) {
      lightTicking = true;
      requestAnimationFrame(checkNavbarLight);
    }
  }, { passive: true });

  // Initial check + resize
  checkNavbarLight(); 
  isMobile.addEventListener("change", checkNavbarLight);

  // ---- Active nav link ----
  var navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          allNavLinks.forEach(function (link) {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + id
            );
          });
        }
      });
    },
    { threshold: 0.2, rootMargin: "-60px 0px 0px 0px" }
  );

  sections.forEach(function (sec) {
    navObserver.observe(sec);
  });

  // ---- Scroll-reveal animations ----
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale"
  );

  if (prefersReducedMotion) {
    revealElements.forEach(function (el) {
      el.classList.add("visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ---- Keyboard navigation mode ----
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-nav");
    }
  });

  document.addEventListener("mousedown", function () {
    document.body.classList.remove("keyboard-nav");
  });

  // ============================================
  // OVERDRIVE — Cinematic Effects
  // ============================================

  var isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // ---- Scroll Progress Bar ----
  var scrollProgress = document.querySelector(".scroll-progress");

  if (scrollProgress && !prefersReducedMotion) {
    var progressTicking = false;

    window.addEventListener("scroll", function () {
      if (!progressTicking) {
        progressTicking = true;
        requestAnimationFrame(function () {
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
          scrollProgress.style.width = pct + "%";
          progressTicking = false;
        });
      }
    }, { passive: true });
  }

  // ---- Hero Entrance Trigger ----
  var heroEntrances = document.querySelectorAll(".hero-entrance");

  if (heroEntrances.length && !prefersReducedMotion) {
    // Small delay so the browser paints the initial hidden state first
    setTimeout(function () {
      heroEntrances.forEach(function (el) {
        el.classList.add("visible");
      });
    }, 100);
  } else {
    // Reduced motion or no elements — show immediately
    heroEntrances.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  // ---- 3D Card Tilt (desktop only) ----
  if (!isTouch && !prefersReducedMotion) {
    var featureCards = document.querySelectorAll(".feature-card");

    featureCards.forEach(function (card) {
      card.addEventListener("mouseenter", function () {
        card.classList.add("tilt-active");
      });

      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        // ±8deg max tilt
        var rotateY = ((x - centerX) / centerX) * 8;
        var rotateX = ((centerY - y) / centerY) * 8;

        card.style.transform =
          "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
        card.style.boxShadow =
          (rotateY * -0.5) + "px " + (rotateX * 0.5 + 8) + "px 30px rgba(0,0,0,0.12)";
      });

      card.addEventListener("mouseleave", function () {
        card.classList.remove("tilt-active");
        card.style.transform = "";
        card.style.boxShadow = "";
      });
    });
  }

  // ---- Magnetic CTA Button (desktop only) ----
  if (!isTouch && !prefersReducedMotion) {
    var ctaBtns = document.querySelectorAll(".cta-btn");

    ctaBtns.forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;

        // Subtle pull — max ~6px shift
        btn.classList.add("magnetic-active");
        btn.style.transform = "translate(" + (x * 0.15) + "px, " + (y * 0.15) + "px)";
      });

      btn.addEventListener("mouseleave", function () {
        btn.classList.add("magnetic-active");
        btn.style.transform = "";
        // Remove after transition completes
        setTimeout(function () {
          btn.classList.remove("magnetic-active");
        }, 200);
      });
    });
  }

  // ---- Parallax Mockup ----
  if (!prefersReducedMotion) {
    var conceptVisual = document.querySelector(".concept-visual");

    if (conceptVisual) {
      var parallaxTicking = false;

      window.addEventListener("scroll", function () {
        if (!parallaxTicking) {
          parallaxTicking = true;
          requestAnimationFrame(function () {
            var rect = conceptVisual.getBoundingClientRect();
            var viewH = window.innerHeight;

            // Only calculate when in/near viewport
            if (rect.top < viewH && rect.bottom > 0) {
              var center = rect.top + rect.height / 2;
              var offset = (center - viewH / 2) * 0.08; // subtle 8% parallax
              conceptVisual.style.transform = "translateY(" + offset + "px)";
            }

            parallaxTicking = false;
          });
        }
      }, { passive: true });
    }
  }

  // ---- Count-up animation ----
  var countEls = document.querySelectorAll(".count-up");

  function formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-target"), 10);
    var duration = 1000;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = formatNumber(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Trigger underline animation after count finishes
        var underline = document.querySelector(".hero-title-underline");
        if (underline) underline.classList.add("visible");
      }
    }

    requestAnimationFrame(step);
  }

  countEls.forEach(function (el) {
    var obs = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          animateCount(el);
          obs.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
  });

  // ============================================
  // Hero Icon — Draggable + Tagline
  // ============================================

  var heroRings = document.querySelector(".hero-rings");
  var heroAppIcon = document.getElementById("hero-app-icon-click");

  if (heroRings && heroAppIcon) {
    var heroDragging = false;
    var heroWasDragged = false;
    var heroOffsetX = 0;
    var heroOffsetY = 0;
    var heroTransX = 0;
    var heroTransY = 0;

    function heroOnDragStart(cx, cy) {
      heroDragging = true;
      heroWasDragged = false;
      heroRings.classList.remove("snap-back");
      heroAppIcon.classList.add("is-dragging");
      var rect = heroRings.getBoundingClientRect();
      heroOffsetX = cx - rect.left - rect.width / 2 - heroTransX;
      heroOffsetY = cy - rect.top - rect.height / 2 - heroTransY;
    }

    function heroOnDragMove(cx, cy) {
      if (!heroDragging) return;
      var rect = heroRings.parentElement.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var newX = cx - centerX - heroOffsetX;
      var newY = cy - centerY - heroOffsetY;
      var dist = Math.sqrt(newX * newX + newY * newY);
      if (dist > 3) heroWasDragged = true;
      heroTransX = newX;
      heroTransY = newY;
      heroRings.style.transform = "translate(" + newX + "px, " + newY + "px)";
    }

    function heroOnDragEnd() {
      if (!heroDragging) return;
      heroDragging = false;
      heroAppIcon.classList.remove("is-dragging");
      heroTransX = 0;
      heroTransY = 0;
      heroRings.classList.add("snap-back");
      heroRings.style.transform = "translate(0, 0)";
    }

    heroRings.addEventListener("transitionend", function (e) {
      if (e.propertyName === "transform") {
        heroRings.classList.remove("snap-back");
        heroRings.style.transform = "";
      }
    });

    // Mouse drag
    heroAppIcon.addEventListener("mousedown", function (e) {
      e.preventDefault();
      heroOnDragStart(e.clientX, e.clientY);
    });
    document.addEventListener("mousemove", function (e) {
      if (heroDragging) heroOnDragMove(e.clientX, e.clientY);
    });
    document.addEventListener("mouseup", function () {
      if (heroDragging) heroOnDragEnd();
    });

    // Touch drag
    heroAppIcon.addEventListener("touchstart", function (e) {
      var t = e.touches[0];
      heroOnDragStart(t.clientX, t.clientY);
    }, { passive: true });
    document.addEventListener("touchmove", function (e) {
      if (heroDragging) {
        var t = e.touches[0];
        heroOnDragMove(t.clientX, t.clientY);
      }
    }, { passive: true });
    document.addEventListener("touchend", function () {
      if (heroDragging) heroOnDragEnd();
    });

  }

  // ============================================
  // Floating E — Magnetic Corner Snap System
  // (Sources from concept mockup, not hero icon)
  // ============================================

  var floatingE = document.getElementById("floating-e");
  var floatingTrigger = document.getElementById("floating-e-trigger");
  var conceptMockup = document.getElementById("concept-mockup");
  var heroSection = document.getElementById("acasa");
  var floatingEOpen = false;

  var isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  function openFloatingMenu() {
    floatingEOpen = true;
    floatingE.classList.add("is-open");
  }

  function closeFloatingMenu() {
    floatingEOpen = false;
    floatingE.classList.remove("is-open");
  }

  if (floatingE && floatingTrigger && conceptMockup && heroSection) {
    // Drag state
    var isDragging = false;
    var dragStartX = 0;
    var dragStartY = 0;
    var dragOffsetX = 0;
    var dragOffsetY = 0;
    var currentEX = 0;
    var currentEY = 0;
    var wasDragged = false;

    function getESize() {
      return window.innerWidth < 768 ? 64 : 78;
    }

    function getSnapAnchors() {
      var viewW = window.innerWidth;
      var viewH = window.innerHeight;
      var eSize = getESize();
      var m = viewW < 768 ? 16 : 24;
      return [
        { x: viewW - eSize - m, y: viewH - eSize - m },
        { x: m, y: viewH - eSize - m },
        { x: viewW - eSize - m, y: viewH * 0.4 },
        { x: m, y: viewH * 0.4 }
      ];
    }

    function getDefaultCorner() {
      var viewW = window.innerWidth;
      var viewH = window.innerHeight;
      var eSize = getESize();
      var m = viewW < 768 ? 16 : 24;
      return { x: viewW - eSize - m, y: viewH - eSize - m };
    }

    function getNearestAnchor(x, y) {
      var anchors = getSnapAnchors();
      var best = anchors[0];
      var bestDist = Infinity;
      for (var i = 0; i < anchors.length; i++) {
        var dx = x - anchors[i].x;
        var dy = y - anchors[i].y;
        var dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          best = anchors[i];
        }
      }
      return best;
    }

    function setPosition(x, y, animate) {
      currentEX = x;
      currentEY = y;
      if (animate) {
        floatingE.classList.add("snapping");
      } else {
        floatingE.classList.remove("snapping");
      }
      floatingE.style.transform = "translate(" + x + "px, " + y + "px)";
    }

    floatingE.addEventListener("transitionend", function (e) {
      if (e.propertyName === "transform") {
        floatingE.classList.remove("snapping");
      }
    });

    function updateMenuSide() {
      var viewW = window.innerWidth;
      var isLeft = currentEX < viewW / 2;
      floatingE.classList.toggle("menu-flip", isLeft);
    }

    var wasVisible = false;

    function updateFloatingE() {
      if (isDragging) return;

      var viewW = window.innerWidth;
      var viewH = window.innerHeight;
      var eSize = getESize();

      var heroRect = heroSection.getBoundingClientRect();
      var shouldHide = heroRect.bottom > viewH * 0.15;

      if (shouldHide) {
        if (wasVisible) {
          // Animate back toward mockup before fading
          var mockRect = conceptMockup.getBoundingClientRect();
          var mockCX = mockRect.left + mockRect.width / 2 - eSize / 2;
          var mockCY = mockRect.top + mockRect.height * 0.3;
          setPosition(mockCX, mockCY, true);
          floatingE.style.opacity = "0";
          wasVisible = false;
        } else {
          // Already hidden — silently reposition at mockup
          floatingE.classList.remove("visible");
          floatingE.style.opacity = "0";
          var mockRect2 = conceptMockup.getBoundingClientRect();
          var mockCX2 = mockRect2.left + mockRect2.width / 2 - eSize / 2;
          var mockCY2 = mockRect2.top + mockRect2.height * 0.3;
          setPosition(mockCX2, mockCY2, false);
        }
        floatingE.classList.remove("visible");
        return;
      }

      // Show E button
      floatingE.style.opacity = "1";
      floatingE.classList.add("visible");
      wasVisible = true;

      var corner = getDefaultCorner();
      setPosition(corner.x, corner.y, true);
      currentEX = corner.x;
      updateMenuSide();
    }

    // ---- Drag ----

    function onDragStart(clientX, clientY) {
      isDragging = true;
      wasDragged = false;
      floatingE.classList.remove("snapping");
      dragStartX = clientX;
      dragStartY = clientY;
      dragOffsetX = clientX - currentEX;
      dragOffsetY = clientY - currentEY;
      floatingE.style.cursor = "grabbing";
    }

    function onDragMove(clientX, clientY) {
      if (!isDragging) return;
      var dx = clientX - dragStartX;
      var dy = clientY - dragStartY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) wasDragged = true;

      var newX = clientX - dragOffsetX;
      var newY = clientY - dragOffsetY;
      var viewW = window.innerWidth;
      var viewH = window.innerHeight;
      var eSize = getESize();
      newX = Math.max(0, Math.min(viewW - eSize, newX));
      newY = Math.max(0, Math.min(viewH - eSize, newY));

      setPosition(newX, newY, false);
    }

    function onDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      floatingE.style.cursor = "";

      var anchor = getNearestAnchor(currentEX, currentEY);
      setPosition(anchor.x, anchor.y, true);
      currentEX = anchor.x;
      updateMenuSide();
    }

    // Mouse drag
    floatingTrigger.addEventListener("mousedown", function (e) {
      e.preventDefault();
      onDragStart(e.clientX, e.clientY);
    });

    document.addEventListener("mousemove", function (e) {
      if (isDragging) onDragMove(e.clientX, e.clientY);
    });

    document.addEventListener("mouseup", function () {
      if (isDragging) onDragEnd();
    });

    // Touch drag
    floatingTrigger.addEventListener("touchstart", function (e) {
      var touch = e.touches[0];
      onDragStart(touch.clientX, touch.clientY);
    }, { passive: true });

    document.addEventListener("touchmove", function (e) {
      if (isDragging) {
        var touch = e.touches[0];
        onDragMove(touch.clientX, touch.clientY);
      }
    }, { passive: true });

    document.addEventListener("touchend", function () {
      if (isDragging) onDragEnd();
    });

    // Scroll listener
    var floatingETicking = false;

    window.addEventListener("scroll", function () {
      if (!floatingETicking) {
        floatingETicking = true;
        requestAnimationFrame(function () {
          updateFloatingE();
          floatingETicking = false;
        });
      }
    }, { passive: true });

    updateFloatingE();
    window.addEventListener("resize", function () {
      if (!isDragging) updateFloatingE();
    });

    // Menu: hover on desktop, click/tap on mobile
    var hoverCloseTimer = null;

    if (isTouchDevice) {
      floatingTrigger.addEventListener("click", function (e) {
        if (wasDragged) return;
        e.stopPropagation();
        if (floatingEOpen) {
          closeFloatingMenu();
        } else {
          openFloatingMenu();
        }
      });
    } else {
      floatingE.addEventListener("mouseenter", function () {
        if (isDragging) return;
        if (hoverCloseTimer) {
          clearTimeout(hoverCloseTimer);
          hoverCloseTimer = null;
        }
        openFloatingMenu();
      });
      floatingE.addEventListener("mouseleave", function () {
        hoverCloseTimer = setTimeout(function () {
          closeFloatingMenu();
          hoverCloseTimer = null;
        }, 300);
      });

      floatingTrigger.addEventListener("click", function (e) {
        if (wasDragged) return;
        e.stopPropagation();
      });
    }

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (floatingEOpen && !floatingE.contains(e.target)) {
        closeFloatingMenu();
      }
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && floatingEOpen) {
        closeFloatingMenu();
        floatingTrigger.focus();
      }
    });

    // Close menu after nav click
    var floatingItems = floatingE.querySelectorAll(".floating-e-item");
    floatingItems.forEach(function (item) {
      item.addEventListener("click", function () {
        closeFloatingMenu();
      });
    });
  }

})();
