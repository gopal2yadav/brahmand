(() => {
  "use strict";

  const { qs, qsa, speak, stopSpeaking, toast, currentLanguage, languageMap } = window.Brahmand;
  const messages = qs("#chatMessages");
  const form = qs("#chatForm");
  const input = qs("#chatInput");
  const sendButton = qs("#sendChatButton");
  const voiceButton = qs("#voiceInputButton");
  const autoVoice = qs("#autoVoice");
  const language = qs("#chatLanguage");
  const clearButton = qs("#clearChat");

  if (!messages || !form || !input) return;

  const STORAGE_KEY = "brahmand-chat-history-v1";
  let history = [];
  let busy = false;
  let recognition = null;

  const params = new URLSearchParams(location.search);
  const initialLanguage = params.get("lang") || localStorage.getItem("brahmand-language") || "hi-IN";
  if (language) language.value = [...language.options].some((option) => option.value === initialLanguage) ? initialLanguage : "hi-IN";

  function now() {
    return new Intl.DateTimeFormat("hi-IN", { hour: "2-digit", minute: "2-digit" }).format(new Date());
  }

  function addMessage(role, text, source = "", persist = true) {
    const wrapper = document.createElement("article");
    wrapper.className = `message ${role}`;

    const icon = document.createElement("div");
    icon.className = "message-icon";
    icon.textContent = role === "user" ? "✦" : "ॐ";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = text;

    if (source) {
      const sourceLine = document.createElement("span");
      sourceLine.className = "message-source";
      sourceLine.textContent = `संदर्भ: ${source}`;
      bubble.appendChild(sourceLine);
    }

    const time = document.createElement("span");
    time.className = "message-time";
    time.textContent = now();
    bubble.appendChild(time);

    wrapper.append(icon, bubble);
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;

    if (persist) {
      history.push({ role, text, source, timestamp: Date.now() });
      history = history.slice(-30);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
    return wrapper;
  }

  function showTyping() {
    const wrapper = document.createElement("article");
    wrapper.className = "message assistant";
    wrapper.id = "typingMessage";
    wrapper.innerHTML = '<div class="message-icon">ॐ</div><div class="message-bubble"><span class="typing" aria-label="उत्तर तैयार हो रहा है"><i></i><i></i><i></i></span></div>';
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    qs("#typingMessage")?.remove();
  }

  function isHindi(text) {
    return /[\u0900-\u097F]/.test(text);
  }

  function offlineAnswer(question, selectedLanguage) {
    const q = question.toLowerCase();
    const hindi = selectedLanguage === "hi-IN" || selectedLanguage === "sa-IN" || isHindi(question);

    const answers = [
      {
        test: /(तनाव|चिंता|परेशान|stress|anxiety|tension|दुःख|duk|sad)/i,
        source: "भगवद्गीता 2.14",
        hi: "सुख और दुःख स्थायी नहीं हैं; वे बदलते मौसम की तरह आते-जाते हैं। अभी तीन काम करो: चार धीमी साँसें लो, अपनी चिंता को एक वाक्य में लिखो, और केवल अगला छोटा सही कदम चुनो। समस्या को पूरा जीवन मत मानो—यह एक गुजरती हुई अवस्था है।",
        en: "Pleasure and pain are temporary, like changing weather. Take four slow breaths, name the worry in one sentence, and choose only the next right step. Do not mistake a passing state for your whole life."
      },
      {
        test: /(काम|नौकरी|career|business|result|फल|failure|असफल|पैसा|money)/i,
        source: "भगवद्गीता 2.47",
        hi: "तुम्हारा नियंत्रण तैयारी, ईमानदार प्रयास और निर्णय पर है; परिणाम पर पूरा नियंत्रण नहीं। आज का कर्म तीन भाग में बाँटो—जो अभी कर सकते हो, जो किसी और की सहायता चाहता है, और जिसे अभी छोड़ना है। फल की चिंता कम करके कर्म की गुणवत्ता बढ़ाओ।",
        en: "Your control lies in preparation, honest effort and decisions—not in every outcome. Divide today into what you can do now, what needs help, and what must be released. Improve the quality of action instead of feeding anxiety about results."
      },
      {
        test: /(डर|भय|fear|afraid|घबराहट|guilt|अपराध)/i,
        source: "भगवद्गीता 18.66",
        hi: "भय अक्सर तब बढ़ता है जब मन सब कुछ अकेले नियंत्रित करना चाहता है। अपनी पूरी सामर्थ्य से उचित कर्म करो, फिर शेष को परम व्यवस्था पर छोड़ने का अभ्यास करो। शरणागति भागना नहीं है; यह अहंकार का बोझ हल्का करके स्पष्ट कर्म करना है।",
        en: "Fear grows when the mind tries to control everything alone. Act responsibly with your full capacity, then practice releasing what is beyond you. Surrender is not escape; it is lighter ego and clearer action."
      },
      {
        test: /(मृत्यु|death|मर गया|शोक|grief|loss|खो दिया)/i,
        source: "भगवद्गीता 2.20",
        hi: "शोक प्रेम की गहराई बताता है, इसलिए उसे दबाना आवश्यक नहीं। गीता आत्मा को शरीर से परे नित्य मानती है। आज स्मृति के साथ बैठो, किसी विश्वासपात्र से बात करो, और स्वयं को रोने या मौन रहने की अनुमति दो। आध्यात्मिक समझ दुख को नकारती नहीं—उसे सहने का आधार देती है।",
        en: "Grief reveals the depth of love, so it need not be suppressed. The Gita describes the self as deeper than the body. Sit with one loving memory, speak to someone trusted, and allow tears or silence. Spiritual insight does not deny pain; it gives ground beneath it."
      },
      {
        test: /(आत्मविश्वास|confidence|कमजोर|weak|motivation|हिम्मत|courage)/i,
        source: "भगवद्गीता 6.5",
        hi: "मन को शत्रु कहकर मत छोड़ो; उसे अभ्यास से मित्र बनाओ। एक छोटा वचन चुनो जिसे आज अवश्य पूरा करोगे—जैसे 20 मिनट काम, एक जरूरी फोन, या 10 मिनट ध्यान। स्वयं पर विश्वास बड़े भाषण से नहीं, निभाए गए छोटे वचनों से बनता है।",
        en: "Do not abandon the mind as an enemy; train it into an ally. Choose one small promise you will keep today—twenty minutes of work, one necessary call, or ten minutes of meditation. Confidence grows from promises kept."
      },
      {
        test: /(गुस्सा|क्रोध|anger|angry|झगड़ा|fight)/i,
        source: "भगवद्गीता 2.62–63 का भाव",
        hi: "क्रोध के समय निर्णय मत लो। पहले शरीर की गति धीमी करो: पानी पियो, दस गहरी साँसें लो, और उत्तर देने से पहले 20 मिनट का अंतर रखो। फिर पूछो—मैं किस चोट, अपेक्षा या भय की रक्षा कर रहा हूँ? कारण समझ आने पर प्रतिक्रिया की जगह उत्तर चुनना संभव होता है।",
        en: "Do not make major decisions while angry. Slow the body first: drink water, take ten deep breaths, and wait twenty minutes before replying. Then ask what hurt, expectation or fear you are protecting. Understanding the cause makes a wise response possible."
      },
      {
        test: /(रिश्ता|relationship|love|प्यार|शादी|marriage|family|परिवार)/i,
        source: "नारद भक्ति सूत्र का प्रेम-भाव",
        hi: "प्रेम केवल अधिकार नहीं, दूसरे के कल्याण को देखने की क्षमता है। बातचीत में तीन बातें रखो—बिना आरोप के अपना अनुभव, सामने वाले की बात पूरी सुनना, और एक स्पष्ट सीमा या अनुरोध। जहाँ सम्मान लगातार टूटे, वहाँ करुणा के साथ दूरी भी धर्म हो सकती है।",
        en: "Love is not possession; it includes concern for the other person's well-being. Speak without accusation, listen fully, and make one clear request or boundary. Where respect is repeatedly broken, compassionate distance may also be dharmic."
      },
      {
        test: /(ध्यान|meditation|मन शांत|peace|नींद|sleep|ॐ|om)/i,
        source: "योगसूत्र 1.12",
        hi: "मन को जबरन खाली करने की आवश्यकता नहीं। पाँच मिनट के लिए रीढ़ सहज सीधी रखो, चार गिनती में साँस लो और छह गिनती में छोड़ो। विचार आएँ तो केवल ‘विचार’ कहकर साँस पर लौटो। अभ्यास और अनासक्ति—यही स्थिरता का मार्ग है।",
        en: "You do not need to force the mind blank. Sit comfortably upright for five minutes, inhale for four counts and exhale for six. When thoughts arise, label them gently as ‘thinking’ and return to the breath. Practice and non-attachment create steadiness."
      }
    ];

    const selected = answers.find((item) => item.test.test(question));
    if (selected) return { answer: hindi ? selected.hi : selected.en, source: selected.source };

    return {
      answer: hindi
        ? "इस प्रश्न को तीन स्तर पर देखो: तथ्य क्या है, मन उसकी कौन-सी कहानी बना रहा है, और अभी तुम्हारा धर्मसंगत अगला कदम क्या है। शांत होकर वह कर्म चुनो जो सत्य, करुणा और दीर्घकालिक कल्याण के सबसे निकट हो। परिणाम को पकड़ने के बजाय कर्म की शुद्धता पर ध्यान दो।"
        : "Look at this on three levels: what are the facts, what story is the mind adding, and what is the next dharmic action available now? Choose the step closest to truth, compassion and long-term well-being. Focus on the integrity of action rather than clinging to the outcome.",
      source: "भगवद्गीता 2.47 एवं 6.5 का व्यावहारिक भाव"
    };
  }

  async function requestAnswer(question) {
    const selectedLanguage = language?.value || currentLanguage();
    const apiHistory = history.slice(-10).map(({ role, text }) => ({ role, content: text }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, language: selectedLanguage, history: apiHistory })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!data.answer) throw new Error("Missing answer");
      return { answer: data.answer, source: data.source || "", demo: Boolean(data.demo) };
    } catch {
      return { ...offlineAnswer(question, selectedLanguage), demo: true };
    }
  }

  async function sendMessage(question) {
    const clean = question.trim();
    if (!clean || busy) return;
    busy = true;
    sendButton.disabled = true;
    input.value = "";
    input.style.height = "48px";
    addMessage("user", clean);
    showTyping();

    const response = await requestAnswer(clean);
    hideTyping();
    addMessage("assistant", response.answer, response.source);
    if (response.demo) {
      qs("#demoModeBadge")?.classList.remove("hidden");
    }
    if (autoVoice?.checked) speak(response.answer, language?.value || currentLanguage());
    busy = false;
    sendButton.disabled = false;
    input.focus();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
  });

  qsa("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.prompt;
      input.focus();
    });
  });

  language?.addEventListener("change", () => {
    localStorage.setItem("brahmand-language", language.value);
    const global = qs("#globalLanguage");
    if (global) global.value = language.value;
  });

  clearButton?.addEventListener("click", () => {
    stopSpeaking();
    history = [];
    sessionStorage.removeItem(STORAGE_KEY);
    messages.innerHTML = "";
    addMessage(
      "assistant",
      "ॐ नमः शिवाय। मैं एक AI आध्यात्मिक सहायक हूँ। जीवन, कर्म, संबंध, मन, ध्यान या शास्त्रों से जुड़ा प्रश्न पूछिए—मैं सरल, व्यावहारिक और संदर्भयुक्त उत्तर देने का प्रयास करूँगा।",
      "आरम्भिक संदेश",
      false
    );
  });

  function setupVoiceRecognition() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      voiceButton?.setAttribute("disabled", "disabled");
      voiceButton?.setAttribute("title", "Voice input is not supported in this browser");
      return;
    }

    recognition = new Recognition();
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      voiceButton.classList.add("btn-primary");
      voiceButton.setAttribute("aria-label", "सुन रहा हूँ");
      toast("बोलिए… मैं सुन रहा हूँ।", 1800);
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      input.value = transcript;
      input.dispatchEvent(new Event("input"));
      if (event.results[event.results.length - 1].isFinal) input.focus();
    };

    recognition.onerror = (event) => {
      if (event.error !== "aborted") toast("Voice input शुरू नहीं हो पाया। Microphone permission जाँचें।");
    };

    recognition.onend = () => {
      voiceButton.classList.remove("btn-primary");
      voiceButton.setAttribute("aria-label", "Voice input");
    };

    voiceButton?.addEventListener("click", () => {
      recognition.lang = languageMap[language?.value] || language?.value || "hi-IN";
      try {
        recognition.start();
      } catch {
        recognition.stop();
      }
    });
  }

  setupVoiceRecognition();

  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved) && saved.length) {
      history = [];
      saved.forEach((item) => addMessage(item.role, item.text, item.source, true));
    } else {
      addMessage(
        "assistant",
        "ॐ नमः शिवाय। मैं एक AI आध्यात्मिक सहायक हूँ। जीवन, कर्म, संबंध, मन, ध्यान या शास्त्रों से जुड़ा प्रश्न पूछिए—मैं सरल, व्यावहारिक और संदर्भयुक्त उत्तर देने का प्रयास करूँगा।",
        "आरम्भिक संदेश",
        false
      );
    }
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  const query = params.get("q");
  if (query) {
    input.value = query;
    window.setTimeout(() => form.requestSubmit(), 350);
  } else {
    input.focus();
  }

  if (params.get("voice") === "1") {
    voiceButton?.classList.add("btn-primary");
    toast("Microphone button दबाकर अपना प्रश्न बोलें।", 4200);
  }
})();
