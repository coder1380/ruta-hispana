# Mundo Hispano · Exploración Creativa del Mundo Hispano

**Mundo Hispano** is an interactive, AI-powered travel and cultural guide web application built for our University Spanish coursework: *Creative Exploration of the Hispanic World*.

Featuring **Spain, Puerto Rico, Central America, Cuba, the Dominican Republic, and Equatorial Guinea** with a country-agnostic architecture driven by JSON country guides.

---

## Key Features

1. **Bilingual Design with Interactive Tooltips**:
   - Navigation and headings are bilingual (e.g., *Comida · Food*, *Mapa · Map*, *Cultura · Culture*).
   - Body text is in English with key Spanish cultural terms bolded. Hovering over any term reveals an interactive tooltip with its definition and an audio pronunciation button.
2. **Hero & Frase del Día**:
   - Bilingual title with quick country stats.
   - Interactive *Frase del Día* (Phrase of the Day) card with phonetic pronunciation and Web Speech API audio playback.
3. **Interactive Country Maps**:
   - Country pages show their regions and landmarks with location markers.
   - Clicking a region fetches a grounded, AI-generated cultural blurb via the server.
4. **Comida · Food (3D Flip Cards)**:
   - Interactive 3D flip cards with Spanish dish names on the front and concise taglines (max 8 words) on the back.
   - A 🌱 indicator marks dishes that are vegetarian-friendly.
5. **Cultura · Culture**:
   - Country-specific *Fiestas*, music, dance, crafts, and landmarks with sourced captions.
6. **AI Trip Planner (Strict JSON)**:
   - Configurable inputs for trip duration (1–7 days), budget in Indian Rupees (INR), traveler interests, and a strictly vegetarian toggle.
   - Server-side route calls Gemini and returns a day-by-day itinerary as strict JSON, grounded in the selected country's local data.
7. **"Habla con tu Guía" Chatbot**:
   - Persona-driven assistant (*Mateo*) with a language mode switch: **English**, **Mixed · Bilingüe**, or **Español (Spanish-heavy)**.
8. **Indian Traveller's Guide (Consejos para la India)**:
   - Country-specific entry checks, connecting-flight guidance, indicative daily INR budgets, and vegetarian food phrases for Indian travellers.
9. **Visible Research and Attribution**:
   - Country guides display source links, verification caveats, research reflections, and photo credits with license/source links.
10. **Academic Attribution Badges**:
   - Each section features a customizable **"Built by [Student Name]"** badge showcasing individual student contributions.

---

## Project Structure

```text
ruta-hispana/
├── data/
│   └── countries/
│       ├── spain.json
│       ├── puertorico.json
│       ├── central-america.json
│       ├── cuba.json
│       ├── dominican-republic.json
│       └── equatorial-guinea.json
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts       # Mateo guide chatbot endpoint
│   │   │   ├── planner/route.ts    # AI trip planner endpoint (strict JSON)
│   │   │   └── region/route.ts     # Regional cultural blurb endpoint
│   │   ├── globals.css             # Spanish color tokens, 3D flip card utilities
│   │   ├── layout.tsx              # SEO metadata, layout wrapper
│   │   └── page.tsx                # Country landing page assembling the selected guide
│   ├── components/
│   │   ├── CultureSection.tsx      # Festivals & Landmarks cards
│   │   ├── FoodSection.tsx         # 3D Flip cards for gastronomy & drinks
│   │   ├── Footer.tsx              # University project credits & teammate instructions
│   │   ├── GuideChatbot.tsx        # Mateo chatbot with language mode selector
│   │   ├── HeroSection.tsx         # Hero banner & Frase del Día
│   │   ├── IndiaTraveller.tsx      # Visa, flight, budget INR, & veg tips
│   │   ├── MapSection.tsx          # Interactive SVG map & AI blurb panel
│   │   ├── Navbar.tsx              # Bilingual header & country selector
│   │   ├── SpanishTooltip.tsx      # Hover tooltip & text parser
│   │   └── StudentBadge.tsx        # Student contribution badge
│   ├── lib/
│   │   ├── countries.ts            # Country loader (country-agnostic)
│   │   └── gemini.ts               # Gemini API client, memory cache & prompt rules
│   └── types/
│       └── country.ts              # TypeScript schemas for country datasets
├── .env.example
├── package.json
└── tsconfig.json
```

---

## How Teammates Can Add New Countries

The application supports multiple country datasets:
1. Add a JSON file to `data/countries/` using the shape of `spain.json` as a reference.
2. Include an `id`, `name`, and `name_es`, plus the page sections (`regions`, `lugares`, `fiestas`, `comida`, and `cultura`).
3. Add any referenced image files under `public/` at the paths in the JSON.
4. Add five words to each of the four section vocabulary arrays and five more to `viaje_palabras` for 25 terms total. Bold terms in English prose as `**palabra** (meaning)` to activate the hover tooltip.
5. Provide visible `research_sources`, `india_traveller` notes where relevant, photo credits with source URLs, and verification notes for estimates or changing rules.
6. Restart the development server if it was already running, then choose the country from the menu in the page header. Spain remains the default at `/`; other country pages use `/?country=<id>`.

---

## Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: If no API key is provided, the application runs in offline fallback mode using local country-guide data.)*

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

---

## University Assignment Attribution

| Section | Feature | Student Contributor |
| :--- | :--- | :--- |
| **Hero & Frase del Día** | Linguistic design, quote engine, Web Speech API | Maya Patel |
| **Interactive Map** | SVG peninsular map & AI regional grounding | Liam Vance |
| **Comida · Food** | 3D flip card animations, food taxonomy, veg badges | Sofia Morales |
| **Cultura · Culture** | Festival & monument cards, filter controls | Carlos Mendez |
| **AI Trip Planner** | Strict JSON schema, prompt engineering, INR budgets | Priya Sharma |
| **Habla con tu Guía** | Conversational guide persona, language mode toggles | Elena Gomez |
| **Consejos para la India** | Cross-cultural logistics, visa, and flight research | Rohan Verma |

---

## Deploy to Cloudflare Workers

This project uses OpenNext to run the full Next.js app, including its API routes, on Cloudflare Workers. Country data is bundled at build time, and Next.js image optimization is disabled so the deployment does not require a paid Cloudflare Images binding.

### Test the Cloudflare build locally

```bash
npm install
npm run preview:cloudflare
```

The preview runs in the Workers runtime. Check the country selector and the chat and trip-planner tools before deploying.

### Connect the repository to Cloudflare

1. Push this repository and its `package-lock.json` to GitHub.
2. In Cloudflare, open **Workers & Pages** → **Create application** → **GitHub**, authorize access, and select this repository.
3. Set the Worker name to `mundo-hispano` to match `wrangler.jsonc`.
4. Configure the build command as `npm run build:cloudflare` and the deploy command as `npm run deploy:cloudflare`. Set the root directory to `/` if Cloudflare asks.
5. Save and deploy. Cloudflare will rebuild and deploy the Worker whenever you push to the configured production branch.
6. In the Worker’s **Settings** → **Variables and Secrets**, add `GEMINI_API_KEY` as a secret if you want live Gemini responses. It is optional; the app has offline fallback responses. Do not add the key as a build variable or commit it.
7. Add a custom domain from the Worker’s **Settings** when you are ready to use one.

The checked-in `.dev.vars.example` is a safe template for local Worker secrets. Copy it to `.dev.vars` and add your key there for local testing; `.dev.vars` is ignored by Git.
