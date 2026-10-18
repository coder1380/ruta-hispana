import { NextRequest, NextResponse } from 'next/server';
import { getCountryData } from '@/lib/countries';
import {
  getGeminiClient,
  getCachedResponse,
  setCachedResponse,
  MANDATORY_LANGUAGE_RULE,
  formatCountryContext,
} from '@/lib/gemini';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Intelligent local fallback responses when live AI is unavailable.
 * Follows the strict rule: English only, 3-5 easy bold Spanish words with bracketed meanings, no full Spanish sentences.
 */
function getOfflineGuideResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('food') || lower.includes('eat') || lower.includes('tapas') || lower.includes('paella')) {
    return `In Spain, dining is a deeply social celebration. You should begin your evening with **el tapeo** (hopping between tapas bars) around 8:30 PM. Order a slice of golden **tortilla de patatas** (potato omelet) and authentic **paella** (saffron rice dish). Remember to ask for a cold **caña** (small draft beer) or refreshing **horchata** (tiger nut milk) while enjoying your meal!`;
  }

  if (lower.includes('veg') || lower.includes('vegan') || lower.includes('vegetarian')) {
    return `Vegetarian travelers will find great options once they know the right dishes. Look for blistered **pimientos de Padrón** (green peppers from Galicia), crispy **patatas bravas** (spicy potatoes), and thick **tortilla** (egg and potato omelet). Always tell your waiter you want your dish without **jamón** (cured ham) or **carne** (meat).`;
  }

  if (lower.includes('budget') || lower.includes('inr') || lower.includes('cost') || lower.includes('money')) {
    return `A standard daily budget in Spain ranges between **₹7,000 and ₹11,000** per day (about 80 to 125 **euros** [currency of Spain]). This easily covers high-speed **trenes** (trains), boutique hotels, museum tickets, and a three-course **menú del día** (daily set lunch menu) at a neighborhood tavern.`;
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hola')) {
    return `Welcome to **Ruta Hispana**! I am your cultural **guía** (guide) for discovering Spain. Whether you are curious about colorful street **fiestas** (festivals), ancient Moorish **palacios** (palaces), or lively central **plazas** (town squares), I am here to help you plan your journey. Which corner of Spain would you like to explore today?`;
  }

  return `Spain is a fascinating country composed of autonomous **regiones** (regions), each with unique customs and culinary heritage. From the sunlit **playas** (beaches) and historical **castillos** (castles) to vibrant town **mercados** (markets), every destination has its own distinct rhythm. What specific question can I answer for your trip?`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      countryId = 'spain',
      message,
      history = [],
    } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'A valid message string is required.' },
        { status: 400 }
      );
    }

    const country = getCountryData(countryId);
    const client = getGeminiClient();

    // Cache check for identical query
    const cacheKey = `chat:${countryId}:${message.trim().toLowerCase()}`;
    const cached = getCachedResponse<{ reply: string; isFallback: boolean }>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    if (!client) {
      const fallbackReply = getOfflineGuideResponse(message);
      const resData = {
        reply: fallbackReply,
        isFallback: true,
        source: 'spain.json (Offline Guide)',
        message: 'Operating in local guide mode (GEMINI_API_KEY not configured).',
      };
      setCachedResponse(cacheKey, resData);
      return NextResponse.json(resData);
    }

    const prompt = `You are "Mateo", the knowledgeable and friendly local guide for "Ruta Hispana" (an educational travel exploration of Spain).

VERIFIED GROUND TRUTH CONTEXT FOR ${country.name}:
${formatCountryContext(country)}

MANDATORY LANGUAGE RULE:
${MANDATORY_LANGUAGE_RULE}
- Reply in English only.
- Naturally include 3-5 easy Spanish words per reply, bold them and add the meaning in brackets the first time (e.g. **tapas** [small savory plates], **siesta** [afternoon rest], **mercado** [market]).
- Never write full sentences in Spanish.

GENERAL INSTRUCTIONS:
- Strictly adhere to verified facts from the context above; do not invent fictional places.
- Keep responses concise (2 to 3 engaging paragraphs), helpful, and culturally respectful.

CONVERSATION CONTEXT:
${history.map((h: any) => `${h.role === 'user' ? 'Traveler' : 'Guide (Mateo)'}: ${h.content}`).slice(-4).join('\n')}
Traveler: ${message}
Guide (Mateo):
`;

    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const reply = response.text || getOfflineGuideResponse(message);

      const result = {
        reply,
        isFallback: false,
        source: 'Gemini 2.5 Flash',
      };

      setCachedResponse(cacheKey, result);
      return NextResponse.json(result);
    } catch (apiError: any) {
      console.warn('[Gemini Chat API] Rate limit or error, using local fallback:', apiError?.message || apiError);
      const fallbackReply = getOfflineGuideResponse(message);
      const resData = {
        reply: fallbackReply,
        isFallback: true,
        source: 'spain.json (Fallback Guide)',
        message: 'Live AI is temporarily rate-limited. Enjoy this verified answer from local guidance!',
      };
      setCachedResponse(cacheKey, resData);
      return NextResponse.json(resData);
    }
  } catch (error: any) {
    console.error('[Chat Route Handler] Error caught; returning resilient fallback:', error);
    const reply = getOfflineGuideResponse('general');
    return NextResponse.json({
      reply,
      isFallback: true,
      source: 'spain.json (Offline Guide)',
    });
  }
}
