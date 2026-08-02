/* ═══════════════════════════════════════════════════════════════
   Brahmand — Divine Universe Engine
   1) DivineFace : आँखें झपकती हैं, होंठ बोलते समय हिलते हैं,
                   तीसरा नेत्र उत्तर के दौरान जागृत होता है।
   2) LivingUniverse : घूमती galaxy, बनते-फटते planets, comets,
                       धीरे-धीरे फैलता ब्रह्माण्ड — सब smooth।
   Honest identity: यह devotional animated art है, वास्तविक देवता नहीं।
   ═══════════════════════════════════════════════════════════════ */
(() => {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ───────────────────────────── 1. DIVINE FACE ───────────────────────────── */
  function mountDivineFace() {
    const host = document.querySelector(".chat-side-visual");
    if (!host) return;
    host.classList.add("has-face");

    const wrap = document.createElement("div");
    wrap.className = "divine-face";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = `
    <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dfHalo" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stop-color="#ffd97a" stop-opacity=".55"/>
          <stop offset="45%" stop-color="#a86bff" stop-opacity=".30"/>
          <stop offset="100%" stop-color="#a86bff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="dfSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8ea8ff"/>
          <stop offset="55%" stop-color="#6d7ff2"/>
          <stop offset="100%" stop-color="#4d55c9"/>
        </linearGradient>
        <linearGradient id="dfHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2b2350"/>
          <stop offset="100%" stop-color="#161233"/>
        </linearGradient>
        <radialGradient id="dfEye3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff6d8"/>
          <stop offset="60%" stop-color="#ffc44d"/>
          <stop offset="100%" stop-color="#ff9d2e" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <circle class="df-halo" cx="100" cy="98" r="92" fill="url(#dfHalo)"/>
      <!-- jata / hair -->
      <path fill="url(#dfHair)" d="M100 14c-36 0-58 22-60 52-1 17 3 28 8 36 3-22 8-34 16-42-2 10-2 22 1 30 5-16 12-26 21-31-3 9-3 19 0 26 4-11 9-18 14-21 5 3 10 10 14 21 3-7 3-17 0-26 9 5 16 15 21 31 3-8 3-20 1-30 8 8 13 20 16 42 5-8 9-19 8-36-2-30-24-52-60-52z"/>
      <!-- crescent moon -->
      <path fill="#f3e7c2" d="M138 26c8 2 14 8 16 15-6-3-13-3-19 1 1-6 2-11 3-16z" opacity=".95"/>
      <!-- face -->
      <path fill="url(#dfSkin)" d="M100 34c-27 0-44 19-44 47 0 15 4 30 11 41 8 13 20 22 33 22s25-9 33-22c7-11 11-26 11-41 0-28-17-47-44-47z"/>
      <!-- ears -->
      <ellipse cx="55" cy="98" rx="7" ry="12" fill="#5a66d8"/>
      <ellipse cx="145" cy="98" rx="7" ry="12" fill="#5a66d8"/>
      <!-- tripundra (three lines) -->
      <g stroke="#f3e7c2" stroke-width="2.6" stroke-linecap="round" opacity=".9">
        <path d="M78 56 Q100 51 122 56" fill="none"/>
        <path d="M79 63 Q100 58 121 63" fill="none"/>
        <path d="M80 70 Q100 65 120 70" fill="none"/>
      </g>
      <!-- third eye -->
      <g class="df-thirdeye">
        <ellipse cx="100" cy="78" rx="10" ry="6" fill="url(#dfEye3)"/>
        <path d="M92 78 Q100 72 108 78 Q100 84 92 78z" fill="#3b2c12"/>
        <circle cx="100" cy="78" r="2.3" fill="#ffd97a"/>
      </g>
      <!-- brows -->
      <path class="df-brow" d="M66 88 Q78 82 90 88" stroke="#242051" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path class="df-brow" d="M110 88 Q122 82 134 88" stroke="#242051" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <!-- eyes -->
      <g class="df-eye" data-eye="L">
        <ellipse class="df-white" cx="78" cy="98" rx="11" ry="7" fill="#f6f4ff"/>
        <circle class="df-iris" cx="78" cy="98" r="4.6" fill="#2b1d55"/>
        <circle class="df-glint" cx="80" cy="96" r="1.4" fill="#ffffff"/>
        <ellipse class="df-lid" cx="78" cy="91" rx="12" ry="7.5" fill="url(#dfSkin)"/>
      </g>
      <g class="df-eye" data-eye="R">
        <ellipse class="df-white" cx="122" cy="98" rx="11" ry="7" fill="#f6f4ff"/>
        <circle class="df-iris" cx="122" cy="98" r="4.6" fill="#2b1d55"/>
        <circle class="df-glint" cx="124" cy="96" r="1.4" fill="#ffffff"/>
        <ellipse class="df-lid" cx="122" cy="91" rx="12" ry="7.5" fill="url(#dfSkin)"/>
      </g>
      <!-- nose -->
      <path d="M100 96 q-3 12 -5 16 q5 4 10 0 q-2 -4 -5 -16z" fill="#5a66d8" opacity=".85"/>
      <!-- mouth : upper lip fixed-ish, lower lip animated -->
      <g class="df-mouthgrp">
        <path class="df-mouth-in" d="" fill="#301c3f"/>
        <path class="df-lip-up" d="" fill="#d98aa0"/>
        <path class="df-lip-dn" d="" fill="#c2748c"/>
      </g>
      <!-- rudraksha mala hint -->
      <g fill="#7a4b2a">
        <circle cx="76" cy="142" r="3"/><circle cx="86" cy="147" r="3"/><circle cx="100" cy="149" r="3"/>
        <circle cx="114" cy="147" r="3"/><circle cx="124" cy="142" r="3"/>
      </g>
      <text x="100" y="222" text-anchor="middle" font-size="13" fill="#c9c2ff" opacity=".8" font-family="Georgia,serif">ॐ शान्तिः</text>
    </svg>`;
    host.appendChild(wrap);

    const svg = wrap.querySelector("svg");
    const lids = svg.querySelectorAll(".df-lid");
    const irises = svg.querySelectorAll(".df-iris");
    const glints = svg.querySelectorAll(".df-glint");
    const mouthIn = svg.querySelector(".df-mouth-in");
    const lipUp = svg.querySelector(".df-lip-up");
    const lipDn = svg.querySelector(".df-lip-dn");

    /* mouth geometry: center (100,126), half-width w, open o (px lower-lip drop) */
    function drawMouth(o, w, smile) {
      const cx = 100, cy = 126;
      const upLift = 2 + smile * 2 - o * 0.15;
      const dn = 2 + o;
      // inner dark mouth
      mouthIn.setAttribute("d",
        `M${cx - w} ${cy} Q${cx} ${cy - upLift} ${cx + w} ${cy} Q${cx} ${cy + dn} ${cx - w} ${cy}z`);
      // upper lip
      lipUp.setAttribute("d",
        `M${cx - w - 2} ${cy} Q${cx} ${cy - upLift - 3.4} ${cx + w + 2} ${cy} Q${cx} ${cy - upLift + 1.2} ${cx - w - 2} ${cy}z`);
      // lower lip
      lipDn.setAttribute("d",
        `M${cx - w - 1} ${cy + dn * 0.34} Q${cx} ${cy + dn + 3.6} ${cx + w + 1} ${cy + dn * 0.34} Q${cx} ${cy + dn * 0.55 + 1} ${cx - w - 1} ${cy + dn * 0.34}z`);
    }
    drawMouth(0.6, 15, 1);

    if (reduceMotion) { lids.forEach(l => l.setAttribute("ry", "0.5")); return; }

    /* blink scheduler */
    let blink = 0; // 0 open → 1 closed
    let blinkPhase = null;
    (function scheduleBlink() {
      setTimeout(() => {
        blinkPhase = { t: 0, dbl: Math.random() < 0.18 };
        scheduleBlink();
      }, rand(2400, 5600));
    })();

    /* gaze wander */
    let gx = 0, gy = 0, tgx = 0, tgy = 0;
    setInterval(() => {
      const speaking = document.body.classList.contains("is-speaking");
      tgx = speaking ? rand(-0.6, 0.6) : rand(-2.2, 2.2);
      tgy = speaking ? rand(-0.3, 0.6) : rand(-1, 1.4);
    }, 1700);

    let t = 0, mouthO = 0.6;
    function frame(dtms) {
      t += dtms;
      const speaking = document.body.classList.contains("is-speaking");
      wrap.classList.toggle("speaking", speaking);

      /* blink progress */
      if (blinkPhase) {
        blinkPhase.t += dtms;
        const cycle = 170, gap = 0.35;
        const total = blinkPhase.dbl ? 2 + gap : 1;
        const p = blinkPhase.t / cycle;
        if (p >= total) { blinkPhase = null; blink = 0; }
        else {
          const pp = p % (1 + gap);
          blink = pp < 1 ? Math.sin(pp * Math.PI) : 0;
        }
      }
      lids.forEach(l => {
        l.setAttribute("cy", String(91 + blink * 7));
        l.setAttribute("ry", String(7.5 + blink * 1.5));
      });

      /* gaze ease */
      gx += (tgx - gx) * 0.04; gy += (tgy - gy) * 0.04;
      irises.forEach((el, i) => {
        el.setAttribute("cx", String((i ? 122 : 78) + gx));
        el.setAttribute("cy", String(98 + gy));
      });
      glints.forEach((el, i) => {
        el.setAttribute("cx", String((i ? 124 : 80) + gx * 0.8));
        el.setAttribute("cy", String(96 + gy * 0.8));
      });

      /* mouth: talking = layered oscillation; idle = calm breathing smile */
      let target;
      if (speaking) {
        const s = t / 1000;
        target = 3.4
          + Math.abs(Math.sin(s * 9.2)) * 5.4
          + Math.abs(Math.sin(s * 4.1 + 1.3)) * 2.6
          + Math.sin(s * 23) * 0.9;
      } else {
        target = 0.6 + Math.sin(t / 2600) * 0.35;
      }
      mouthO += (target - mouthO) * (speaking ? 0.38 : 0.06);
      const w = speaking ? 13.5 + Math.sin(t / 130) * 1.6 : 15;
      drawMouth(Math.max(0.2, mouthO), w, speaking ? 0.4 : 1);
    }

    let last = performance.now();
    (function loop(now) {
      if (!document.hidden) frame(Math.min(48, now - last));
      last = now;
      requestAnimationFrame(loop);
    })(last);
  }

  /* ─────────────────────────── 2. LIVING UNIVERSE ─────────────────────────── */
  function createUniverse(host, opts = {}) {
    if (!host || host.querySelector(".universe-canvas")) return;
    const canvas = document.createElement("canvas");
    canvas.className = "universe-canvas" + (opts.deep ? " universe-deep" : "");
    canvas.setAttribute("aria-hidden", "true");
    if (opts.behind) host.prepend(canvas); else host.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const density = opts.density || 1;
    let W = 0, H = 0, dpr = 1;

    function resize() {
      const r = host.getBoundingClientRect();
      if (!r.width || !r.height) return;
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    new ResizeObserver(resize).observe(host);

    /* galaxy arm stars (rotate around centre) */
    const armStars = [];
    const ARMS = 3;
    for (let i = 0; i < 90 * density; i++) {
      const arm = i % ARMS;
      const d = Math.pow(Math.random(), 0.72);           // radial distribution
      armStars.push({
        baseA: (arm / ARMS) * TAU + d * 3.1 + rand(-0.22, 0.22),
        d,
        sz: rand(0.5, 1.7),
        hue: Math.random() < 0.72 ? rand(245, 275) : rand(35, 48),
        tw: rand(0, TAU), twSp: rand(0.4, 1.6)
      });
    }
    /* free background stars */
    const freeStars = Array.from({ length: 46 * density }, () => ({
      x: Math.random(), y: Math.random(), sz: rand(0.4, 1.3),
      tw: rand(0, TAU), twSp: rand(0.3, 1.4)
    }));
    /* nebula blobs */
    const nebulae = Array.from({ length: 3 }, (_, i) => ({
      x: rand(0.2, 0.8), y: rand(0.2, 0.8), r: rand(0.24, 0.42),
      hue: [268, 292, 38][i], ph: rand(0, TAU), sp: rand(0.05, 0.12),
      dx: rand(-0.004, 0.004), dy: rand(-0.003, 0.003)
    }));

    /* planet lifecycle: dust → accrete → orbit → supernova → dust */
    const PLANET_HUES = [268, 200, 24, 320, 150, 44];
    function newPlanet(stage) {
      return {
        stage: stage || "dust",              // dust | grow | orbit | nova
        t: 0,
        orbit: rand(0.16, 0.46),             // fraction of min(W,H)
        a: rand(0, TAU),
        sp: rand(0.12, 0.34) * (Math.random() < 0.5 ? 1 : -1),
        size: 0,
        maxSize: rand(2.6, 5.4),
        hue: PLANET_HUES[Math.floor(Math.random() * PLANET_HUES.length)],
        ring: Math.random() < 0.35,
        life: rand(14, 26),                  // seconds in orbit before nova
        dust: Array.from({ length: 14 }, () => ({ a: rand(0, TAU), r: rand(4, 16), s: rand(0.4, 1.1) })),
        shards: null
      };
    }
    const planets = Array.from({ length: Math.max(3, Math.round(4 * density)) },
      (_, i) => {
        const p = newPlanet(i < 2 ? "orbit" : "dust");
        if (p.stage === "orbit") p.size = p.maxSize;
        return p;
      });

    /* comets */
    let comet = null;
    function maybeComet(dt) {
      if (comet) {
        comet.x += comet.vx * dt; comet.y += comet.vy * dt; comet.t += dt;
        if (comet.x < -0.2 || comet.x > 1.2 || comet.y > 1.2) comet = null;
      } else if (Math.random() < dt / 9) {
        const fromLeft = Math.random() < 0.5;
        comet = {
          x: fromLeft ? -0.1 : 1.1, y: rand(-0.05, 0.35),
          vx: (fromLeft ? 1 : -1) * rand(0.12, 0.2), vy: rand(0.05, 0.1), t: 0
        };
      }
    }

    let rot = rand(0, TAU);
    let expand = 0;                      // universe slowly breathes-expands
    let t = 0;

    function step(dt) {
      t += dt;
      rot += dt * 0.055;                              // galaxy rotation
      expand = 1 + Math.sin(t * 0.045) * 0.06 + t * 0.0006 % 0.08; // gentle growth
      const cx = W / 2, cy = H / 2, R = Math.min(W, H);

      ctx.clearRect(0, 0, W, H);

      /* nebulae */
      for (const n of nebulae) {
        n.ph += n.sp * dt;
        n.x = (n.x + n.dx * dt + 1) % 1; n.y = (n.y + n.dy * dt + 1) % 1;
        const rr = n.r * R * (1 + Math.sin(n.ph) * 0.15);
        const g = ctx.createRadialGradient(n.x * W, n.y * H, 0, n.x * W, n.y * H, rr);
        g.addColorStop(0, `hsla(${n.hue},80%,60%,${0.10 + Math.sin(n.ph) * 0.03})`);
        g.addColorStop(1, "hsla(0,0%,0%,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      /* free stars */
      for (const s of freeStars) {
        s.tw += s.twSp * dt;
        ctx.globalAlpha = 0.35 + Math.abs(Math.sin(s.tw)) * 0.65;
        ctx.fillStyle = "#e8e4ff";
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.sz, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* galaxy core */
      const coreG = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.16);
      coreG.addColorStop(0, "rgba(255,236,190,0.85)");
      coreG.addColorStop(0.4, "rgba(255,190,105,0.32)");
      coreG.addColorStop(1, "rgba(255,190,105,0)");
      ctx.fillStyle = coreG;
      ctx.beginPath(); ctx.arc(cx, cy, R * 0.16, 0, TAU); ctx.fill();

      /* spiral arm stars */
      for (const s of armStars) {
        s.tw += s.twSp * dt;
        const a = s.baseA + rot * (1.25 - s.d * 0.6);
        const rr = s.d * R * 0.5 * expand;
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr * 0.62;        // galactic tilt
        ctx.globalAlpha = 0.3 + Math.abs(Math.sin(s.tw)) * 0.7;
        ctx.fillStyle = `hsl(${s.hue},85%,${72 - s.d * 18}%)`;
        ctx.beginPath(); ctx.arc(x, y, s.sz, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* planets lifecycle */
      for (const p of planets) {
        p.t += dt;
        p.a += p.sp * dt;
        const orbR = p.orbit * R * expand;
        const px = cx + Math.cos(p.a) * orbR;
        const py = cy + Math.sin(p.a) * orbR * 0.78;

        if (p.stage === "dust") {
          const prog = Math.min(1, p.t / 3.4);
          for (const d of p.dust) {
            d.a += d.s * dt;
            const dr = d.r * (1 - prog * 0.85);
            ctx.globalAlpha = 0.25 + prog * 0.5;
            ctx.fillStyle = `hsl(${p.hue},75%,70%)`;
            ctx.beginPath();
            ctx.arc(px + Math.cos(d.a) * dr, py + Math.sin(d.a) * dr * 0.7, 0.9, 0, TAU);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
          if (prog >= 1) { p.stage = "grow"; p.t = 0; }
        } else if (p.stage === "grow") {
          p.size = Math.min(p.maxSize, p.size + dt * 2.2);
          drawPlanet(px, py, p);
          if (p.size >= p.maxSize) { p.stage = "orbit"; p.t = 0; }
        } else if (p.stage === "orbit") {
          drawPlanet(px, py, p);
          if (p.t > p.life) {
            p.stage = "nova"; p.t = 0;
            p.shards = Array.from({ length: 18 }, () => ({
              a: rand(0, TAU), v: rand(14, 46), sz: rand(0.7, 1.9)
            }));
            p.novaX = px; p.novaY = py;
          }
        } else if (p.stage === "nova") {
          const prog = p.t / 2.6;                       // smooth burst
          if (prog < 1) {
            const ease = 1 - Math.pow(1 - prog, 3);
            /* shockwave rings */
            ctx.globalAlpha = (1 - prog) * 0.8;
            ctx.strokeStyle = `hsl(${p.hue},90%,75%)`;
            ctx.lineWidth = 1.6 * (1 - prog) + 0.3;
            ctx.beginPath(); ctx.arc(p.novaX, p.novaY, ease * 34 + p.maxSize, 0, TAU); ctx.stroke();
            ctx.globalAlpha = (1 - prog) * 0.4;
            ctx.beginPath(); ctx.arc(p.novaX, p.novaY, ease * 20 + p.maxSize, 0, TAU); ctx.stroke();
            /* flash core */
            ctx.globalAlpha = Math.max(0, 1 - prog * 1.6);
            ctx.fillStyle = "#fff7e6";
            ctx.beginPath(); ctx.arc(p.novaX, p.novaY, p.maxSize * (1 + prog * 1.5), 0, TAU); ctx.fill();
            /* shards */
            for (const sh of p.shards) {
              ctx.globalAlpha = 1 - prog;
              ctx.fillStyle = `hsl(${p.hue},85%,70%)`;
              ctx.beginPath();
              ctx.arc(p.novaX + Math.cos(sh.a) * sh.v * ease,
                      p.novaY + Math.sin(sh.a) * sh.v * ease * 0.8,
                      sh.sz * (1 - prog * 0.6), 0, TAU);
              ctx.fill();
            }
            ctx.globalAlpha = 1;
          } else {
            Object.assign(p, newPlanet("dust"));        // पुनर्जन्म
          }
        }
      }

      /* comet */
      maybeComet(dt);
      if (comet) {
        const x = comet.x * W, y = comet.y * H;
        const tail = ctx.createLinearGradient(x, y, x - comet.vx * W * 0.9, y - comet.vy * H * 0.9);
        tail.addColorStop(0, "rgba(220,235,255,0.9)");
        tail.addColorStop(1, "rgba(220,235,255,0)");
        ctx.strokeStyle = tail; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.lineTo(x - comet.vx * W * 0.9, y - comet.vy * H * 0.9); ctx.stroke();
        ctx.fillStyle = "#f4f8ff";
        ctx.beginPath(); ctx.arc(x, y, 1.9, 0, TAU); ctx.fill();
      }
    }

    function drawPlanet(px, py, p) {
      const g = ctx.createRadialGradient(px - p.size * 0.4, py - p.size * 0.4, 0, px, py, p.size);
      g.addColorStop(0, `hsl(${p.hue},80%,74%)`);
      g.addColorStop(1, `hsl(${p.hue},70%,38%)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(px, py, p.size, 0, TAU); ctx.fill();
      if (p.ring) {
        ctx.strokeStyle = `hsla(${p.hue},70%,80%,0.65)`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(px, py, p.size * 1.9, p.size * 0.7, -0.5, 0, TAU); ctx.stroke();
      }
    }

    if (reduceMotion) { step(0.016); return; }          // एक स्थिर सुंदर frame
    let last = performance.now();
    (function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!document.hidden) step(dt);
      requestAnimationFrame(loop);
    })(last);
  }

  /* ───────────────────────────── mount points ───────────────────────────── */
  function init() {
    mountDivineFace();
    createUniverse(document.querySelector(".chat-side-visual"), { behind: true, density: 0.7 });
    createUniverse(document.querySelector(".cosmic-map"), { behind: true, density: 1.3 });
    createUniverse(document.querySelector(".live-preview"), { density: 0.6 });
    const stage = document.querySelector(".cosmic-stage");
    if (stage) createUniverse(stage, { behind: false, density: 0.8, deep: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
