import fs from 'fs';
import path from 'path';
import { CountryData } from '@/types/country';
import spainData from '../../data/countries/spain.json';

const COUNTRIES_DIR = path.join(process.cwd(), 'data', 'countries');

function normalizeCountryId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Country-agnostic loader:
 * Teammates can drop in any new country JSON (e.g., mexico.json, argentina.json, peru.json)
 * into /data/countries/ and it will be recognized automatically!
 */
export function getCountryData(id: string = 'spain'): CountryData {
  try {
    const requestedId = normalizeCountryId(id);
    const files = fs.readdirSync(COUNTRIES_DIR).filter((file) => file.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(COUNTRIES_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as CountryData;
      const fileId = file.replace(/\.json$/i, '');
      if (
        normalizeCountryId(fileId) === requestedId ||
        normalizeCountryId(data.id || '') === requestedId
      ) {
        return data;
      }
    }
  } catch (error) {
    console.error(`[Country Loader] Error reading ${id}.json:`, error);
  }

  // Fallback to static Spain dataset
  return spainData as unknown as CountryData;
}

export function getAllCountries(): { id: string; name: string; name_es: string }[] {
  try {
    if (fs.existsSync(COUNTRIES_DIR)) {
      const files = fs.readdirSync(COUNTRIES_DIR);
      return files
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
        .sort((a, b) => a.id === 'spain' ? -1 : b.id === 'spain' ? 1 : a.name.localeCompare(b.name));
    }
  } catch (error) {
    console.error('[Country Loader] Error listing countries:', error);
  }

  return [{ id: 'spain', name: 'Spain', name_es: 'España' }];
}
