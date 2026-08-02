(() => {
  "use strict";

  const { qs, qsa, escapeHTML, toast } = window.Brahmand;
  const grid = qs("#libraryGrid");
  if (!grid) return;

  const search = qs("#librarySearch");
  const category = qs("#libraryCategory");
  const count = qs("#libraryCount");
  const empty = qs("#libraryEmpty");
  const dialog = qs("#scriptureDialog");
  let entries = [];

  const categoryClass = {
    "Bhagavad Gita": "gold-badge",
    Vedas: "cyan-badge",
    Upanishads: "violet-badge",
    Puranas: "gold-badge",
    Darshana: "cyan-badge",
    Itihasa: "gold-badge",
    Bhakti: "violet-badge",
    Vedanta: "violet-badge",
    Shaiva: "violet-badge",
    Mantra: "cyan-badge"
  };

  function render(list) {
    grid.innerHTML = list
      .map(
        (entry) => `
          <article class="card card-hover scripture-card reveal visible" data-entry-id="${escapeHTML(entry.id)}">
            <span class="badge ${categoryClass[entry.category] || ""}">${escapeHTML(entry.category)}</span>
            <h3 style="margin-top:14px">${escapeHTML(entry.title)}</h3>
            <p class="muted">${escapeHTML(entry.summary_hi)}</p>
            <div class="card-meta">
              <span class="pill">${escapeHTML(entry.source)}</span>
              ${(entry.themes || []).slice(0, 2).map((theme) => `<span class="pill">${escapeHTML(theme)}</span>`).join("")}
            </div>
            <button class="btn btn-sm btn-ghost" type="button" data-open-entry="${escapeHTML(entry.id)}" style="margin-top:16px">विस्तार से पढ़ें →</button>
          </article>`
      )
      .join("");

    count.textContent = `${list.length} ज्ञान-स्रोत`;
    empty.classList.toggle("hidden", list.length > 0);

    qsa("[data-open-entry]", grid).forEach((button) => {
      button.addEventListener("click", () => openEntry(button.dataset.openEntry));
    });
  }

  function applyFilter() {
    const query = (search.value || "").trim().toLowerCase();
    const selected = category.value || "all";
    const filtered = entries.filter((entry) => {
      const matchesCategory = selected === "all" || entry.category === selected;
      const haystack = [entry.title, entry.category, entry.source, entry.verse, entry.summary_hi, entry.summary_en, ...(entry.themes || [])]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
    render(filtered);
  }

  function openEntry(id) {
    const entry = entries.find((item) => item.id === id);
    if (!entry || !dialog) return;
    qs("#dialogCategory").textContent = entry.category;
    qs("#dialogTitle").textContent = entry.title;
    qs("#dialogSource").textContent = entry.source;
    const verse = qs("#dialogVerse");
    verse.textContent = entry.verse || "इस प्रविष्टि में विषय-सार दिया गया है; मूल ग्रन्थ के अध्याय/संस्करण के साथ अध्ययन करें।";
    verse.classList.toggle("muted", !entry.verse);
    qs("#dialogHindi").textContent = entry.summary_hi;
    qs("#dialogEnglish").textContent = entry.summary_en;
    qs("#dialogThemes").innerHTML = (entry.themes || []).map((theme) => `<span class="pill">${escapeHTML(theme)}</span>`).join("");
    dialog.showModal();
  }

  search.addEventListener("input", applyFilter);
  category.addEventListener("change", applyFilter);
  qs("#closeScriptureDialog")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  fetch("data/scriptures.json")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      entries = data;
      render(entries);
    })
    .catch(() => {
      grid.innerHTML = '<div class="empty-state">ज्ञान-संग्रह load नहीं हुआ। Website को local server या Vercel पर चलाएँ।</div>';
      toast("Scripture library load नहीं हो पाई।");
    });
})();
