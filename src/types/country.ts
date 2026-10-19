export interface SpanishWordItem {
  word: string;
  meaning: string;
  pronunciation: string;
}

export interface LandmarkItem {
  id: string;
  name: string;
  city: string;
  caption: string; // Max 12 words
  image: string | null;
  credit: string | null;
  coordinates: [number, number] | null;
  tagline?: string;
}

export interface FestivalItem {
  id: string;
  name: string;
  month: string;
  town_region: string;
  caption: string; // Max 12 words
  image: string | null;
  credit: string | null;
}

export interface FoodTileItem {
  id: string;
  name_es: string;
  caption: string; // Max 8 words
  veg_friendly: boolean;
  image: string | null;
  credit: string | null;
}

export interface CultureTraditionItem {
  id: string;
  name: string;
  origin: string;
  description: string; // 2 lines
  image: string | null;
  credit: string | null;
}

export interface RegionSummary {
  id: string;
  name: string;
  name_es: string;
  capital: string;
  coordinates: [number, number];
  famous_place: string;
  signature_festival: string;
  signature_dish: string;
  character?: string;
  regional_language?: string;
  signature_food?: string;
  fallback_blurb?: string;
  [key: string]: any;
}

export type RegionIdentity = RegionSummary;

export interface CountryVisualData {
  id: string;
  name: string;
  name_es: string;
  capital: string;
  currency: string;
  best_time_to_visit: string;
  hero_image: string;
  hero_credit: string;
  daily_phrases: { es: string; en: string; pronunciation: string }[];
  regions: RegionSummary[];
  lugares: LandmarkItem[];
  lugares_palabras: SpanishWordItem[];
  fiestas: FestivalItem[];
  fiestas_palabras: SpanishWordItem[];
  comida: FoodTileItem[];
  comida_palabras: SpanishWordItem[];
  cultura: CultureTraditionItem[];
  cultura_palabras: SpanishWordItem[];
  photo_credits: {
    title: string;
    photographer: string;
    license: string;
    source_url?: string;
  }[];
  intro?: string;
  fun_fact?: string;
  viaje_palabras?: SpanishWordItem[];
  india_traveller?: IndiaTravellerGuide;
  research_sources?: AcademicSource[];
  verification_notes?: string[];
  research_reflection?: string;
  [key: string]: any;
}

export type CountryData = CountryVisualData;

// Compatibility interfaces for auxiliary/legacy components
export interface ArtLiteratureFigure {
  [key: string]: any;
}

export interface MusicDanceItem {
  [key: string]: any;
}

export interface FutbolCulture {
  [key: string]: any;
}

export interface FestivalEvent {
  [key: string]: any;
}

export interface EtiquetteItem {
  [key: string]: any;
}

export interface FamousFoodItem {
  [key: string]: any;
}

export interface TimelineEvent {
  [key: string]: any;
}

export interface IndiaTravellerGuide {
  visa_note: string;
  flight_note: string;
  cost_per_day_inr: string | null;
  veg_tips: string;
  visa_label?: string;
  visa_official_url?: string;
  visa_official_label?: string;
  visa_application_note?: string;
  visa_timing_note?: string;
  flight_duration?: string | null;
  flight_route?: string | null;
  flight_carriers?: string | null;
  cost_daily_range?: string | null;
  cost_reference_note?: string | null;
  key_food_phrase?: string;
}

export interface AcademicSource {
  title: string;
  author_or_institution: string;
  url: string;
  year?: string;
  note?: string;
}

export interface SpanishComparisonItem {
  [key: string]: any;
}

export interface LearnedWord {
  [key: string]: any;
}
