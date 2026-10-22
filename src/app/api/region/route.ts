import { NextRequest, NextResponse } from 'next/server';
import { getCountryData } from '@/lib/countries';
import {
  getGeminiClient,
  getCachedResponse,
  setCachedResponse,
  MANDATORY_LANGUAGE_RULE,
  formatCountryContext,
} from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { countryId = 'spain', regionId } = body;
    const country = getCountryData(countryId);
    const regions = country.regions || [];

    const targetId = (regionId || 'catalonia').toLowerCase();
    const region =
      regions.find(
        (r) =>
          r.id.toLowerCase() === targetId ||
          r.name.toLowerCase() === targetId ||
          r.name_es.toLowerCase() === targetId
      ) || regions[0];

    const cacheKey = `region:${countryId}:${region.id}`;
    const cached = getCachedResponse<{ blurb: string; isFallback: boolean }>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    const defaultBlurb = `${region.name} (${region.name_es}) is famed for **${region.famous_place}** (landmark), the spirited celebration of **${region.signature_festival}** (festival), and authentic culinary pride in **${region.signature_dish}** (regional specialty).`;

    const client = getGeminiClient();

    if (!client) {
      const fallbackResult = {
        region: region.name,
        region_es: region.name_es,
        capital: region.capital,
        famous_place: region.famous_place,
        signature_festival: region.signature_festival,
        signature_dish: region.signature_dish,
        blurb: defaultBlurb,
        isFallback: true,
        source: 'spain.json (Verified Field Archive)',
      };
      setCachedResponse(cacheKey, fallbackResult);
      return NextResponse.json(fallbackResult);
    }

    const prompt = `You are a student travel writer for "Mundo Hispano".
VERIFIED REGIONAL DATA:
Region: ${region.name} (${region.name_es})
Capital: ${region.capital}
Famous Landmark: ${region.famous_place}
Signature Festival: ${region.signature_festival}
Signature Dish: ${region.signature_dish}

TASK:
Write a STRICTLY 3-LINE observational note (maximum 40 words total).
Highlight the landmark, the festival, and the dish.
Short, human sentences. No marketing clichés.
Include 2-3 Spanish words in bold with meaning in brackets.
`;

    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const generatedText = response.text?.trim() || defaultBlurb;

      const result = {
        region: region.name,
        region_es: region.name_es,
        capital: region.capital,
        famous_place: region.famous_place,
        signature_festival: region.signature_festival,
        signature_dish: region.signature_dish,
        blurb: generatedText,
        isFallback: false,
        source: 'Gemini 2.5 Flash',
      };

      setCachedResponse(cacheKey, result);
      return NextResponse.json(result);
    } catch {
      const fallbackResult = {
        region: region.name,
        region_es: region.name_es,
        capital: region.capital,
        famous_place: region.famous_place,
        signature_festival: region.signature_festival,
        signature_dish: region.signature_dish,
        blurb: defaultBlurb,
        isFallback: true,
        source: 'spain.json (Fallback)',
      };
      setCachedResponse(cacheKey, fallbackResult);
      return NextResponse.json(fallbackResult);
    }
  } catch (error: any) {
    console.warn('[Region Route] Handled gracefully:', error);
    return NextResponse.json({
      region: 'Spain',
      blurb: 'Explore Spain through its regional monuments, seasonal festivals, and authentic culinary heritage.',
      isFallback: true,
      source: 'spain.json',
    });
  }
}
