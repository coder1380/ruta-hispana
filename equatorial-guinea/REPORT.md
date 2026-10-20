# Equatorial Guinea country-data audit

**Reviewed:** 2026-10-19  
**Files:** `../data/countries/equatorial-guinea.json` (audited copy used by the site), `equatorial-guinea.original.json` (pre-audit snapshot), and `images/`.

## Summary

- Corrected 10 wrong, over-broad, or duplicated image assignments. Retained five image-bearing records using four unique files; the Presidential Palace is intentionally shared by the hero and its matching landmark.
- Ten visual records now have `image: null` because the prior photo depicted a different place, dish, event, or tradition, or because no source-verified photo could be downloaded.
- Cleared unsupported India-to-Equatorial Guinea route, duration, carrier, and INR-cost values rather than presenting estimates as verified facts.
- Updated the shared India-traveller card to read country-specific data and show explicit “not verified” fallbacks instead of hardcoded Schengen, flight, and euro-cost claims.
- Retained the existing JSON key structure. No `*_id` fields/references occur in this file.
- No unintended duplicate image hashes remain; the only repeated reference is the intentional hero/Presidential Palace image.
- **Still open:** original-resolution Wikimedia downloads, ten missing images, official Indian-passport visa guidance, current flights/costs, and several local culture/food/coordinate claims.

## Image audit

“Verified” means the local image was visually inspected and its source page, photographer, and reuse licence were checked. It does **not** imply that a smaller derivative is the source original; those cases are called out separately.

| Item | File | Subject matches? | Photographer | Licence | Source URL | Verified? |
|---|---|---|---|---|---|---|
| Hero | [malabo-palace-audit.jpg](./images/malabo-palace-audit.jpg) | Yes — source page identifies the Presidential Palace in Malabo | Ventosear | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons file](https://commons.wikimedia.org/wiki/File:Presidential_palace_in_malabo_equatorial_guinea.png) | Yes* |
| Presidential Palace | [malabo-palace-audit.jpg](./images/malabo-palace-audit.jpg) | Yes — same palace photo as the hero, intentionally shared | Ventosear | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons file](https://commons.wikimedia.org/wiki/File:Presidential_palace_in_malabo_equatorial_guinea.png) | Yes* |
| Malabo Waterfront | [malabo-city-audit.jpg](./images/malabo-city-audit.jpg) | Yes — Malabo shoreline/harbour view; broad rather than a named quay | Ben Sutherland | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Flickr photo](https://www.flickr.com/photos/60179301@N00/16492973176) | Yes |
| Pico Basilé | — | No verified Pico Basilé source. The former photo was Malabo waterfront; a plausible local mountain image lacked provenance/licence | — | — | — | No |
| Monte Alén National Park | — | No local file retained. The Commons source page identifies Monte Alén, but its original could not be downloaded | Mehlauge (candidate only) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) (candidate) | [Commons candidate](https://commons.wikimedia.org/wiki/File:Nationalpark_Monte_Al%C3%A9n.jpg) | No |
| Independence Day | — | No event-specific photo; the former image showed the Presidential Palace | — | — | — | No |
| Semana Santa | — | No event photo; the former image showed Malabo waterfront | — | — | — | No |
| Community and Patron-Saint Festivities | — | No in-country celebration photo; the former image shows Equatorial Guinea students at an international university festival in Beijing | — | — | — | No |
| Abalá | [abala-audit.jpg](./images/abala-audit.jpg) | Yes — leaf-wrapped Abalá; source identifies malanga, red palm oil, and salt | Miguel Obono | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons file](https://commons.wikimedia.org/wiki/File:Abala,_malanga_roja_aceite_palma_y_sal.jpg) | Yes* |
| Pepesup | — | No image retained; the former image depicted Abalá, not fish soup | — | — | — | No |
| Pollo con salsa de cacahuete | — | No image retained; the former image depicted Abalá, not chicken in peanut sauce | — | — | — | No |
| Mvet storytelling | — | No image verified as Fang Mvet performance; the former photo was a university booth/dance | — | — | — | No |
| Balélé dance | — | No image verified as Bubi Balélé; the former photo was a university booth/dance | — | — | — | No |
| Many languages, one country | — | No language-specific photo; the former image was a generic Malabo shoreline | — | — | — | No |
| Cultural exchange | [culture-festival-audit.jpg](./images/culture-festival-audit.jpg) | Yes — Equatorial Guinea students dancing in front of their booth at an international university festival in Beijing; fits this card's description | 颜邯 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Commons file](https://commons.wikimedia.org/wiki/File:International_Culture_Festival_of_UIBE,_booth_of_Equatorial_Guinea,_Apr_2018.jpg) | Yes* |

\* Subject, source photographer, and licence metadata are verified, but the local copy is smaller than the Commons original. Source/local dimensions: Palace 3185×1792 / 1600×900; Abalá 1846×1529 / 960×795; UIBE festival 5328×4000 / 1600×1201. Wikimedia original-file requests returned HTTP 429. The Malabo Flickr `_o` original-size URL returned HTTP 410; the available downloaded `_b` file is 1024×678.

The prior assignment reused Malabo city for four unrelated records and Abalá for three dishes; the source photo for Cultural Exchange was also wrongly applied to Mvet, Balélé, and domestic celebrations. Those assignments were removed. The image credit strings and `photo_credits` entries now describe only retained photos. No `license_url` key was added because that would alter the existing JSON shape; licence links are recorded above.

## Fact-check

| Claim | Status | Source URL | Finding / change |
|---|---|---|---|
| Mainland and Gulf of Guinea setting | Confirmed | [World Bank country overview](https://www.worldbank.org/en/country/equatorialguinea/overview) | The World Bank overview confirms the country’s mainland border/geographic setting and Gulf of Guinea context. The broad intro was retained. |
| Spanish, French, and Portuguese as official languages | Unverifiable | [Britannica country page](https://www.britannica.com/place/Equatorial-Guinea) | The listed Britannica page returned HTTP 403, and no accessible official constitutional source was verified. The wording was retained but should be checked against a current government source. |
| Central African CFA franc (XAF) | Unverifiable | — | Currency code was retained; no current central-bank or official currency source was opened in this audit. |
| Presidential Palace identity and coordinates | Corrected | [Commons Palace file](https://commons.wikimedia.org/wiki/File:Presidential_palace_in_malabo_equatorial_guinea.png) | The source metadata identifies the subject and Ventosear as photographer, with CC BY-SA 4.0. The photo was retained for both hero and landmark. The JSON coordinates are approximate and were not independently confirmed against an official map. |
| Pico Basilé and Monte Alén coordinates/descriptions | Unverifiable | [Commons Monte Alén photo candidate](https://commons.wikimedia.org/wiki/File:Nationalpark_Monte_Al%C3%A9n.jpg) | The Monte Alén photo description matches the park, but the file download was rate-limited. Neither location's supplied coordinates were independently confirmed from an authoritative mapping source; values were not silently changed. |
| Independence Day date, Semana Santa timing, local festivities | Unverifiable | — | The October 12 date and broad calendar descriptions were not checked against an accessible Equatorial Guinea government event calendar. Wording was retained; event images were removed where mismatched. |
| Abalá description and vegetarian status | Confirmed | [Commons Abalá file](https://commons.wikimedia.org/wiki/File:Abala,_malanga_roja_aceite_palma_y_sal.jpg) | The source file describes Abalá as Equatorial Guinean food and names malanga, red palm oil, and salt. Its listed ingredients are vegetarian; actual preparation should still be confirmed locally. |
| Pepesup and peanut-chicken descriptions/dietary status | Unverifiable | — | No authoritative local culinary source was found in this check. They remain described as fish soup and chicken in peanut sauce, with non-vegetarian flags, but recipes may vary. |
| Fang Mvet and Bubi Balélé cultural descriptions | Unverifiable | [UNESCO Equatorial Guinea state-party profile](https://whc.unesco.org/en/statesparties/gq) | The profile loaded but did not provide a usable source for these specific traditions in the reviewed content. No UNESCO inscription claim was added. A culture-specific primary source is still needed. |
| Indian-passport visa eligibility and eVisa portal | Corrected | [UK FCDO entry requirements](https://www.gov.uk/foreign-travel-advice/equatorial-guinea/entry-requirements); [linked eVisa portal](https://equatorialguinea-evisa.com/) | FCDO explicitly limits its rules to British citizen passports and says British visitors need a visa; it describes 90-day short-stay validity and 72-hour processing, and links the eVisa portal. This does **not** verify Indian eligibility or prove the portal's official ownership. The JSON remains cautious and labels FCDO guidance as British-passport-only. |
| India-to-Equatorial Guinea routes, duration, and carriers | Corrected | — | No current schedule evidence was verified. `flight_route`, `flight_duration`, and `flight_carriers` are now `null`; the note asks travelers to compare live schedules and transit requirements. |
| INR daily-cost range and calculation | Corrected | — | No reproducible current source or inputs were found. `cost_per_day_inr` and `cost_daily_range` are now `null`; no calculation is presented. |
| Shared India-traveller card | Corrected | [IndiaTraveller.tsx](../src/components/IndiaTraveller.tsx) | Removed fixed Schengen, European route/carrier, duration, and euro-cost labels; the card now uses the current country data and labels nulls as unverified. |
| Spanish phrases, terms, English meanings, and pronunciations | Unverifiable | — | The Spanish phrases and translations were checked for basic grammatical sense. English-style pronunciation guides are approximate, not IPA or native-speaker audio verification; region-specific usage needs a local language source. |

## Problems found (ranked)

1. **HIGH — Original-resolution downloads incomplete.** Wikimedia original-file requests returned HTTP 429. The Palace, Abalá, and Cultural Exchange copies are smaller derivatives; the exact differences are listed above. They should not be described as downloaded originals.
2. **MEDIUM — Ten image slots remain empty.** Pico Basilé, Monte Alén, three festivals, Pepesup, peanut chicken, Mvet, Balélé, and the languages card need distinct, subject-specific, openly licensed photos. Do not reuse the Malabo waterfront, Abalá, or UIBE booth images.
3. **MEDIUM — Indian travel details are not source-backed.** The FCDO page is for British passport holders, not Indian travellers. Portal ownership, current routes/carriers, and INR cost remain unverified; route/cost fields were nulled.
4. **MEDIUM — Several factual descriptions remain unverified.** Official language status, XAF currency, local holiday dates, exact place coordinates, and regional dish/tradition details need primary or authoritative sources.
5. **LOW — Existing Britannica reference is inaccessible to this fetcher.** It returned HTTP 403; that is not proof the page is dead, but it could not substantiate the language claims here.

## Open items for a human

- Obtain original-resolution Commons files through an allowed, non-rate-limited method and replace the three smaller copies.
- Find and inspect a properly licensed Pico Basilé photo and download the identified Monte Alén original; source distinct images for local festivals, Pepesup, peanut chicken, Mvet, Balélé, and languages.
- Confirm official-language status, currency, Independence Day/event dates, coordinates, and food/culture descriptions using government, local institutional, or subject-specialist sources.
- Ask Equatorial Guinea's consular mission responsible for India to confirm Indian ordinary-passport visa rules and the official visa application domain.
- Verify live Indian-origin flight options and obtain a dated, reproducible INR cost estimate before restoring any null values.
- Have a local Spanish speaker review country-specific vocabulary and pronunciation guides.
