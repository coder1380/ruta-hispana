# Dominican Republic country-data audit

**Reviewed:** 2026-10-19  
**Files:** `../data/countries/dominican-republic.json` (audited copy used by the site), `dominican-republic.original.json` (pre-audit snapshot), and `images/`.

## Summary

- Corrected 8 wrong, overly broad, or duplicated image assignments; corrected the hero photographer credit and added the Bachata source/credit.
- Kept 10 image-bearing records with 10 unique files. Seven visual records now have `image: null` because the available image was wrong, duplicated, not location-specific, or could not be sourced at the required standard.
- Cleared unsupported India-to-Dominican Republic route, duration, carrier, and INR-cost values rather than presenting estimates as verified facts.
- Updated the shared India-traveller card to read country-specific data and show explicit “not verified” fallbacks instead of hardcoded Schengen, flight, and euro-cost claims.
- Added UNESCO Bachata and RAE `guagua` sources; retained the existing JSON key structure. No `*_id` fields/references occur in this file.
- No hash duplicates remain among the files referenced by this JSON.
- **Still open:** original-resolution Wikimedia files for several retained photos; seven missing images; current flight/visa/cost evidence; several regional and event claims.

## Image audit

“Verified” below means the local image was visually inspected and its source page, photographer, and reuse licence were checked. It does **not** imply that a lower-resolution derivative is the source original; those cases are called out separately.

| Item | File | Subject matches? | Photographer | Licence | Source URL | Verified? |
|---|---|---|---|---|---|---|
| Hero | [dominican-landscape-audit.jpg](./images/dominican-landscape-audit.jpg) | Yes — Dominican Republic beach; not an identified Punta Cana beach | Sandra Cohen-Rose and Colin Rose | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Flickr photo](https://www.flickr.com/photos/73416633@N00/340189266) | Yes |
| Colonial City | — | No image retained; the former image showed the cathedral, not a representative city view | — | — | — | No |
| Catedral Primada de América | [santo-domingo-cathedral-audit.jpg](./images/santo-domingo-cathedral-audit.jpg) | Yes — cathedral and plaza | Reinhard Link | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | [Flickr photo](https://www.flickr.com/photos/129472585@N03/16896202791) | Yes |
| Los Haitises National Park | [los-haitises-audit.jpg](./images/los-haitises-audit.jpg) | Yes — source describes the park from San Lorenzo Bay | Anton Bielousov | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons file](https://commons.wikimedia.org/wiki/File:Los_Haitises_Park.jpeg) | Yes* |
| Pico Duarte | [pico-duarte-audit.jpg](./images/pico-duarte-audit.jpg) | Yes — Pico Duarte landscape | Adrian Michael | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons file](https://commons.wikimedia.org/wiki/File:Pico_Duarte.jpg) | Yes* |
| Punta Cana Coast | — | No image retained; the former beach photo was not specific to Punta Cana | — | — | — | No |
| Carnaval de Santo Domingo | — | No file retained. A matching “Califé” carnival photo was found, but its original could not be downloaded during the audit | Augusto Valdivia Tavárez (candidate only) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (candidate) | [Commons candidate](https://commons.wikimedia.org/wiki/File:Calif%C3%A9_urbano.jpg) | No |
| Carnaval de Santiago | — | No verified Santiago Carnival photo | — | — | — | No |
| Festival del Merengue | — | No event-specific photo; the former image showed a dance couple, not the festival | — | — | — | No |
| Día de Nuestra Señora de la Altagracia | — | No pilgrimage/event photo; the former image showed a Santo Domingo cathedral | — | — | — | No |
| Mangú | [mangu-audit.jpg](./images/mangu-audit.jpg) | Yes — mashed plantain | Ll1324 | [CC0](https://creativecommons.org/publicdomain/zero/1.0/) | [Commons file](https://commons.wikimedia.org/wiki/File:Dominican_Mangu.jpg) | Yes* |
| La Bandera Dominicana | [la-bandera-audit.jpg](./images/la-bandera-audit.jpg) | Yes — rice, beans, meat, and fried plantain | Funcheta | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons file](https://commons.wikimedia.org/wiki/File:Mega_Adventures_Dominican_Food.jpg) | Yes |
| Sancocho | [sancocho-audit.jpg](./images/sancocho-audit.jpg) | Yes — stew | LittleT889 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons file](https://commons.wikimedia.org/wiki/File:Sancocho_Dominicano.jpg) | Yes* |
| Merengue | [merengue-dance-audit.jpg](./images/merengue-dance-audit.jpg) | Yes — Dominican merengue dancers | Javier10 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Commons file](https://commons.wikimedia.org/wiki/File:Merengue_Dominicano.jpg) | Yes |
| Bachata | [bachata-quintet-audit.jpg](./images/bachata-quintet-audit.jpg) | Yes — Amargue Bachata Quintet and Andre Veloz | Mobilus In Mobili | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | [Commons file](https://commons.wikimedia.org/wiki/File:Amargue_Bachata_Quintet_with_Andre_Veloz_(22092585435).jpg) | Yes* |
| Muñecas sin rostro | [dominican-dolls-audit.jpg](./images/dominican-dolls-audit.jpg) | Yes — faceless dolls | Jose Elias (Jose Cruz) | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Flickr photo](https://www.flickr.com/photos/48941604@N06/8203683333) | Yes |
| Perico ripiao | — | No photo verified as a merengue típico ensemble; the former photo showed generic merengue dancers | — | — | — | No |

\* Subject and licensing metadata are verified, but the local file is a smaller copy than the source original. Wikimedia's original-file requests returned HTTP 429. The checked source/local dimensions are: Los Haitises 1920×1280 / 960×640; Pico Duarte 2419×1673 / 960×664; Mangú 2614×2246 / 1600×1375; Sancocho 4032×3024 / 1600×1200; Bachata quintet 4904×2052 / 1023×428. The Merengue and La Bandera files match the listed Commons source dimensions (500×332 and 500×478). Flickr original-size requests for the cathedral and dolls returned HTTP 410; the available downloaded files are 1024×576 and 1024×835. The hero original downloaded from Flickr is 2067×1717.

The image `credit` strings and `photo_credits` source records were corrected to the metadata shown on the source pages. No `license_url` property was added because it is not part of the existing JSON shape; the licence links are recorded above.

## Fact-check

| Claim | Status | Source URL | Finding / change |
|---|---|---|---|
| Santo Domingo Colonial City is UNESCO-listed; its grid influenced cities in the Americas | Confirmed | [UNESCO World Heritage listing 526](https://whc.unesco.org/en/list/526/) | The listing confirms the site and the model role of its grid. The caption and fun fact were retained. |
| Settlement/founding and grid dates | Confirmed | [UNESCO World Heritage listing 526](https://whc.unesco.org/en/list/526/) | The JSON makes no 1519 claim. UNESCO describes an eastern settlement in 1496, a founding by Bartholomew Columbus in 1498, and Ovando's west-bank grid in 1502; the grid-model wording is supported. |
| Merengue's Dominican identity and UNESCO inscription | Confirmed | [UNESCO ICH: Merengue](https://ich.unesco.org/en/RL/music-and-dance-of-the-merengue-in-the-dominican-republic-01162) | UNESCO confirms the tradition and its 2016 inscription; the source was retained. |
| Bachata origin and UNESCO status | Confirmed | [UNESCO ICH: Dominican Bachata](https://ich.unesco.org/en/RL/music-and-dance-of-bachata-in-the-dominican-republic-01514) | UNESCO describes Dominican bachata and its community context; it was inscribed in 2019. Added this source to `research_sources`. |
| Santo Domingo and Santiago Carnival timing | Unverifiable | [Dominican Republic Ministry of Tourism events path](https://www.godominicanrepublic.com/events/) | The official tourism URL redirected to a generic home page during this check; February was retained but is not independently verified here. Their incorrect/reused images were removed. |
| Festival del Merengue schedule and Altagracia Day event details | Unverifiable | [UNESCO ICH: Merengue](https://ich.unesco.org/en/RL/music-and-dance-of-the-merengue-in-the-dominican-republic-01162) | UNESCO confirms merengue festivals generally, but not the current Festival del Merengue schedule. The January 21 event detail was not verified against an accessible official calendar; values were not silently changed. |
| Mangú, La Bandera, Sancocho descriptions and dietary labels | Unverifiable | [Mangú image page](https://commons.wikimedia.org/wiki/File:Dominican_Mangu.jpg); [La Bandera image page](https://commons.wikimedia.org/wiki/File:Mega_Adventures_Dominican_Food.jpg); [Sancocho image page](https://commons.wikimedia.org/wiki/File:Sancocho_Dominicano.jpg) | The photos and source descriptions match the dishes. Recipes and vegetarian suitability vary; keep asking about broth, butter, toppings, and meat. Existing dietary labels remain qualified by the captions, not treated as guarantees. |
| Region-specific `signature_dish` assignments | Unverifiable | — | The dishes are plausible Dominican foods, but no authoritative regional source was found to establish that Mangú is Santiago-specific or Sancocho is Samaná-specific. No replacement was made. A Samaná seafood/coconut specialty is a possible lead, not a verified correction. |
| Currency/payment and best-season guidance | Unverifiable | — | DOP is retained; no current central-bank/payment source was opened. November–April is retained as a broad travel-season suggestion, not a guarantee; weather and hurricane advisories should be checked. |
| Indian-passport visa eligibility | Unverifiable | [Official tourism entry requirements](https://www.godominicanrepublic.com/travel/entry-requirements/) | This official page covers entry procedures and the e-ticket, not Indian-passport visa eligibility. The JSON correctly advises checking with consular authorities. |
| India-to-Dominican Republic route, duration, and carriers | Corrected | — | No current schedule source was verified. `flight_route`, `flight_duration`, and `flight_carriers` are now `null`; the note tells travelers to check live routes and transit rules. |
| INR daily-cost range and calculation | Corrected | — | No reproducible current source or inputs were found. `cost_per_day_inr` and `cost_daily_range` are now `null`; no calculation is presented. |
| Shared India-traveller card | Corrected | [IndiaTraveller.tsx](../src/components/IndiaTraveller.tsx) | Removed fixed Schengen, European route/carrier, duration, and euro-cost labels; the card now uses the current country data and labels nulls as unverified. |
| Spanish phrases, meanings, regional `guagua`, and pronunciations | Unverifiable | [RAE term URL](https://dle.rae.es/guagua) | The phrases and English meanings were reviewed, and the vegetarian pronunciation now represents both `-o/-a`. The RAE fetch returned generic resource text rather than the `guagua` entry; regional usage and every English-style pronunciation therefore remain unverified against the source. Pronunciation spellings are approximate, not IPA or native-speaker audio verification. |

## Problems found (ranked)

1. **HIGH — Original-resolution downloads incomplete.** Wikimedia returned HTTP 429 for original-file requests; three Flickr `_o` requests returned HTTP 410. Several retained Commons files are only smaller copies. They are identified with dimensions above; this audit does not claim they are source originals.
2. **MEDIUM — Seven image slots remain empty.** Colonial City, Punta Cana Coast, both Carnival entries, Festival del Merengue, Altagracia Day, and Perico ripiao need exact, reusable photos. A suitable Santo Domingo “Califé” candidate is documented but not downloaded.
3. **MEDIUM — India travel claims require current primary sources.** No Indian-passport visa determination, current routing/carriers, or reproducible INR budget was verified. Unsupported route/cost fields were nulled.
4. **MEDIUM — Regional dish associations and event schedules remain weakly sourced.** No dish was silently reassigned; current Carnival months and Altagracia event details need an official calendar.
5. **LOW — Pronunciation guides are approximate.** Grammar and translations were checked, but exact pronunciation requires a standard phonetic transcription or native-speaker/audio review.
6. **LOW — Some government URLs could not be independently opened.** The tourism entry page loaded; the e-ticket and migration sites returned access errors in the earlier check. That is not evidence that the pages are dead, but they could not be validated here.

## Open items for a human

- Obtain the source-original Commons files listed above through an allowed, non-rate-limited method, then replace the lower-resolution copies and recheck hashes.
- Source and inspect the seven missing image subjects. Do not use the general beach photo for Punta Cana or a generic dancer for an event/ensemble.
- Confirm February Carnival schedules, the Festival del Merengue calendar, and January 21 Altagracia observances from current official event sources.
- Verify Indian passport visa requirements, actual DEL/BOM routings, and a dated INR cost estimate from current primary sources before restoring any of those fields.
- Ask a Dominican culinary source or knowledgeable reviewer whether the four regional `signature_dish` choices are genuinely regional rather than national/popular dishes.
- Have a native speaker validate the English-style pronunciation guides if pronunciation precision is important.
