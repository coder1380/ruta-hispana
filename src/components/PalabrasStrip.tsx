'use client';

import React from 'react';
import { SpanishWordItem } from '@/types/country';
import { Volume2, BookMarked } from 'lucide-react';

interface PalabrasStripProps {
  words: SpanishWordItem[];
  sectionName: string;
  variant?: 'light' | 'dark';
}

export const PalabrasStrip: React.FC<PalabrasStripProps> = ({
  words,
  sectionName,
  variant = 'light',
}) => {
  const speakText = (word: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && word) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85;

      window.speechSynthesis.speak(utterance);
    }
  };

  const isDark = variant === 'dark';

  // Remove invalid entries so empty vocabulary cards aren't rendered.
  const validWords = (words ?? []).filter(
    (item) =>
      item &&
      typeof item.word === 'string' &&
      item.word.trim().length > 0
  );

  return (
    <div
      className={`mt-10 pt-5 rounded-2xl p-4 sm:p-6 border transition-colors ${
        isDark
          ? 'bg-[#152943] border-cream/20 text-cream'
          : 'bg-cream/90 border-terracotta/20 text-ink'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <BookMarked
            className={`w-4 h-4 ${
              isDark ? 'text-saffron' : 'text-terracotta'
            }`}
          />

          <span
            className={`font-display font-bold text-xs uppercase tracking-wider ${
              isDark ? 'text-saffron' : 'text-terracotta'
            }`}
          >
            Palabras de la sección · Spanish Vocabulary ({sectionName})
          </span>
        </div>

        <span
          className={`font-handwriting text-sm ${
            isDark ? 'text-cream/70' : 'text-ink/70'
          }`}
        >
          Hover term or click speaker for pronunciation
        </span>
      </div>

      {validWords.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {validWords.map((item, index) => (
            <div
              key={`${item.word}-${index}`}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02] ${
                isDark
                  ? 'bg-azulejo border-cream/15 text-cream hover:border-saffron'
                  : 'bg-sand/60 border-terracotta/20 text-ink hover:border-terracotta'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`font-display font-bold text-xs capitalize ${
                      isDark ? 'text-cream' : 'text-ink'
                    }`}
                  >
                    {item.word}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => speakText(item.word, e)}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      isDark
                        ? 'text-cream/70 hover:text-saffron hover:bg-white/10'
                        : 'text-ink/60 hover:text-terracotta hover:bg-terracotta/10'
                    }`}
                    title={`Listen to ${item.word}`}
                    aria-label={`Listen to ${item.word}`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p
                  className={`text-[11px] font-body mt-1 leading-snug ${
                    isDark ? 'text-cream/80' : 'text-ink/80'
                  }`}
                >
                  {item.meaning || 'English translation unavailable'}
                </p>
              </div>

              <span
                className={`text-[9.5px] font-mono mt-2 pt-1 border-t ${
                  isDark
                    ? 'border-cream/10 text-saffron'
                    : 'border-terracotta/15 text-terracotta'
                }`}
              >
                [{item.pronunciation || 'Pronunciation unavailable'}]
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p
          className={`text-sm py-4 ${
            isDark ? 'text-cream/70' : 'text-ink/70'
          }`}
        >
          Vocabulary will be added soon.
        </p>
      )}
    </div>
  );
};