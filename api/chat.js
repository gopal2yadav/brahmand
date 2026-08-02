const scriptureEntries = require("../data/scriptures.json");

const languageNames = {
  "hi-IN": "Hindi",
  "en-US": "English",
  "sa-IN": "Sanskrit (with simple Hindi explanation when useful)",
  "ta-IN": "Tamil",
  "te-IN": "Telugu",
  "bn-IN": "Bengali",
  "gu-IN": "Gujarati",
  "mr-IN": "Marathi",
  "pa-IN": "Punjabi",
  "ur-PK": "Urdu",
  "es-ES": "Spanish",
  "fr-FR": "French",
  "de-DE": "German",
  "pt-BR": "Portuguese",
  "ar-SA": "Arabic",
  "zh-CN": "Simplified Chinese",
  "ja-JP": "Japanese"
};

function safeText(value, max = 4000) {
  return String(value || "").replace(/\u0000/g, "").slice(0, max);
}

function scoreEntry(entry, message) {
  const normalized = message.toLowerCase();
  const terms = [
    entry.title,
    entry.category,
    entry.source,
    entry.summary_hi,
    entry.summary_en,
    ...(entry.themes || [])
  ].join(" ").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((term) => term.length > 2);

  let score = 0;
  for (const term of new Set(terms)) {
    if (normalized.includes(term)) score += term.length > 6 ? 3 : 1;
  }
  if (normalized.includes(String(entry.category).toLowerCase())) score += 4;
  return score;
}

function retrieveContext(message) {
  const ranked = scriptureEntries
    .map((entry) => ({ entry, score: scoreEntry(entry, message) }))
    .sort((a, b) => b.score - a.score);

  const selected = ranked.filter((item) => item.score > 0).slice(0, 5).map((item) => item.entry);
  return selected.length ? selected : scriptureEntries.slice(0, 5);
}

function extractOutputText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  const chunks = [];
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === "output_text" && typeof content.text === "string") chunks.push(content.text);
    }
  }
  return chunks.join("\n").trim();
}

function demoAnswer(message, languageCode, context) {
  const q = message.toLowerCase();
  const hindi = languageCode === "hi-IN" || languageCode === "sa-IN" || /[\u0900-\u097f]/.test(message);
  const source = context[0]?.source || "भगवद्गीता 2.47";

  const patterns = [
    {
      words: ["stress", "anxiety", "tension", "तनाव", "चिंता", "दुःख", "परेशान"],
      source: "भगवद्गीता 2.14",
      hi: "सुख और दुःख बदलते मौसम की तरह आते-जाते हैं। अभी चार धीमी साँसें लें, चिंता को एक वाक्य में लिखें, और केवल अगला छोटा सही कदम चुनें। इस क्षण की परेशानी को पूरा जीवन मत मानिए।",
      en: "Pleasure and pain pass like changing weather. Take four slow breaths, name the worry in one sentence, and choose only the next right step. Do not mistake this difficult moment for your whole life."
    },
    {
      words: ["work", "career", "business", "result", "failure", "काम", "नौकरी", "फल", "असफल", "पैसा"],
      source: "भगवद्गीता 2.47",
      hi: "आपका नियंत्रण तैयारी, ईमानदार प्रयास और निर्णय पर है—हर परिणाम पर नहीं। आज के काम को तीन भागों में बाँटें: जो अभी कर सकते हैं, जिसमें सहायता चाहिए, और जिसे अभी छोड़ना है। फल की बेचैनी कम करके कर्म की गुणवत्ता बढ़ाइए।",
      en: "Your control lies in preparation, honest effort and decisions—not in every outcome. Divide today into what you can do now, what needs help, and what must be released. Improve the quality of action rather than feeding anxiety about results."
    },
    {
      words: ["fear", "afraid", "डर", "भय", "घबराहट", "guilt"],
      source: "भगवद्गीता 18.66",
      hi: "भय तब बढ़ता है जब मन सब कुछ अकेले नियंत्रित करना चाहता है। अपनी क्षमता से उचित कर्म करें, फिर जो आपके नियंत्रण में नहीं है उसे छोड़ने का अभ्यास करें। शरणागति भागना नहीं; अहंकार का बोझ हल्का करके स्पष्ट कर्म करना है।",
      en: "Fear grows when the mind tries to control everything alone. Act responsibly within your capacity, then practice releasing what is beyond you. Surrender is not escape; it is lighter ego and clearer action."
    },
    {
      words: ["anger", "angry", "गुस्सा", "क्रोध", "झगड़ा"],
      source: "भगवद्गीता 2.62–63 का भाव",
      hi: "क्रोध के समय बड़ा निर्णय न लें। पानी पिएँ, दस गहरी साँसें लें और उत्तर देने से पहले थोड़ी दूरी रखें। फिर पूछें—मैं किस चोट, अपेक्षा या भय की रक्षा कर रहा हूँ? कारण दिखने पर प्रतिक्रिया की जगह उत्तर चुनना आसान होता है।",
      en: "Do not make a major decision while angry. Drink water, take ten slow breaths and create some distance before replying. Then ask what hurt, expectation or fear you are protecting. Seeing the cause makes a wise response easier."
    },
    {
      words: ["death", "grief", "loss", "मृत्यु", "शोक", "मर गया", "खो दिया"],
      source: "भगवद्गीता 2.20",
      hi: "शोक प्रेम की गहराई बताता है, इसलिए उसे दबाना आवश्यक नहीं। गीता आत्मा को शरीर से अधिक गहरा और नित्य मानती है। किसी विश्वासपात्र से बात करें, एक प्रिय स्मृति के साथ शांत बैठें और स्वयं को रोने या मौन रहने की अनुमति दें।",
      en: "Grief reveals the depth of love, so it need not be suppressed. The Gita describes the self as deeper than the body. Speak with someone trusted, sit with one loving memory, and allow tears or silence."
    },
    {
      words: ["confidence", "motivation", "courage", "आत्मविश्वास", "हिम्मत", "कमजोर"],
      source: "भगवद्गीता 6.5",
      hi: "मन को शत्रु कहकर छोड़िए नहीं; अभ्यास से उसे मित्र बनाइए। आज एक छोटा वचन चुनें जिसे अवश्य पूरा करेंगे—बीस मिनट काम, एक जरूरी फोन या दस मिनट ध्यान। आत्मविश्वास निभाए गए छोटे वचनों से बनता है।",
      en: "Do not abandon the mind as an enemy; train it into an ally. Choose one small promise you will keep today—twenty minutes of work, one necessary call, or ten minutes of meditation. Confidence grows from promises kept."
    },
    {
      words: ["relationship", "marriage", "family", "love", "रिश्त", "शादी", "परिवार", "प्यार"],
      source: "नारद भक्ति सूत्र का प्रेम-भाव",
      hi: "प्रेम केवल अधिकार नहीं, दूसरे के कल्याण को देखने की क्षमता है। बिना आरोप के अपना अनुभव कहें, सामने वाले की बात पूरी सुनें और एक स्पष्ट अनुरोध या सीमा रखें। जहाँ सम्मान लगातार टूटे, वहाँ करुणा के साथ दूरी भी उचित हो सकती है।",
      en: "Love is not possession; it includes concern for the other person's well-being. Speak without accusation, listen fully, and make one clear request or boundary. Where respect is repeatedly broken, compassionate distance may be appropriate."
    },
    {
      words: ["meditat", "peace", "sleep", "ध्यान", "मन शांत", "नींद", "ॐ"],
      source: "योगसूत्र 1.12",
      hi: "मन को जबरन खाली करने की आवश्यकता नहीं। पाँच मिनट सहज बैठें, चार गिनती में श्वास लें और छह गिनती में छोड़ें। विचार आए तो केवल ‘विचार’ कहकर धीरे से श्वास पर लौटें। अभ्यास और अनासक्ति से स्थिरता बढ़ती है।",
      en: "You do not need to force the mind blank. Sit comfortably for five minutes, inhale for four counts and exhale for six. When thoughts arise, label them gently as ‘thinking’ and return to the breath. Steadiness grows through practice and non-attachment."
    }
  ];

  const match = patterns.find((item) => item.words.some((word) => q.includes(word)));
  const fallbackHi = "इस प्रश्न को तीन स्तर पर देखें: तथ्य क्या है, मन कौन-सी कहानी जोड़ रहा है, और अभी आपका धर्मसंगत अगला कदम क्या है। सत्य, करुणा और दीर्घकालिक कल्याण के सबसे निकट छोटा कर्म चुनें। परिणाम को पकड़ने के बजाय कर्म की शुद्धता पर ध्यान दें।";
  const fallbackEn = "Look at this on three levels: what are the facts, what story is the mind adding, and what is the next dharmic step available now? Choose the small action closest to truth, compassion and long-term well-being. Focus on the integrity of action rather than clinging to the result.";

  return {
    answer: match ? (hindi ? match.hi : match.en) : (hindi ? fallbackHi : fallbackEn),
    source: match?.source || source,
    demo: true
  };
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST for this endpoint." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== "object") body = {};

  const message = safeText(body.message, 2400).trim();
  const languageCode = safeText(body.language, 12) || "hi-IN";
  const language = languageNames[languageCode] || "the same language as the user";
  const rawHistory = Array.isArray(body.history) ? body.history : [];

  if (!message) return res.status(400).json({ error: "A message is required." });

  const context = retrieveContext(message);
  const source = context.slice(0, 3).map((entry) => entry.source).join(" · ");
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(200).json(demoAnswer(message, languageCode, context));

  const history = rawHistory.slice(-8).map((entry) => ({
    role: entry?.role === "assistant" ? "assistant" : "user",
    content: safeText(entry?.content, 1600)
  })).filter((entry) => entry.content);

  const studyContext = context.map((entry) => [
    `Source: ${entry.source}`,
    `Category: ${entry.category}`,
    entry.verse ? `Original text: ${entry.verse}` : "",
    `Hindi study summary: ${entry.summary_hi}`,
    `English study summary: ${entry.summary_en}`
  ].filter(Boolean).join("\n")).join("\n\n");

  const instructions = `You are Brahmand, a respectful Shiva-inspired AI spiritual study companion.

Identity and honesty:
- Never claim to literally be Lord Shiva, God, omniscient, supernatural, or a substitute for a guru.
- You may use a serene, compassionate, lightly smiling tone inspired by Shiva imagery.
- If asked who you are, clearly state that you are an AI spiritual study companion.

Scriptural method:
- Ground relevant answers primarily in Hindu scripture and philosophy.
- Distinguish direct scriptural teaching from practical interpretation.
- Cite a book/chapter/verse only when supported by the supplied context or when highly confident.
- Never invent a Sanskrit line, verse number, quotation, translation, miracle, prophecy, or source.
- Note that Hindu traditions may interpret teachings differently when that matters.

Response style:
- Reply in ${language}, unless the user explicitly requests another language.
- Use clear everyday language, usually 3 to 6 short paragraphs.
- Give: a direct compassionate answer, a scriptural lens, and one small practical action for today.
- Avoid excessive headings, preaching, shame, fatalism, superstition, discrimination, violence, blind obedience, or financial exploitation.

Safety:
- For medical, legal, financial, abuse, immigration, or crisis situations, give only general spiritual support and recommend qualified help.
- For possible self-harm, violence, or immediate danger, urge immediate local emergency/crisis support and contact with a trusted person.

Relevant study context (not an exhaustive canon):
${studyContext}`;

  const input = [...history, { role: "user", content: message }];
  const model = process.env.OPENAI_MODEL || "gpt-5.6";

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        max_output_tokens: 850,
        store: false
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("AI API error", response.status, data?.error?.message || data);
      return res.status(200).json({ ...demoAnswer(message, languageCode, context), fallbackReason: "provider_error" });
    }

    const answer = extractOutputText(data);
    if (!answer) return res.status(200).json({ ...demoAnswer(message, languageCode, context), fallbackReason: "empty_response" });

    return res.status(200).json({ answer, source, demo: false, model: data.model || model });
  } catch (error) {
    console.error("Brahmand chat error", error);
    return res.status(200).json({ ...demoAnswer(message, languageCode, context), fallbackReason: "network_error" });
  }
};
