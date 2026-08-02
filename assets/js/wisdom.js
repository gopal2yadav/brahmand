(() => {
  "use strict";

  const { qs, speak, toast } = window.Brahmand;
  const card = qs("#dailyWisdomCard");
  if (!card) return;

  const dateKey = new Date().toISOString().slice(0, 10);
  const journalKey = `brahmand-journal-${dateKey}`;
  let wisdomItems = [];
  let currentIndex = 0;

  function indexForToday(length) {
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date() - start;
    const day = Math.floor(diff / 86400000);
    return day % length;
  }

  function render(entry) {
    qs("#dailyCategory").textContent = entry.category;
    qs("#dailyVerse").textContent = entry.verse || entry.title;
    qs("#dailyMeaning").textContent = entry.summary_hi;
    qs("#dailyEnglish").textContent = entry.summary_en;
    qs("#dailySource").textContent = entry.source;
    qs("#dailyThemes").innerHTML = (entry.themes || []).map((theme) => `<span class="pill">${window.Brahmand.escapeHTML(theme)}</span>`).join("");
  }

  fetch("data/scriptures.json")
    .then((response) => response.json())
    .then((data) => {
      wisdomItems = data.filter((item) => item.verse);
      currentIndex = indexForToday(wisdomItems.length);
      render(wisdomItems[currentIndex]);
    })
    .catch(() => {
      qs("#dailyMeaning").textContent = "ज्ञान-संग्रह load नहीं हुआ। Website को local server या Vercel पर चलाएँ।";
    });

  qs("#newWisdom")?.addEventListener("click", () => {
    if (!wisdomItems.length) return;
    currentIndex = (currentIndex + 1) % wisdomItems.length;
    render(wisdomItems[currentIndex]);
  });

  qs("#listenWisdom")?.addEventListener("click", () => {
    if (!wisdomItems.length) return;
    const item = wisdomItems[currentIndex];
    speak(`${item.verse}. सरल अर्थ: ${item.summary_hi}`, "hi-IN", { rate: 0.82, pitch: 0.88 });
  });

  const journal = qs("#wisdomJournal");
  const saved = qs("#journalSaved");
  journal.value = localStorage.getItem(journalKey) || "";
  qs("#saveJournal")?.addEventListener("click", () => {
    localStorage.setItem(journalKey, journal.value.trim());
    saved.classList.add("show");
    toast("आज की journal entry सुरक्षित हो गई।");
    window.setTimeout(() => saved.classList.remove("show"), 2200);
  });
})();
