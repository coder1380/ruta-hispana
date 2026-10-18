'use client';

import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

interface SpanishTooltipProps {
  word: string;
  meaning: string;
  className?: string;
}

export const SpanishTooltip: React.FC<SpanishTooltipProps> = ({
  word,
  meaning,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <span
      className={`relative inline-block cursor-help select-none ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      onClick={toggleVisibility}
      tabIndex={0}
      role="button"
      aria-expanded={isVisible}
      aria-label={`${word}: ${meaning}`}
    >
      <span className="font-bold text-terracotta underline decoration-dotted decoration-saffron decoration-2 underline-offset-3 hover:text-ink transition-colors px-1 py-0.5 rounded bg-terracotta/5">
        {word}
      </span>

      {isVisible && (
        <span
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 text-xs font-medium text-cream bg-ink rounded-lg shadow-xl ring-1 ring-terracotta/40 pointer-events-auto flex items-center gap-1.5 animate-in fade-in duration-150"
        >
          <span className="text-saffron font-bold">{word}:</span>
          <span className="text-cream">{meaning}</span>
          <button
            onClick={handleSpeak}
            title="Listen to pronunciation"
            className="ml-1 p-0.5 text-cream/70 hover:text-cream rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          {/* Tooltip arrow */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink" />
        </span>
      )}
    </span>
  );
};

/**
 * Utility to parse markdown-like bold Spanish terms followed by bracketed meanings:
 * e.g., "**tapas** (savory small dishes)" or "**palacio** [palace]"
 * and render them as interactive SpanishTooltip components.
 */
export function renderBilingualContent(text: string): React.ReactNode {
  if (!text) return null;

  const pattern = /\*\*([^*]+)\*\*\s*(?:\(([^)]+)\)|\[([^\]]+)\])/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = pattern.lastIndex;

    if (matchStart > lastIndex) {
      parts.push(text.substring(lastIndex, matchStart));
    }

    const word = match[1];
    const meaning = match[2] || match[3] || 'Spanish cultural term';

    parts.push(
      <SpanishTooltip
        key={`${word}-${matchStart}`}
        word={word}
        meaning={meaning}
      />
    );

    lastIndex = matchEnd;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
}
