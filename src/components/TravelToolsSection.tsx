'use client';

import React, { useState } from 'react';
import { TripPlanner } from './TripPlanner';
import { GuideChatbot } from './GuideChatbot';
import { Sparkles, Calendar, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface TravelToolsSectionProps {
  countryId: string;
  countryName: string;
}

export const TravelToolsSection: React.FC<TravelToolsSectionProps> = ({ countryId, countryName }) => {
  const [activeTab, setActiveTab] = useState<'planner' | 'chat'>('planner');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="herramientas" className="py-12 bg-sand border-t border-terracotta/20 scroll-mt-16 text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quiet Drawer Header */}
        <div className="bg-cream rounded-2xl border border-terracotta/20 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-terracotta/10 text-terracotta">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-terracotta font-display">
                  Herramientas · Travel Companions
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-ink mt-1">
                Cuaderno de Itinerario & Guía Mateo
              </h3>
              <p className="text-xs sm:text-sm text-ink/70 font-body mt-0.5">
                Quiet assistant tools to generate custom day-by-day plans or answer cultural questions in English with Spanish terms.
              </p>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-terracotta text-cream hover:bg-terracotta/90 transition-colors text-xs font-semibold cursor-pointer shrink-0 self-start sm:self-auto shadow-xs"
            >
              <span>{isOpen ? 'Close Travel Tools' : 'Open Travel Tools'}</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Expandable Content */}
          {isOpen && (
            <div className="mt-6 pt-6 border-t border-sand animate-fade-in-up">
              {/* Tabs */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('planner')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'planner'
                      ? 'bg-ink text-cream shadow-xs'
                      : 'bg-sand/40 text-ink/80 hover:text-ink border border-sand'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Trip Planner</span>
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-ink text-cream shadow-xs'
                      : 'bg-sand/40 text-ink/80 hover:text-ink border border-sand'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask Mateo</span>
                </button>
              </div>

              {/* Tool Component */}
              <div className="bg-sand/30 rounded-xl border border-sand overflow-hidden">
                {activeTab === 'planner' ? (
                  <TripPlanner studentName="Priya Sharma" countryId={countryId} countryName={countryName} />
                ) : (
                  <GuideChatbot countryId={countryId} countryName={countryName} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
