import { CountryData } from '@/types/country';
import argentinaData from '../../data/countries/argentina.json';
import centralAmericaData from '../../data/countries/central-america.json';
import chileData from '../../data/countries/chile.json';
import cubaData from '../../data/countries/cuba.json';
import dominicanRepublicData from '../../data/countries/dominican-republic.json';
import equatorialGuineaData from '../../data/countries/equatorial-guinea.json';
import paraguayData from '../../data/countries/paraguay.json';
import puertoRicoData from '../../data/countries/puertorico.json';
import spainData from '../../data/countries/spain.json';
import uruguayData from '../../data/countries/uruguay.json';

type CountryJsonData =
  | typeof argentinaData
  | typeof centralAmericaData
  | typeof chileData
  | typeof cubaData
  | typeof dominicanRepublicData
  | typeof equatorialGuineaData
  | typeof paraguayData
  | typeof puertoRicoData
  | typeof spainData
  | typeof uruguayData;

function normalizeCountryId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function coordinatePair(
  coordinates: number[],
  label: string
): [number, number] {
  if (
    coordinates.length !== 2 ||
    !coordinates.every((coordinate) => Number.isFinite(coordinate))
  ) {
    throw new Error(`[Country Loader] Invalid coordinates for ${label}.`);
  }

  return [coordinates[0], coordinates[1]];
}

function normalizeDiet(
  diet: string | undefined,
  dishId: string
): CountryData['comida'][number]['diet'] {
  if (diet === undefined || diet === 'veg' || diet === 'non-veg' || diet === 'egg') {
    return diet;
  }

  throw new Error(`[Country Loader] Invalid diet "${diet}" for dish "${dishId}".`);
}

function normalizeCountry(data: CountryJsonData): CountryData {
  return {
    ...data,
    regions: data.regions.map((region) => ({
      ...region,
      coordinates: coordinatePair(region.coordinates, `region "${region.id}"`),
    })),
    lugares: data.lugares.map((place) => ({
      ...place,
      coordinates: place.coordinates
        ? coordinatePair(place.coordinates, `landmark "${place.id}"`)
        : null,
    })),
    comida: data.comida.map((dish) => ({
      ...dish,
      diet: 'diet' in dish ? normalizeDiet(dish.diet, dish.id) : undefined,
    })),
  };
}

const countries: Record<string, CountryData> = {
  argentina: normalizeCountry(argentinaData),
  'central-america': normalizeCountry(centralAmericaData),
  chile: normalizeCountry(chileData),
  cuba: normalizeCountry(cubaData),
  'dominican-republic': normalizeCountry(dominicanRepublicData),
  'equatorial-guinea': normalizeCountry(equatorialGuineaData),
  paraguay: normalizeCountry(paraguayData),
  puertorico: normalizeCountry(puertoRicoData),
  spain: normalizeCountry(spainData),
  uruguay: normalizeCountry(uruguayData),
};

export function getCountryData(id: string = 'spain'): CountryData {
  const normalizedId = normalizeCountryId(id);
  const country = Object.entries(countries).find(
    ([fileId, data]) =>
      normalizeCountryId(fileId) === normalizedId ||
      normalizeCountryId(data.id || '') === normalizedId
  );

  if (country) return country[1];

  console.error(`[Country Loader] No country data found for "${id}".`);
  throw new Error(
    `Could not load chapter "${normalizedId}". Check data/countries/${normalizedId}.json.`
  );
}

export function getAllCountries(): {
  id: string;
  name: string;
  name_es: string;
}[] {
  return Object.entries(countries)
    .map(([fileId, data]) => ({
      id: data.id || fileId,
      name: data.name || fileId,
      name_es: data.name_es || data.name || fileId,
    }))
    .sort((a, b) =>
      a.id === 'spain' ? -1 : b.id === 'spain' ? 1 : a.name.localeCompare(b.name)
    );
}