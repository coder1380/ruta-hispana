import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

const JSON_FILE = path.join(
  ROOT,
  'data',
  'countries',
  'central-america.json'
);

const IMAGE_DIR = path.join(
  ROOT,
  'public',
  'images',
  'central-america'
);

const API = 'https://commons.wikimedia.org/w/api.php';

// Be polite to Wikimedia servers.
const REQUEST_DELAY_MS = 2500;
const MAX_RETRIES = 4;

const SEARCH_TERMS = {
  'central-america-hero.jpg':
    'Central America tropical rainforest volcano landscape',

  'tikal.jpg': 'Tikal Guatemala Maya temples rainforest',
  'antigua-guatemala.jpg': 'Antigua Guatemala colonial city volcano',
  'great-blue-hole.jpg': 'Great Blue Hole Belize aerial',
  'xunantunich.jpg': 'Xunantunich Maya ruins Belize',
  'copan.jpg': 'Copan Maya archaeological ruins Honduras',
  'roatan.jpg': 'Roatan Honduras Caribbean beach coral reef',
  'joya-de-ceren.jpg': 'Joya de Ceren archaeological site El Salvador',
  'santa-ana-volcano.jpg': 'Santa Ana volcano El Salvador crater',
  'granada.jpg': 'Granada Nicaragua colonial architecture',
  'ometepe.jpg': 'Ometepe Island Nicaragua volcano lake',
  'arenal-volcano.jpg': 'Arenal Volcano Costa Rica',
  'manuel-antonio.jpg': 'Manuel Antonio Costa Rica tropical beach',
  'panama-canal.jpg': 'Panama Canal ships locks',
  'casco-viejo.jpg': 'Casco Viejo Panama historic buildings',

  'semana-santa.jpg':
    'Semana Santa Antigua Guatemala alfombras procession',
  'garifuna-day.jpg':
    'Garifuna Settlement Day Belize traditional celebration',
  'feria-juniana.jpg': 'Feria Juniana Honduras festival parade',
  'august-festival.jpg': 'August Festival San Salvador El Salvador',
  'la-purisima.jpg': 'La Purisima Nicaragua celebration',
  'palmares.jpg': 'Fiestas de Palmares Costa Rica festival',
  'carnaval-las-tablas.jpg':
    'Carnaval Las Tablas Panama traditional costumes',

  'pepian.jpg': 'Pepian traditional Guatemalan stew',
  'jocon.jpg': 'Jocon Guatemalan chicken stew',
  'rellenitos.jpg': 'Rellenitos de platano Guatemala dessert',
  'belize-rice-and-beans.jpg':
    'Belize rice and beans coconut milk food',
  'fry-jacks.jpg': 'Belize fry jacks traditional food',
  'belize-stew-chicken.jpg': 'Belizean stew chicken rice and beans',
  'baleadas.jpg': 'Honduran baleadas traditional food',
  'sopa-caracol.jpg': 'Honduras sopa de caracol traditional soup',
  'nacatamales.jpg': 'Honduran nacatamales traditional food',
  'pupusas.jpg': 'Salvadoran pupusas traditional food',
  'yuca-frita.jpg': 'El Salvador yuca frita traditional dish',
  'tamales-salvadorenos.jpg': 'Tamales salvadorenos banana leaves',
  'gallo-pinto.jpg': 'Nicaragua gallo pinto rice beans',
  'vigoron.jpg': 'Nicaraguan vigoron yuca cabbage pork',
  'nacatamal.jpg': 'Nicaragua nacatamal traditional food',
  'casado.jpg': 'Costa Rican casado traditional meal',
  'olla-de-carne.jpg': 'Costa Rica olla de carne soup',
  'costa-rica-tamales.jpg': 'Costa Rican tamales banana leaves',
  'sancocho.jpg': 'Panamanian sancocho chicken soup',
  'hojaldres.jpg': 'Panamanian hojaldres fried bread',
  'carimanolas.jpg': 'Panamanian carimanolas cassava fritters',

  'maya-heritage.jpg': 'Maya traditional textiles Guatemala',
  'garifuna-culture.jpg': 'Garifuna traditional dance Belize',
  'lenca-crafts.jpg': 'Lenca traditional pottery Honduras',
  'el-salvador-art.jpg': 'El Salvador traditional crafts art',
  'marimba.jpg': 'Nicaragua marimba traditional music',
  'painted-oxcarts.jpg': 'Costa Rica traditional painted oxcarts',
  'pollera.jpg': 'Panama traditional pollera dress'
};

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

async function fileExists(file) {
  try {
    const stat = await fs.stat(file);
    return stat.isFile() && stat.size > 1000;
  } catch {
    return false;
  }
}

function imagePaths(data) {
  const paths = new Set();

  function scan(value) {
    if (!value || typeof value !== 'object') return;

    if (!Array.isArray(value)) {
      if (typeof value.image === 'string') {
        paths.add(value.image);
      }

      if (typeof value.hero_image === 'string') {
        paths.add(value.hero_image);
      }
    }

    if (Array.isArray(value)) {
      value.forEach(scan);
    } else {
      Object.values(value).forEach(scan);
    }
  }

  scan(data);

  return [...paths].filter(imagePath =>
    imagePath.startsWith('/images/central-america/')
  );
}

async function fetchWithRetry(url, options = {}) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await sleep(REQUEST_DELAY_MS);

      const response = await fetch(url, options);

      if (response.ok) {
        return response;
      }

      if (
        response.status === 429 ||
        response.status === 503 ||
        response.status >= 500
      ) {
        const retryAfter = Number(
          response.headers.get('retry-after')
        );

        const waitMs =
          Number.isFinite(retryAfter) && retryAfter > 0
            ? retryAfter * 1000
            : attempt * 10000;

        if (attempt < MAX_RETRIES) {
          console.log(
            `Temporary HTTP ${response.status}. Waiting ${Math.ceil(waitMs / 1000)} seconds before retry ${attempt + 1}/${MAX_RETRIES}...`
          );

          await sleep(waitMs);
          continue;
        }
      }

      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;

      if (attempt < MAX_RETRIES) {
        const waitMs = attempt * 5000;

        console.log(
          `Request error: ${error.message}. Retrying in ${waitMs / 1000} seconds (${attempt + 1}/${MAX_RETRIES})...`
        );

        await sleep(waitMs);
      }
    }
  }

  throw lastError ?? new Error('Request failed after retries');
}

async function searchCommons(term) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${term}`,
    gsrnamespace: '6',
    gsrlimit: '8',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '1200'
  });

  const response = await fetchWithRetry(
    `${API}?${params}`,
    {
      headers: {
        'User-Agent':
          'RutaHispanaImageSetup/1.1 (educational website image setup)'
      }
    }
  );

  const json = await response.json();
  const pages = Object.values(json.query?.pages ?? {});

  const allowed = pages.filter(page => {
    const info = page.imageinfo?.[0];
    const metadata = info?.extmetadata ?? {};
    const license = metadata.LicenseShortName?.value ?? '';

    return (
      info?.thumburl &&
      /CC BY|CC0|Public domain/i.test(license) &&
      !/NC|ND/i.test(license)
    );
  });

  return allowed[0] ?? null;
}

async function downloadImage(url, destination) {
  const response = await fetchWithRetry(url, {
    headers: {
      'User-Agent':
        'RutaHispanaImageSetup/1.1 (educational website image setup)'
    }
  });

  const bytes = Buffer.from(await response.arrayBuffer());

  if (bytes.length < 1000) {
    throw new Error('Downloaded file is too small to be a valid image');
  }

  // Verify that the downloaded content is an image.
  const isJpeg =
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff;

  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;

  const isWebp =
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP';

  if (!isJpeg && !isPng && !isWebp) {
    throw new Error(
      'Downloaded content is not a supported JPEG, PNG, or WebP image'
    );
  }

  // Keep the actual file extension consistent with its image format.
  const ext = isJpeg ? '.jpg' : isPng ? '.png' : '.webp';
  const finalDestination =
    path.join(
      path.dirname(destination),
      path.basename(destination, path.extname(destination)) + ext
    );

  await fs.writeFile(finalDestination, bytes);

  return path.basename(finalDestination);
}

async function main() {
  await fs.mkdir(IMAGE_DIR, { recursive: true });

  const data = JSON.parse(
    await fs.readFile(JSON_FILE, 'utf8')
  );

  const paths = imagePaths(data);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  const creditsPath = path.join(
    IMAGE_DIR,
    'IMAGE-CREDITS.txt'
  );

  const credits = [];

  console.log(`Found ${paths.length} image paths.`);
  console.log('Checking existing files and downloading missing images.\n');

  for (const imagePath of paths) {
    const filename = path.basename(imagePath);
    const destination = path.join(IMAGE_DIR, filename);

    if (await fileExists(destination)) {
      console.log(`Already exists: ${filename}`);
      skipped++;
      continue;
    }

    // Check for the same image with another supported extension.
    const stem = path.basename(filename, path.extname(filename));
    let existingAlternate = false;

    for (const ext of ['.jpg', '.png', '.webp']) {
      if (await fileExists(path.join(IMAGE_DIR, stem + ext))) {
        existingAlternate = true;
        console.log(
          `Image already exists in another format: ${stem + ext}`
        );
        break;
      }
    }

    if (existingAlternate) {
      skipped++;
      continue;
    }

    const term = SEARCH_TERMS[filename];

    if (!term) {
      console.log(`No search term configured: ${filename}`);
      failed++;
      continue;
    }

    try {
      console.log(`Searching for: ${filename}`);

      const page = await searchCommons(term);

      if (!page) {
        console.log(`No suitable image found: ${filename}`);
        failed++;
        continue;
      }

      const info = page.imageinfo[0];
      const actualFilename = await downloadImage(
        info.thumburl,
        destination
      );

      const metadata = info.extmetadata ?? {};

      credits.push([
        `Filename: ${actualFilename}`,
        `Title: ${page.title}`,
        `Artist: ${metadata.Artist?.value ?? 'See source page'}`,
        `License: ${metadata.LicenseShortName?.value ?? 'Check source page'}`,
        `Source: ${info.descriptionurl ?? ''}`,
        ''
      ].join('\n'));

      console.log(`Downloaded: ${actualFilename}`);
      downloaded++;
    } catch (error) {
      console.log(
        `Could not download ${filename}: ${error.message}`
      );
      failed++;
    }
  }

  // Append credits instead of erasing previous entries.
  if (credits.length > 0) {
    const oldCredits = await fs.readFile(
      creditsPath,
      'utf8'
    ).catch(() => '');

    await fs.writeFile(
      creditsPath,
      oldCredits +
        (oldCredits && !oldCredits.endsWith('\n\n') ? '\n' : '') +
        credits.join('\n'),
      'utf8'
    );
  }

  console.log('\nFinished!');
  console.log(`Downloaded this run: ${downloaded}`);
  console.log(`Already present: ${skipped}`);
  console.log(`Could not download: ${failed}`);
  console.log(`Images folder: ${IMAGE_DIR}`);
  console.log('Review the photographs and IMAGE-CREDITS.txt.');
}

main().catch(error => {
  console.error('\nSetup failed:', error.message);
  process.exitCode = 1;
});