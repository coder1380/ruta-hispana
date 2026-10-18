import fs from 'fs';
import path from 'path';
import { CountryData } from '@/types/country';
import spainData from '../../data/countries/spain.json';

const COUNTRIES_DIR = path.join(process.cwd(), 'data', 'countries');

function normalizeCountryId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getCountryData(id: string = 'spain'): CountryData {
  const normalizedId = normalizeCountryId(id);

  try {
    const files = fs.readdirSync(COUNTRIES_DIR).filter((file) => file.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(COUNTRIES_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as CountryData;
      const fileId = file.replace(/\.json$/i, '');
      if (
        normalizeCountryId(fileId) === normalizedId ||
        normalizeCountryId(data.id || '') === normalizedId
      ) {
        return data;
      }
    }

    console.error(`[Country Loader] No country data found for "${id}".`);
  } catch (error) {
    console.error(
      `[Country Loader] Could not load "${normalizedId}":`,
      error
    );
  }

  // Keep the existing Spain homepage working.
  if (normalizedId === 'spain') {
    return spainData as unknown as CountryData;
  }

  // Do not silently display Spain when another chapter fails.
  throw new Error(
    `Could not load chapter "${normalizedId}". Check data/countries/${normalizedId}.json.`
  );
}

export function getAllCountries(): {
  id: string;
  name: string;
  name_es: string;
}[] {
  try {
    if (!fs.existsSync(COUNTRIES_DIR)) {
      return [];
    }

    return fs
      .readdirSync(COUNTRIES_DIR)
      .filter((file) => file.endsWith('.json'))
      .map((file) => {
        const raw = fs.readFileSync(path.join(COUNTRIES_DIR, file), 'utf-8');
        const data = JSON.parse(raw);

        return {
          id: data.id || file.replace('.json', ''),
          name: data.name || file.replace('.json', ''),
          name_es: data.name_es || data.name || file.replace('.json', ''),
        };
      })
      .sort((a, b) =>
        a.id === 'spain' ? -1 : b.id === 'spain' ? 1 : a.name.localeCompare(b.name)
      );
  } catch (error) {
    console.error('[Country Loader] Error listing chapters:', error);
    return [];
  }
}