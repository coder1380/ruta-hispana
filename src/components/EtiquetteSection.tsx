'use client';

import React from 'react';
import { EtiquetteItem } from '@/types/country';
import { StudentBadge } from './StudentBadge';
import { SpanishTooltip } from './SpanishTooltip';
import { Check, X, Clock, Coffee, Sparkles } from 'lucide-react';

interface EtiquetteSectionProps {
  etiquetteList: EtiquetteItem[];
  studentName?: string;
}

export const EtiquetteSection: React.FC<EtiquetteSectionProps> = ({
  etiquetteList,
  studentName = 'Lucia Rivas',
}) => {
  return (
    <section id="etiqueta" className="py-16 sm:py-24 bg-[#FCFAF6] border-t border-[#E6DCCD] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#E6DCCD]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#C25B38]">
                Normas Sociales y Ritmos · Social Codes
              </span>

            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1C1917]">
              Etiqueta y Costumbres · The Daily Rhythm
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#57524E] max-w-2xl font-body">
              How Spaniards structure daily life, from the non-negotiable two-hour lunch to the sacred art of the <SpanishTooltip word="sobremesa" meaning="lingering conversation after dining" />.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="font-handwriting text-xl text-[#943A1E] block">
              &ldquo;No hay prisa en la mesa&rdquo;
            </span>
            <span className="text-xs text-[#57524E]">Linger at the table; hurry is considered impolite</span>
          </div>
        </div>

        {/* Etiquette Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {etiquetteList.map((item) => (
            <div
              key={item.topic}
              className="bg-[#F9F6F0] p-6 rounded-2xl border border-[#E6DCCD] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E6DCCD]">
                  <h3 className="font-display text-xl font-bold text-[#1C1917]">
                    {item.topic}
                  </h3>
                  <span className="text-xs font-semibold text-[#C25B38] font-body italic">
                    {item.topic_es}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#1C1917] font-body leading-relaxed mb-4">
                  {item.rule}
                </p>

                {/* Do and Don't Chips */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 bg-[#EEF3E6] p-2.5 rounded-lg border border-[#4A582F]/20 text-[#354020]">
                    <Check className="w-4 h-4 text-[#4A582F] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Haz esto (Do): </span>
                      <span className="font-body">{item.do_tip}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-[#F4E8E2] p-2.5 rounded-lg border border-[#C25B38]/20 text-[#943A1E]">
                    <X className="w-4 h-4 text-[#C25B38] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Evita esto (Don&apos;t): </span>
                      <span className="font-body">{item.dont_tip}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
