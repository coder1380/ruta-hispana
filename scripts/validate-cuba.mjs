import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const countryPath = path.join(root, 'data', 'countries', 'cuba.json');
const country = JSON.parse(readFileSync(countryPath, 'utf8'));
const idCollections = new Map([
  ['regions', new Set(country.regions.map(({ id }) => id))],
  ['lugares', new Set(country.lugares.map(({ id }) => id))],
  ['fiestas', new Set(country.fiestas.map(({ id }) => id))],
  ['comida', new Set(country.comida.map(({ id }) => id))],
  ['cultura', new Set(country.cultura.map(({ id }) => id))],
]);
const allIds = new Set([...idCollections.values()].flatMap((ids) => [...ids]));
const referenceTargets = new Map([
  ['famous_place_id', 'lugares'],
  ['location_region_id', 'regions'],
  ['signature_festival_id', 'fiestas'],
  ['signature_dish_id', 'comida'],
]);
const errors = [];
const imageReferences = [];

function visit(value, label = 'country') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => visit(item, `${label}[${index}]`));
    return;
  }
  if (!value || typeof value !== 'object') return;

  for (const [key, child] of Object.entries(value)) {
    const childLabel = `${label}.${key}`;
    if (key === 'image' || key === 'hero_image') {
      if (child !== null) imageReferences.push({ label: childLabel, value: child });
    }
    if (key.endsWith('_id') && child !== null) {
      const target = referenceTargets.get(key);
      const resolved = target
        ? idCollections.get(target)?.has(child)
        : allIds.has(child);
      if (!resolved) errors.push(`${childLabel} references missing id "${child}"`);
    }
    visit(child, childLabel);
  }
}

visit(country);

const referencesByPath = new Map();
const hashes = new Map();
for (const { label, value } of imageReferences) {
  if (typeof value !== 'string' || !value.startsWith('/images/cuba/')) {
    errors.push(`${label} is not a /images/cuba/ path`);
    continue;
  }

  const imagePath = path.join(root, 'public', value.slice(1));
  const deliveryImagePath = path.join(
    root,
    'cuba',
    'images',
    path.basename(value),
  );
  if (!existsSync(imagePath)) {
    errors.push(`${label} points to missing file "${value}"`);
    continue;
  }
  if (!existsSync(deliveryImagePath)) {
    errors.push(`${label} is missing from cuba/images: "${path.basename(value)}"`);
  } else if (!readFileSync(imagePath).equals(readFileSync(deliveryImagePath))) {
    errors.push(`${label} differs between public/images and cuba/images`);
  }

  const labels = referencesByPath.get(value) ?? [];
  labels.push(label);
  referencesByPath.set(value, labels);

  const hash = createHash('sha256').update(readFileSync(imagePath)).digest('hex');
  const previousPath = hashes.get(hash);
  if (previousPath && previousPath !== value) {
    errors.push(`${value} duplicates image contents in ${previousPath}`);
  } else {
    hashes.set(hash, value);
  }
}

for (const [imagePath, labels] of referencesByPath) {
  if (labels.length > 1) {
    const intentionalHeroReuse =
      imagePath === country.hero_image &&
      labels.includes('country.hero_image') &&
      labels.includes('country.lugares[0].image');
    if (!intentionalHeroReuse) {
      errors.push(`${imagePath} is reused by ${labels.join(', ')}`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((error) => `ERROR: ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `Cuba JSON valid; checked ${imageReferences.length} image references, ` +
      `${allIds.size} ids, and all *_id references.`,
  );
}
