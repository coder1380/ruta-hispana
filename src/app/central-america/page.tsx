import { getCountryData } from '@/lib/countries';
import { getAllCountries } from '@/lib/countries';
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

export default function CentralAmericaPage() {
  const country = getCountryData('central-america');
  const countries = getAllCountries();

  return (
    <div className="flex flex-col min-h-screen bg-cream text-ink font-body">
      <Navbar currentCountry={country} countries={countries} />

      <main className="flex-1">
        <HeroSection country={country} />

        <WavyDivider fillColor="#EBDDC0" bgColor="#F5ECD9" />

        <MapSection
          countryName={country.name_es}
          regions={country.regions}
          landmarks={country.lugares}
          currentCountry={country.id}
          
        />

        <MarqueeStrip theme="sand" />

        <WavyDivider
          fillColor="#F5ECD9"
          bgColor="#EBDDC0"
          flipped
        />

        <LugaresSection
          countryName={country.name}
          lugares={country.lugares}
          palabras={country.lugares_palabras}
          studentName="Your Name"
          currentCountry={country.id}
        />

        <WavyDivider fillColor="#1E3A5F" bgColor="#F5ECD9" />

        <FiestasVisualSection
          fiestas={country.fiestas}
          palabras={country.fiestas_palabras}
          studentName="Your Name"
        />

        <WavyDivider fillColor="#EBDDC0" bgColor="#1E3A5F" />

        <ComidaVisualSection
          comida={country.comida}
          palabras={country.comida_palabras}
          studentName="Your Name"
        />

        <MarqueeStrip theme="cream" />

        <WavyDivider
          fillColor="#F5ECD9"
          bgColor="#EBDDC0"
          flipped
        />

        <CulturaVisualSection
          cultura={country.cultura}
          palabras={country.cultura_palabras}
          studentName="Your Name"
        />

        <WavyDivider fillColor="#EBDDC0" bgColor="#F5ECD9" />

        <TravelToolsSection countryId={country.id} countryName={country.name} />
      </main>

      <Footer photoCredits={country.photo_credits} />
    </div>
  );
}