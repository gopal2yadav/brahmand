# Production Scripture Knowledge Architecture

## उद्देश्य

Brahmand को ऐसा AI बनाना जो वेद, उपनिषद्, भगवद्गीता, पुराण, इतिहास, दर्शन और भक्ति साहित्य से उत्तर दे, exact source बताए, अलग परम्पराओं के मतभेद को ईमानदारी से प्रस्तुत करे और कोई श्लोक न गढ़े।

## 1. Corpus acquisition

हर ग्रन्थ के लिए इनमें से एक अधिकार स्थिति स्पष्ट करें:

- Public domain original Sanskrit
- Public domain translation
- Licensed modern translation
- आपकी अपनी commissioned translation/summary

Published modern translations को बिना permission bulk copy न करें। Original Sanskrit और translation को अलग fields में रखें।

## 2. Recommended record schema

```json
{
  "work_id": "bhagavad-gita",
  "work_title": "Bhagavad Gita",
  "tradition": ["Vedanta", "Smriti"],
  "edition": "edition identifier",
  "translator": "name or original Sanskrit",
  "language": "sa",
  "chapter": 2,
  "verse_start": 47,
  "verse_end": 47,
  "original_text": "...",
  "translation": "...",
  "summary": "...",
  "themes": ["karma", "non-attachment"],
  "source_url_or_bibliography": "...",
  "rights": "public-domain-or-license-id",
  "review_status": "scholar-reviewed"
}
```

## 3. Chunking

- Gita और verse-based texts: एक से पाँच श्लोक प्रति chunk
- Upanishads: dialogue/section boundaries
- Puranas और Itihasa: scene or teaching unit, लगभग 300–800 words
- Commentary: मूल पाठ से अलग collection और स्पष्ट commentator metadata
- हर chunk में self-contained citation metadata रखें

## 4. Retrieval pipeline

1. User language और intent detect करें।
2. Query को themes और key entities में normalize करें।
3. Hybrid search चलाएँ: keyword/BM25 + vector similarity।
4. Tradition, work, language और edition filters लागू करें।
5. Top passages rerank करें।
6. Context window में original text, translation, source और rights metadata भेजें।
7. Model से structured response माँगें: answer, interpretation, citations, practical action, uncertainty.
8. Citation validator जाँच करे कि हर cited verse retrieved context में मौजूद है।

## 5. Suggested production components

- Frontend: current static UI को Next.js/React में migrate किया जा सकता है
- API: Node or Python service
- Database: PostgreSQL
- Vector search: pgvector, Qdrant, Pinecone या equivalent
- Object storage: source scans/PDFs के लिए
- Queue: ingestion and embedding jobs
- Authentication: email/social login + optional anonymous mode
- Observability: prompt version, retrieved sources, latency, cost और safety events

Vendor selection budget, scale और data-residency needs पर निर्भर होनी चाहिए।

## 6. Answer contract

Model output को structured रखें:

```json
{
  "answer": "simple response",
  "scriptural_lens": "what the retrieved source teaches",
  "citations": [
    {"work": "Bhagavad Gita", "chapter": 2, "verse": "47", "chunk_id": "..."}
  ],
  "practical_action": "one safe action for today",
  "tradition_note": "optional difference in interpretation",
  "confidence": "high|medium|low"
}
```

Frontend citations को clickable source cards में दिखाए।

## 7. Theological governance

कम-से-कम इन perspectives से reviewers रखें:

- Vedanta traditions
- Shaiva traditions
- Shakta traditions
- Vaishnava traditions
- Yoga/Darshana specialists
- Sanskrit/textual scholarship

Reviewer का काम किसी एक मत को “सही” घोषित करना नहीं, बल्कि source accuracy, fair representation और harmful interpretation रोकना है।

## 8. Safety boundaries

AI को यह नहीं करना चाहिए:

- स्वयं को भगवान या सर्वज्ञ घोषित करना
- चमत्कार, भविष्यवाणी या supernatural guarantee देना
- बीमारी का spiritual कारण निश्चित बताना
- उपयोगकर्ता को medical care छोड़ने को कहना
- हिंसा, जातीय/लैंगिक भेदभाव या धार्मिक घृणा को शास्त्र से justify करना
- दान/भुगतान के बदले मोक्ष, cure या divine favor का दावा करना

## 9. Multilingual plan

- User question original language में रखें।
- Retrieval के लिए multilingual embeddings या translated search query उपयोग करें।
- Citation original language में दिखाएँ; साथ में licensed/approved translation।
- Sanskrit pronunciation के लिए सामान्य TTS से अलग reviewed phonetic layer उपयोग करें।
- Low-confidence translation पर स्पष्ट warning दें।

## 10. Living avatar plan

वास्तविक बोलता/मुस्कुराता Shiva-inspired avatar के लिए:

1. Devotional art और theological visual review
2. Rigged 2D/3D face या pre-approved animation states
3. Streaming speech synthesis
4. Phoneme-to-viseme lip-sync
5. Smile, blink, breath और subtle head motion state machine
6. Fast interruption/barge-in support
7. Clear on-screen “AI devotional avatar” disclosure

किसी real person की face/voice clone बिना explicit rights और consent के उपयोग न करें।

## 11. Evaluation suite

हर release पर automated और human tests:

- Verse citation accuracy
- Invented Sanskrit rate
- Tradition fairness
- Language quality
- Medical/legal/crisis escalation
- Prompt injection resistance
- Hate/discrimination refusal
- Latency and cost
- Mobile voice usability

Production goal केवल सुंदर उत्तर नहीं, बल्कि traceable, respectful और source-grounded उत्तर होना चाहिए।
