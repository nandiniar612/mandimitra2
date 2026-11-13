import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { buildAllCropAnalyses, evaluateMandisForFarmer } from './src/data/marketData.ts';
import { GOVERNMENT_SCHEMES } from './src/data/schemesData.ts';
import type { ChatAnalysisCard, FarmerProfile, Language } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '15mb' }));

interface HistoryTurn {
  role: 'user' | 'assistant';
  text: string;
}

interface ChatRequestBody {
  message?: string;
  language?: Language;
  farmer?: Partial<FarmerProfile>;
  history?: HistoryTurn[];
}

interface VoiceChatRequestBody {
  audioBase64?: string;
  mimeType?: string;
  language?: Language;
  farmer?: Partial<FarmerProfile>;
  history?: HistoryTurn[];
}

interface TtsRequestBody {
  text?: string;
  language?: Language;
}

const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  hi: 'Hindi (Devanagari script, simple natural farmer-friendly Hindi)',
  kn: 'Kannada (Kannada script, simple natural farmer-friendly Kannada)',
};

function createGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Add it in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function normalizeLanguage(code: unknown, fallback: Language): Language {
  if (code === 'kn' || code === 'hi' || code === 'en') return code;
  return fallback;
}

function inferScriptLanguage(text: string): Language | null {
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  return null;
}

function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[*_`#>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1200);
}

async function synthesizeSpeechWav(
  ai: GoogleGenAI,
  text: string,
  language: Language
): Promise<string | undefined> {
  const cleanText = cleanTextForSpeech(text);
  if (!cleanText) return undefined;

  try {
    const langHint =
      language === 'kn'
        ? 'Speak naturally in clear Kannada'
        : language === 'hi'
        ? 'Speak naturally in clear Hindi'
        : 'Speak naturally in clear Indian English';

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: `${langHint}, warm and helpful agricultural market advisor tone`,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio =
      ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || undefined;
  } catch (err: unknown) {
    console.warn('TTS synthesis fallback:', err instanceof Error ? err.message : err);
    return undefined;
  }
}

async function generateMarketAdvisoryReply(params: {
  ai: GoogleGenAI;
  message: string;
  uiLanguage: Language;
  farmerName: string;
  farmerPlace: string;
  farmerLocality: string;
  history: HistoryTurn[];
}): Promise<{
  reply: string;
  detectedLanguage: Language;
  analysisCard?: ChatAnalysisCard;
}> {
  const { ai, message, uiLanguage, farmerName, farmerPlace, farmerLocality, history } = params;
  const scriptHint = inferScriptLanguage(message);
  const preferredLang = scriptHint ?? uiLanguage;

  const crops = buildAllCropAnalyses(farmerPlace, farmerLocality);
  const marketContext = crops.map((crop) => {
    const evaluated = evaluateMandisForFarmer(crop.mandiRates, farmerPlace, farmerLocality);
    const topMandi = evaluated[0];
    return {
      cropId: crop.id,
      cropNameEn: crop.name.en,
      cropNameHi: crop.name.hi,
      cropNameKn: crop.name.kn,
      currentBestPriceRsPerQtl: crop.currentBestPrice,
      previousDayPriceRsPerQtl: crop.previousDayPrice,
      dailyChangePercent: crop.changePercent,
      dailyTrendDirection: crop.trendDirection,
      predicted5DayPriceRsPerQtl: crop.predicted5DayPrice,
      predicted5DayChangePercent: crop.forecastPercent,
      forecastDirection: crop.forecastDirection,
      recommendedAction: crop.recommendation,
      perishability: crop.perishability,
      modelConfidencePercent: crop.confidencePercent,
      mandisEn: evaluated.map((m) => ({
        mandi: m.name.en,
        district: m.district,
        modalPrice: m.modalPrice,
        distanceKm: m.estimatedDistanceKm,
        transportCost: m.transportCostPerQtl,
        netProfit: m.netProfitPerQtl,
      })),
      mandisHi: evaluated.map((m) => ({
        mandi: m.name.hi,
        district: m.district,
        modalPrice: m.modalPrice,
        distanceKm: m.estimatedDistanceKm,
        transportCost: m.transportCostPerQtl,
        netProfit: m.netProfitPerQtl,
      })),
      mandisKn: evaluated.map((m) => ({
        mandi: m.name.kn,
        district: m.district,
        modalPrice: m.modalPrice,
        distanceKm: m.estimatedDistanceKm,
        transportCost: m.transportCostPerQtl,
        netProfit: m.netProfitPerQtl,
      })),
      topMandiNetProfitRsPerQtl: topMandi.netProfitPerQtl,
      topMandiDistanceKm: topMandi.estimatedDistanceKm,
      qualityAndSizeGrades: {
        gradeA: {
          labelEn: crop.qualityTiers.gradeA.label.en,
          sizeSpecEn: crop.qualityTiers.gradeA.sizeSpec.en,
          sizeSpecHi: crop.qualityTiers.gradeA.sizeSpec.hi,
          sizeSpecKn: crop.qualityTiers.gradeA.sizeSpec.kn,
          bestPriceRsPerQtl: crop.qualityTiers.gradeA.currentBestPrice,
          dailyChangePercent: crop.qualityTiers.gradeA.changePercent,
          predicted5DayPriceRsPerQtl: crop.qualityTiers.gradeA.predicted5DayPrice,
          forecastPercent: crop.qualityTiers.gradeA.forecastPercent,
          recommendation: crop.qualityTiers.gradeA.recommendation,
        },
        gradeB: {
          labelEn: crop.qualityTiers.gradeB.label.en,
          sizeSpecEn: crop.qualityTiers.gradeB.sizeSpec.en,
          sizeSpecHi: crop.qualityTiers.gradeB.sizeSpec.hi,
          sizeSpecKn: crop.qualityTiers.gradeB.sizeSpec.kn,
          bestPriceRsPerQtl: crop.qualityTiers.gradeB.currentBestPrice,
          dailyChangePercent: crop.qualityTiers.gradeB.changePercent,
          predicted5DayPriceRsPerQtl: crop.qualityTiers.gradeB.predicted5DayPrice,
          forecastPercent: crop.qualityTiers.gradeB.forecastPercent,
          recommendation: crop.qualityTiers.gradeB.recommendation,
        },
        gradeC: {
          labelEn: crop.qualityTiers.gradeC.label.en,
          sizeSpecEn: crop.qualityTiers.gradeC.sizeSpec.en,
          sizeSpecHi: crop.qualityTiers.gradeC.sizeSpec.hi,
          sizeSpecKn: crop.qualityTiers.gradeC.sizeSpec.kn,
          bestPriceRsPerQtl: crop.qualityTiers.gradeC.currentBestPrice,
          dailyChangePercent: crop.qualityTiers.gradeC.changePercent,
          predicted5DayPriceRsPerQtl: crop.qualityTiers.gradeC.predicted5DayPrice,
          forecastPercent: crop.qualityTiers.gradeC.forecastPercent,
          recommendation: crop.qualityTiers.gradeC.recommendation,
        },
      },
    };
  });

  const systemInstruction = `You are MANDIMITRA, an expert, empathetic Indian agricultural market advisor helping a farmer named ${farmerName} from ${farmerLocality}, ${farmerPlace}.

CRITICAL LANGUAGE RULE (HIGHEST PRIORITY):
1. Detect the EXACT language of the farmer's current question ("${message}").
   - If the farmer asked in Kannada (Kannada script or transliterated Kannada like "eerulli bele eshtu"), you MUST reply strictly in Kannada (Kannada script) and set detectedLanguage = "kn".
   - If the farmer asked in Hindi (Devanagari script or Hinglish like "pyaj ka bhav kya hai"), you MUST reply strictly in Hindi (Devanagari script) and set detectedLanguage = "hi".
   - If the farmer asked in English, you MUST reply strictly in English and set detectedLanguage = "en".
   - Only if the message has no language signal (e.g. just a number), default to ${LANGUAGE_NAMES[preferredLang]} (detectedLanguage = "${preferredLang}").
2. NEVER reply in English if the farmer asked in Kannada or Hindi, and NEVER reply in Kannada/Hindi if the farmer asked in English—even if the UI language differs.

MARKET ANALYSIS RULES:
3. Ground EVERY price, percentage change, 5-day prediction, Sell/Hold decision, and mandi net profit exclusively in the LIVE MARKET DATA provided below. Never invent prices or mandis.
4. For any crop the farmer asks about, clearly address all 4 insights in concise, natural spoken-friendly language (and mention the quality/size grade breakdown for Grade A Large, Grade B Medium FAQ, and Grade C Small when relevant or specifically asked):
   a) Current best market price (₹/Quintal) and whether it increased or decreased with the exact % rate.
   b) Whether the price is predicted to increment or decrement over the next 5 days, with the predicted price and % change.
   c) Explicit decision: SELL NOW or HOLD/WAIT, explaining why (momentum, 5-day trend, perishability).
   d) Which specific mandi gives ${farmerName} the highest net profit near ${farmerLocality}, ${farmerPlace}.
5. LOSS & LIVELIHOOD SUPPORT RULE: If the farmer mentions suffering a crop loss, price crash, debt burden, or asks how to survive/lead life after a loss (or if the crop is currently trending down and they ask for help), proactively recommend matching GOVERNMENT SCHEMES from the list below with clear benefits, required documents, and official helpline numbers in their exact language.
6. Set "matchedCropId" to the matching cropId from the dataset if a crop is discussed, or "" if none.

LIVE MARKET DATA FOR ${farmerLocality}, ${farmerPlace}:
${JSON.stringify(marketContext)}

GOVERNMENT LOSS RECOVERY & LIVELIHOOD SCHEMES:
${JSON.stringify(
  GOVERNMENT_SCHEMES.map((s) => ({
    code: s.code,
    category: s.category,
    nameEn: s.name.en,
    nameHi: s.name.hi,
    nameKn: s.name.kn,
    benefitEn: s.benefit.en,
    benefitHi: s.benefit.hi,
    benefitKn: s.benefit.kn,
    documentsEn: s.documents.en,
    helplineOrPortal: s.helplineOrPortal,
  }))
)}`;

  const conversationLines = history
    .map((item) => `${item.role === 'user' ? 'Farmer' : 'MANDIMITRA'}: ${item.text}`)
    .join('\n');

  const promptText = conversationLines
    ? `Recent conversation:\n${conversationLines}\n\nCurrent Farmer Question: ${message}`
    : `Farmer Question: ${message}`;

  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: promptText,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reply: {
            type: Type.STRING,
            description:
              'Helpful, concise, spoken-friendly reply strictly in the exact same language the farmer used.',
          },
          detectedLanguage: {
            type: Type.STRING,
            description: 'Language code of the farmer question and reply: "en", "hi", or "kn".',
          },
          matchedCropId: {
            type: Type.STRING,
            description:
              'The cropId from LIVE MARKET DATA (e.g. onion, tomato, maize, paddy, turdal, cotton, arecanut, potato), or empty string if none.',
          },
        },
        required: ['reply', 'detectedLanguage', 'matchedCropId'],
      },
    },
  });

  const rawText = (response.text ?? '').trim();
  let parsed: { reply?: string; detectedLanguage?: string; matchedCropId?: string } = {};
  try {
    parsed = JSON.parse(rawText);
  } catch {
    parsed = { reply: rawText || 'Please ask about a crop.', detectedLanguage: preferredLang, matchedCropId: '' };
  }

  const detectedLanguage =
    inferScriptLanguage(parsed.reply ?? '') ??
    normalizeLanguage(parsed.detectedLanguage, preferredLang);

  const matchedCrop = crops.find((c) => c.id === parsed.matchedCropId?.toLowerCase());
  let analysisCard: ChatAnalysisCard | undefined;

  if (matchedCrop) {
    const evaluated = evaluateMandisForFarmer(matchedCrop.mandiRates, farmerPlace, farmerLocality);
    const topMandi = evaluated[0];
    analysisCard = {
      cropId: matchedCrop.id,
      cropName: matchedCrop.name[detectedLanguage],
      currentBestPrice: matchedCrop.currentBestPrice,
      changePercent: matchedCrop.changePercent,
      trendDirection: matchedCrop.trendDirection,
      predicted5DayPrice: matchedCrop.predicted5DayPrice,
      forecastPercent: matchedCrop.forecastPercent,
      forecastDirection: matchedCrop.forecastDirection,
      recommendation: matchedCrop.recommendation,
      bestMandiName: topMandi.name[detectedLanguage],
      bestMandiNetProfit: topMandi.netProfitPerQtl,
      bestMandiDistanceKm: topMandi.estimatedDistanceKm,
    };
  }

  return {
    reply: parsed.reply ?? '',
    detectedLanguage,
    analysisCard,
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const body = req.body as ChatRequestBody;
    const message = (body.message ?? '').trim();
    const uiLanguage: Language = normalizeLanguage(body.language, 'en');
    const farmerName = (body.farmer?.name ?? 'Farmer').trim() || 'Farmer';
    const farmerPlace = (body.farmer?.place ?? 'Davanagere').trim() || 'Davanagere';
    const farmerLocality = (body.farmer?.locality ?? 'Harihar').trim() || 'Harihar';
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

    if (!message) {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    const ai = createGeminiClient();
    const result = await generateMarketAdvisoryReply({
      ai,
      message,
      uiLanguage,
      farmerName,
      farmerPlace,
      farmerLocality,
      history,
    });

    res.json(result);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to analyze mandi prices.';
    console.error('Gemini /api/chat error:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

app.post('/api/voice-chat', async (req, res) => {
  try {
    const body = req.body as VoiceChatRequestBody;
    const audioBase64 = (body.audioBase64 ?? '').trim();
    const rawMime = (body.mimeType ?? 'audio/webm').trim();
    const cleanMimeType = rawMime.split(';')[0] || 'audio/webm';
    const uiLanguage: Language = normalizeLanguage(body.language, 'en');
    const farmerName = (body.farmer?.name ?? 'Farmer').trim() || 'Farmer';
    const farmerPlace = (body.farmer?.place ?? 'Davanagere').trim() || 'Davanagere';
    const farmerLocality = (body.farmer?.locality ?? 'Harihar').trim() || 'Harihar';
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

    if (!audioBase64) {
      res.status(400).json({ error: 'Audio recording data is required.' });
      return;
    }

    const ai = createGeminiClient();

    // 1. Transcribe spoken audio in its exact original language & script
    const transcribeResponse = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: cleanMimeType,
              data: audioBase64,
            },
          },
          {
            text: 'Transcribe this farmer voice query accurately in the EXACT language and script spoken (use Kannada script for Kannada, Devanagari script for Hindi, Latin script for English). Do not translate. Output only the exact spoken transcript.',
          },
        ],
      },
    });

    const transcript = (transcribeResponse.text ?? '').trim();
    if (!transcript) {
      res.status(422).json({ error: 'Could not hear speech clearly. Please speak closer to the microphone and try again.' });
      return;
    }

    // 2. Analyze market data & reply strictly in the detected spoken language
    const advisory = await generateMarketAdvisoryReply({
      ai,
      message: transcript,
      uiLanguage,
      farmerName,
      farmerPlace,
      farmerLocality,
      history,
    });

    // 3. Synthesize natural voice reply (WAV) in that exact same language
    const replyAudioBase64 = await synthesizeSpeechWav(
      ai,
      advisory.reply,
      advisory.detectedLanguage
    );

    res.json({
      transcript,
      reply: advisory.reply,
      detectedLanguage: advisory.detectedLanguage,
      analysisCard: advisory.analysisCard,
      audioBase64: replyAudioBase64,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to process voice query.';
    console.error('Gemini /api/voice-chat error:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

app.post('/api/tts', async (req, res) => {
  try {
    const body = req.body as TtsRequestBody;
    const text = (body.text ?? '').trim();
    const language: Language = normalizeLanguage(body.language, 'en');

    if (!text) {
      res.status(400).json({ error: 'Text is required for speech synthesis.' });
      return;
    }

    const ai = createGeminiClient();
    const audioBase64 = await synthesizeSpeechWav(ai, text, language);
    if (!audioBase64) {
      res.status(500).json({ error: 'Unable to synthesize speech audio.' });
      return;
    }

    res.json({ audioBase64 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to generate speech.';
    console.error('Gemini /api/tts error:', errorMessage);
    res.status(500).json({ error: errorMessage });
  }
});

async function startServer() {
  const port = 3000;

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`MANDIMITRA server running on http://0.0.0.0:${port}`);
  });
}

startServer();
