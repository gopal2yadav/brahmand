(() => {
  "use strict";

  const { qs, qsa, escapeHTML } = window.Brahmand;
  const clock = qs("#cosmicClock");
  const feed = qs("#activityFeed");

  function updateClock() {
    if (!clock) return;
    const now = new Date();
    clock.textContent = new Intl.DateTimeFormat("hi-IN", {
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short"
    }).format(now);
  }

  updateClock();
  window.setInterval(updateClock, 1000);

  const activities = [
    ["✨", "नई जिज्ञासा", "एक साधक ने कर्मयोग पर प्रश्न पूछा"],
    ["🪷", "ध्यान पूर्ण", "10 मिनट का श्वास अभ्यास पूरा हुआ"],
    ["📖", "श्लोक पढ़ा गया", "भगवद्गीता 2.47 का अध्ययन"],
    ["🌌", "ब्रह्माण्ड विस्तार", "Cosmic visual simulation updated"],
    ["🔱", "शिव-तत्त्व", "चेतना और साक्षीभाव पर संवाद"],
    ["🕉️", "मंत्र अभ्यास", "महामृत्युञ्जय मंत्र का श्रवण"],
    ["🌿", "शांति संकल्प", "एक उपयोगकर्ता ने journal entry सुरक्षित की"]
  ];

  function addActivity() {
    if (!feed) return;
    const item = activities[Math.floor(Math.random() * activities.length)];
    const element = document.createElement("div");
    element.className = "activity-item";
    element.innerHTML = `
      <div class="activity-icon">${escapeHTML(item[0])}</div>
      <div class="activity-copy"><strong>${escapeHTML(item[1])}</strong><small>${escapeHTML(item[2])}</small></div>
      <span class="activity-time">अभी</span>`;
    feed.prepend(element);
    while (feed.children.length > 7) feed.lastElementChild.remove();
  }

  window.setInterval(addActivity, 6500);

  qsa("[data-live-number]").forEach((el) => {
    let value = Number(el.dataset.liveNumber || 0);
    const minStep = Number(el.dataset.minStep || 1);
    const maxStep = Number(el.dataset.maxStep || 5);
    const suffix = el.dataset.suffix || "";
    const update = () => {
      value += Math.floor(Math.random() * (maxStep - minStep + 1)) + minStep;
      el.textContent = `${value.toLocaleString("en-IN")}${suffix}`;
    };
    update();
    window.setInterval(update, 4200 + Math.random() * 3000);
  });
})();
