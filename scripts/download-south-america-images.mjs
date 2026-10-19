import fs from 'fs';
import path from 'path';
import https from 'https';

const COUNTRIES = [
  {
    dir: 'argentina',
    images: {
      'hero-argentina.jpg':       'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1600&q=80',
      'perito-moreno.jpg':        'https://images.unsplash.com/photo-1531761535209-180857e963b9?auto=format&fit=crop&w=800&q=80',
      'iguazu-falls.jpg':         'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
      'la-boca.jpg':              'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?auto=format&fit=crop&w=800&q=80',
      'recoleta.jpg':             'https://images.unsplash.com/photo-1574710067629-5e1d3a48ade4?auto=format&fit=crop&w=800&q=80',
      'quebrada-humahuaca.jpg':   'https://images.unsplash.com/photo-1584646098378-0f5cf6a1e1e8?auto=format&fit=crop&w=800&q=80',
      'aconcagua.jpg':            'https://images.unsplash.com/photo-1560764016-954e45f3e2f1?auto=format&fit=crop&w=800&q=80',
      'ushuaia.jpg':              'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=800&q=80',
      'tango-festival.jpg':       'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=800&q=80',
      'vendimia.jpg':             'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?auto=format&fit=crop&w=800&q=80',
      'cosquin.jpg':              'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      'carnaval-gualeguaychu.jpg':'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?auto=format&fit=crop&w=800&q=80',
      'tilcara-carnaval.jpg':     'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80',
      'dia-independencia.jpg':    'https://images.unsplash.com/photo-1569974498991-d3c12a504f95?auto=format&fit=crop&w=800&q=80',
      'asado.jpg':                'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
      'empanadas.jpg':            'https://images.unsplash.com/photo-1604702433776-c5e58ebb2b74?auto=format&fit=crop&w=800&q=80',
      'locro.jpg':                'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
      'medialunas.jpg':           'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      'dulce-de-leche.jpg':       'https://images.unsplash.com/photo-1621236378699-8597faf6a176?auto=format&fit=crop&w=800&q=80',
      'mate.jpg':                 'https://images.unsplash.com/photo-1566454825481-9c9cb8ebabbd?auto=format&fit=crop&w=800&q=80',
      'tango-dance.jpg':          'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
      'gaucho.jpg':               'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?auto=format&fit=crop&w=800&q=80',
      'futbol.jpg':               'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      'literature.jpg':           'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    }
  },
  {
    dir: 'paraguay',
    images: {
      'hero-paraguay.jpg':        'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1600&q=80',
      'trinidad-ruins.jpg':       'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80',
      'itaipu-dam.jpg':           'https://images.unsplash.com/photo-1581022999880-cf7d15c06f48?auto=format&fit=crop&w=800&q=80',
      'palacio-lopez.jpg':        'https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=800&q=80',
      'caacupe.jpg':              'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80',
      'cerro-koi.jpg':            'https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?auto=format&fit=crop&w=800&q=80',
      'chaco-park.jpg':           'https://images.unsplash.com/photo-1504387103978-e4ee71416c38?auto=format&fit=crop&w=800&q=80',
      'humaita.jpg':              'https://images.unsplash.com/photo-1571863533956-01c88e79957e?auto=format&fit=crop&w=800&q=80',
      'caacupe-fiesta.jpg':       'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      'carnaval-encarnacion.jpg': 'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?auto=format&fit=crop&w=800&q=80',
      'festival-folklore.jpg':    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
      'san-juan-py.jpg':          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'semana-santa-py.jpg':      'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80',
      'dia-heroes.jpg':           'https://images.unsplash.com/photo-1569974498991-d3c12a504f95?auto=format&fit=crop&w=800&q=80',
      'sopa-paraguaya.jpg':       'https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?auto=format&fit=crop&w=800&q=80',
      'chipa.jpg':                'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&w=800&q=80',
      'bori-bori.jpg':            'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
      'mbeju.jpg':                'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
      'asado-py.jpg':             'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
      'terere.jpg':               'https://images.unsplash.com/photo-1566454825481-9c9cb8ebabbd?auto=format&fit=crop&w=800&q=80',
      'arpa-paraguaya.jpg':       'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80',
      'guarani-language.jpg':     'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
      'nanduti.jpg':              'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      'jesuit-missions.jpg':      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    }
  },
  {
    dir: 'chile',
    images: {
      'hero-chile.jpg':           'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=1600&q=80',
      'torres-del-paine.jpg':     'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
      'valle-luna.jpg':           'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&w=800&q=80',
      'easter-island-moai.jpg':   'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      'valparaiso.jpg':           'https://images.unsplash.com/photo-1597524678053-5ad788b26c0b?auto=format&fit=crop&w=800&q=80',
      'tatio-geysers.jpg':        'https://images.unsplash.com/photo-1531761535209-180857e963b9?auto=format&fit=crop&w=800&q=80',
      'marble-caves.jpg':         'https://images.unsplash.com/photo-1612818608570-34e36c8b77aa?auto=format&fit=crop&w=800&q=80',
      'salar-atacama.jpg':        'https://images.unsplash.com/photo-1584646098378-0f5cf6a1e1e8?auto=format&fit=crop&w=800&q=80',
      'festival-vina.jpg':        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      'tapati.jpg':               'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80',
      'vendimia-chile.jpg':       'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?auto=format&fit=crop&w=800&q=80',
      'semana-valdiviana.jpg':    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'fiestas-patrias.jpg':      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
      'ano-nuevo-valparaiso.jpg': 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=800&q=80',
      'cazuela.jpg':              'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
      'empanadas-pino.jpg':       'https://images.unsplash.com/photo-1604702433776-c5e58ebb2b74?auto=format&fit=crop&w=800&q=80',
      'pastel-choclo.jpg':        'https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?auto=format&fit=crop&w=800&q=80',
      'completo.jpg':             'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      'humitas.jpg':              'https://images.unsplash.com/photo-1502998070258-dc1338445ac2?auto=format&fit=crop&w=800&q=80',
      'pebre.jpg':                'https://images.unsplash.com/photo-1563865436874-9aef32095fad?auto=format&fit=crop&w=800&q=80',
      'cueca-dance.jpg':          'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
      'rapa-nui.jpg':             'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      'mapuche.jpg':              'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      'nueva-cancion.jpg':        'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80',
    }
  },
  {
    dir: 'uruguay',
    images: {
      'hero-uruguay.jpg':         'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1600&q=80',
      'colonia-historica.jpg':    'https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=800&q=80',
      'cabo-polonio.jpg':         'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=800&q=80',
      'mercado-puerto.jpg':       'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
      'palacio-salvo.jpg':        'https://images.unsplash.com/photo-1574710067629-5e1d3a48ade4?auto=format&fit=crop&w=800&q=80',
      'la-mano.jpg':              'https://images.unsplash.com/photo-1583779457306-fb45f9588eb1?auto=format&fit=crop&w=800&q=80',
      'lunarejo.jpg':             'https://images.unsplash.com/photo-1504387103978-e4ee71416c38?auto=format&fit=crop&w=800&q=80',
      'ciudad-vieja.jpg':         'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=800&q=80',
      'carnaval-montevideo.jpg':  'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?auto=format&fit=crop&w=800&q=80',
      'festival-tacuarembo.jpg':  'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
      'semana-criolla.jpg':       'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?auto=format&fit=crop&w=800&q=80',
      'muestra-teatro.jpg':       'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      'llamadas.jpg':             'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80',
      'dia-patrimonio.jpg':       'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80',
      'chivito.jpg':              'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      'asado-uy.jpg':             'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
      'tortas-fritas.jpg':        'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?auto=format&fit=crop&w=800&q=80',
      'alfajores.jpg':            'https://images.unsplash.com/photo-1621236378699-8597faf6a176?auto=format&fit=crop&w=800&q=80',
      'mate-uy.jpg':              'https://images.unsplash.com/photo-1566454825481-9c9cb8ebabbd?auto=format&fit=crop&w=800&q=80',
      'milanesa.jpg':             'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',
      'candombe-culture.jpg':     'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=800&q=80',
      'murga-culture.jpg':        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      'gaucho-uy.jpg':            'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?auto=format&fit=crop&w=800&q=80',
      'tango-uy.jpg':             'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    }
  }
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
          file.close();
          fs.unlink(dest, () => {});
          const next = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, fetchUrl).href;
          const newFile = fs.createWriteStream(dest);
          https.get(next, (r2) => {
            r2.pipe(newFile);
            newFile.on('finish', () => { newFile.close(); console.log(`  [OK] ${filename}`); resolve(true); });
          }).on('error', (e) => { fs.unlink(dest, () => {}); console.warn(`  [FAIL] ${filename}: ${e.message}`); resolve(false); });
        } else if (res.statusCode === 200) {
          res.pipe(file);
          file.on('finish', () => { file.close(); console.log(`  [OK] ${filename}`); resolve(true); });
        } else {
          file.close();
          fs.unlink(dest, () => {});
          console.warn(`  [FAIL] ${filename}: HTTP ${res.statusCode}`);
          resolve(false);
        }
      }).on('error', (err) => {
        file.close();
        fs.unlink(dest, () => {});
        console.warn(`  [FAIL] ${filename}: ${err.message}`);
        resolve(false);
      });
    };

    fetch(url);
  });
}

async function run() {
  let total = 0, done = 0, skipped = 0, failed = 0;
  for (const country of COUNTRIES) {
    const targetDir = path.join(process.cwd(), 'public', 'images', country.dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const count = Object.keys(country.images).length;
    total += count;
    console.log(`\n=== ${country.dir.toUpperCase()} — ${count} images ===`);
    for (const [filename, url] of Object.entries(country.images)) {
      const ok = await download(filename, url, targetDir);
      if (ok) done++; else failed++;
    }
  }
  console.log(`\n✅ Done! ${done} downloaded / ${failed} failed out of ${total} total.`);
}

run().catch(console.error);
