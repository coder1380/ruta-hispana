'use client';

import React from 'react';
import { ArtLiteratureFigure, MusicDanceItem, FutbolCulture } from '@/types/country';
import { StudentBadge } from './StudentBadge';
import { SpanishTooltip } from './SpanishTooltip';
import { Palette, Music, Trophy, Sparkles } from 'lucide-react';

interface CultureArtsSectionProps {
  artFigures: ArtLiteratureFigure[];
  musicItems: MusicDanceItem[];
  futbol: FutbolCulture;
  studentName?: string;
}

export const CultureArtsSection: React.FC<CultureArtsSectionProps> = ({
  artFigures,
  musicItems,
  futbol,
  studentName = 'Carlos Mendez',
}) => {
  return (
    <section id="arte-cultura" className="py-16 sm:py-24 bg-[#F9F6F0] border-t border-[#E6DCCD] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#E6DCCD]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#C25B38]">
                Expresión y Creatividad · Arts, Rhythm & Passion
              </span>

            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1C1917]">
              Arte, Música y Fútbol · Cultural Expressions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#57524E] max-w-2xl font-body">
              How Spain thinks, moves, and celebrates — through canonical literature, visual genius, flamenco rhythm, and the social drama of the stadium.
            </p>
          </div>
        </div>

        {/* 1. Arte y Literatura: 5 Key Figures (One Line Each) */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5 text-[#C25B38]" />
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1C1917]">
              Arte y Literatura · Masters of Word and Canvas
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artFigures.map((fig) => (
              <div
                key={fig.name}
                className="bg-[#FCFAF6] p-6 rounded-2xl border border-[#E6DCCD] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#57524E] mb-2">
                    <span className="font-semibold text-[#D99B26]">{fig.epoch}</span>
                    <span className="font-mono text-[10px] bg-[#F4EFE6] px-2 py-0.5 rounded text-[#943A1E]">
                      {fig.field.split('(')[0].trim()}
                    </span>
                  </div>

                  <h4 className="font-display text-xl font-bold text-[#1C1917] mb-1">
                    {fig.name}
                  </h4>

                  <p className="text-xs font-semibold text-[#943A1E] italic mb-3">
                    Obra cumbre: {fig.work}
                  </p>

                  {/* One-line focused summary */}
                  <p className="text-xs sm:text-sm text-[#1C1917] font-body leading-relaxed">
                    {fig.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Asymmetric Two-Column: Música y Baile (Left) + Fútbol (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Música y Baile (6 Cols) */}
          <div className="lg:col-span-6 bg-[#FCFAF6] p-7 rounded-2xl border border-[#E6DCCD] shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <Music className="w-5 h-5 text-[#4A582F]" />
              <h3 className="font-display text-2xl font-bold text-[#1C1917]">
                Música y Baile · Sound & Movement
              </h3>
            </div>

            <div className="space-y-6">
              {musicItems.map((item) => (
                <div key={item.name} className="pb-5 border-b border-[#E6DCCD] last:border-b-0 last:pb-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="font-display text-lg font-bold text-[#943A1E]">
                      {item.name}
                    </h4>
                    <span className="text-xs text-[#57524E] italic font-medium">
                      {item.origin}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1C1917] font-body leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E6DCCD]">
              <span className="font-handwriting text-base text-[#943A1E] block">
                &ldquo;El duende cannot be learned; it burns in the soles of the dancer&apos;s shoes.&rdquo;
              </span>
            </div>
          </div>

          {/* Fútbol y Sociedad (6 Cols) */}
          <div className="lg:col-span-6 bg-[#FCFAF6] p-7 rounded-2xl border border-[#E6DCCD] shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-[#D99B26]" />
              <h3 className="font-display text-2xl font-bold text-[#1C1917]">
                Fútbol y Sociedad · More Than a Sport
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#943A1E] block mb-1">
                  {futbol.rivalry_name}
                </span>
                <p className="text-xs sm:text-sm text-[#1C1917] font-body leading-relaxed">
                  {futbol.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E6DCCD]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#57524E] block mb-2">
                  Rituales en las Calles y Terrazas:
                </span>
                <ul className="space-y-2 text-xs text-[#1C1917] font-body">
                  {(futbol.traditions || []).map((trad: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#F9F6F0] p-2.5 rounded-lg border border-[#E6DCCD]/60">
                      <span className="text-[#C25B38] font-bold">·</span>
                      <span>{trad}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-[#E6DCCD]">
                <span className="font-handwriting text-base text-[#4A582F] block">
                  On matchday, town plazas empty as generations gather around tavern televisions.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
