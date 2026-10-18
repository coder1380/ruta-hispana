import { getCountryData } from '@/lib/countries';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { MapSection } from '@/components/MapSection';
import { LugaresSection } from '@/components/LugaresSection';
import { FiestasVisualSection } from '@/components/FiestasVisualSection';
import { ComidaVisualSection } from '@/components/ComidaVisualSection';
import { CulturaVisualSection } from '@/components/CulturaVisualSection';
import { TravelToolsSection } from '@/components/TravelToolsSection';
import { WavyDivider } from '@/components/WavyDivider';
import { MarqueeStrip } from '@/components/MarqueeStrip';
import { Footer } from '@/components/Footer';

export default function Home() {
  const country = getCountryData('spain');

  return (
    <div className="flex flex-col min-h-screen bg-cream text-ink font-body">
      <Navbar currentCountry={country.id} />

      <main className="flex-1">
        {/* 1. Hero Banner: Parallax Photo, Line-by-Line Reveal, Phrase Card */}
        <HeroSection country={country} />

        {/* Transition: Cream to Sand */}
        <WavyDivider fillColor="#EBDDC0" bgColor="#F5ECD9" />

        {/* 2. Cartografía: Leaflet Map with OpenStreetMap warm tiles, dropping pins, pulsing circles */}
        <MapSection regions={country.regions} landmarks={country.lugares} />

        {/* Looping Marquee Vocabulary Strip */}
        <MarqueeStrip theme="sand" />

        {/* Transition: Sand to Cream */}
        <WavyDivider fillColor="#F5ECD9" bgColor="#EBDDC0" flipped />

        {/* 3. Lugares · Places: 7 landmarks with hover tilt & zoom, max 12-word captions + Palabras strip */}
        <LugaresSection
          lugares={country.lugares}
          palabras={country.lugares_palabras}
          studentName="Liam Vance"
        />

        {/* Transition: Cream to Full-Bleed Azulejo (#1E3A5F) */}
        <WavyDivider fillColor="#1E3A5F" bgColor="#F5ECD9" />

        {/* 4. Fiestas · Festivals: Full-bleed contrast section with cream text, saffron stamps */}
        <FiestasVisualSection
          fiestas={country.fiestas}
          palabras={country.fiestas_palabras}
          studentName="Carlos Mendez"
        />

        {/* Transition: Azulejo to Sand */}
        <WavyDivider fillColor="#EBDDC0" bgColor="#1E3A5F" />

        {/* 5. Comida · Food: 6 dishes 3D flip tiles on hover/tap, max 8-word captions, veg tags + Palabras strip */}
        <ComidaVisualSection
          comida={country.comida}
          palabras={country.comida_palabras}
          studentName="Sofia Morales"
        />

        {/* Looping Marquee Vocabulary Strip */}
        <MarqueeStrip theme="cream" />

        {/* Transition: Sand to Cream */}
        <WavyDivider fillColor="#F5ECD9" bgColor="#EBDDC0" flipped />

        {/* 6. Cultura · Culture: 4 compact living tradition cards with 2-line descriptions + Palabras strip */}
        <CulturaVisualSection
          cultura={country.cultura}
          palabras={country.cultura_palabras}
          studentName="Lucia Rivas"
        />

        {/* Transition: Cream to Sand */}
        <WavyDivider fillColor="#EBDDC0" bgColor="#F5ECD9" />

        {/* 7. Travel Tools: Quiet secondary drawer for Trip Planner and Mateo */}
        <TravelToolsSection />
      </main>

      {/* Footer with Photo Credits & Cartography Attribution */}
      <Footer photoCredits={country.photo_credits} />
    </div>
  );
}
