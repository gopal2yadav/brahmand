(() => {
  "use strict";

  const body = document.body;
  const page = body.dataset.page || "home";
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const languageMap = {
    "auto": "hi-IN",
    "hi-IN": "hi-IN",
    "en-US": "en-US",
    "sa-IN": "hi-IN",
    "ta-IN": "ta-IN",
    "te-IN": "te-IN",
    "bn-IN": "bn-IN",
    "gu-IN": "gu-IN",
    "mr-IN": "mr-IN",
    "pa-IN": "pa-IN",
    "ur-PK": "ur-PK",
    "es-ES": "es-ES",
    "fr-FR": "fr-FR",
    "de-DE": "de-DE",
    "pt-BR": "pt-BR",
    "ar-SA": "ar-SA",
    "zh-CN": "zh-CN",
    "ja-JP": "ja-JP"
  };

  function toast(message, duration = 2600) {
    let el = qs("#siteToast");
    if (!el) {
      el = document.createElement("div");
      el.id = "siteToast";
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    window.clearTimeout(el._timer);
    el._timer = window.setTimeout(() => el.classList.remove("show"), duration);
  }

  function currentLanguage() {
    const chatLanguage = qs("#chatLanguage");
    if (chatLanguage?.value) return chatLanguage.value;
    return localStorage.getItem("brahmand-language") || "hi-IN";
  }

  function setSpeaking(state) {
    body.classList.toggle("is-speaking", Boolean(state));
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function speak(text, lang = currentLanguage(), options = {}) {
    if (!("speechSynthesis" in window) || !text) {
      toast("इस ब्राउज़र में voice output उपलब्ध नहीं है।");
      return;
    }
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(String(text).replace(/[*#`_]/g, ""));
    utterance.lang = languageMap[lang] || lang || "hi-IN";
    utterance.rate = options.rate || 0.92;
    utterance.pitch = options.pitch || 0.9;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const prefix = utterance.lang.split("-")[0].toLowerCase();
    const matchingVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix));
    if (matchingVoice) utterance.voice = matchingVoice;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  window.Brahmand = {
    qs,
    qsa,
    toast,
    speak,
    stopSpeaking,
    setSpeaking,
    currentLanguage,
    languageMap,
    escapeHTML
  };

  // Active navigation state.
  qsa(`[data-nav="${page}"]`).forEach((link) => link.classList.add("active"));

  // Mobile drawer.
  const navToggle = qs("#navToggle");
  navToggle?.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("nav-open")) return;
    const sidebar = qs("#sidebar");
    if (sidebar?.contains(event.target) || navToggle?.contains(event.target)) return;
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });

  qsa("#sidebar a").forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("nav-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Global language persistence.
  const globalLanguage = qs("#globalLanguage");
  const savedLanguage = localStorage.getItem("brahmand-language") || "hi-IN";
  if (globalLanguage) globalLanguage.value = savedLanguage;

  globalLanguage?.addEventListener("change", () => {
    localStorage.setItem("brahmand-language", globalLanguage.value);
    const chatLanguage = qs("#chatLanguage");
    if (chatLanguage) chatLanguage.value = globalLanguage.value;
    toast("भाषा preference सुरक्षित हो गई।");
  });

  // Search/filter utility for cards.
  qsa("[data-filter-input]").forEach((input) => {
    const targetSelector = input.dataset.filterTarget;
    const categorySelector = input.dataset.categoryTarget;
    const targetRoot = targetSelector ? qs(targetSelector) : document;
    const category = categorySelector ? qs(categorySelector) : null;

    const applyFilter = () => {
      const query = input.value.trim().toLowerCase();
      const selectedCategory = category?.value?.toLowerCase() || "all";
      let visible = 0;
      qsa("[data-search-item]", targetRoot).forEach((item) => {
        const haystack = `${item.textContent} ${item.dataset.keywords || ""}`.toLowerCase();
        const itemCategory = (item.dataset.category || "all").toLowerCase();
        const categoryMatch = selectedCategory === "all" || itemCategory === selectedCategory;
        const queryMatch = !query || haystack.includes(query);
        item.classList.toggle("hidden", !(queryMatch && categoryMatch));
        if (queryMatch && categoryMatch) visible += 1;
      });
      const empty = targetRoot ? qs("[data-empty-state]", targetRoot.parentElement || document) : null;
      empty?.classList.toggle("hidden", visible > 0);
    };

    input.addEventListener("input", applyFilter);
    category?.addEventListener("change", applyFilter);
  });

  // Accordions.
  qsa(".accordion-button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".accordion-item");
      const open = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
    });
  });

  // Reveal on scroll.
  const revealItems = qsa(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  // Animated number counters.
  const counters = qsa("[data-counter]");
  const animateCounter = (el) => {
    const target = Number(el.dataset.counter || 0);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const duration = Math.min(2200, Math.max(700, target * 3));
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = `${prefix}${value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  // Live seeker count: stable during the browser session with small changes.
  const seekerBase = Number(sessionStorage.getItem("brahmand-seekers")) || 12470 + Math.floor(Math.random() * 620);
  sessionStorage.setItem("brahmand-seekers", String(seekerBase));
  qsa("[data-seekers]").forEach((el) => {
    el.textContent = seekerBase.toLocaleString("en-IN");
  });

  // Home quick ask.
  const homeAskForm = qs("#homeAskForm");
  homeAskForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = qs("#homeQuestion");
    const lang = qs("#homeLanguage")?.value || currentLanguage();
    const question = input?.value?.trim();
    const params = new URLSearchParams();
    if (question) params.set("q", question);
    if (lang) params.set("lang", lang);
    window.location.href = `ask-bhagwan.html${params.toString() ? `?${params}` : ""}`;
  });

  qs("#homeVoiceButton")?.addEventListener("click", () => {
    window.location.href = `ask-bhagwan.html?voice=1&lang=${encodeURIComponent(currentLanguage())}`;
  });

  // Cosmic stage parallax.
  const stage = qs(".cosmic-stage");
  const stageImage = qs(".cosmic-image");
  if (stage && stageImage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      stageImage.style.backgroundPosition = `${50 + x * 2.4}% ${22 + y * 1.8}%`;
    });
    stage.addEventListener("pointerleave", () => {
      stageImage.style.backgroundPosition = "center 22%";
    });
  }

  // Copy buttons.
  qsa("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const selector = button.dataset.copy;
      const target = selector ? qs(selector) : null;
      const text = target?.innerText || button.dataset.copyText || "";
      try {
        await navigator.clipboard.writeText(text.trim());
        toast("कॉपी हो गया।");
      } catch {
        toast("कॉपी नहीं हो पाया। कृपया manually copy करें।");
      }
    });
  });

  // Generic share buttons.
  qsa("[data-share]").forEach((button) => {
    button.addEventListener("click", async () => {
      const data = {
        title: document.title,
        text: button.dataset.shareText || document.title,
        url: location.href
      };
      if (navigator.share) {
        try {
          await navigator.share(data);
        } catch {
          // User dismissed the native share sheet.
        }
      } else {
        try {
          await navigator.clipboard.writeText(location.href);
          toast("Page link कॉपी हो गया।");
        } catch {
          toast("इस ब्राउज़र में sharing उपलब्ध नहीं है।");
        }
      }
    });
  });

  // Footer year.
  qsa("[data-current-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Starfield canvas.
  const canvas = qs("#starfield");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars = [];
    let raf = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(230, Math.max(80, Math.round((width * height) / 8500)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.25 + 0.18,
        speed: Math.random() * 0.11 + 0.025,
        alpha: Math.random() * 0.7 + 0.16,
        pulse: Math.random() * Math.PI * 2
      }));
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > height + 2) {
          star.y = -2;
          star.x = Math.random() * width;
        }
        const alpha = star.alpha * (0.65 + Math.sin(time * 0.001 + star.pulse) * 0.35);
        ctx.beginPath();
        ctx.fillStyle = `rgba(210, 229, 255, ${Math.max(0.05, alpha)})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pagehide", () => cancelAnimationFrame(raf), { once: true });
  }

  // Register the optional service worker only on secure origins / localhost.
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // The website remains fully usable without offline mode.
      });
    });
  }
})();
