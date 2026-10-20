import { GoogleGenAI } from '@google/genai';
import { CountryData } from '@/types/country';

// In-memory cache to prevent repeated API calls and avoid quota exhaustion
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

/**
 * Helper to fetch from cache or compute
 */
export function getCachedResponse<T>(key: string): T | null {
  const cached = responseCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return cached.data as T;
}

export function setCachedResponse<T>(key: string, data: T): void {
  responseCache.set(key, { data, timestamp: Date.now() });
}

/**
 * Initialize Google GenAI client securely on the server.
 * Returns null if GEMINI_API_KEY is not configured.
 */
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (error) {
    console.error('[Gemini Client] Initialization error:', error);
    return null;
  }
}

/**
 * Standard system instruction enforced across all AI prompts:
 * "Reply in English only. Naturally include 3-5 easy Spanish words per reply, bold them and add the meaning in brackets the first time. Never write full sentences in Spanish."
 */
export const MANDATORY_LANGUAGE_RULE = 
  "Reply in English only. Naturally include 3-5 easy Spanish words per reply, bold them and add the meaning in brackets the first time. Never write full sentences in Spanish.";

/**
 * Formats a country's verified ground truth JSON into a condensed string for injection into prompts.
 */
export function formatCountryContext(country: CountryData): string {
  const regions = (country.regions || []).map((r) => ({
    name: r.name,
    name_es: r.name_es,
    capital: r.capital,
    place: r.famous_place,
    festival: r.signature_festival,
    dish: r.signature_dish,
  }));

  return JSON.stringify({
    name: country.name,
    name_es: country.name_es,
    capital: country.capital,
    intro: country.intro,
    fun_fact: country.fun_fact,
    regions,
    lugares: (country.lugares || []).map((l) => `${l.name} (${l.city}): ${l.caption}`),
    fiestas: (country.fiestas || []).map((f) => `${f.name} (${f.month}): ${f.caption}`),
    comida: (country.comida || []).map((c) => `${c.name_es}: ${c.caption} (Veg: ${c.veg_friendly})`),
    cultura: (country.cultura || []).map((t) => `${t.name} (${t.origin}): ${t.description}`),
    research_sources: (country.research_sources || []).map((source) => ({
      title: source.title,
      institution: source.author_or_institution,
      url: source.url,
      note: source.note,
    })),
  });
}
