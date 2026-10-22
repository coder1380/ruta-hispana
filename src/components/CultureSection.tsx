'use client';

import React from 'react';
import { FestivalEvent } from '@/types/country';
import { StudentBadge } from './StudentBadge';
import { SpanishTooltip } from './SpanishTooltip';
import { Calendar, MapPin, Flame, Volume2, Sparkles } from 'lucide-react';

interface CultureSectionProps {
  fiestas: FestivalEvent[];
  studentName?: string;
}

export const CultureSection: React.FC<CultureSectionProps> = ({
  fiestas,
  studentName = 'Carlos Mendez',
}) => {
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <section id="culture" className="py-16 sm:py-24 bg-[#F9F6F0] border-t border-[#E6DCCD] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#E6DCCD]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#C25B38]">
                Calendario Festivo · Celebrations
              </span>

            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1C1917]">
              Fiestas del Año · Festival Calendar
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#57524E] max-w-2xl font-body">
              In Spain, festivals are collective emotional releases where whole towns take over the streets. Dates and one-line summaries of the iconic celebrations.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="font-handwriting text-xl text-[#943A1E] block">
              &ldquo;La calle es de todos&rdquo;
            </span>
            <span className="text-xs text-[#57524E]">The streets belong to everyone during fiestas</span>
          </div>
        </div>

        {/* Calendar Grid with exact dates and 1-line taglines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fiestas.map((fest) => (
            <div
              key={fest.name}
              className="bg-[#FCFAF6] p-6 rounded-2xl border border-[#E6DCCD] shadow-xs hover:border-[#C25B38]/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E6DCCD]">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#943A1E] font-display">
                    <Calendar className="w-3.5 h-3.5 text-[#C25B38]" />
                    {fest.date_or_month}
                  </span>
                  <span className="text-[11px] font-mono text-[#57524E] bg-[#F4EFE6] px-2 py-0.5 rounded">
                    {fest.city_region}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-2xl font-bold text-[#1C1917]">
                    {fest.name}
                  </h3>
                  <button
                    onClick={() => speakText(fest.name)}
                    className="p-1 text-[#943A1E] hover:bg-[#F4EFE6] rounded-full transition-colors"
                    title="Pronounce festival"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Exactly one line description as requested */}
                <p className="text-xs sm:text-sm text-[#1C1917] font-body leading-relaxed">
                  {fest.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E6DCCD] flex items-center justify-between text-[11px] text-[#57524E]">
                <span className="font-semibold text-[#D99B26]">Celebración Tradicional</span>
                <span className="font-handwriting text-sm text-[#C25B38]">Patrimonio Popular</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
