const https = require('https');

async function searchCommons(query) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=' + encodeURIComponent(query) + '&gsrlimit=5&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1200&format=json';

  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'MundoHispanoApp/1.0 (educational research; samagata17)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages || {};
          const results = Object.values(pages).map(p => {
            const info = p.imageinfo?.[0] || {};
            const meta = info.extmetadata || {};
            return {
              title: p.title,
              url: info.thumburl || info.url,
              originalUrl: info.url,
              descriptionurl: info.descriptionurl,
              width: info.width,
              height: info.height,
              size: info.size,
              artist: meta.Artist?.value?.replace(/<[^>]*>/g, '').trim(),
              license: meta.LicenseShortName?.value || meta.License?.value,
              credit: meta.Credit?.value?.replace(/<[^>]*>/g, '').trim(),
              description: meta.ImageDescription?.value?.replace(/<[^>]*>/g, '').trim()?.slice(0, 150)
            };
          });
          resolve(results);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const queries = [
    'Spanish omelette',
    'Tortilla de patatas',
    'Gazpacho andaluz',
    'Pimientos de Padron'
  ];
  for (const q of queries) {
    console.log('=== ' + q + ' ===');
    const res = await searchCommons(q);
    res.forEach((r, i) => {
      console.log(`[${i + 1}] ${r.title}`);
      console.log(`    URL: ${r.url}`);
      console.log(`    Original URL: ${r.originalUrl}`);
      console.log(`    Description URL: ${r.descriptionurl}`);
      console.log(`    Artist: ${r.artist}`);
      console.log(`    License: ${r.license}`);
      console.log(`    Desc: ${r.description}`);
    });
  }
}
main();
