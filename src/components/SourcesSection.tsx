'use client';

import React from 'react';
import { AcademicSource } from '@/types/country';
import { StudentBadge } from './StudentBadge';
import { BookOpen, AlertCircle, Link as LinkIcon, ExternalLink } from 'lucide-react';

interface SourcesSectionProps {
  sources: AcademicSource[];
  verificationNotes: string[];
  studentName?: string;
}

export const SourcesSection: React.FC<SourcesSectionProps> = ({
  sources,
  verificationNotes,
  studentName = 'Ruta Hispana Research Team',
}) => {
  return (
    <section id="fuentes" className="py-16 sm:py-24 bg-[#FCFAF6] border-t border-[#E6DCCD] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#E6DCCD]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#C25B38]">
                Rigor Académico y Bibliografía · Scholarly Citations
              </span>
              <StudentBadge studentName={studentName} role="Research & Academic Grounding" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1C1917]">
              Fuentes y Referencias · Bibliography
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#57524E] max-w-2xl font-body">
              Verified historical, literary, and linguistic foundations for this university assignment. Links are curated and placeholders left for student library IDs.
            </p>
          </div>
        </div>

        {/* Sources Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {sources.map((src, index) => (
            <div
              key={src.title}
              className="bg-[#F9F6F0] p-6 rounded-2xl border border-[#E6DCCD] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#57524E] mb-2">
                  <span className="font-bold text-[#943A1E] font-display">Reference [{index + 1}]</span>
                  {src.year && <span className="font-mono text-[#D99B26]">{src.year}</span>}
                </div>

                <h3 className="font-display text-xl font-bold text-[#1C1917] mb-1">
                  {src.title}
                </h3>

                <p className="text-xs font-semibold text-[#57524E] italic mb-2">
                  Author / Institution: {src.author_or_institution}
                </p>

                {src.note && (
                  <p className="text-xs text-[#1C1917] font-body leading-relaxed mb-3">
                    {src.note}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#E6DCCD] flex items-center justify-between text-xs text-[#57524E]">
                <span className="font-mono text-[11px] text-[#943A1E] truncate max-w-[280px]">
                  {src.url}
                </span>
                <span className="text-[10px] bg-[#FCFAF6] px-2 py-0.5 rounded border border-[#E6DCCD]">
                  Academic
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Verification Alert Box */}
        {verificationNotes && verificationNotes.length > 0 && (
          <div className="bg-[#F4E8E2] rounded-2xl p-6 border border-[#C25B38]/30 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-[#C25B38] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-[#943A1E]">
                Notas de Verificación (// VERIFY):
              </h4>
              <p className="text-xs text-[#1C1917] font-body leading-relaxed">
                The following facts have been flagged for ongoing review during upcoming term updates:
              </p>
              <ul className="list-disc list-inside text-xs text-[#57524E] font-mono space-y-1 pt-1">
                {verificationNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
