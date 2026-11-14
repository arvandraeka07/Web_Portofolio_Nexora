/* =========================================================
   Arvandra — Portfolio interactions
   Theme (day/night) · nav · reveal · typing · counter
   filter · form · Minecraft HUD · block particles
   ========================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const CONTACT_EMAIL = "arvandraeka05@gmail.com";

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

  /* ---------- Advancement popup ---------- */
  const advancement = $("#advancement");
  const advancementText = $("#advancementText");
  const advancementQueue = [];
  const ADVANCEMENT_KEY = "arvandra-advancement";
  let advancementTimer;
  let advancementRunning = false;

  function playNextAdvancement() {
    if (!advancement || !advancementText) return;

    const next = advancementQueue.shift();

    if (!next) {
      advancementRunning = false;
      return;
    }

    advancementRunning = true;
    advancementText.textContent = next;
    advancement.classList.add("is-visible");

    clearTimeout(advancementTimer);
    advancementTimer = setTimeout(() => {
      advancement.classList.remove("is-visible");
      setTimeout(playNextAdvancement, 380);
    }, 4200);
  }

  function showAdvancement(message) {
    if (!advancement || !advancementText) return;
    advancementQueue.push(message);
    if (!advancementRunning) playNextAdvancement();
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
    $$("img[data-day]").forEach((img) => { const s = theme === "light" ? img.dataset.day : img.dataset.night; if (img.getAttribute("src") !== s) img.setAttribute("src", s); });

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

      showToast(next === "light" ? "Mode siang aktif" : "Mode malam aktif");
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

  /* 9-slot hotbar, like the real inventory bar */
  const hudHotbar = $("#hudHotbar");
  if (hudHotbar) hudHotbar.innerHTML = "<span></span>".repeat(9);

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
    "Mahasiswa Informatika",
    "Anak DKV yang Ngoding",
    "Pembaca Novel",
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
        unlockAdvancement("email", "Email disalin: " + text);
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
        showToast("Lengkapi nama, email valid, dan pesan kamu dulu ya");

        if (!name && nameInput) nameInput.focus();
        else if (!emailValid && emailInput) emailInput.focus();
        else if (messageInput) messageInput.focus();
        return;
      }

      const subject = encodeURIComponent(`Halo dari ${name} — Portfolio`);
      const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\n${message}`);

      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      showToast("Membuka aplikasi email... Terima kasih sudah mampir!");
      form.reset();
    });
  }

  /* ---------- Advancement triggers ---------- */
  function hasSeenAdvancement(key) {
    try {
      return sessionStorage.getItem(ADVANCEMENT_KEY + ":" + key) === "1";
    } catch (error) {
      return false;
    }
  }

  function markAdvancementSeen(key) {
    try {
      sessionStorage.setItem(ADVANCEMENT_KEY + ":" + key, "1");
    } catch (error) {
      /* storage unavailable */
    }
  }

  function unlockAdvancement(key, message) {
    if (hasSeenAdvancement(key)) return;
    markAdvancementSeen(key);
    showAdvancement(message);
  }

  if (advancement && !reduceMotion) {
    setTimeout(() => unlockAdvancement("welcome", "Selamat datang di dunia Arvandra"), 2000);

    const portfolioSection = $("#portofolio");

    if (portfolioSection && "IntersectionObserver" in window) {
      const advancementObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            unlockAdvancement("portfolio", "Karya ditemukan: portofolio terbuka");
            observer.disconnect();
          });
        },
        { threshold: 0.3 }
      );

      advancementObserver.observe(portfolioSection);
    }
  }

  /* ---------- Creeper: klik untuk meledakkan ---------- */
  const creeper = $("#creeper");

  if (creeper) {
    let exploding = false;

    creeper.addEventListener("click", () => {
      if (exploding) return;
      exploding = true;
      creeper.classList.add("is-boom");

      const rect = creeper.getBoundingClientRect();
      for (let i = 0; i < 3; i++) {
        spawnParticles({ clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 });
      }

      unlockAdvancement("creeper", "Aww man! Creeper meledak");
      setTimeout(() => {
        creeper.classList.remove("is-boom");
        exploding = false;
      }, 3500);
    });
  }

  /* ---------- Debug screen (F3) ---------- */
  const debugEl = $("#debug");
  const debugToggle = $("#debugToggle");

  if (debugEl) {
    const BIOMES = { home: "Plains", tentang: "Forest", hobi: "Flower Forest", portofolio: "Windswept Hills", kontak: "Village" };

    const updateDebug = () => {
      if (!debugEl.classList.contains("is-on")) return;
      let biome = sections.length ? sections[0].id : "home";
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top < window.innerHeight * 0.4) biome = section.id;
      });
      const theme = root.getAttribute("data-theme") === "light" ? "Siang" : "Malam";
      debugEl.textContent =
        "Arvandra Portfolio 1.0 (HTML/CSS/JS)\n" +
        "XYZ: " + Math.round(window.innerWidth / 2) + " / 64 / " + Math.round(window.scrollY) + "\n" +
        "Biome: minecraft:" + (BIOMES[biome] || "plains").toLowerCase().replace(" ", "_") + "\n" +
        "Waktu: " + theme + " · Layar: " + window.innerWidth + "x" + window.innerHeight;
    };

    const toggleDebug = () => {
      debugEl.classList.toggle("is-on");
      updateDebug();
    };

    window.addEventListener("scroll", updateDebug, { passive: true });
    window.addEventListener("resize", updateDebug);
    if (debugToggle) debugToggle.addEventListener("click", toggleDebug);
    document.addEventListener("keydown", (event) => {
      if (event.key !== "F3") return;
      event.preventDefault();
      toggleDebug();
    });
  }

  /* ---------- Kubus profil: 4 sisi (foto + hobi), tilt kursor, seret, slot hotbar, auto-showcase ---------- */
  const cube = $("#mcCube");
  const profileCard = $("#profileCard");

  if (cube && profileCard) {
    const VIEW_Y = -26;
    const VIEW_X = -18;
    const FACES = [
      { name: "Foto", sub: "Andra IRL", y: 0 },
      { name: "Baca Novel", sub: "hobi favorit", y: -90 },
      { name: "Main Game", sub: "chill mode", y: -180 },
      { name: "Olahraga", sub: "reset kepala", y: -270 },
    ];
    const faceBtns = Array.prototype.slice.call(document.querySelectorAll(".mc-face-btn"));
    const faceLabel = $("#mcLabel");

    let faceIndex = 0;
    let baseY = VIEW_Y;
    let rotY = baseY, rotX = VIEW_X, goalY = baseY, goalX = VIEW_X;
    let dragging = false, moved = false, lastX = 0, onScreen = true, rafId = 0, lastTouch = 0;

    const wrap = (deg) => ((((deg + 180) % 360) + 360) % 360) - 180;
    const render = () => {
      cube.style.transform = "rotateX(" + rotX.toFixed(2) + "deg) rotateY(" + rotY.toFixed(2) + "deg)";
    };

    const showFace = (index) => {
      faceIndex = index;
      const face = FACES[index];
      if (faceLabel) faceLabel.innerHTML = "<b>" + face.name + "</b> · " + face.sub;
      faceBtns.forEach((btn, i) => {
        const active = i === index;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    };

    const setFace = (index, byUser) => {
      baseY = FACES[index].y + VIEW_Y;
      goalY = baseY;
      goalX = VIEW_X;
      showFace(index);
      if (byUser) lastTouch = Date.now();
    };

    const tick = (time) => {
      if (onScreen && !dragging) {
        const sway = reduceMotion ? 0 : Math.sin(time / 1300) * 4;
        rotY += wrap(goalY + sway - rotY) * 0.09;
        rotX += (goalX - rotX) * 0.09;
        render();
      }
      rafId = window.requestAnimationFrame(tick);
    };

    if (!reduceMotion && finePointer) {
      profileCard.addEventListener("pointermove", (event) => {
        if (dragging) return;
        const rect = profileCard.getBoundingClientRect();
        goalY = baseY + ((event.clientX - rect.left) / rect.width - 0.5) * 40;
        goalX = VIEW_X - ((event.clientY - rect.top) / rect.height - 0.5) * 26;
      }, { passive: true });

      profileCard.addEventListener("pointerleave", () => {
        goalY = baseY;
        goalX = VIEW_X;
      });
    }

    cube.addEventListener("pointerdown", (event) => {
      dragging = true;
      moved = false;
      lastX = event.clientX;
      cube.classList.add("is-dragging");
      cube.setPointerCapture(event.pointerId);
    });

    cube.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      lastX = event.clientX;
      if (Math.abs(dx) > 0) moved = true;
      rotY += dx * 0.7;
      render();
    });

    const endDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      cube.classList.remove("is-dragging");
      if (moved) {
        // lepas = "pasang" blok: kunci ke sisi terdekat
        const idx = ((Math.round(-wrap(rotY - VIEW_Y) / 90) % 4) + 4) % 4;
        rotY = wrap(rotY);
        setFace(idx, true);
        unlockAdvancement("cube", "Blok diputar: kamu melihat semua sisinya");
      } else {
        spawnParticles(event);
      }
    };

    cube.addEventListener("pointerup", endDrag);
    cube.addEventListener("pointercancel", endDrag);

    faceBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        setFace(Number(btn.getAttribute("data-face")) || 0, true);
        unlockAdvancement("cube", "Blok diputar: kamu melihat semua sisinya");
      });
    });

    // showcase otomatis: kalau didiamkan, kubus ganti sisi sendiri
    if (!reduceMotion) {
      window.setInterval(() => {
        if (!window.__cubeAuto || !onScreen || dragging || Date.now() - lastTouch < 7000) return;
        setFace((faceIndex + 1) % FACES.length, false);
      }, 4200);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => { onScreen = entries[0].isIntersecting; }).observe(profileCard);
    }

    showFace(0);
    rafId = window.requestAnimationFrame(tick);
  }


  /* ---------- Efek suara 8-bit (dari versi A, default mati) ---------- */
  const sfxBtn = $("#sfxToggle");
  let sfxOn = false, audioCtx = null;
  try { sfxOn = localStorage.getItem("arvandra-sfx") === "1"; } catch (e) {}
  const blip = (freq = 520) => {
    if (!sfxOn) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = audioCtx || new AC();
    const t = audioCtx.currentTime, o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = "square"; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(freq * 1.35, t + 0.06);
    g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(t + 0.08);
  };
  const paintSfx = () => { if (!sfxBtn) return; sfxBtn.setAttribute("aria-pressed", sfxOn); sfxBtn.classList.toggle("is-on", sfxOn); sfxBtn.setAttribute("aria-label", sfxOn ? "Matikan efek suara" : "Nyalakan efek suara"); };
  paintSfx();
  if (sfxBtn) sfxBtn.addEventListener("click", () => {
    sfxOn = !sfxOn; paintSfx();
    try { localStorage.setItem("arvandra-sfx", sfxOn ? "1" : "0"); } catch (e) {}
    blip(660); showToast(sfxOn ? "Efek suara menyala" : "Efek suara mati");
  });
  document.addEventListener("pointerdown", (e) => { if (e.target.closest(".btn, .filter-chip, .tool-btn, .mc-face-btn, .icon-btn, .hobby")) blip(560); }, { passive: true });

  /* ---------- Kontrol kubus: putar otomatis, meledak, acak ---------- */
  const spinBtn = $("#cubeSpin"), boomBtn = $("#cubeBoom"), randBtn = $("#cubeRand"), mcCube = $("#mcCube");
  window.__cubeAuto = true;
  if (spinBtn) spinBtn.addEventListener("click", () => { window.__cubeAuto = !window.__cubeAuto; spinBtn.setAttribute("aria-pressed", window.__cubeAuto); });
  if (boomBtn && mcCube) boomBtn.addEventListener("click", () => {
    const on = !mcCube.classList.contains("is-exploded");
    mcCube.classList.toggle("is-exploded", on); boomBtn.setAttribute("aria-pressed", on);
    boomBtn.textContent = on ? "▣ Satukan" : "✸ Meledak"; blip(on ? 300 : 700);
    if (on) unlockAdvancement("tnt", "TNT meledak: kubus terbuka lebar");
  });
  if (randBtn) randBtn.addEventListener("click", () => { const b = $$(".mc-face-btn"); if (b.length) b[Math.floor(Math.random() * b.length)].click(); });

  /* ---------- Lightbox "inspect" ---------- */
  const lb = $("#lightbox"), lbImg = $("#lightboxImg"), lbCap = $("#lightboxCap");
  const closeLb = () => { if (lb) { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); } };
  const openLb = (img) => {
    if (!lb) return;
    lbImg.src = img.currentSrc || img.src;
    const card = img.closest(".hobby, .portrait");
    lbCap.textContent = card ? (($("h3", card) || $("figcaption", card) || {}).textContent || "") : "";
    lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false"); blip(680);
  };
  $$("[data-zoom], .portrait img").forEach((img) => {
    img.addEventListener("click", () => openLb(img));
    img.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(img); } });
  });
  if (lb) lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest("#lightboxX")) closeLb(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });

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
