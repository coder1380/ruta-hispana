'use client';

import React from 'react';
import Image from 'next/image';
import { CultureTraditionItem, SpanishWordItem } from '@/types/country';
import { PalabrasStrip } from './PalabrasStrip';
import { MapPin, Sparkles } from 'lucide-react';

interface CulturaVisualSectionProps {
  cultura: CultureTraditionItem[];
  palabras: SpanishWordItem[];
  studentName?: string;
}

export const CulturaVisualSection: React.FC<CulturaVisualSectionProps> = ({
  cultura,
  palabras,
  studentName = 'Lucia Rivas',
}) => {
  const traditionPhrases: Record<string, { es: string; en: string }> = {
    flamenco: { es: 'Con mucho duende.', en: 'With deep inner soul.' },
    castells: { es: 'Força i equilibri.', en: 'Strength & balance.' },
    sardana: { es: 'Danza en corro.', en: 'Circular town dance.' },
    jota: { es: '¡A bailar!', en: 'Let’s dance!' },
  };

  return (
    <section id="cultura" className="py-16 sm:py-24 bg-cream text-ink scroll-mt-16 border-t border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-sand">
          <div>
            <span className="animate-stamp inline-block text-xs font-bold tracking-widest uppercase text-terracotta font-display px-2.5 py-1 rounded-full bg-sand/60 border border-sand mb-2">
              Sección 04 · Heritage & Dance
            </span>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-ink mt-1">
              Cultura · Living Traditions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-ink/80 max-w-2xl font-body">
              Four living expressions: passionate Andalusian song, towering human towers, and regional communal dances.
            </p>
          </div>

          <div className="text-right hidden sm:block shrink-0">
            <span className="font-handwriting text-2xl text-terracotta block">
              &ldquo;El cuerpo expresa lo que el pueblo siente&rdquo;
            </span>
            <span className="text-xs text-ink/70">4 living expressions</span>
          </div>
        </div>

        {/* 4 Compact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cultura.map((item, idx) => {
            const descLines = item.description.split('\n');
            const tiltClass = idx % 2 === 0 ? 'photo-hover-tilt' : 'photo-hover-tilt-alt';
            const phrase = traditionPhrases[item.id] || { es: 'Tradición viva.', en: 'Living tradition.' };

            return (
              <div
                key={item.id}
                className="bg-sand/40 rounded-2xl overflow-hidden border border-sand shadow-xs hover:border-terracotta transition-colors duration-300 flex flex-col justify-between group"
              >
                {/* Image */}
                <div className={`relative w-full h-52 overflow-hidden bg-sand ${tiltClass}`}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-60" />

                  {/* Origin Tag */}
                  <div className="animate-stamp absolute bottom-3 left-3 bg-cream/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold text-ink border border-sand flex items-center gap-1 shadow-xs">
                    <MapPin className="w-3 h-3 text-terracotta" />
                    <span>{item.origin}</span>
                  </div>
                </div>

                {/* Content Box (Exactly 2 Lines description) */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-ink mb-2 group-hover:text-terracotta transition-colors">
                      {item.name}
                    </h3>
                    <div className="space-y-1 text-xs sm:text-sm text-ink/80 font-body leading-relaxed">
                      {descLines.map((line, lIdx) => (
                        <p key={lIdx}>{line}</p>
                      ))}
                    </div>
                  </div>

                  {/* Single short phrase with inline translation */}
                  <div className="mt-4 pt-3 border-t border-sand">
                    <p className="text-xs text-terracotta font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <strong className="font-display">{phrase.es}</strong>
                      <span className="text-ink/60">&mdash; {phrase.en}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Palabras Strip */}
        <PalabrasStrip words={palabras} sectionName="Cultura · Culture" variant="light" />
      </div>
    </section>
  );
};
