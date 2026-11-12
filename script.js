/* =========================================================
   Arvandra — Portfolio interactions
   Theme (day/night) · nav · reveal · typing · counter
   filter · form · Minecraft HUD · block particles
   ========================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3800);
  }

  /* ---------- Year ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Theme: day / night ---------- */
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const themeColor = $("#themeColor");
  const THEME_KEY = "arvandra-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    if (themeColor) {
      themeColor.setAttribute("content", theme === "light" ? "#7ea9ec" : "#0b1020");
    }

    if (themeToggle) {
      const next = theme === "light" ? "malam" : "siang";
      themeToggle.setAttribute("aria-label", `Aktifkan mode ${next}`);
    }
  }

  applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);

      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (error) {
        /* storage unavailable — theme still works for this session */
      }

      showToast(next === "light" ? "Mode siang aktif ☀" : "Mode malam aktif ☾");
    });
  }

  /* ---------- Navbar: scrolled state + progress + back to top ---------- */
  const nav = $("#nav");
  const scrollProgress = $("#scrollProgress");
  const toTop = $("#toTop");

  /* ---------- HUD ---------- */
  const hudHearts = $("#hudHearts");
  const hudFood = $("#hudFood");
  const hudXp = $("#hudXp");
  const hudLevel = $("#hudLevel");

  const HEART_SVG =
    '<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">' +
    '<rect x="4" y="4" width="3" height="1" fill="#E52521"/>' +
    '<rect x="9" y="4" width="3" height="1" fill="#E52521"/>' +
    '<rect x="3" y="5" width="10" height="3" fill="#E52521"/>' +
    '<rect x="4" y="8" width="8" height="1" fill="#E52521"/>' +
    '<rect x="5" y="9" width="6" height="1" fill="#E52521"/>' +
    '<rect x="6" y="10" width="4" height="1" fill="#E52521"/>' +
    '<rect x="7" y="11" width="2" height="1" fill="#E52521"/>' +
    '<rect x="4" y="5" width="2" height="1" fill="#FF8A80"/>' +
    "</svg>";

  const FOOD_SVG =
    '<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">' +
    '<rect x="4" y="2" width="8" height="4" fill="#C87F4A"/>' +
    '<rect x="3" y="3" width="2" height="3" fill="#E0A06A"/>' +
    '<rect x="4" y="6" width="8" height="4" fill="#A8653A"/>' +
    '<rect x="4" y="9" width="3" height="2" fill="#E8E8E8"/>' +
    '<rect x="3" y="11" width="3" height="2" fill="#E8E8E8"/>' +
    '<rect x="6" y="10" width="2" height="2" fill="#D8D8D8"/>' +
    "</svg>";

  function fillHudRow(target, svg, count) {
    if (!target) return;
    target.innerHTML = svg.repeat(count);
  }

  fillHudRow(hudHearts, HEART_SVG, 10);
  fillHudRow(hudFood, FOOD_SVG, 10);

  function onScroll() {
    const scrolled = window.scrollY > 24;
    if (nav) nav.classList.toggle("is-scrolled", scrolled);
    if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 520);

    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;

    if (scrollProgress) {
      scrollProgress.style.width = progress * 100 + "%";
    }

    /* XP bar mirrors the scroll progress */
    if (hudXp) hudXp.style.width = progress * 100 + "%";
    if (hudLevel) hudLevel.textContent = String(1 + Math.floor(progress * 29));
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
  onScroll();

  /* ---------- Mobile menu ---------- */
  const hamburger = $("#hamburger");
  const navLinks = $("#navLinks");
  const navBackdrop = $("#navBackdrop");

  function closeMenu() {
    if (!nav || !hamburger) return;
    nav.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Buka menu");
    document.body.classList.remove("is-locked");
  }

  function openMenu() {
    if (!nav || !hamburger) return;
    nav.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.setAttribute("aria-label", "Tutup menu");
    document.body.classList.add("is-locked");
  }

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.contains("is-open") ? closeMenu() : openMenu();
    });

    if (navLinks) {
      $$("a", navLinks).forEach((link) => {
        link.addEventListener("click", closeMenu);
      });
    }

    if (navBackdrop) navBackdrop.addEventListener("click", closeMenu);

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- Active nav link ---------- */
  const sections = $$("main section[id]");
  const navAnchors = $$(".nav__link");

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navAnchors.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealItems = $$("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  /* ---------- Typing effect ---------- */
  const typedEl = $("#typed");
  const roles = [
    "Web Developer",
    "UI/UX Enthusiast",
    "Front-End Learner",
    "Block Builder",
    "Creative Coder",
  ];

  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const current = roles[roleIndex];
        typedEl.textContent = current.slice(0, charIndex);

        if (!deleting && charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1700);
          return;
        }

        if (deleting && charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 320);
          return;
        }

        charIndex += deleting ? -1 : 1;
        setTimeout(tick, deleting ? 42 : 78);
      };

      setTimeout(tick, 500);
    }
  }

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-count]");

  function runCounter(el) {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach((el) => {
        el.textContent = el.dataset.count + (el.dataset.suffix || "");
      });
    } else {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            runCounter(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );

      counters.forEach((el) => counterObserver.observe(el));
    }
  }

  /* ---------- Project filter ---------- */
  const filterChips = $$(".filter-chip");
  const workCards = $$(".work");

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;

      filterChips.forEach((item) => {
        const isActive = item === chip;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      workCards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;

        card.classList.remove("is-shown");

        if (show) {
          card.classList.remove("is-hidden");
          // Force reflow so the entrance animation replays.
          void card.offsetWidth;
          card.classList.add("is-shown");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  /* ---------- Pointer glow on cards ---------- */
  if (finePointer && !reduceMotion) {
    $$("[data-glow]").forEach((card) => {
      card.addEventListener(
        "pointermove",
        (event) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", ((event.clientX - rect.left) / rect.width) * 100 + "%");
          card.style.setProperty("--my", ((event.clientY - rect.top) / rect.height) * 100 + "%");
        },
        { passive: true }
      );
    });
  }

  /* ---------- Cursor spotlight ---------- */
  const spotlight = $("#spotlight");

  if (spotlight && finePointer && !reduceMotion) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.25;
    let currentX = targetX;
    let currentY = targetY;
    let started = false;

    window.addEventListener(
      "pointermove",
      (event) => {
        targetX = event.clientX;
        targetY = event.clientY;

        if (!started) {
          started = true;
          currentX = targetX;
          currentY = targetY;
          spotlight.classList.add("is-active");
        }
      },
      { passive: true }
    );

    const follow = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      window.requestAnimationFrame(follow);
    };

    window.requestAnimationFrame(follow);
  }

  /* ---------- Block break particles ---------- */
  const PARTICLE_COLORS = ["#6BA347", "#8ACC6B", "#866043", "#9C6B4A", "#C9A96E", "#5AEDD9"];

  function spawnParticles(event) {
    if (reduceMotion) return;

    const x = event.clientX;
    const y = event.clientY;

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement("span");
      particle.className = "block-particle";
      particle.style.left = x + "px";
      particle.style.top = y + "px";
      particle.style.background = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
      particle.style.setProperty("--px", (Math.random() * 90 - 45).toFixed(1) + "px");
      particle.style.setProperty("--py", (Math.random() * -70 - 20).toFixed(1) + "px");
      particle.style.animationDelay = (i * 12) + "ms";
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }
  }

  if (finePointer) {
    document.addEventListener(
      "pointerdown",
      (event) => {
        const target = event.target.closest(
          ".btn, .filter-chip, .social, .work__go, .skill, .contact__socials a"
        );
        if (target) spawnParticles(event);
      },
      { passive: true }
    );
  }

  /* ---------- Copy email ---------- */
  const copyBtn = $("#copyEmail");

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const text = copyBtn.dataset.copy || "";

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const temp = document.createElement("textarea");
          temp.value = text;
          temp.setAttribute("readonly", "");
          temp.style.position = "fixed";
          temp.style.opacity = "0";
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
        }

        copyBtn.classList.add("is-copied");
        showToast("Email disalin: " + text);
        setTimeout(() => copyBtn.classList.remove("is-copied"), 1800);
      } catch (error) {
        showToast("Salin manual ya: " + text);
      }
    });
  }

  /* ---------- Contact form ---------- */
  const form = $("#contactForm");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = $("#name");
      const emailInput = $("#email");
      const messageInput = $("#message");

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailValid || !message) {
        showToast("Lengkapi nama, email valid, dan pesan kamu dulu ya ✨");

        if (!name && nameInput) nameInput.focus();
        else if (!emailValid && emailInput) emailInput.focus();
        else if (messageInput) messageInput.focus();
        return;
      }

      const subject = encodeURIComponent(`Halo dari ${name} — Portfolio`);
      const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\n${message}`);

      window.location.href = `mailto:halo@arvandra.dev?subject=${subject}&body=${body}`;
      showToast("Membuka aplikasi email... Terima kasih sudah mampir! 👋");
      form.reset();
    });
  }

  /* ---------- Back to top ---------- */
  if (toTop) {
    toTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  }
})();
