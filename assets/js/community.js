(() => {
  "use strict";

  const { qs, escapeHTML, toast } = window.Brahmand;
  const form = qs("#communityForm");
  const list = qs("#communityPosts");
  if (!form || !list) return;

  const KEY = "brahmand-community-posts-v1";
  const samples = [
    {
      id: "sample-1",
      name: "अनन्या",
      topic: "Daily Wisdom",
      message: "आज गीता 2.47 के भाव को अपने काम में लगाया। परिणाम की चिंता कम हुई और काम पर ध्यान बेहतर रहा।",
      likes: 24,
      createdAt: Date.now() - 1000 * 60 * 18,
      local: false
    },
    {
      id: "sample-2",
      name: "Arjun",
      topic: "Meditation",
      message: "4-2-6 breathing cycle ने meeting से पहले बहुत मदद की। पाँच मिनट का अभ्यास भी असर करता है।",
      likes: 17,
      createdAt: Date.now() - 1000 * 60 * 52,
      local: false
    },
    {
      id: "sample-3",
      name: "मीरा",
      topic: "Question",
      message: "कर्तव्य और अपनी सीमाओं के बीच संतुलन कैसे रखें? मैं इस पर समुदाय के अनुभव सुनना चाहती हूँ।",
      likes: 31,
      createdAt: Date.now() - 1000 * 60 * 110,
      local: false
    }
  ];

  let posts = [];
  try {
    posts = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(posts)) posts = [];
  } catch {
    posts = [];
  }

  function relativeTime(timestamp) {
    const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
    if (minutes < 60) return `${minutes} मिनट पहले`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} घंटे पहले`;
    return `${Math.floor(hours / 24)} दिन पहले`;
  }

  function initials(name) {
    return name.trim().slice(0, 2).toUpperCase() || "ॐ";
  }

  function render() {
    const all = [...posts, ...samples].sort((a, b) => b.createdAt - a.createdAt);
    list.innerHTML = all
      .map(
        (post) => `
          <article class="card post-card" data-post-id="${escapeHTML(post.id)}">
            <div class="post-head">
              <div class="post-avatar">${escapeHTML(initials(post.name))}</div>
              <div class="post-author"><strong>${escapeHTML(post.name)}</strong><small>${escapeHTML(post.topic)} · ${relativeTime(post.createdAt)}</small></div>
              ${post.local ? '<span class="badge violet-badge" style="margin-left:auto">आपकी पोस्ट</span>' : ""}
            </div>
            <p>${escapeHTML(post.message)}</p>
            <div class="post-actions">
              <button class="post-action" type="button" data-like="${escapeHTML(post.id)}">♡ <span>${Number(post.likes || 0)}</span> आशीर्वाद</button>
              <button class="post-action" type="button" data-copy-post="${escapeHTML(post.id)}">⧉ कॉपी</button>
              ${post.local ? `<button class="post-action" type="button" data-delete-post="${escapeHTML(post.id)}">हटाएँ</button>` : ""}
            </div>
          </article>`
      )
      .join("");

    list.querySelectorAll("[data-like]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.like;
        const localPost = posts.find((post) => post.id === id);
        const samplePost = samples.find((post) => post.id === id);
        const post = localPost || samplePost;
        if (!post) return;
        post.likes = Number(post.likes || 0) + 1;
        if (localPost) save();
        button.querySelector("span").textContent = post.likes;
      });
    });

    list.querySelectorAll("[data-copy-post]").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.copyPost;
        const post = [...posts, ...samples].find((item) => item.id === id);
        if (!post) return;
        try {
          await navigator.clipboard.writeText(`${post.name}: ${post.message}`);
          toast("पोस्ट कॉपी हो गई।");
        } catch {
          toast("कॉपी नहीं हो पाया।");
        }
      });
    });

    list.querySelectorAll("[data-delete-post]").forEach((button) => {
      button.addEventListener("click", () => {
        posts = posts.filter((post) => post.id !== button.dataset.deletePost);
        save();
        render();
      });
    });
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(posts.slice(0, 30)));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = qs("#communityName").value.trim();
    const topic = qs("#communityTopic").value;
    const message = qs("#communityMessage").value.trim();
    if (name.length < 2 || message.length < 5) {
      toast("नाम और कम-से-कम 5 अक्षरों का संदेश लिखें।");
      return;
    }
    posts.unshift({
      id: `local-${Date.now()}`,
      name: name.slice(0, 40),
      topic,
      message: message.slice(0, 900),
      likes: 0,
      createdAt: Date.now(),
      local: true
    });
    save();
    form.reset();
    render();
    toast("आपकी पोस्ट इस browser में सुरक्षित हो गई।");
  });

  render();
})();
