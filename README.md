# Ruta Hispana · Exploración Creativa del Mundo Hispano

**Ruta Hispana** is an interactive, AI-powered travel and cultural guide web application built for our University Spanish coursework: *Creative Exploration of the Hispanic World*.

Currently featuring **Spain (España)** with a fully country-agnostic modular architecture designed so teammates can add additional Spanish-speaking countries (Mexico, Argentina, Colombia, Peru, etc.) simply by adding a single JSON file.

---

## Key Features (Spain Section)

1. **Bilingual Design with Interactive Tooltips**:
   - Navigation and headings are bilingual (e.g., *Comida · Food*, *Mapa · Map*, *Cultura · Culture*).
   - Body text is in English with key Spanish cultural terms bolded. Hovering over any term reveals an interactive tooltip with its definition and an audio pronunciation button.
2. **Hero & Frase del Día**:
   - Bilingual title with quick country stats.
   - Interactive *Frase del Día* (Phrase of the Day) card with phonetic pronunciation and Web Speech API audio playback.
3. **Interactive Map of Spain**:
   - SVG map covering the 5 core autonomous communities: **Madrid**, **Catalonia**, **Andalusia**, **Basque Country**, and **Valencia**.
   - Clicking a region fetches a grounded, AI-generated cultural blurb via the server.
4. **Comida · Food (3D Flip Cards)**:
   - Interactive 3D flip cards with Spanish dish names on the front and concise taglines (max 8 words) on the back.
   - Vegetarian indicator (🌱) highlighting meatless classics like *Tortilla Española* and *Gazpacho Andaluz*.
   - Featured national drink: *Horchata de Chufa*.
5. **Cultura · Culture**:
   - Card showcases for Spain's top *Fiestas* (e.g., La Tomatina, Feria de Abril) and *Monumentos* (e.g., Sagrada Família, La Alhambra).
   - Filterable by category with month/city tags.
6. **AI Trip Planner (Strict JSON)**:
   - Configurable inputs for trip duration (1–7 days), budget in Indian Rupees (INR), traveler interests, and a strictly vegetarian toggle.
   - Server-side route calls Gemini and returns a day-by-day itinerary as strict JSON, fully grounded in `spain.json`.
7. **"Habla con tu Guía" Chatbot**:
   - Persona-driven assistant (*Mateo*) with a language mode switch: **English**, **Mixed · Bilingüe**, or **Español (Spanish-heavy)**.
8. **Indian Traveller's Guide (Consejos para la India)**:
   - Practical guidance on Schengen visa applications via BLS International, direct and 1-stop flight routes from India, daily INR budget guidelines, and vegetarian food phrases (*"Sin carne, sin jamón, sin pescado"*).
9. **Academic Attribution Badges**:
   - Each section features a customizable **"Built by [Student Name]"** badge showcasing individual student contributions.

---

## Project Structure

```text
ruta-hispana/
├── data/
│   └── countries/
│       └── spain.json          # Source of truth for Spain (schema reference)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts       # Mateo guide chatbot endpoint
│   │   │   ├── planner/route.ts    # AI trip planner endpoint (strict JSON)
│   │   │   └── region/route.ts     # Regional cultural blurb endpoint
│   │   ├── globals.css             # Spanish color tokens, 3D flip card utilities
│   │   ├── layout.tsx              # SEO metadata, layout wrapper
│   │   └── page.tsx                # Spain landing page assembling all components
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

The application is built to be **country-agnostic**:
1. Duplicate `data/countries/spain.json` and rename it to your target country (e.g., `mexico.json`, `argentina.json`, `peru.json`).
2. Populate the fields matching the schema (`name`, `name_es`, `region_groups`, `famous_foods`, `festivals`, `landmarks`, etc.).
3. The country loader in `src/lib/countries.ts` will automatically load your country!

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
   *(Note: If no API key is provided, the application runs in offline fallback mode using verified local knowledge from `spain.json`.)*

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
