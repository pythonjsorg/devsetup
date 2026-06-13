/* ============================================================
   pythonjs.org — interactions (ported from reference v2-main.js + ux.js)
   Vanilla, framework-free. Every handler guards for missing elements,
   so deferred sections (work/services/contact/…) are safe no-ops until built.
   NOTE: theme key unified to "pyjs.theme" to match the inline anti-flash script.
   ============================================================ */

/* ---------- core (v2-main.js) ---------- */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = matchMedia("(pointer: fine)").matches;

  /* ---------- theme toggle (View Transitions circular reveal) ---------- */
  var toggle = document.getElementById("themeToggle");
  function applyTheme(t: string) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("pyjs.theme", t); } catch (e) {}
  }
  function switchTheme(e: MouseEvent) {
    var current = root.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    var x = e ? e.clientX : window.innerWidth - 60;
    var y = e ? e.clientY : 60;
    root.style.setProperty("--vt-x", x + "px");
    root.style.setProperty("--vt-y", y + "px");
    if ((document as any).startViewTransition && !reduced) {
      root.classList.add("vt-clip");
      var vt = (document as any).startViewTransition(function () { applyTheme(next); });
      vt.finished.finally(function () { root.classList.remove("vt-clip"); });
    } else {
      applyTheme(next);
    }
  }
  if (toggle) toggle.addEventListener("click", switchTheme as EventListener);

  /* ---------- nav scroll + active pill ---------- */
  var nav = document.getElementById("nav");
  var navMid = document.getElementById("navMid");
  var navPill = document.getElementById("navPill");
  var links: HTMLElement[] = navMid ? Array.prototype.slice.call(navMid.querySelectorAll("a")) : [];
  var sections = links.map(function (a) { return document.getElementById((a as HTMLElement).dataset.sec || ""); });

  function onScrollNav() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  function movePillTo(link: HTMLElement | null) {
    if (!link || !navPill) return;
    navPill.style.left = link.offsetLeft + "px";
    navPill.style.width = link.offsetWidth + "px";
    navPill.style.height = link.offsetHeight + "px";
    navPill.style.top = link.offsetTop + "px";
    navPill.style.opacity = "1";
  }
  var activeLink: HTMLElement | null = null;
  function setActive(idx: number) {
    links.forEach(function (l, i) { l.classList.toggle("active", i === idx); });
    activeLink = links[idx] || null;
    if (!hovering) movePillTo(activeLink);
  }
  // hover preview
  var hovering = false;
  links.forEach(function (l) {
    l.addEventListener("mouseenter", function () { hovering = true; movePillTo(l); });
    l.addEventListener("mouseleave", function () { hovering = false; movePillTo(activeLink); });
  });

  /* ---------- scroll progress ---------- */
  var progress = document.getElementById("progress");
  function onScrollProgress() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? window.scrollY / h : 0;
    if (progress) progress.style.transform = "scaleX(" + p + ")";
  }
  window.addEventListener("scroll", onScrollProgress, { passive: true });
  onScrollProgress();

  /* ---------- active section observer ---------- */
  if ("IntersectionObserver" in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var idx = sections.indexOf(en.target as HTMLElement);
          if (idx >= 0) setActive(idx);
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { if (s) secObs.observe(s); });
  }

  /* ---------- reveal (manual + IO + safety, keyframe based) ---------- */
  var reveals: HTMLElement[] = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function checkReveals() {
    var vh = window.innerHeight || root.clientHeight;
    for (var i = reveals.length - 1; i >= 0; i--) {
      var r = reveals[i].getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        reveals[i].classList.add("in");
        reveals.splice(i, 1);
      }
    }
  }
  window.addEventListener("scroll", checkReveals, { passive: true });
  window.addEventListener("resize", function () { checkReveals(); movePillTo(hovering ? null : activeLink); });
  checkReveals();
  requestAnimationFrame(checkReveals);
  setTimeout(checkReveals, 120);
  if ("IntersectionObserver" in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.06, rootMargin: "0px 0px -5% 0px" });
    reveals.forEach(function (r) { rio.observe(r); });
  }
  setTimeout(function () {
    document.querySelectorAll(".reveal").forEach(function (r) { r.classList.add("in"); });
  }, 1700);

  /* ---------- animated counters ---------- */
  var counters: HTMLElement[] = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  function runCounter(el: HTMLElement) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    var target = parseFloat(el.dataset.count || "0");
    var suffix = el.dataset.suffix || "";
    var dur = reduced ? 0 : 1300;
    var start = performance.now();
    function frame(now: number) {
      var p = dur ? Math.min((now - start) / dur, 1) : 1;
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) runCounter(e.target as HTMLElement); });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(runCounter);
  }
  setTimeout(function () { counters.forEach(runCounter); }, 1800);

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      var strength = 0.32;
      el.addEventListener("mousemove", function (e) {
        var me = e as MouseEvent;
        var r = (el as HTMLElement).getBoundingClientRect();
        var mx = me.clientX - (r.left + r.width / 2);
        var my = me.clientY - (r.top + r.height / 2);
        (el as HTMLElement).style.transform = "translate(" + mx * strength + "px," + my * strength + "px)";
      });
      el.addEventListener("mouseleave", function () { (el as HTMLElement).style.transform = ""; });
    });
  }

  /* ---------- tile spotlight follow ---------- */
  if (finePointer) {
    document.querySelectorAll(".tile").forEach(function (tile) {
      tile.addEventListener("mousemove", function (e) {
        var me = e as MouseEvent;
        var r = (tile as HTMLElement).getBoundingClientRect();
        (tile as HTMLElement).style.setProperty("--mx", (me.clientX - r.left) + "px");
        (tile as HTMLElement).style.setProperty("--my", (me.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- hero cursor spotlight ---------- */
  var hero = document.querySelector(".hero");
  var heroSpot = document.getElementById("heroSpot");
  if (hero && heroSpot && finePointer && !reduced) {
    hero.addEventListener("mousemove", function (e) {
      var me = e as MouseEvent;
      var r = (hero as HTMLElement).getBoundingClientRect();
      heroSpot!.style.left = (me.clientX - r.left - 230) + "px";
      heroSpot!.style.top = (me.clientY - r.top - 230) + "px";
      heroSpot!.style.opacity = "1";
    });
    hero.addEventListener("mouseleave", function () { heroSpot!.style.opacity = "0"; });
  }

  /* ---------- services accordion ---------- */
  var svcWrap = document.getElementById("svcWrap");
  if (svcWrap) {
    svcWrap.querySelectorAll(".svc-head").forEach(function (head) {
      head.addEventListener("click", function () {
        var svc = (head as HTMLElement).parentElement!;
        var isOpen = svc.classList.contains("open");
        svcWrap!.querySelectorAll(".svc").forEach(function (s) { s.classList.remove("open"); });
        if (!isOpen) svc.classList.add("open");
      });
    });
  }

  /* ---------- marquee duplicate ---------- */
  var strip = document.getElementById("strip");
  if (strip) strip.innerHTML += strip.innerHTML;
})();

/* ---------- UX enhancements (ux.js): mobile menu · accordion a11y · form ---------- */
(function () {
  "use strict";

  /* ---------- mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var mPanel = document.getElementById("mPanel");
  var mScrim = document.getElementById("mScrim");
  if (menuBtn && mPanel) {
    var setMenu = function (open: boolean) {
      document.body.classList.toggle("menu-open", open);
      menuBtn!.setAttribute("aria-expanded", open ? "true" : "false");
    };
    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!document.body.classList.contains("menu-open"));
    });
    mPanel.addEventListener("click", function (e) {
      if ((e.target as HTMLElement).closest("a")) setMenu(false);
    });
    if (mScrim) mScrim.addEventListener("click", function () { setMenu(false); });
    document.addEventListener("click", function (e) {
      var t = e.target as HTMLElement;
      if (document.body.classList.contains("menu-open") &&
          !t.closest("#mPanel") && !t.closest("#menuBtn")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        setMenu(false);
        menuBtn!.focus();
      }
    });
  }

  /* ---------- services accordion: aria-expanded sync ---------- */
  var svcWrap = document.getElementById("svcWrap");
  if (svcWrap) {
    var syncSvc = function () {
      svcWrap!.querySelectorAll(".svc").forEach(function (svc) {
        var head = svc.querySelector(".svc-head");
        if (head) head.setAttribute("aria-expanded", svc.classList.contains("open") ? "true" : "false");
      });
    };
    syncSvc();
    svcWrap.addEventListener("click", function (e) {
      if ((e.target as HTMLElement).closest(".svc-head")) syncSvc();
    });
  }

  /* ---------- contact form: take over with inline errors ---------- */
  var oldForm = document.getElementById("contactForm");
  if (oldForm) {
    var form = oldForm.cloneNode(true) as HTMLFormElement;
    oldForm.parentNode!.replaceChild(form, oldForm);

    var chips = form.querySelector("#needChips");
    if (chips) {
      chips.addEventListener("click", function (e) {
        var nc = (e.target as HTMLElement).closest(".nc");
        if (!nc) return;
        nc.classList.toggle("on");
        nc.setAttribute("aria-pressed", nc.classList.contains("on") ? "true" : "false");
      });
    }

    var rules = [
      { name: "name", msg: "Please add your name.", test: function (v: string) { return v.trim().length > 0; } },
      { name: "email", msg: "That email doesn't look right.", test: function (v: string) { return /^\S+@\S+\.\S+$/.test(v.trim()); } },
      { name: "message", msg: "Tell us a little about the project.", test: function (v: string) { return v.trim().length > 0; } }
    ];
    rules.forEach(function (r) {
      var input = form.querySelector('[name="' + r.name + '"]') as HTMLElement | null;
      if (!input) return;
      var err = document.createElement("small");
      err.className = "ferr";
      err.id = "ferr-" + r.name;
      err.hidden = true;
      err.textContent = r.msg;
      input.closest(".field")!.appendChild(err);
      input.setAttribute("aria-describedby", err.id);
      input.addEventListener("input", function () {
        input!.closest(".field")!.classList.remove("has-err");
        err.hidden = true;
        input!.removeAttribute("aria-invalid");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad: HTMLElement | null = null;
      rules.forEach(function (r) {
        var input = form.querySelector('[name="' + r.name + '"]') as HTMLInputElement | null;
        if (!input) return;
        var ok = r.test(input.value);
        input.closest(".field")!.classList.toggle("has-err", !ok);
        var err = document.getElementById("ferr-" + r.name);
        if (err) err.hidden = ok;
        if (ok) input.removeAttribute("aria-invalid");
        else {
          input.setAttribute("aria-invalid", "true");
          if (!firstBad) firstBad = input;
        }
      });
      if (firstBad) { (firstBad as HTMLElement).focus(); return; }
      form.classList.add("sent");
    });
  }
})();
