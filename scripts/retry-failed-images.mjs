import fs from 'fs';
import path from 'path';
import https from 'https';

// Only the failed images with fresh replacement URLs
const FAILED = [
  // Argentina
  { dir: 'argentina', file: 'recoleta.jpg',           url: 'https://images.unsplash.com/photo-1612086882903-f9a1a64a9b97?auto=format&fit=crop&w=800&q=80' },
  { dir: 'argentina', file: 'aconcagua.jpg',           url: 'https://images.unsplash.com/photo-1548534297-a2cca8e36b78?auto=format&fit=crop&w=800&q=80' },
  { dir: 'argentina', file: 'tilcara-carnaval.jpg',    url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80' },
  { dir: 'argentina', file: 'dulce-de-leche.jpg',      url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80' },
  // Paraguay
  { dir: 'paraguay',  file: 'itaipu-dam.jpg',          url: 'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?auto=format&fit=crop&w=800&q=80' },
  { dir: 'paraguay',  file: 'humaita.jpg',             url: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80' },
  { dir: 'paraguay',  file: 'sopa-paraguaya.jpg',      url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80' },
  { dir: 'paraguay',  file: 'chipa.jpg',               url: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=80' },
  // Chile
  { dir: 'chile',     file: 'marble-caves.jpg',        url: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=800&q=80' },
  { dir: 'chile',     file: 'empanadas-pino.jpg',      url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80' },
  { dir: 'chile',     file: 'humitas.jpg',             url: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=800&q=80' },
  // Uruguay
  { dir: 'uruguay',   file: 'palacio-salvo.jpg',       url: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=800&q=80' },
  { dir: 'uruguay',   file: 'la-mano.jpg',             url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80' },
  { dir: 'uruguay',   file: 'mate-uy.jpg',             url: 'https://images.unsplash.com/photo-1589401859787-c5c30a95897e?auto=format&fit=crop&w=800&q=80' },
];

function download(filename, url, targetDir) {
  return new Promise((resolve) => {
    const dest = path.join(targetDir, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
      console.log(`  [SKIP] ${filename}`);
      return resolve(true);
    }
    const file = fs.createWriteStream(dest);
    const fetch = (fetchUrl) => {
      https.get(fetchUrl, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close(); fs.unlink(dest, () => {});
          const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, fetchUrl).href;
          const nf = fs.createWriteStream(dest);
          https.get(next, (r2) => { r2.pipe(nf); nf.on('finish', () => { nf.close(); console.log(`  [OK] ${filename}`); resolve(true); }); }).on('error', (e) => { fs.unlink(dest, () => {}); console.warn(`  [FAIL] ${filename}: ${e.message}`); resolve(false); });
        } else if (res.statusCode === 200) {
          res.pipe(file);
          file.on('finish', () => { file.close(); console.log(`  [OK] ${filename}`); resolve(true); });
        } else {
          file.close(); fs.unlink(dest, () => {});
          console.warn(`  [FAIL] ${filename}: HTTP ${res.statusCode}`); resolve(false);
        }
      }).on('error', (err) => { file.close(); fs.unlink(dest, () => {}); console.warn(`  [FAIL] ${filename}: ${err.message}`); resolve(false); });
    };
    fetch(url);
  });
}

async function run() {
  let ok = 0, fail = 0;
  for (const { dir, file, url } of FAILED) {
    const targetDir = path.join(process.cwd(), 'public', 'images', dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    const result = await download(file, url, targetDir);
    if (result) ok++; else fail++;
  }
  console.log(`\n✅ Retry complete: ${ok} fixed / ${fail} still failed.`);
}

run().catch(console.error);
