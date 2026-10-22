import { NextRequest, NextResponse } from 'next/server';
import { getCountryData } from '@/lib/countries';
import { CountryData } from '@/types/country';
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
function getOfflineGuideResponse(message: string, country: CountryData): string {
  const lower = message.toLowerCase();
  const dishes = country.comida ?? [];
  const regions = country.regions ?? [];
  const firstDish = dishes[0];
  const vegetarianDish = dishes.find((dish) => dish.veg_friendly);
  const firstRegion = regions[0];

  if (lower.includes('food') || lower.includes('eat') || lower.includes('dish') || lower.includes('meal')) {
    return firstDish
      ? `A dish to explore in ${country.name} is **${firstDish.name_es}** (${firstDish.caption}). Ask locally about ingredients and preparation, especially if you have dietary requirements.`
      : `Explore the local food traditions of ${country.name}, and ask restaurants about ingredients and preparation.`;
  }

  if (lower.includes('veg') || lower.includes('vegan') || lower.includes('vegetarian')) {
    return vegetarianDish
      ? `The dataset marks **${vegetarianDish.name_es}** as vegetarian-friendly, but its preparation can vary. Confirm that it contains no meat, seafood, or animal broth.`
      : `The dataset does not identify a vegetarian dish for ${country.name}. Ask restaurants directly about meat, seafood, and animal broth before ordering.`;
  }

  if (lower.includes('budget') || lower.includes('inr') || lower.includes('cost') || lower.includes('money')) {
    return `Costs in ${country.name} vary by season, location, and travel style. Use the trip planner to set an INR budget, then check current prices for transport, accommodation, meals, and attractions.`;
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hola')) {
    return `Welcome to **Mundo Hispano**! I am your cultural **guía** (guide) for discovering ${country.name}. Ask about its **regiones** (regions), **fiestas** (festivals), or **comida** (food), and I can help you explore the local highlights.`;
  }

  const regionalHighlight = firstRegion
    ? `${firstRegion.name} is represented with ${firstRegion.famous_place}, ${firstRegion.signature_festival}, and ${firstRegion.signature_dish} in the country guide.`
    : `The country guide includes verified highlights for ${country.name}.`;
  return `${country.name} has a range of **regiones** (regions), each with its own **costumbres** (customs) and **cultura** (culture). ${regionalHighlight} What would you like to explore?`;
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
      const fallbackReply = getOfflineGuideResponse(message, country);
      const resData = {
        reply: fallbackReply,
        isFallback: true,
        source: `${country.id}.json (Offline Guide)`,
        message: 'Operating in local guide mode (GEMINI_API_KEY not configured).',
      };
      setCachedResponse(cacheKey, resData);
      return NextResponse.json(resData);
    }

    const prompt = `You are "Mateo", the knowledgeable and friendly local guide for "Mundo Hispano", an educational travel exploration of ${country.name}.

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

      const reply = response.text || getOfflineGuideResponse(message, country);

      const result = {
        reply,
        isFallback: false,
        source: 'Gemini 2.5 Flash',
      };

      setCachedResponse(cacheKey, result);
      return NextResponse.json(result);
    } catch (apiError: any) {
      console.warn('[Gemini Chat API] Rate limit or error, using local fallback:', apiError?.message || apiError);
      const fallbackReply = getOfflineGuideResponse(message, country);
      const resData = {
        reply: fallbackReply,
        isFallback: true,
        source: `${country.id}.json (Fallback Guide)`,
        message: 'Live AI is temporarily rate-limited. Enjoy this verified answer from local guidance!',
      };
      setCachedResponse(cacheKey, resData);
      return NextResponse.json(resData);
    }
  } catch (error: any) {
    console.error('[Chat Route Handler] Error caught; returning resilient fallback:', error);
    const reply = getOfflineGuideResponse('general', getCountryData('spain'));
    return NextResponse.json({
      reply,
      isFallback: true,
      source: 'spain.json (Offline Guide)',
    });
  }
}
