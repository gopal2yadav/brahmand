(() => {
  "use strict";

  const { qs, speak, toast } = window.Brahmand;
  const display = qs("#timerDisplay");
  const durationSelect = qs("#meditationDuration");
  const startButton = qs("#startMeditation");
  const resetButton = qs("#resetMeditation");
  const orb = qs("#breathOrb");
  const cue = qs("#breathCue");
  const ambienceButton = qs("#ambienceToggle");
  const volume = qs("#ambienceVolume");
  const sessions = qs("#sessionCount");
  if (!display || !durationSelect || !startButton) return;

  let remaining = Number(durationSelect.value) * 60;
  let timer = null;
  let running = false;
  let breathTimer = null;
  let audioContext = null;
  let gainNode = null;
  let oscillators = [];
  let ambienceOn = false;

  function format(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  }

  function updateDisplay() {
    display.textContent = format(remaining);
    document.title = running ? `${format(remaining)} · Brahmand Meditation` : "Meditation · Brahmand";
  }

  function breathCycle() {
    if (!running) return;
    orb.className = "breath-orb active inhale";
    cue.textContent = "श्वास लें · Inhale";
    breathTimer = window.setTimeout(() => {
      if (!running) return;
      cue.textContent = "रोकें · Hold";
      breathTimer = window.setTimeout(() => {
        if (!running) return;
        orb.className = "breath-orb active exhale";
        cue.textContent = "श्वास छोड़ें · Exhale";
        breathTimer = window.setTimeout(breathCycle, 6000);
      }, 2000);
    }, 4000);
  }

  function complete() {
    window.clearInterval(timer);
    window.clearTimeout(breathTimer);
    timer = null;
    running = false;
    orb.className = "breath-orb";
    cue.textContent = "ध्यान पूर्ण · Complete";
    startButton.textContent = "फिर से शुरू करें";
    const count = Number(localStorage.getItem("brahmand-meditation-sessions") || 0) + 1;
    localStorage.setItem("brahmand-meditation-sessions", String(count));
    sessions.textContent = String(count);
    speak("आपका ध्यान सत्र पूर्ण हुआ। ॐ शान्तिः शान्तिः शान्तिः।", "hi-IN", { rate: 0.78, pitch: 0.85 });
    toast("ध्यान सत्र पूर्ण हुआ। ॐ शान्तिः।", 5000);
  }

  function toggleTimer() {
    if (running) {
      running = false;
      window.clearInterval(timer);
      window.clearTimeout(breathTimer);
      timer = null;
      orb.className = "breath-orb";
      cue.textContent = "विराम · Paused";
      startButton.textContent = "जारी रखें";
      return;
    }

    if (remaining <= 0) remaining = Number(durationSelect.value) * 60;
    running = true;
    startButton.textContent = "विराम दें";
    breathCycle();
    timer = window.setInterval(() => {
      remaining -= 1;
      updateDisplay();
      if (remaining <= 0) complete();
    }, 1000);
  }

  function reset() {
    running = false;
    window.clearInterval(timer);
    window.clearTimeout(breathTimer);
    timer = null;
    remaining = Number(durationSelect.value) * 60;
    orb.className = "breath-orb";
    cue.textContent = "शुरू करने के लिए तैयार";
    startButton.textContent = "ध्यान शुरू करें";
    updateDisplay();
  }

  function startAmbience() {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.gain.value = Number(volume.value) * 0.10;
    gainNode.connect(audioContext.destination);

    [68.05, 136.1, 204.15].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const partialGain = audioContext.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      partialGain.gain.value = index === 0 ? 0.52 : 0.18 / index;
      oscillator.connect(partialGain).connect(gainNode);
      oscillator.start();
      oscillators.push(oscillator);
    });

    ambienceOn = true;
    ambienceButton.textContent = "ॐ Ambience बंद करें";
  }

  function stopAmbience() {
    oscillators.forEach((oscillator) => {
      try { oscillator.stop(); } catch { /* already stopped */ }
    });
    oscillators = [];
    if (gainNode) gainNode.disconnect();
    gainNode = null;
    ambienceOn = false;
    ambienceButton.textContent = "ॐ Ambience चलाएँ";
  }

  startButton.addEventListener("click", toggleTimer);
  resetButton.addEventListener("click", reset);
  durationSelect.addEventListener("change", reset);
  ambienceButton?.addEventListener("click", () => {
    if (ambienceOn) stopAmbience();
    else startAmbience();
  });
  volume?.addEventListener("input", () => {
    if (gainNode) gainNode.gain.value = Number(volume.value) * 0.10;
  });
  window.addEventListener("pagehide", stopAmbience);

  sessions.textContent = localStorage.getItem("brahmand-meditation-sessions") || "0";
  updateDisplay();
})();
