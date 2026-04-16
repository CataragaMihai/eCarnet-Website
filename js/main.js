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

})();
