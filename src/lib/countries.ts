import fs from 'fs';
import path from 'path';
import { CountryData } from '@/types/country';
import spainData from '../../data/countries/spain.json';

const COUNTRIES_DIR = path.join(process.cwd(), 'data', 'countries');

export function getCountryData(id: string = 'spain'): CountryData {
  const normalizedId = id.toLowerCase();
  const filePath = path.join(COUNTRIES_DIR, `${normalizedId}.json`);

  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent) as CountryData;

      // Prevent a file from accidentally returning another chapter's data.
      if (data.id !== normalizedId) {
        throw new Error(
          `Chapter ID mismatch: requested "${normalizedId}", received "${data.id}".`
        );
      }

      return data;
    }

    console.error(`[Country Loader] File not found: ${filePath}`);
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
      });
  } catch (error) {
    console.error('[Country Loader] Error listing chapters:', error);
    return [];
  }
}