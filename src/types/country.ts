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
  image: string;
  credit: string;
  coordinates: [number, number];
  tagline?: string;
}

export interface FestivalItem {
  id: string;
  name: string;
  month: string;
  town_region: string;
  caption: string; // Max 12 words
  image: string;
  credit: string;
}

export interface FoodTileItem {
  id: string;
  name_es: string;
  caption: string; // Max 8 words
  veg_friendly: boolean;
  diet?: 'veg' | 'non-veg' | 'egg';
  image: string;
  credit: string;
  alt?: string;
  source_url?: string;
  license?: string;
}

export interface CultureTraditionItem {
  id: string;
  name: string;
  origin: string;
  description: string; // 2 lines
  image: string;
  credit: string;
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
  photo_credits: { title: string; photographer: string; license: string; url?: string }[];
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
  [key: string]: any;
}

export interface AcademicSource {
  [key: string]: any;
}

export interface SpanishComparisonItem {
  [key: string]: any;
}

export interface LearnedWord {
  [key: string]: any;
}
