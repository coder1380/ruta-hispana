'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CountryVisualData } from '@/types/country';
import { Volume2, RefreshCw, MapPin, Coins, Calendar, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  country: CountryVisualData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ country }) => {
  const [scrollY, setScrollY] = useState(0);
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);

  const phrases = country.daily_phrases.map(({ es, en, pronunciation }) => ({
    es,
    en,
    pron: pronunciation,
  }));

  const phrase = phrases[currentPhraseIdx];

  // Slow parallax on background image
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNextPhrase = () => {
    setCurrentPhraseIdx((prev) => (prev + 1) % phrases.length);
  };

  const speakPhrase = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <section className="relative bg-cream pt-6 pb-12 sm:pb-16 text-ink overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner with Parallax Photo */}
        <div className="relative rounded-3xl overflow-hidden border border-sand shadow-md bg-azulejo min-h-[400px] sm:min-h-[500px] flex flex-col justify-end p-6 sm:p-10 lg:p-14">
          {/* Parallax Background Image */}
          <div
            className="absolute inset-0 w-full h-[125%] -top-[12%] pointer-events-none transition-transform duration-75 ease-out will-change-transform"
            style={{
              transform: `translate3d(0, ${scrollY * 0.14}px, 0)`,
            }}
          >
            <Image
              src={country.hero_image}
              alt={country.name}
              fill
              priority
              className="object-cover opacity-65 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
          </div>

          {/* Gradient Overlay for confident readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-azulejo via-azulejo/60 to-transparent pointer-events-none" />

          {/* Top Stamp / Assignment Ribbon */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex flex-wrap items-center gap-2">
            <span className="animate-stamp px-3 py-1 rounded-full bg-cream/95 text-xs font-bold tracking-widest uppercase text-terracotta font-display border border-terracotta/20 shadow-xs">
              Cuaderno de Viaje · Student Journal
            </span>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-azulejo/90 text-xs text-cream font-mono border border-cream/20">
              Creative Exploration of the Hispanic World
            </span>
          </div>

          {/* Hero Content with Line-by-Line Reveal */}
          <div className="relative z-10 max-w-3xl space-y-4">
            {/* Line 1: Subtitle stamp */}
            <div className="reveal-line-1 flex items-center gap-3">
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-saffron font-display">
                {country.name_es} · Travel & Culture
              </span>
            </div>

            {/* Line 2: Large Confident Heading */}
            <h1 className="reveal-line-2 font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-cream leading-[0.95]">
              {country.name_es}{' '}
              <span className="text-saffron font-handwriting text-3xl sm:text-5xl font-normal">
                · {country.name}
              </span>
            </h1>

            {/* Line 3: English travel summary with embedded Spanish keywords & tooltips */}
            <p className="reveal-line-3 text-sm sm:text-lg text-cream/90 font-body max-w-2xl leading-relaxed">
              Explore {country.name} through its historic landmarks, local festivals, regional food traditions, and living culture.
            </p>

            {/* Quick Badges stamped in */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-body">
              <span className="animate-stamp inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream/95 text-ink font-semibold shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                Capital: <strong>{country.capital}</strong>
              </span>
              <span className="animate-stamp inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream/95 text-ink font-semibold shadow-xs">
                <Coins className="w-3.5 h-3.5 text-saffron" />
                Moneda: <strong>{country.currency}</strong>
              </span>
              <span className="animate-stamp inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream/95 text-ink font-semibold shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-terracotta" />
                Best Season: <strong>{country.best_time_to_visit}</strong>
              </span>
            </div>
          </div>

          {/* Photo Credit bottom right */}
          <div className="absolute bottom-3 right-4 z-10 text-[10px] text-cream/60 font-body">
            {country.hero_credit}
          </div>
        </div>

        {/* Daily Phrase Card (Single short phrase with translation right next to it) */}
        <div className="mt-6 bg-sand/70 rounded-2xl p-4 sm:p-5 border border-sand shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta font-display">
                  Frase del Día · Useful Street Expression
                </span>
                <span className="text-[10px] text-ink/60 font-mono">
                  ({currentPhraseIdx + 1}/{phrases.length})
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                <span className="font-display text-lg sm:text-xl font-bold text-ink">
                  &ldquo;{phrase.es}&rdquo;
                </span>
                <span className="text-xs sm:text-sm text-terracotta font-semibold">
                  &mdash; {phrase.en}
                </span>
                <span className="text-xs text-ink/60 font-mono">
                  [{phrase.pron}]
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => speakPhrase(phrase.es)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-terracotta text-cream hover:bg-terracotta/90 transition-colors text-xs font-semibold cursor-pointer shadow-xs"
              title="Listen to pronunciation"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen</span>
            </button>
            <button
              onClick={handleNextPhrase}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-terracotta/30 bg-cream text-ink hover:text-terracotta transition-colors text-xs font-semibold cursor-pointer shadow-xs"
              title="Next expression"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Next</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
