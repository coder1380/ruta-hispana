'use client';

import React from 'react';
import Image from 'next/image';
import { FestivalItem, SpanishWordItem } from '@/types/country';
import { PalabrasStrip } from './PalabrasStrip';
import { renderBilingualContent } from './SpanishTooltip';
import { StudentBadge } from './StudentBadge';
import { Calendar } from 'lucide-react';

interface FiestasVisualSectionProps {
  fiestas: FestivalItem[];
  palabras: SpanishWordItem[];
  studentName?: string;
}

export const FiestasVisualSection: React.FC<FiestasVisualSectionProps> = ({
  fiestas,
  palabras,
  studentName = 'Carlos Mendez',
}) => {
  return (
    <section id="fiestas" className="py-20 sm:py-28 bg-azulejo text-cream scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-cream/20">
          <div>
            <span className="animate-stamp inline-block text-xs font-bold tracking-widest uppercase text-saffron font-display px-2.5 py-1 rounded-full bg-cream/10 border border-cream/20 mb-2">
              Sección 02 · Celebrations
            </span>
            <div className="mb-2">
              <StudentBadge studentName={studentName} role="Festival research" />
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-cream mt-1">
              Fiestas · Street Festivals
            </h2>
            <p className="mt-2 text-sm sm:text-base text-cream/80 max-w-2xl font-body">
              {fiestas.length} celebrations bring music, dance, and community traditions into public spaces.
            </p>
          </div>

          <div className="text-right hidden sm:block shrink-0">
            <span className="font-handwriting text-2xl text-saffron block">
              &ldquo;La fiesta se vive en la calle&rdquo;
            </span>
            <span className="text-xs text-cream/70">Stamped annual calendar</span>
          </div>
        </div>

        {/* 6 Fiestas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fiestas.map((fest, idx) => {
            const tiltClass = idx % 2 === 0 ? 'photo-hover-tilt' : 'photo-hover-tilt-alt';

            return (
              <div
                key={fest.id}
                className="bg-[#152943] rounded-2xl overflow-hidden border border-cream/15 shadow-sm hover:border-saffron transition-colors duration-300 flex flex-col justify-between group"
              >
                {/* Photo Container */}
                <div className={`relative w-full h-60 sm:h-64 overflow-hidden bg-[#0F1E32] ${tiltClass}`}>
                  <Image
                    src={fest.image}
                    alt={fest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#152943] via-transparent to-transparent opacity-60" />

                  {/* Stamp-Style Month Badge with Scale Bounce */}
                  <div className="animate-stamp absolute top-3 right-3 bg-saffron text-ink px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase font-display shadow-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-ink" />
                    <span>{fest.month.split(' ')[0]}</span>
                  </div>

                  {/* Town Tag */}
                  <div className="absolute bottom-3 left-3 bg-azulejo/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-medium text-cream border border-cream/20">
                    {fest.town_region}
                  </div>
                </div>

                {/* Caption & Info */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-cream mb-1 group-hover:text-saffron transition-colors">
                      {fest.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-cream/80 font-body leading-relaxed">
                      {renderBilingualContent(fest.caption)}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-cream/10 flex items-center justify-between text-xs text-cream/60 font-body">
                    <span className="italic">{fest.credit}</span>
                    <span className="font-handwriting text-base text-saffron">
                      {fest.month.includes('(') ? fest.month.split('(')[1].replace(')', '') : 'Annual'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Palabras Strip (Dark Variant for Azulejo) */}
        <PalabrasStrip words={palabras} sectionName="Fiestas · Festivals" variant="dark" />
      </div>
    </section>
  );
};
