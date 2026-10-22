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

export interface ItineraryDay {
  day_number: number;
  title: string;
  location: string;
  morning: string;
  afternoon: string;
  evening: string;
  food_recommendation: {
    dish: string;
    description: string;
    veg_friendly: boolean;
  };
  key_phrase?: {
    es: string;
    en: string;
    pronunciation: string;
  };
}

export interface TripPlanResult {
  title: string;
  summary: string;
  estimated_cost_inr: string;
  is_vegetarian: boolean;
  days: ItineraryDay[];
  practical_tips: string[];
  isFallback: boolean;
  source: string;
  message?: string;
}

/**
 * Builds a deterministic, rich fallback itinerary grounded directly in spain.json
 * when offline or when API rate limits are hit.
 */
function buildFallbackItinerary(
  country: CountryData,
  days: number,
  budgetInr: number,
  interests: string[],
  isVegetarian: boolean
): TripPlanResult {
  const safeDays = Math.min(Math.max(days, 1), 7);
  const interestLabel = interests.length > 0 ? interests.join(' & ') : 'Culture & Gastronomy';
  const regions = country.regions ?? [];
  const places = country.lugares ?? [];
  const availableFood = country.comida ?? [];
  const vegetarianFood = availableFood.filter((item) => item.veg_friendly);
  const locations = Array.from(
    { length: Math.max(regions.length, places.length, 1) },
    (_, index) => {
      const region = regions.length ? regions[index % regions.length] : undefined;
      const place = places.length ? places[index % places.length] : undefined;
      const city = place?.city || region?.capital || country.capital;

      return {
        city,
        morning: place
          ? `Visit ${place.name} in ${place.city}.`
          : `Explore ${region?.name || city} and its local highlights.`,
        afternoon: region
          ? `Discover ${region.name}; notable sights include ${region.famous_place}.`
          : `Explore more of ${country.name} at your own pace.`,
        evening: region
          ? `Learn about ${region.signature_festival} and try ${region.signature_dish}.`
          : `Explore local food and cultural traditions in ${city}.`,
      };
    }
  );

  const daysList: ItineraryDay[] = [];
  for (let i = 0; i < safeDays; i++) {
    const loc = locations[i % locations.length];
    const foodChoices = isVegetarian ? vegetarianFood : availableFood;
    const selectedFood = foodChoices.length ? foodChoices[i % foodChoices.length] : undefined;
    const food = selectedFood
      ? {
        dish: selectedFood.name_es,
        description: selectedFood.caption,
        veg_friendly: selectedFood.veg_friendly,
      }
      : {
        dish: 'Ask locally about available options',
        description: 'Check that the dish contains no meat, seafood, or animal broth.',
        veg_friendly: false,
      };
    const phrases = country.daily_phrases ?? [];
    const phrase = phrases.length
      ? phrases[i % phrases.length]
      : { es: 'Una mesa, por favor.', en: 'A table, please.', pronunciation: 'OO-nah MEH-sah' };

    daysList.push({
      day_number: i + 1,
      title: `Day ${i + 1}: Discovering ${loc.city}`,
      location: loc.city,
      morning: loc.morning,
      afternoon: loc.afternoon,
      evening: loc.evening,
      food_recommendation: food,
      key_phrase: phrase,
    });
  }

  return {
    title: `${safeDays}-Day ${interestLabel} Journey Across ${country.name}`,
    summary: `A balanced itinerary highlighting ${country.name}'s cultural sites, regional traditions, and local food, tailored for ${isVegetarian ? 'vegetarian dining' : 'flexible dining'}.`,
    estimated_cost_inr: `₹${(budgetInr || safeDays * 11000).toLocaleString('en-IN')}`,
    is_vegetarian: isVegetarian,
    days: daysList,
    practical_tips: [
      `Confirm local transport routes, opening times, and entry requirements before setting out.`,
      `Ask restaurants whether dishes contain meat, seafood, or animal broth.`,
      `Use the regional highlights in this itinerary to choose places that match your interests.`,
      `Check current local guidance for seasonal weather and travel conditions.`,
    ],
    isFallback: true,
    source: `${country.id}.json (Verified Local Ground Truth)`,
    message: `Generated using verified data from ${country.name}.`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      countryId = 'spain',
      days = 3,
      budgetInr = 35000,
      interests = ['Culture', 'History'],
      isVegetarian = false,
    } = body;

    const safeDays = Math.min(Math.max(Number(days) || 3, 1), 7);
    const safeBudget = Number(budgetInr) || safeDays * 11000;
    const country = getCountryData(countryId);

    const cacheKey = `planner:${countryId}:${safeDays}:${safeBudget}:${isVegetarian}:${(interests || []).sort().join('-')}`;
    const cached = getCachedResponse<TripPlanResult>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    const client = getGeminiClient();

    if (!client) {
      const fallback = buildFallbackItinerary(country, safeDays, safeBudget, interests, isVegetarian);
      setCachedResponse(cacheKey, fallback);
      return NextResponse.json(fallback);
    }

    const prompt = `You are an expert travel planner for "Mundo Hispano".
GROUNDING CONTEXT (Use strictly these facts from ${country.name}):
${formatCountryContext(country)}

USER TRIP REQUEST:
- Country: ${country.name} (${country.name_es})
- Number of Days: ${safeDays}
- Estimated Total Budget (INR): ₹${safeBudget.toLocaleString('en-IN')}
- Traveler Interests: ${interests.join(', ')}
- Strictly Vegetarian Dining: ${isVegetarian ? 'YES (No meat, no seafood, no animal broth)' : 'NO (Flexible)'}

TASK:
Generate a detailed day-by-day travel itinerary.
Return your response as STRICT, VALID JSON ONLY. Do not wrap in markdown backticks or explanation. Just pure raw JSON matching this schema:
{
  "title": "string (Creative bilingual trip title)",
  "summary": "string (Engaging 2-sentence overview)",
  "estimated_cost_inr": "string (e.g. ₹45,000)",
  "is_vegetarian": boolean,
  "days": [
    {
      "day_number": number,
      "title": "string (e.g. Day 1: Art and Grand Plazas of Madrid)",
      "location": "string (City/Region)",
      "morning": "string (Morning activities)",
      "afternoon": "string (Afternoon activities)",
      "evening": "string (Evening activities)",
      "food_recommendation": {
        "dish": "string",
        "description": "string",
        "veg_friendly": boolean
      },
      "key_phrase": {
        "es": "string",
        "en": "string",
        "pronunciation": "string"
      }
    }
  ],
  "practical_tips": ["string", "string", "string"]
}

MANDATORY LANGUAGE RULE:
${MANDATORY_LANGUAGE_RULE}
Apply this language rule inside the morning, afternoon, evening, and description fields!
`;

    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text?.trim() || '';
      // Clean possible markdown wrappers if any
      const cleanedJson = rawText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      const parsed: TripPlanResult = JSON.parse(cleanedJson);

      parsed.isFallback = false;
      parsed.source = `Gemini 2.5 Flash (Grounded in ${country.id}.json)`;

      setCachedResponse(cacheKey, parsed);
      return NextResponse.json(parsed);
    } catch (apiError: any) {
      console.warn('[Gemini Planner API] API error or JSON parse error, using fallback:', apiError?.message || apiError);
      const fallback = buildFallbackItinerary(country, safeDays, safeBudget, interests, isVegetarian);
      fallback.message = `Live AI was unavailable; this itinerary uses verified ${country.name} data.`;
      setCachedResponse(cacheKey, fallback);
      return NextResponse.json(fallback);
    }
  } catch (error: any) {
    console.error('[Planner Route Handler] Error caught; returning resilient fallback itinerary:', error);
    const fallback = buildFallbackItinerary(getCountryData('spain'), 3, 35000, ['Culture', 'Gastronomy'], true);
    return NextResponse.json(fallback);
  }
}
