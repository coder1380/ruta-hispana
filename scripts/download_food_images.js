const https = require('https');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'spain', 'food');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const dishes = [
  {
    filename: 'paella-valenciana.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/01_Paella_Valenciana_original.jpg/1280px-01_Paella_Valenciana_original.jpg',
    title: 'Paella Valenciana'
  },
  {
    filename: 'tortilla-de-patatas.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Tortilla_de_Patatas_%28Corte_transversal%29.jpg/1280px-Tortilla_de_Patatas_%28Corte_transversal%29.jpg',
    title: 'Tortilla de Patatas'
  },
  {
    filename: 'gazpacho-andaluz.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Gazpacho_Cazuela_Barro.jpg/1280px-Gazpacho_Cazuela_Barro.jpg',
    title: 'Gazpacho Andaluz'
  },
  {
    filename: 'pimientos-de-padron.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ae/Gebratene_Pimientos_de_Padr%C3%B3n.jpg/1280px-Gebratene_Pimientos_de_Padr%C3%B3n.jpg',
    title: 'Pimientos de Padrón'
  },
  {
    filename: 'pan-con-tomate.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Pa_amb_tom%C3%A0quet_-_001.jpg/1280px-Pa_amb_tom%C3%A0quet_-_001.jpg',
    title: 'Pan con Tomate'
  },
  {
    filename: 'churros-con-chocolate.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Chocolate_con_churros_de_lazo.jpg/1280px-Chocolate_con_churros_de_lazo.jpg',
    title: 'Churros con Chocolate'
  }
];

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchBuffer(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function processAll() {
  for (const item of dishes) {
    console.log(`Downloading ${item.title}...`);
    try {
      const rawBuf = await fetchBuffer(item.url);
      const outPath = path.join(targetDir, item.filename);

      // Compress to ~150-250 KB
      await sharp(rawBuf)
        .resize({ width: 1000, height: 750, fit: 'cover' })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(outPath);

      const stats = fs.statSync(outPath);
      console.log(`✓ Saved ${item.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`✗ Error processing ${item.title}:`, err.message);
    }
  }
}

processAll();
