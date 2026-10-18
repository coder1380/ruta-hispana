import { NextRequest, NextResponse } from 'next/server';
import { getCountryData } from '@/lib/countries';
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
  days: number,
  budgetInr: number,
  interests: string[],
  isVegetarian: boolean
): TripPlanResult {
  const spain = getCountryData('spain');
  const safeDays = Math.min(Math.max(days, 1), 7);
  const interestLabel = interests.length > 0 ? interests.join(' & ') : 'Culture & Gastronomy';

  const locations = [
    { city: 'Madrid', region: 'Madrid', morning: 'Explore the historic **Plaza Mayor** (main square) and walk through Puerta del Sol.', afternoon: 'Visit the renowned **Museo del Prado** (Prado art museum) to view Velázquez and Goya.', evening: 'Stroll around Parque del Buen Retiro and relax at a sunny terrace for early **tapas** (savory appetizers).' },
    { city: 'Barcelona', region: 'Catalonia', morning: 'Marvel at Antoni Gaudí’s awe-inspiring **Sagrada Família** (Holy Family basilica).', afternoon: 'Wander through the gothic stone arches of the **Barrio Gótico** (Gothic quarter).', evening: 'Catch sunset along the **playa** (beach) of Barceloneta and enjoy maritime breezes.' },
    { city: 'Seville', region: 'Andalusia', morning: 'Visit the majestic Plaza de España and admire the grand **azulejos** (ceramic painted tiles).', afternoon: 'Tour the royal Real Alcázar palace with fragrant orange courtyards.', evening: 'Experience authentic emotional **flamenco** (traditional passionate dance) in the Triana neighborhood.' },
    { city: 'Valencia', region: 'Valencia', morning: 'Walk through the futuristic **Ciudad de las Artes** (City of Arts and Sciences).', afternoon: 'Explore the bustling Mercado Central and taste fresh seasonal produce.', evening: 'Savor genuine paella cooked over orange wood near the Albufera nature reserve.' },
    { city: 'Granada', region: 'Andalusia', morning: 'Climb up to the breathtaking **Alhambra** (red Moorish fortress and palace).', afternoon: 'Wander the winding whitewashed alleys of the Albayzín quarter.', evening: 'Enjoy complimentary tapas served with every refreshment in traditional taverns.' },
    { city: 'San Sebastián', region: 'Basque Country', morning: 'Walk around the pristine shell-shaped crescent of **La Concha** (seashell bay).', afternoon: 'Hop between lively taverns in the Old Town tasting gourmet **pintxos** (skewered delicacies).', evening: 'Take the funicular to Monte Igueldo for panoramic coastal views.' },
    { city: 'Córdoba', region: 'Andalusia', morning: 'Step inside the mesmerizing **Mezquita** (historic mosque-cathedral with striped arches).', afternoon: 'Photograph flower-filled courtyards in the Calleja de las Flores.', evening: 'Cross the Roman Bridge as evening lights illuminate the Guadalquivir river.' },
  ];

  const daysList: ItineraryDay[] = [];
  for (let i = 0; i < safeDays; i++) {
    const loc = locations[i % locations.length];
    const food = isVegetarian
      ? (i % 2 === 0
          ? { dish: 'Tortilla de Patatas', description: 'Classic Spanish golden potato omelet made with farm eggs and caramelized onions.', veg_friendly: true }
          : { dish: 'Gazpacho Andaluz', description: 'Chilled ripe tomato and bell pepper soup served with crusty artisan bread.', veg_friendly: true })
      : (i % 2 === 0
          ? { dish: 'Paella Valenciana', description: 'Traditional saffron rice prepared with seasonal poultry, butter beans, and fresh rosemary.', veg_friendly: false }
          : { dish: 'Pintxos Variados', description: 'Assorted skewers of grilled vegetables, artisan cheese, and regional cured meats.', veg_friendly: false });

    const phrase = spain.daily_phrases ? spain.daily_phrases[i % spain.daily_phrases.length] : { es: 'Una mesa, por favor.', en: 'A table, please.', pronunciation: 'OO-nah MEH-sah' };

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
    title: `${safeDays}-Day Grand ${interestLabel} Journey Across Spain`,
    summary: `A balanced, research-backed itinerary highlighting Spain's cultural wonders, historic monuments, and delectable culinary traditions tailored for ${isVegetarian ? 'vegetarian dining' : 'all dietary preferences'}.`,
    estimated_cost_inr: `₹${(budgetInr || safeDays * 11000).toLocaleString('en-IN')}`,
    is_vegetarian: isVegetarian,
    days: daysList,
    practical_tips: [
      `Cost baseline: Approx. ₹6,000–₹9,000 per day including meals and regional transit.`,
      `Dining schedule: Spaniards eat lunch around 2:00 PM and dinner after 8:30 PM.`,
      `Vegetarian guidance: Order tortilla de patatas, gazpacho, and pimientos de padrón for naturally vegetarian dishes.`,
      `Transport: Book high-speed Renfe AVE trains between Madrid, Barcelona, and Seville in advance for the best fares.`,
    ],
    isFallback: true,
    source: 'spain.json (Verified Local Ground Truth)',
    message: 'Generated using verified data from spain.json.',
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
      const fallback = buildFallbackItinerary(safeDays, safeBudget, interests, isVegetarian);
      setCachedResponse(cacheKey, fallback);
      return NextResponse.json(fallback);
    }

    const prompt = `You are an expert travel planner for "Ruta Hispana".
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
      parsed.source = 'Gemini 2.5 Flash (Grounded in spain.json)';

      setCachedResponse(cacheKey, parsed);
      return NextResponse.json(parsed);
    } catch (apiError: any) {
      console.warn('[Gemini Planner API] API error or JSON parse error, using fallback:', apiError?.message || apiError);
      const fallback = buildFallbackItinerary(safeDays, safeBudget, interests, isVegetarian);
      fallback.message = 'Live AI itinerary generated fallback from verified spain.json data due to API limits.';
      setCachedResponse(cacheKey, fallback);
      return NextResponse.json(fallback);
    }
  } catch (error: any) {
    console.error('[Planner Route Handler] Error caught; returning resilient fallback itinerary:', error);
    const fallback = buildFallbackItinerary(3, 35000, ['Culture', 'Gastronomy'], true);
    return NextResponse.json(fallback);
  }
}
