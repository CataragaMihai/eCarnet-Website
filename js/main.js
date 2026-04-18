// ============================================
// eCarnet — Main JS
// i18n, mobile menu, navbar state,
// scroll reveal, active section tracking
// ============================================

(function () {
  "use strict";

  // ============================================
  // I18N — Translations
  // ============================================

  var translations = {
    ro: {
      "nav.home":    "Acasă",
      "nav.problem": "Problema",
      "nav.solution":"Soluția",
      "nav.roadmap": "Progres",
      "nav.contact": "Mesaj",

      "hero.tag":      "Carnetul de elev, reinventat",
      "hero.title":    "Carnetul tău de elev,<br><span class=\"hero-title-glow-wrap\"><span class=\"hero-title-accent\">digital.</span></span>",
      "hero.subtitle": "eCarnet înlocuiește carnetul fizic cu o soluție digitală. Mereu cu tine, niciodată pierdut.",
      "hero.cta":      "Descoperă",

      "problem.eyebrow":  "Problema",
      "problem.title":    "Carnetul fizic este învechit.",
      "problem.subtitle": "Zeci de mii de elevi și studenți din Moldova se confruntă zilnic cu aceleași neajunsuri.",
      "problem.1.title":  "Se pierde ușor",
      "problem.1.text":   "Carnetul fizic poate fi uitat acasă sau pierdut, tocmai când ai nevoie de el.",
      "problem.2.title":  "Expiră",
      "problem.2.text":   "Anual, carnetul expiră și trebuie reînnoit, iar mereu uiți să o faci. Timp pierdut, bani cheltuiți.",
      "problem.3.title":  "Birocrație inutilă",
      "problem.3.text":   "Ștampile, semnături, hârtii. Un proces depășit.",
      "problem.4.title":  "O hârtie simplă",
      "problem.4.text":   "Nu arată notele, absențele sau orarul tău. E doar o hârtie.",
      "problem.5.title":  "Cheltuială",
      "problem.5.text":   "De fiecare dată când îți faci un carnet nou, sau când îl pierzi, sau când îl reînoiești, achiți bani. În decursul anilor, aceste cheltuieli se adună.",

      "solution.eyebrow":  "Soluția",
      "solution.title":    "Același carnet. Acum digital.",
      "solution.subtitle": "eCarnet este o aplicație mobilă care aduce carnetul de elev sau student în telefon — simplu, sigur, modern.",
      "solution.f1.title": "Identitate digitală verificabilă",
      "solution.f1.text":  "Arăți telefonul și gata. Funcționează oriunde ai nevoie să dovedești că ești elev sau student.",
      "solution.f2.title": "Note și absențe",
      "solution.f2.text":  "Catalogul electronic la îndemână. Note, medii, absențe — totul într-un singur loc.",
      "solution.f3.title": "Orar și notițe",
      "solution.f3.text":  "Orarul zilei, teme, notițe personale. O agendă care ține totul la un loc.",

      "roadmap.eyebrow":   "Unde suntem",
      "roadmap.title":     "Parcursul eCarnet.",
      "roadmap.subtitle":  "eCarnet încă nu e gata. Iată unde suntem și unde vrem să ajungem.",
      "roadmap.s1.badge":  "Acum",
      "roadmap.s1.title":  "Concept și design",
      "roadmap.s1.text":   "Definim arhitectura aplicației, fluxurile de utilizare, designul vizual și strategia produsului.",
      "roadmap.s2.badge":  "Urmează",
      "roadmap.s2.title":  "Prototip funcțional",
      "roadmap.s2.text":   "Prima versiune funcțională a aplicației mobile, testată intern cu un set limitat de utilizatori.",
      "roadmap.s3.badge":  "Viitor",
      "roadmap.s3.title":  "Pilot cu o instituție",
      "roadmap.s3.text":   "Colaborare cu o școală sau universitate din Chișinău pentru un test real în condiții reale.",
      "roadmap.s4.badge":  "Viitor",
      "roadmap.s4.title":  "Rafinare și securitate",
      "roadmap.s4.text":   "Îmbunătățiri bazate pe feedback real. Audit de securitate, sistem de validare digitală.",
      "roadmap.s5.badge":  "Viitor",
      "roadmap.s5.title":  "Lansare publică",
      "roadmap.s5.text":   "Disponibil pe iOS și Android. Pregătit pentru adoptare la scară instituțională în Moldova.",
      "roadmap.open":      "Proiectul este open-source.",
      "roadmap.gh":        "Urmărește procesul pe GitHub",

      "footer.tagline": "Pentru elevii și studenții din Moldova.",
      "footer.contact": "Contactează-mă"
    },

    en: {
      "nav.home":    "Home",
      "nav.problem": "Problem",
      "nav.solution":"Solution",
      "nav.roadmap": "Progress",
      "nav.contact": "Message",

      "hero.tag":      "The student ID, reinvented",
      "hero.title":    "Your student ID,<br><span class=\"hero-title-glow-wrap\"><span class=\"hero-title-accent\">on your phone.</span></span>",
      "hero.subtitle": "eCarnet replaces the physical student card with a digital solution. Always with you, never lost.",
      "hero.cta":      "Discover",

      "problem.eyebrow":  "The Problem",
      "problem.title":    "The physical student card isn't keeping up.",
      "problem.subtitle": "Tens of thousands of students in Moldova face the same daily frustrations.",
      "problem.1.title":  "Easy to lose",
      "problem.1.text":   "The physical card can be left at home or lost — exactly when you need it most.",
      "problem.2.title":  "Expires and deteriorates",
      "problem.2.text":   "Paper wears out. Every new school year, it must be renewed. Time lost, money spent.",
      "problem.3.title":  "Unnecessary bureaucracy",
      "problem.3.text":   "Stamps, signatures, forms. An outdated process that wastes everyone's time.",
      "problem.4.title":  "Disconnected from digital life",
      "problem.4.text":   "It doesn't sync with your grades, absences, or schedule. It's an isolated object.",
      "problem.5.title":  "Hard to verify quickly",
      "problem.5.text":   "Without a digital validation system, any card can be faked or rejected.",

      "solution.eyebrow":  "The Solution",
      "solution.title":    "Same card. Now digital.",
      "solution.subtitle": "eCarnet is a mobile app that brings the student ID to your phone — simple, secure, modern.",
      "solution.f1.title": "Verifiable digital identity",
      "solution.f1.text":  "Show your phone and done. Works anywhere you need to prove you're a student.",
      "solution.f2.title": "Grades and attendance",
      "solution.f2.text":  "Your digital gradebook, at hand. Grades, averages, absences — all in one place.",
      "solution.f3.title": "Schedule and notes",
      "solution.f3.text":  "Today's schedule, homework, personal notes. A planner that keeps everything together.",

      "roadmap.eyebrow":   "Where We Are",
      "roadmap.title":     "A serious project, at the concept stage.",
      "roadmap.subtitle":  "eCarnet doesn't pretend to be finished. Here's where we are and where we're headed.",
      "roadmap.s1.badge":  "Now",
      "roadmap.s1.title":  "Concept & Design",
      "roadmap.s1.text":   "Defining the app architecture, user flows, visual design, and product strategy.",
      "roadmap.s2.badge":  "Next",
      "roadmap.s2.title":  "Functional Prototype",
      "roadmap.s2.text":   "First working version of the mobile app, tested internally with a small group of users.",
      "roadmap.s3.badge":  "Future",
      "roadmap.s3.title":  "Pilot with an institution",
      "roadmap.s3.text":   "Collaboration with a school or university in Chișinău for a real-world test.",
      "roadmap.s4.badge":  "Future",
      "roadmap.s4.title":  "Refinement & Security",
      "roadmap.s4.text":   "Improvements based on real feedback. Security audit, digital validation system.",
      "roadmap.s5.badge":  "Future",
      "roadmap.s5.title":  "Public Launch",
      "roadmap.s5.text":   "Available on iOS and Android. Ready for institutional adoption across Moldova.",
      "roadmap.open":      "The project is open-source.",
      "roadmap.gh":        "Follow the process on GitHub",

      "footer.tagline": "For students across Moldova.",
      "footer.contact": "Contact me"
    },

    ru: {
      "nav.home":    "Главная",
      "nav.problem": "Проблема",
      "nav.solution":"Решение",
      "nav.roadmap": "Прогресс",
      "nav.contact": "Сообщение",

      "hero.tag":      "Студенческий билет, переосмыслен",
      "hero.title":    "Твой студенческий билет,<br><span class=\"hero-title-glow-wrap\"><span class=\"hero-title-accent\">в телефоне.</span></span>",
      "hero.subtitle": "eCarnet заменяет бумажный дневник цифровым решением. Всегда под рукой, никогда не теряется.",
      "hero.cta":      "Узнать больше",

      "problem.eyebrow":  "Проблема",
      "problem.title":    "Бумажный дневник устарел.",
      "problem.subtitle": "Десятки тысяч учеников и студентов Молдовы сталкиваются с одними и теми же неудобствами каждый день.",
      "problem.1.title":  "Легко потерять",
      "problem.1.text":   "Дневник можно забыть дома или потерять — именно тогда, когда он нужен.",
      "problem.2.title":  "Истекает и изнашивается",
      "problem.2.text":   "Бумага изнашивается. Каждый учебный год нужно обновлять. Время и деньги потеряны.",
      "problem.3.title":  "Лишняя бюрократия",
      "problem.3.text":   "Печати, подписи, бланки. Устаревший процесс, который отнимает время у всех.",
      "problem.4.title":  "Оторван от цифровой жизни",
      "problem.4.text":   "Не синхронизируется с оценками, пропусками или расписанием. Это изолированный объект.",
      "problem.5.title":  "Сложно проверить",
      "problem.5.text":   "Без цифровой верификации любой дневник можно подделать или не признать.",

      "solution.eyebrow":  "Решение",
      "solution.title":    "Тот же билет. Теперь цифровой.",
      "solution.subtitle": "eCarnet — мобильное приложение, которое переносит студенческий билет в телефон — просто, безопасно, современно.",
      "solution.f1.title": "Проверяемая цифровая личность",
      "solution.f1.text":  "Показываешь телефон — и готово. Работает везде, где нужно подтвердить статус ученика.",
      "solution.f2.title": "Оценки и посещаемость",
      "solution.f2.text":  "Электронный журнал под рукой. Оценки, средний балл, пропуски — всё в одном месте.",
      "solution.f3.title": "Расписание и заметки",
      "solution.f3.text":  "Расписание на день, домашние задания, личные заметки. Всё в одном месте.",

      "roadmap.eyebrow":   "Где мы сейчас",
      "roadmap.title":     "Серьёзный проект на концептуальной стадии.",
      "roadmap.subtitle":  "eCarnet не делает вид, что готов. Вот где мы находимся и куда движемся.",
      "roadmap.s1.badge":  "Сейчас",
      "roadmap.s1.title":  "Концепция и дизайн",
      "roadmap.s1.text":   "Определяем архитектуру приложения, пользовательские потоки, визуальный дизайн и стратегию продукта.",
      "roadmap.s2.badge":  "Далее",
      "roadmap.s2.title":  "Функциональный прототип",
      "roadmap.s2.text":   "Первая рабочая версия мобильного приложения, протестированная внутри с небольшой группой пользователей.",
      "roadmap.s3.badge":  "Будущее",
      "roadmap.s3.title":  "Пилот с учреждением",
      "roadmap.s3.text":   "Сотрудничество со школой или университетом в Кишинёве для реального тестирования.",
      "roadmap.s4.badge":  "Будущее",
      "roadmap.s4.title":  "Доработка и безопасность",
      "roadmap.s4.text":   "Улучшения на основе реальной обратной связи. Аудит безопасности, система верификации.",
      "roadmap.s5.badge":  "Будущее",
      "roadmap.s5.title":  "Публичный запуск",
      "roadmap.s5.text":   "Доступно на iOS и Android. Готово к масштабному внедрению в учреждениях Молдовы.",
      "roadmap.open":      "Проект с открытым исходным кодом.",
      "roadmap.gh":        "Следить за процессом на GitHub",

      "footer.tagline": "Для учеников и студентов Молдовы.",
      "footer.contact": "Написать мне"
    }
  };

  var currentLang = localStorage.getItem("ecarnet-lang") || "ro";

  var mockupSrcs = {
    ro: "assets/mockup.png",
    en: "assets/mockup english.png",
    ru: "assets/mockup russian.png"
  };

  // Label order matches DOM order of .floating-e-item and .hero-shortcut-item
  var navLabelKeys = ["nav.home", "nav.problem", "nav.solution", "nav.roadmap", "nav.contact"];

  function applyTranslations(lang) {
    if (!translations[lang]) return;
    var t = translations[lang];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) el.textContent = t[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    document.documentElement.lang = lang;

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    // Update floating-e item tooltips
    document.querySelectorAll(".floating-e-item").forEach(function (item, i) {
      var key = navLabelKeys[i];
      if (key && t[key]) item.setAttribute("data-label", t[key]);
    });

    // Update hero shortcut item tooltips
    document.querySelectorAll(".hero-shortcut-item").forEach(function (item, i) {
      var key = navLabelKeys[i];
      if (key && t[key]) item.setAttribute("data-label", t[key]);
    });

    // Switch mockup image
    var mockupImg = document.querySelector(".solution-visual img");
    if (mockupImg) {
      mockupImg.src = mockupSrcs[lang] || mockupSrcs.ro;
    }

    currentLang = lang;
    localStorage.setItem("ecarnet-lang", lang);
  }

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var lang = btn.getAttribute("data-lang");
      if (lang !== currentLang) applyTranslations(lang);
    });
  });

  applyTranslations(currentLang);

  // ============================================
  // DOM refs
  // ============================================
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
      if (navLinks.classList.contains("open")) closeMenu();
      else openMenu();
    });
  }

  if (overlay) overlay.addEventListener("click", closeMenu);

  allNavLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (navLinks.classList.contains("open")) closeMenu();
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      setTimeout(function () {
        history.replaceState(null, "", window.location.pathname);
      }, 50);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks && navLinks.classList.contains("open")) closeMenu();
  });

  // ---- Navbar: light-section detection ----
  var isMobile    = window.matchMedia("(max-width: 767px)");
  var lightSections = document.querySelectorAll(".solution-section");
  var navHeight   = 64;
  var lightTicking = false;

  function checkNavbarLight() {
    lightTicking = false;
    if (isMobile.matches) { navbar.classList.remove("is-light-section"); return; }
    var anyLight = false;
    lightSections.forEach(function (s) {
      var rect = s.getBoundingClientRect();
      if (rect.top < navHeight && rect.bottom > navHeight) anyLight = true;
    });
    navbar.classList.toggle("is-light-section", anyLight);
  }

  window.addEventListener("scroll", function () {
    if (!lightTicking) { lightTicking = true; requestAnimationFrame(checkNavbarLight); }
  }, { passive: true });

  checkNavbarLight();
  isMobile.addEventListener("change", checkNavbarLight);

  // ---- Active nav link ----
  var navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          allNavLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    },
    { threshold: 0.2, rootMargin: "-60px 0px 0px 0px" }
  );

  sections.forEach(function (sec) { navObserver.observe(sec); });

  // ---- Scroll-reveal animations ----
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");

  if (prefersReducedMotion) {
    revealElements.forEach(function (el) { el.classList.add("visible"); });
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
    revealElements.forEach(function (el) { revealObserver.observe(el); });
  }

  // ---- Keyboard navigation mode ----
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") document.body.classList.add("keyboard-nav");
  });
  document.addEventListener("mousedown", function () {
    document.body.classList.remove("keyboard-nav");
  });

  // ============================================
  // CINEMATIC EFFECTS
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
    setTimeout(function () {
      heroEntrances.forEach(function (el) { el.classList.add("visible"); });
    }, 100);
  } else {
    heroEntrances.forEach(function (el) { el.classList.add("visible"); });
  }

  // ---- 3D Card Tilt (desktop only) ----
  if (!isTouch && !prefersReducedMotion) {
    var featureCards = document.querySelectorAll(".feature-card");

    featureCards.forEach(function (card) {
      card.addEventListener("mouseenter", function () { card.classList.add("tilt-active"); });

      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateY = ((x - centerX) / centerX) * 8;
        var rotateX = ((centerY - y) / centerY) * 8;
        card.style.transform = "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
        card.style.boxShadow = (rotateY * -0.5) + "px " + (rotateX * 0.5 + 8) + "px 30px rgba(0,0,0,0.12)";
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
        btn.classList.add("magnetic-active");
        btn.style.transform = "translate(" + (x * 0.15) + "px, " + (y * 0.15) + "px)";
      });

      btn.addEventListener("mouseleave", function () {
        btn.classList.add("magnetic-active");
        btn.style.transform = "";
        setTimeout(function () { btn.classList.remove("magnetic-active"); }, 200);
      });
    });
  }

  // ---- Parallax Mockup ----
  if (!prefersReducedMotion) {
  }

  // ============================================
  // Hero Icon — Draggable + Shortcut Wheel
  // ============================================

  var heroRings        = document.querySelector(".hero-rings");
  var heroAppIcon      = document.getElementById("hero-app-icon-click");
  var heroShortcutMenu = document.getElementById("hero-shortcut-menu");

  if (heroRings && heroAppIcon) {
    var heroDragging   = false;
    var heroWasDragged = false;
    var heroOffsetX    = 0;
    var heroOffsetY    = 0;
    var heroTransX     = 0;
    var heroTransY     = 0;
    var heroStartX     = 0;
    var heroStartY     = 0;
    var heroShortcutOpen = false;

    function openHeroShortcut() {
      heroShortcutOpen = true;
      heroRings.classList.add("shortcut-open");
      if (heroShortcutMenu) heroShortcutMenu.setAttribute("aria-hidden", "false");
    }

    function closeHeroShortcut() {
      heroShortcutOpen = false;
      heroRings.classList.remove("shortcut-open");
      if (heroShortcutMenu) heroShortcutMenu.setAttribute("aria-hidden", "true");
    }

    function heroOnDragStart(cx, cy) {
      heroDragging   = true;
      heroWasDragged = false;
      heroStartX     = cx;
      heroStartY     = cy;
      heroRings.classList.remove("snap-back");
      heroAppIcon.classList.add("is-dragging");
      var rect = heroRings.getBoundingClientRect();
      heroOffsetX = cx - rect.left - rect.width / 2 - heroTransX;
      heroOffsetY = cy - rect.top  - rect.height / 2 - heroTransY;
    }

    function heroOnDragMove(cx, cy) {
      if (!heroDragging) return;
      var dx = cx - heroStartX;
      var dy = cy - heroStartY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) heroWasDragged = true;
      var rect = heroRings.parentElement.getBoundingClientRect();
      var newX = cx - (rect.left + rect.width / 2) - heroOffsetX;
      var newY = cy - (rect.top  + rect.height / 2) - heroOffsetY;
      heroTransX = newX;
      heroTransY = newY;
      heroRings.style.transform = "translate(" + newX + "px, " + newY + "px)";
    }

    function heroOnDragEnd() {
      if (!heroDragging) return;
      heroDragging = false;
      heroAppIcon.classList.remove("is-dragging");

      if (!heroWasDragged) {
        // Treat as tap/click — toggle shortcut wheel
        if (heroShortcutOpen) closeHeroShortcut();
        else openHeroShortcut();
      }

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

    // Close shortcut when clicking outside
    document.addEventListener("click", function (e) {
      if (heroShortcutOpen && heroRings && !heroRings.contains(e.target)) {
        closeHeroShortcut();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && heroShortcutOpen) closeHeroShortcut();
    });

    // Close shortcut when a shortcut item is clicked
    if (heroShortcutMenu) {
      heroShortcutMenu.querySelectorAll(".hero-shortcut-item").forEach(function (item) {
        item.addEventListener("click", function () { closeHeroShortcut(); });
      });
    }
  }

  // ============================================
  // Floating E — Magnetic Corner Snap + Pop
  // ============================================

  var floatingE       = document.getElementById("floating-e");
  var floatingTrigger = document.getElementById("floating-e-trigger");
  var heroSection     = document.getElementById("acasa");
  var floatingEOpen   = false;

  var isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  function openFloatingMenu()  { floatingEOpen = true;  floatingE.classList.add("is-open"); }
  function closeFloatingMenu() { floatingEOpen = false; floatingE.classList.remove("is-open"); }

  if (floatingE && floatingTrigger && heroSection) {
    var isDragging  = false;
    var dragStartX  = 0;
    var dragStartY  = 0;
    var dragOffsetX = 0;
    var dragOffsetY = 0;
    var currentEX   = 0;
    var currentEY   = 0;
    var wasDragged  = false;
    var wasVisible  = false;

    function getESize() {
      return window.innerWidth < 768 ? 64 : 78;
    }

    function getCorner() {
      var sz = getESize();
      var vW = window.innerWidth;
      var m  = vW < 768 ? 16 : 24;
      return { x: vW - sz - m, y: window.innerHeight - sz - m };
    }

    function getSnapAnchors() {
      var vW = window.innerWidth;
      var vH = window.innerHeight;
      var sz = getESize();
      var m  = vW < 768 ? 16 : 24;
      return [
        { x: vW - sz - m, y: vH - sz - m },
        { x: m,           y: vH - sz - m },
        { x: vW - sz - m, y: vH * 0.4 },
        { x: m,           y: vH * 0.4 }
      ];
    }

    function getNearestAnchor(x, y) {
      var anchors = getSnapAnchors();
      var best = anchors[0];
      var bestDist = Infinity;
      for (var i = 0; i < anchors.length; i++) {
        var d = Math.pow(x - anchors[i].x, 2) + Math.pow(y - anchors[i].y, 2);
        if (d < bestDist) { bestDist = d; best = anchors[i]; }
      }
      return best;
    }

    function setPosition(x, y, animate) {
      currentEX = x;
      currentEY = y;
      if (animate) floatingE.classList.add("snapping");
      else         floatingE.classList.remove("snapping");
      floatingE.style.transform = "translate(" + x + "px, " + y + "px)";
    }

    floatingE.addEventListener("transitionend", function (e) {
      if (e.propertyName === "transform") floatingE.classList.remove("snapping");
    });

    function updateMenuSide() {
      floatingE.classList.toggle("menu-flip", currentEX < window.innerWidth / 2);
    }

    function updateFloatingE() {
      if (isDragging) return;
      var heroRect = heroSection.getBoundingClientRect();
      var shouldHide = heroRect.bottom > window.innerHeight * 0.15;
      var corner = getCorner();

      if (shouldHide) {
        if (wasVisible) {
          wasVisible = false;
          closeFloatingMenu();
          floatingE.classList.add("snapping");
          floatingE.style.opacity = "0";
          floatingE.style.transform = "translate(" + corner.x + "px, " + corner.y + "px) scale(0.4)";
          setTimeout(function () {
            floatingE.classList.remove("visible", "snapping");
          }, 450);
        } else {
          floatingE.classList.remove("visible", "snapping");
          floatingE.style.opacity = "0";
          floatingE.style.transform = "translate(" + corner.x + "px, " + corner.y + "px) scale(0)";
          currentEX = corner.x;
          currentEY = corner.y;
        }
        return;
      }

      if (!wasVisible) {
        // Pop in from corner
        wasVisible = true;
        floatingE.classList.remove("snapping");
        floatingE.style.opacity = "0";
        floatingE.style.transform = "translate(" + corner.x + "px, " + corner.y + "px) scale(0)";
        currentEX = corner.x;
        currentEY = corner.y;

        void floatingE.offsetWidth; // commit initial state
        requestAnimationFrame(function () {
          floatingE.classList.add("visible", "snapping");
          floatingE.style.opacity = "1";
          floatingE.style.transform = "translate(" + corner.x + "px, " + corner.y + "px) scale(1)";
          updateMenuSide();
        });
      } else {
        // Already visible — only clamp to viewport (e.g. after resize), don't override dragged position
        var sz = getESize();
        var clampedX = Math.max(0, Math.min(window.innerWidth - sz, currentEX));
        var clampedY = Math.max(0, Math.min(window.innerHeight - sz, currentEY));
        if (clampedX !== currentEX || clampedY !== currentEY) {
          setPosition(clampedX, clampedY, false);
        }
        updateMenuSide();
      }
    }

    function onDragStart(cx, cy) {
      isDragging = true;
      wasDragged = false;
      floatingE.classList.remove("snapping");
      dragStartX  = cx; dragStartY  = cy;
      dragOffsetX = cx - currentEX;
      dragOffsetY = cy - currentEY;
      floatingE.style.cursor = "grabbing";
    }

    function onDragMove(cx, cy) {
      if (!isDragging) return;
      var dx = cx - dragStartX;
      var dy = cy - dragStartY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) wasDragged = true;
      var sz = getESize();
      var newX = Math.max(0, Math.min(window.innerWidth  - sz, cx - dragOffsetX));
      var newY = Math.max(0, Math.min(window.innerHeight - sz, cy - dragOffsetY));
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

    floatingTrigger.addEventListener("mousedown", function (e) { e.preventDefault(); onDragStart(e.clientX, e.clientY); });
    document.addEventListener("mousemove",  function (e) { if (isDragging) onDragMove(e.clientX, e.clientY); });
    document.addEventListener("mouseup",    function ()  { if (isDragging) onDragEnd(); });

    floatingTrigger.addEventListener("touchstart", function (e) {
      onDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    document.addEventListener("touchmove", function (e) {
      if (isDragging) onDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    document.addEventListener("touchend", function () { if (isDragging) onDragEnd(); });

    var floatingETicking = false;
    window.addEventListener("scroll", function () {
      if (!floatingETicking) {
        floatingETicking = true;
        requestAnimationFrame(function () { updateFloatingE(); floatingETicking = false; });
      }
    }, { passive: true });

    updateFloatingE();
    window.addEventListener("resize", function () { if (!isDragging) updateFloatingE(); });

    var hoverCloseTimer = null;

    if (isTouchDevice) {
      floatingTrigger.addEventListener("click", function (e) {
        if (wasDragged) return;
        e.stopPropagation();
        if (floatingEOpen) closeFloatingMenu(); else openFloatingMenu();
      });
    } else {
      floatingE.addEventListener("mouseenter", function () {
        if (isDragging) return;
        if (hoverCloseTimer) { clearTimeout(hoverCloseTimer); hoverCloseTimer = null; }
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

    document.addEventListener("click", function (e) {
      if (floatingEOpen && !floatingE.contains(e.target)) closeFloatingMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && floatingEOpen) {
        closeFloatingMenu();
        floatingTrigger.focus();
      }
    });

    floatingE.querySelectorAll(".floating-e-item").forEach(function (item) {
      item.addEventListener("click", function () { closeFloatingMenu(); });
    });
  }

})();
