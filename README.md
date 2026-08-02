# Brahmand — 15-page Cosmic Divine AI Website

यह पूरा front-end + Vercel serverless API project है। Design उसी cosmic Shiva dashboard से बनाया गया है जो conversation में तैयार हुआ था। Website desktop, tablet और mobile पर responsive है।

> **Honest identity:** Website का Shiva visual devotional art है। Chat system एक AI spiritual study companion है; वह वास्तविक भगवान, सर्वज्ञ सत्ता या qualified guru होने का दावा नहीं करता।

## तैयार pages

1. `index.html` — animated cosmic home
2. `ask-bhagwan.html` — multilingual text + voice chat
3. `bhagavad-gita.html` — 18 chapters और selected verses
4. `vedas.html` — चार वेद और वैदिक साहित्य की परतें
5. `puranas.html` — 18 महापुराण directory
6. `upanishads.html` — 10 प्रमुख उपनिषद् और महावाक्य
7. `scriptures.html` — searchable scripture seed library
8. `meditation.html` — timer, breathing guide और generated ॐ ambience
9. `daily-wisdom.html` — daily verse, voice और private journal
10. `cosmic-dashboard.html` — animated orbit system और live visual events
11. `community.html` — localStorage community demo
12. `about.html` — vision, features, roadmap और transparency
13. `privacy.html` — plain-language privacy template
14. `terms.html` — terms template
15. `404.html` — custom not-found page

## मुख्य features

- Animated starfield, glowing universe, moving cosmic background और orbiting planets
- बोलते समय Shiva image के आसपास glow/speaking animation
- Browser microphone से speech-to-text
- Browser text-to-speech से उत्तर सुनना
- 17 language options
- API key के बिना भी built-in local guidance mode
- OpenAI API key जोड़ने पर dynamic AI answers
- Scripture references के साथ seed knowledge base
- Full responsive design और mobile navigation
- PWA manifest तथा basic offline caching
- Vercel-ready `/api/chat` और `/api/health` functions

## 1. सबसे आसान local preview

Project folder में terminal खोलें:

```bash
python3 -m http.server 8000
```

फिर browser में खोलें:

```text
http://localhost:8000
```

इस mode में website, animations, meditation, library और local demo chat काम करेंगे। Serverless AI endpoint नहीं चलेगा, इसलिए chat अपने built-in local guidance mode का उपयोग करेगा।

## 2. AI सहित local run

Node.js 18 या नया होना चाहिए। Project folder में:

```bash
cp .env.example .env.local
```

`.env.local` में secret key डालें:

```env
OPENAI_API_KEY=your_secret_key_here
OPENAI_MODEL=gpt-5.6
```

फिर:

```bash
npx vercel dev
```

Terminal में दिया localhost address खोलें। API key कभी भी `assets/js` या HTML में न डालें।

## 3. Vercel पर deploy

### CLI तरीका

```bash
npx vercel
```

पहली deployment के बाद production deploy:

```bash
npx vercel --prod
```

Vercel dashboard में Project → Settings → Environment Variables में जोड़ें:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` — optional; अपने OpenAI project में उपलब्ध text-capable model चुनें

Environment variables जोड़ने के बाद redeploy करें।

### GitHub तरीका

1. इस folder को GitHub repository में upload करें।
2. Vercel में **Add New → Project** चुनें।
3. GitHub repository import करें।
4. Framework preset को **Other** रहने दें।
5. ऊपर दिए environment variables जोड़ें।
6. Deploy दबाएँ।

## 4. अपना domain लगाना

Vercel → Project → Settings → Domains में domain जोड़ें। फिर `robots.txt` और `sitemap.xml` में `YOUR-DOMAIN.example` को अपने असली domain से बदलें।

## 5. Full वेद–पुराण–उपनिषद् knowledge कैसे जोड़ें

अभी `data/scriptures.json` में citation-ready seed library है, पूरा corpus नहीं। Full production knowledge के लिए:

1. Public-domain या licensed editions चुनें।
2. हर text के साथ edition, translator, chapter, verse और language metadata रखें।
3. Text को verse/section के अनुसार chunks में बाँटें।
4. Embeddings बनाकर vector database में रखें।
5. User question पर relevant passages retrieve करें।
6. AI को केवल retrieved passages से exact citations देने दें।
7. विद्वानों से theological/content review कराएँ।

विस्तृत architecture `docs/PRODUCTION-RAG.md` में है।

## 6. Voice और “living Shiva” की वास्तविक स्थिति

इस build में:

- Shiva image धीरे zoom/drift करती है।
- Voice answer के समय face area और divine halo glow/pulse करते हैं।
- उत्तर browser voice में सुनाया जाता है।

यह वास्तविक facial lip-sync या mouth/smile animation नहीं है। वास्तविक बोलता और मुस्कुराता avatar बनाने के लिए अलग animated video/avatar pipeline, face rig या lip-sync service जोड़नी होगी। Production roadmap About page और RAG document में दिया गया है।

## 7. Browser compatibility

- Chrome और Edge में voice input आम तौर पर सबसे अच्छा चलता है।
- Microphone के लिए browser permission और HTTPS/localhost आवश्यक हो सकता है।
- Voice support न होने पर text chat पूरी तरह काम करता है।

## 8. महत्वपूर्ण files

```text
assets/css/styles.css      पूरा visual design
assets/js/app.js           common navigation, stars, counters, utilities
assets/js/chat.js          chat, voice input/output, local fallback
assets/js/library.js       scripture search and dialog
assets/js/meditation.js    timer, breathing and Om ambience
api/chat.js                Vercel AI endpoint
api/health.js              deployment health check
data/scriptures.json       seed knowledge library
vercel.json                Vercel headers/configuration
```

## 9. Production से पहले आवश्यक काम

- Privacy और Terms को company/entity व jurisdiction के अनुसार lawyer से review कराएँ।
- User accounts, moderation, database और data deletion flow जोड़ें।
- Community page अभी public network नहीं है; केवल local browser demo है।
- Cosmic dashboard के astronomical counts simulation हैं, real science telemetry नहीं।
- Scripture translations के copyrights verify करें।
- AI answers का scholar review और citation testing करें।

