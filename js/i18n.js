// ============================================================================
// i18n — RO / EN / RU. Romanian is the source; EN & RU were translated and then
// rewritten to read naturally (native, not literal). applyLanguage() swaps every
// [data-i18n*] node, the hero mockup image, and <html lang>.
// ============================================================================
window.I18N = {
  ro: {
    "nav.home": "Acasă",
    "nav.problem": "Problema",
    "nav.solution": "Soluția",
    "nav.progress": "Progres",
    "nav.faq": "Întrebări",

    "hero.headlineWhite": "eCarnet este carnetul tău de elev,",
    "hero.headlineAccent": "acum digital!",
    "hero.sub1": "eCarnet înlocuiește actualul carnet al elevului cu o soluție digitală.",
    "hero.sub2": "Acest carnet va fi mereu cu tine, niciodată pierdut.",
    "hero.cta": "De ce?",

    "problem.heading": "Carnetul fizic e depășit.",
    "problem.c1.title": "Se pierde ușor",
    "problem.c1.desc": "Carnetul fizic poate fi uitat acasă sau pierdut, tocmai când ai nevoie de el.",
    "problem.c2.title": "Expiră",
    "problem.c2.desc": "Anual, carnetul expiră și trebuie reînnoit, iar mereu uiți să o faci. Timp pierdut, bani cheltuiți.",
    "problem.c3.title": "Birocrație inutilă",
    "problem.c3.desc": "Ștampile, semnături, hârtii, poze. Un proces depășit.",
    "problem.c4.title": "Cheltuieli",
    "problem.c4.desc": "Când îți faci un carnet nou, când îl pierzi sau când îl reînoiești, trebuie să achiți bani.",

    "solution.heading": "Același carnet, acum digital.",
    "solution.easter": "totul pentru elevi",
    "solution.featuresHeading": "Iată ce îți oferă",
    "solution.f1.title": "Identitate de elev digitală",
    "solution.f1.desc": "Arăți telefonul și gata. Funcționează oriunde ai nevoie să dovedești că ești elev sau student.",
    "solution.f1.tag1": "Transport public",
    "solution.f1.tag2": "Reduceri",
    "solution.f1.tag3": "Verificare",
    "solution.f2.title": "Note și absențe",
    "solution.f2.desc": "eCatalog va fi integrat în eCarnet cu toate notele, mediile și absențele.",
    "solution.f3.title": "Orar și notițe",
    "solution.f3.desc": "Orarul lecțiilor, temele pe acasă, notițe personale. Vei putea să scrii totul în aplicație.",

    "progress.heading": "Parcursul eCarnet.",
    "progress.subtitle": "eCarnet încă nu e gata. Iată unde suntem și unde vrem să ajungem.",
    "progress.now.pill": "Acum",
    "progress.now.text": "Definim structura aplicației, modul de utilizare și designul.",
    "progress.next.pill": "Urmează",
    "progress.next.i1.title": "Prototip funcțional",
    "progress.next.i1.desc": "Prima versiune funcțională a aplicației mobile, testată intern cu un set limitat de utilizatori.",
    "progress.next.i2.title": "Pilot cu o școală",
    "progress.next.i2.desc": "Colaborare cu o școală din Chișinău pentru un test real în condiții reale.",
    "progress.future.pill": "Viitor",
    "progress.future.i1.title": "Securitate",
    "progress.future.i1.desc": "Îmbunătățiri bazate pe feedback real. Audit de securitate, sistem de validare digitală.",
    "progress.future.i2.title": "Lansare Publică",
    "progress.future.i2.desc": "Disponibil pe iOS și Android. Pregătit pentru adoptare în școlile din Moldova.",
    "progress.tail.soon": "În curând...",

    "faq.heading": "Întrebări frecvente",
    "faq.q1": "Este gratuit?",
    "faq.a1": "Da, este absolut gratuit.",
    "faq.q2": "Este recunoscut oficial?",
    "faq.a2": "Încă nu, dar sunt în desfășurare discuții oficiale cu Ministerul.",
    "faq.q3": "Ce se întâmplă dacă îmi pierd telefonul?",
    "faq.a3": "Contul tău rămâne salvat — te autentifici din nou și totul e la loc.",
    "faq.q4": "Ce școli îl acceptă?",
    "faq.a4": "Deocamdată niciuna, dar pregătim lansarea unei faze-pilot.",
    "faq.q5": "Cum îmi sunt protejate datele?",
    "faq.a5": "Datele tale sunt criptate end-to-end și le poți șterge oricând. Lucrăm și la un audit de securitate.",
    "faq.q6": "Când va fi lansat?",
    "faq.a6": "Versiunea finală va fi lansată probabil peste un an. Momentan, este într-o etapă incipientă de dezvoltare.",

    "footer.tagline": "Carnetul de elev, în format digital. Mai puțină birocrație, mai accesibil pentru elevi",
    "footer.badge": "Proiect în dezvoltare",
    "footer.github": 'Urmărește proiectul pe <a href="https://github.com/CataragaMihai?tab=repositories" class="footer-contact-link" target="_blank" rel="noopener">GitHub</a>',
    "footer.contact": "Contactează-mă",
    "footer.copy": "© 2026 eCarnet. Toate drepturile rezervate.",
    "footer.dev": "Dezvoltat de",
    "dev.role": "Student UTM",

    "capture.heading": "Vrei să fii la curent cu progresul eCarnet?",
    "capture.placeholder": "email@tău.com",
    "capture.cta": "Scrie-mi!",
    "capture.error": "Aceasta nu este o adresă de email validă.",
    "capture.thanks": "Mulțumesc pentru email, te vom contacta în curând!",
    "floating.aria": "Abonare la noutățile eCarnet",
    "trigger.aria": "Scrie-te la noutăți"
  },

  en: {
    "nav.home": "Home",
    "nav.problem": "Problem",
    "nav.solution": "Solution",
    "nav.progress": "Progress",
    "nav.faq": "FAQ",

    "hero.headlineWhite": "eCarnet is your student card,",
    "hero.headlineAccent": "now digital!",
    "hero.sub1": "eCarnet replaces the paper student card with a digital one.",
    "hero.sub2": "Always with you, never lost.",
    "hero.cta": "Why?",

    "problem.heading": "The paper card is outdated.",
    "problem.c1.title": "Easy to lose",
    "problem.c1.desc": "A paper card gets left at home or lost — usually right when you need it.",
    "problem.c2.title": "It expires",
    "problem.c2.desc": "Every year it expires and has to be renewed, and you always forget. Wasted time, wasted money.",
    "problem.c3.title": "Pointless bureaucracy",
    "problem.c3.desc": "Stamps, signatures, papers, photos. An outdated process.",
    "problem.c4.title": "It costs money",
    "problem.c4.desc": "A new card, a lost one, a renewal — every time, you pay.",

    "solution.heading": "The same card, now digital.",
    "solution.easter": "everything for students",
    "solution.featuresHeading": "This is what you get",
    "solution.f1.title": "Digital student identity",
    "solution.f1.desc": "Just show your phone. It works anywhere you need to prove you're a student.",
    "solution.f1.tag1": "Public transport",
    "solution.f1.tag2": "Discounts",
    "solution.f1.tag3": "Verification",
    "solution.f2.title": "Grades and absences",
    "solution.f2.desc": "eCatalog will be built into eCarnet, with all your grades, averages and absences.",
    "solution.f3.title": "Schedule and notes",
    "solution.f3.desc": "Class schedule, homework, personal notes — you'll keep it all in the app.",

    "progress.heading": "The eCarnet roadmap.",
    "progress.subtitle": "eCarnet isn't finished yet. Here's where we are and where we're headed.",
    "progress.now.pill": "Now",
    "progress.now.text": "Defining the app's structure, how it's used, and the design.",
    "progress.next.pill": "Next",
    "progress.next.i1.title": "Working prototype",
    "progress.next.i1.desc": "The first working version of the mobile app, tested internally with a small group of users.",
    "progress.next.i2.title": "Pilot with a school",
    "progress.next.i2.desc": "Working with a school in Chișinău for a real test in real conditions.",
    "progress.future.pill": "Future",
    "progress.future.i1.title": "Security",
    "progress.future.i1.desc": "Improvements based on real feedback. A security audit and a digital validation system.",
    "progress.future.i2.title": "Public launch",
    "progress.future.i2.desc": "Available on iOS and Android, ready for schools across Moldova.",
    "progress.tail.soon": "Coming soon",

    "faq.heading": "Frequently asked questions",
    "faq.q1": "Is it free?",
    "faq.a1": "Yes, it's completely free.",
    "faq.q2": "Is it officially recognized?",
    "faq.a2": "Not yet, but official talks with the Ministry are underway.",
    "faq.q3": "What if I lose my phone?",
    "faq.a3": "Your account stays saved — just log back in and everything's there.",
    "faq.q4": "Which schools accept it?",
    "faq.a4": "None yet, but we're preparing to launch a pilot phase.",
    "faq.q5": "How is my data protected?",
    "faq.a5": "Your data is end-to-end encrypted and you can delete it anytime. We're also working toward a security audit.",
    "faq.q6": "When will it launch?",
    "faq.a6": "The final version will likely launch in about a year. For now, it's in an early stage of development.",

    "footer.tagline": "The student card, in digital form. Less bureaucracy, more accessible for students.",
    "footer.badge": "Project in development",
    "footer.github": 'Follow the project on <a href="https://github.com/CataragaMihai?tab=repositories" class="footer-contact-link" target="_blank" rel="noopener">GitHub</a>',
    "footer.contact": "Get in touch",
    "footer.copy": "© 2026 eCarnet. All rights reserved.",
    "footer.dev": "Built by",
    "dev.role": "UTM Student",

    "capture.heading": "Want to keep up with eCarnet's progress?",
    "capture.placeholder": "your@email.com",
    "capture.cta": "Notify me!",
    "capture.error": "That's not a valid email address.",
    "capture.thanks": "Thanks for your email — we'll be in touch soon!",
    "floating.aria": "Subscribe to eCarnet updates",
    "trigger.aria": "Sign up for updates"
  },

  ru: {
    "nav.home": "Главная",
    "nav.problem": "Проблема",
    "nav.solution": "Решение",
    "nav.progress": "Прогресс",
    "nav.faq": "Вопросы",

    "hero.headlineWhite": "eCarnet — твой ученический билет,",
    "hero.headlineAccent": "теперь цифровой!",
    "hero.sub1": "eCarnet заменяет бумажный билет цифровым.",
    "hero.sub2": "Всегда с тобой и никогда не потеряется.",
    "hero.cta": "Почему?",

    "problem.heading": "Бумажный билет устарел.",
    "problem.c1.title": "Легко потерять",
    "problem.c1.desc": "Бумажный билет легко забыть дома или потерять — как раз тогда, когда он нужен.",
    "problem.c2.title": "Истекает",
    "problem.c2.desc": "Каждый год билет нужно продлевать, а ты вечно об этом забываешь. Потерянное время и деньги.",
    "problem.c3.title": "Лишняя бюрократия",
    "problem.c3.desc": "Печати, подписи, бумаги, фотографии. Устаревший процесс.",
    "problem.c4.title": "Расходы",
    "problem.c4.desc": "Новый билет, потеря, продление — каждый раз приходится платить.",

    "solution.heading": "Тот же билет, теперь цифровой.",
    "solution.easter": "всё для учеников",
    "solution.featuresHeading": "Вот что ты получаешь",
    "solution.f1.title": "Цифровое удостоверение ученика",
    "solution.f1.desc": "Просто показываешь телефон — и готово. Работает везде, где нужно подтвердить, что ты ученик или студент.",
    "solution.f1.tag1": "Общественный транспорт",
    "solution.f1.tag2": "Скидки",
    "solution.f1.tag3": "Проверка",
    "solution.f2.title": "Оценки и пропуски",
    "solution.f2.desc": "eCatalog будет встроен в eCarnet — все оценки, средние баллы и пропуски.",
    "solution.f3.title": "Расписание и заметки",
    "solution.f3.desc": "Расписание занятий, домашние задания, личные заметки — всё можно вести в приложении.",

    "progress.heading": "Путь eCarnet.",
    "progress.subtitle": "eCarnet ещё не готов. Вот где мы сейчас и куда движемся.",
    "progress.now.pill": "Сейчас",
    "progress.now.text": "Определяем структуру приложения, способ использования и дизайн.",
    "progress.next.pill": "Далее",
    "progress.next.i1.title": "Рабочий прототип",
    "progress.next.i1.desc": "Первая рабочая версия мобильного приложения, протестированная внутри на небольшой группе пользователей.",
    "progress.next.i2.title": "Пилот со школой",
    "progress.next.i2.desc": "Сотрудничество со школой в Кишинёве для теста в реальных условиях.",
    "progress.future.pill": "Будущее",
    "progress.future.i1.title": "Безопасность",
    "progress.future.i1.desc": "Улучшения на основе реальных отзывов. Аудит безопасности и система цифровой проверки.",
    "progress.future.i2.title": "Публичный запуск",
    "progress.future.i2.desc": "Доступно на iOS и Android. Готово к внедрению в школах Молдовы.",
    "progress.tail.soon": "Уже скоро",

    "faq.heading": "Частые вопросы",
    "faq.q1": "Это бесплатно?",
    "faq.a1": "Да, это абсолютно бесплатно.",
    "faq.q2": "Признан ли он официально?",
    "faq.a2": "Пока нет, но ведутся официальные переговоры с Министерством.",
    "faq.q3": "Что если я потеряю телефон?",
    "faq.a3": "Ваш аккаунт сохраняется — просто войдите снова, и всё будет на месте.",
    "faq.q4": "Какие школы его принимают?",
    "faq.a4": "Пока ни один, но мы готовим запуск пилотного этапа.",
    "faq.q5": "Как защищены мои данные?",
    "faq.a5": "Ваши данные шифруются сквозным шифрованием, и вы можете удалить их в любой момент. Мы также работаем над аудитом безопасности.",
    "faq.q6": "Когда состоится запуск?",
    "faq.a6": "Полная версия, скорее всего, выйдет примерно через год. Сейчас проект на раннем этапе разработки.",

    "footer.tagline": "Ученический билет в цифровом виде. Меньше бюрократии, доступнее для учеников.",
    "footer.badge": "Проект в разработке",
    "footer.github": 'Следи за проектом на <a href="https://github.com/CataragaMihai?tab=repositories" class="footer-contact-link" target="_blank" rel="noopener">GitHub</a>',
    "footer.contact": "Связаться со мной",
    "footer.copy": "© 2026 eCarnet. Все права защищены.",
    "footer.dev": "Разработал",
    "dev.role": "Студент UTM",

    "capture.heading": "Хочешь следить за развитием eCarnet?",
    "capture.placeholder": "почта@пример.com",
    "capture.cta": "Напиши мне!",
    "capture.error": "Это недействительный адрес электронной почты.",
    "capture.thanks": "Спасибо за письмо — скоро свяжемся с тобой!",
    "floating.aria": "Подписка на новости eCarnet",
    "trigger.aria": "Подписаться на новости"
  }
};

// Per-language hero mockup
window.I18N_MOCKUP = {
  ro: "assets/phone_mockup_romanian.png",
  en: "assets/phone_mockup_english.png",
  ru: "assets/phone_mockup_russian.png"
};

window.applyLanguage = function (lang) {
  var dict = window.I18N[lang];
  if (!dict) return;

  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    var v = dict[el.getAttribute("data-i18n")];
    if (v != null) el.textContent = v;
  });
  document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
    var v = dict[el.getAttribute("data-i18n-html")];
    if (v != null) el.innerHTML = v;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
    var v = dict[el.getAttribute("data-i18n-placeholder")];
    if (v != null) el.setAttribute("placeholder", v);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
    var v = dict[el.getAttribute("data-i18n-aria")];
    if (v != null) el.setAttribute("aria-label", v);
  });

  if (window.I18N_MOCKUP[lang]) {
    document.querySelectorAll(".hero-phone-mockup").forEach(function (img) {
      img.src = window.I18N_MOCKUP[lang];
    });
  }

  try { localStorage.setItem("ecarnet-lang", lang); } catch (e) {}
};
