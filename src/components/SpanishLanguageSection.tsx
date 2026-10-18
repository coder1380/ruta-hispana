'use client';

import React, { useState } from 'react';
import { SpanishComparisonItem, LearnedWord } from '@/types/country';
import { StudentBadge } from './StudentBadge';
import { SpanishTooltip } from './SpanishTooltip';
import { BookOpen, Volume2, Globe2, Sparkles, Search, Check } from 'lucide-react';

interface SpanishLanguageSectionProps {
  comparisonList: SpanishComparisonItem[];
  learnedWords: LearnedWord[];
  studentName?: string;
}

export const SpanishLanguageSection: React.FC<SpanishLanguageSectionProps> = ({
  comparisonList,
  learnedWords,
  studentName = 'Mateo Alva',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredWords = learnedWords.filter(
    (w) =>
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="idioma" className="py-16 sm:py-24 bg-[#F9F6F0] border-t border-[#E6DCCD] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-[#E6DCCD]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#C25B38]">
                Lingüística Comparada y Léxico · Spanish in Context
              </span>
              <StudentBadge studentName={studentName} role="Linguistics & Comparative Dialectology" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1C1917]">
              El Español: España vs. América Latina
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#57524E] max-w-2xl font-body">
              Understanding the peninsular dialect: how the usage of <SpanishTooltip word="vosotros" meaning="informal plural 'you' in Spain" />, ubiquitous affirmations like <SpanishTooltip word="vale" meaning="okay / sure / understood" />, and phonetics distinguish Spain from Spanish America.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="font-handwriting text-xl text-[#943A1E] block">
              &ldquo;Dos orillas de un mismo idioma&rdquo;
            </span>
            <span className="text-xs text-[#57524E]">7 Key grammatical and lexical contrasts</span>
          </div>
        </div>

        {/* 1. Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {comparisonList.map((item) => (
            <div
              key={item.feature}
              className="bg-[#FCFAF6] p-6 rounded-2xl border border-[#E6DCCD] shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#943A1E] block mb-2 font-display">
                  {item.feature}
                </span>

                {/* Peninsular vs LatAm Box */}
                <div className="space-y-2 mb-4 text-xs font-body">
                  <div className="p-2.5 rounded-lg bg-[#F4E8E2] border border-[#C25B38]/20">
                    <span className="font-bold text-[#943A1E] block">🇪🇸 España (Peninsular):</span>
                    <span className="text-[#1C1917] mt-0.5 block">{item.spain_usage}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#EEF3E6] border border-[#4A582F]/20">
                    <span className="font-bold text-[#354020] block">🌎 América Latina:</span>
                    <span className="text-[#1C1917] mt-0.5 block">{item.latin_america_usage}</span>
                  </div>
                </div>

                {/* Example sentence */}
                <div className="p-2.5 rounded-lg bg-[#F9F6F0] border border-[#E6DCCD] text-xs">
                  <span className="font-bold text-[#57524E] block text-[11px] uppercase">Ejemplo real:</span>
                  <p className="text-[#1C1917] italic font-serif mt-0.5">{item.example}</p>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-[#E6DCCD] text-[11px] text-[#57524E] font-body italic">
                {item.notes}
              </div>
            </div>
          ))}
        </div>

        {/* 2. Palabras que aprendí (25+ Distinct Spanish Words Pocketbook) */}
        <div className="bg-[#FCFAF6] rounded-3xl p-7 sm:p-10 border border-[#E6DCCD] shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E6DCCD]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 text-[#C25B38]" />
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  Palabras que Aprendí · Words I Learned
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#57524E] font-body">
                A personal student travel glossary of <strong>{learnedWords.length} essential Spanish cultural terms</strong> used throughout this assignment.
              </p>
            </div>

            {/* Vocabulary Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-[#57524E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar palabra..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#E6DCCD] bg-[#F9F6F0] text-xs font-body text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#C25B38]"
              />
            </div>
          </div>

          {/* Interactive Word Chips & Detail Explorer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Word Chips List (7 Cols) */}
            <div className="lg:col-span-7 flex flex-wrap gap-2 max-h-[400px] overflow-y-auto pr-2">
              {filteredWords.map((item, idx) => {
                const isSelected = item.word === (filteredWords[activeWordIndex] || filteredWords[0])?.word;
                return (
                  <button
                    key={item.word}
                    onClick={() => setActiveWordIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#943A1E] text-white shadow-xs font-semibold'
                        : 'bg-[#F9F6F0] border border-[#E6DCCD] text-[#1C1917] hover:border-[#C25B38]'
                    }`}
                  >
                    <span>{item.word}</span>
                    <span className="text-[10px] opacity-70">({item.part_of_speech.split(' ')[0]})</span>
                  </button>
                );
              })}
            </div>

            {/* Active Word Focus Card (5 Cols) */}
            <div className="lg:col-span-5 bg-[#F9F6F0] rounded-2xl p-6 border border-[#E6DCCD] shadow-xs">
              {filteredWords[activeWordIndex] ? (
                (() => {
                  const current = filteredWords[activeWordIndex];
                  return (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between pb-3 border-b border-[#E6DCCD]">
                        <div>
                          <span className="text-[11px] font-bold text-[#D99B26] uppercase tracking-wider">
                            {current.part_of_speech}
                          </span>
                          <h4 className="font-display text-2xl font-bold text-[#1C1917] mt-0.5">
                            {current.word}
                          </h4>
                          <p className="text-xs text-[#57524E] italic font-mono mt-0.5">
                            [{current.pronunciation}]
                          </p>
                        </div>
                        <button
                          onClick={() => speakText(current.word)}
                          className="p-2 rounded-full bg-[#FCFAF6] border border-[#E6DCCD] text-[#C25B38] hover:bg-[#C25B38] hover:text-white transition-colors"
                          title="Pronounce word"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-[#943A1E] block text-[11px] uppercase tracking-wider mb-1">
                          Significado · Meaning:
                        </span>
                        <p className="text-xs sm:text-sm text-[#1C1917] font-body leading-relaxed">
                          {current.meaning}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FCFAF6] border border-[#E6DCCD]">
                        <span className="text-xs font-bold text-[#57524E] block text-[11px] uppercase tracking-wider mb-1">
                          En contexto · Example:
                        </span>
                        <p className="text-xs sm:text-sm text-[#1C1917] italic font-serif leading-relaxed">
                          &ldquo;{current.example_sentence}&rdquo;
                        </p>
                      </div>

                      <div className="pt-2 text-[11px] text-[#57524E] flex items-center justify-between">
                        <span>Click speaker for peninsular pronunciation</span>
                        <span className="font-mono text-[#943A1E]">#0{activeWordIndex + 1} of {filteredWords.length}</span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p className="text-xs text-[#57524E]">No matching vocabulary word.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
