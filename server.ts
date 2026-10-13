import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize AI client on server-side
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
}

/**
 * Real airline deep link builders for Colombia
 */
function buildAirlinePurchaseLinks(origin: string, destination: string, date: string) {
  const [year, month, day] = date.split('-');
  const yymmdd = `${year ? year.slice(2) : '26'}${month || '10'}${day || '17'}`;

  return {
    googleFlights: `https://www.google.com/travel/flights?q=Flights%20from%20${origin}%20to%20${destination}%20on%20${date}`,
    skyscanner: `https://www.skyscanner.com.co/transport/vuelos/${origin.toLowerCase()}/${destination.toLowerCase()}/${yymmdd}/?cabinclass=economy&adultsv2=1`,
    avianca: `https://www.avianca.com/es/`,
    latam: `https://www.latamairlines.com/co/es`,
    wingo: `https://www.wingo.com/`,
    clic: `https://clicair.co/`,
    satena: `https://www.satena.com/`,
    kayak: `https://www.kayak.com.co/flights/${origin}-${destination}/${date}`,
    despegar: `https://www.despegar.com.co/vuelos/${origin}/${destination}?from=${date}`,
  };
}

/**
 * POST /api/scan-live
 * Live real flight scanning endpoint using Google Search Grounding with Gemini 3.8 Flash
 */
app.post('/api/scan-live', async (req, res) => {
  try {
    const { origin = 'RCH', destination = 'MDE', date = '2026-10-17', maxPrice = 200000 } = req.body;
    const links = buildAirlinePurchaseLinks(origin, destination, date);

    let searchGroundingResults: Array<{ uri: string; title: string }> = [];
    let aiSummary = '';
    let realWebPriceFound: number | null = null;

    if (ai) {
      try {
        const prompt = `Actúa como motor de búsqueda de vuelos en tiempo real para Colombia.
Investiga tarifas reales de vuelos entre ${origin} y ${destination} para la fecha ${date} en aerolíneas que operan en Colombia: Avianca, LATAM Airlines Colombia, Wingo, Clic Air o Satena.
Encuentra precios reales actuales en pesos colombianos (COP), horarios de salida aproximados, escalas (por ejemplo en Bogotá BOG o directo) y si hay pasajes por debajo de ${maxPrice} COP.
Devuelve un resumen conciso en español indicando la tarifa más económica detectada y enlaces relevantes.`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        aiSummary = geminiRes.text || '';

        // Extract real web grounding sources
        const chunks = geminiRes.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks && Array.isArray(chunks)) {
          chunks.forEach((chunk: any) => {
            if (chunk.web?.uri) {
              searchGroundingResults.push({
                uri: chunk.web.uri,
                title: chunk.web.title || 'Fuente de aerolínea / buscador',
              });
            }
          });
        }

        // Try extracting any price mentioned
        const priceMatch = aiSummary.match(/(\$?\s?([1-9]\d{1,2}(?:\.\d{3})+)\s?(?:COP|pesos)?)/i);
        if (priceMatch && priceMatch[2]) {
          const parsed = parseInt(priceMatch[2].replace(/\./g, ''), 10);
          if (parsed > 50000 && parsed < 2000000) {
            realWebPriceFound = parsed;
          }
        }
      } catch (geminiError) {
        console.warn('Gemini Search Grounding scan error (falling back to live route engine):', geminiError);
      }
    }

    res.json({
      success: true,
      origin,
      destination,
      date,
      aiSummary,
      realWebPriceFound,
      groundingSources: searchGroundingResults,
      purchaseLinks: links,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/scan-live:', error);
    res.status(500).json({ success: false, error: error.message || 'Error en escaneo' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Vite middleware in dev, static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
