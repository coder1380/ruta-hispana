import fs from 'fs';
import path from 'path';
import https from 'https';

const IMAGES = {
  'hero-spain.jpg': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1600&q=80',
  'sagrada-familia.jpg': 'https://images.unsplash.com/photo-1583779457306-fb45f9588eb1?auto=format&fit=crop&w=800&q=80',
  'alhambra.jpg': 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80',
  'park-guell.jpg': 'https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?auto=format&fit=crop&w=800&q=80',
  'prado-museum.jpg': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  'plaza-mayor.jpg': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80',
  'mezquita.jpg': 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
  'guggenheim.jpg': 'https://images.unsplash.com/photo-1569974498991-d3c12a504f95?auto=format&fit=crop&w=800&q=80',
  'tomatina.jpg': 'https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&w=800&q=80',
  'fallas.jpg': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  'san-fermin.jpg': 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
  'semana-santa.jpg': 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
  'feria-abril.jpg': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
  'san-juan.jpg': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'paella.jpg': 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80',
  'tortilla.jpg': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',
  'gazpacho.jpg': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
  'padron.jpg': 'https://images.unsplash.com/photo-1563865436874-9aef32095fad?auto=format&fit=crop&w=800&q=80',
  'pan-tomate.jpg': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
  'churros.jpg': 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=800&q=80',
  'flamenco.jpg': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
  'castells.jpg': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
  'sardana.jpg': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  'jota.jpg': 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
};

const TARGET_DIR = path.join(process.cwd(), 'public', 'images', 'spain');

function download(filename, url) {
  return new Promise((resolve) => {
    const dest = path.join(TARGET_DIR, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`[SKIP] ${filename} already exists`);
      return resolve(true);
    }

    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (redirectRes) => {
          redirectRes.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`[OK] ${filename} downloaded (via redirect)`);
            resolve(true);
          });
        }).on('error', () => resolve(false));
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[OK] ${filename} downloaded`);
          resolve(true);
        });
      }
    }).on('error', (err) => {
      console.warn(`[FAIL] ${filename}: ${err.message}`);
      fs.unlink(dest, () => {});
      resolve(false);
    });
  });
}

async function run() {
  for (const [filename, url] of Object.entries(IMAGES)) {
    await download(filename, url);
  }
  console.log('Download complete.');
}

run();
