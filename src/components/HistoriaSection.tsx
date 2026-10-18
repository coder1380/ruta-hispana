'use client';

import React from 'react';
import { TimelineEvent } from '@/types/country';
import { StudentBadge } from './StudentBadge';
import { SpanishTooltip } from './SpanishTooltip';
import { Clock, BookOpen } from 'lucide-react';

interface HistoriaSectionProps {
  timeline: TimelineEvent[];
  studentName?: string;
}

export const HistoriaSection: React.FC<HistoriaSectionProps> = ({
  timeline,
  studentName = 'David Moreno',
}) => {
  return (
    <section id="historia" className="py-16 sm:py-24 bg-[#FCFAF6] border-t border-[#E6DCCD] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#E6DCCD]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#C25B38]">
                Cronología Histórica · Historical Timeline
              </span>
              <StudentBadge studentName={studentName} role="Historical Research & Archival Sources" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1C1917]">
              Historia en Breve · Key Turning Points
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#57524E] max-w-2xl font-body">
              Eight defining moments that forged Spain’s modern identity — from Islamic Córdoba and the Renaissance Golden Age to the democratic Constitution of 1978.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="font-handwriting text-xl text-[#943A1E] block">
              &ldquo;Conocer el pasado para entender la calle&rdquo;
            </span>
            <span className="text-xs text-[#57524E]">From Al-Ándalus to the 1992 Olympics</span>
          </div>
        </div>

        {/* Timeline Alternating Editorial Layout */}
        <div className="relative border-l-2 border-[#E6DCCD] ml-4 md:ml-32 space-y-12">
          {timeline.map((event, index) => (
            <div key={event.year} className="relative pl-6 md:pl-10 group">
              {/* Year marker badge on the line */}
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#FCFAF6] border-2 border-[#C25B38] flex items-center justify-center text-[11px] font-bold text-[#943A1E] shadow-xs group-hover:bg-[#C25B38] group-hover:text-white transition-colors">
                {index + 1}
              </div>

              {/* Event Content Box */}
              <div className="bg-[#F9F6F0] p-6 rounded-2xl border border-[#E6DCCD] shadow-xs hover:border-[#C25B38]/50 transition-colors">
                <div className="flex flex-wrap items-baseline gap-3 mb-1.5">
                  <span className="font-display font-bold text-lg sm:text-xl text-[#943A1E]">
                    {event.year}
                  </span>
                  <span className="text-xs font-semibold text-[#D99B26] uppercase tracking-wider">
                    {event.title_es}
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1C1917] mb-2">
                  {event.title}
                </h3>

                <p className="text-sm text-[#1C1917] font-body leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Magazine Pull-Quote */}
        <div className="mt-16 p-8 bg-[#F4EFE6] rounded-2xl border-l-4 border-[#C25B38]">
          <p className="font-display italic text-lg sm:text-xl text-[#1C1917] leading-relaxed">
            &ldquo;Spanish history is not a single linear narrative, but layers of Roman stone, Moorish plaster, Castilian law, and regional autonomies living side by side.&rdquo;
          </p>
          <span className="font-handwriting text-base text-[#943A1E] block mt-2 text-right">
            — Student Synthesis Notes · Spanish Civilization Seminar
          </span>
        </div>
      </div>
    </section>
  );
};
