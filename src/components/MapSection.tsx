'use client';

import React, { useState, useEffect } from 'react';
import { RegionSummary, LandmarkItem } from '@/types/country';
import { MapLeaflet } from './MapLeaflet';
import { MapPin, X } from 'lucide-react';
import Image from 'next/image';
import { renderBilingualContent } from './SpanishTooltip';

interface MapSectionProps {
  countryName: string;
  regions: RegionSummary[];
  landmarks: LandmarkItem[];
  currentCountry?: string;
}

export const MapSection: React.FC<MapSectionProps> = ({
  countryName,
  regions,
  landmarks,
  currentCountry,
}) => {
  const isCentralAmerica = currentCountry === 'central-america';

  const [selectedRegion, setSelectedRegion] = useState<RegionSummary | null>(
    regions[0] ?? null
  );

  const [activeLandmark, setActiveLandmark] =
    useState<LandmarkItem | null>(null);

  useEffect(() => {
    setSelectedRegion(regions[0] ?? null);
    setActiveLandmark(null);
  }, [regions, currentCountry]);

  const handleSelectRegion = (region: RegionSummary) => {
    setSelectedRegion(region);
    setActiveLandmark(null);
  };

  const handleSelectLandmark = (landmark: LandmarkItem) => {
    setActiveLandmark(landmark);
  };

  if (!selectedRegion) {
    return null;
  }

  return (
    <section
      id="mapa"
      className="py-16 sm:py-24 bg-sand text-ink scroll-mt-16 border-t border-terracotta/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-terracotta/20">
          <div>
            <span className="animate-stamp inline-block text-xs font-bold tracking-widest uppercase text-terracotta font-display px-2.5 py-1 rounded-full bg-cream border border-terracotta/20 mb-2">
              Cartografía · Interactive Map
            </span>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink mt-1">
              {isCentralAmerica
                ? 'Mapa de Centroamérica · Seven Countries'
                : `Mapa de ${countryName} · Interactive Cartography`}
            </h2>

            <p className="mt-2 text-sm sm:text-base text-ink/80 max-w-2xl font-body">
              {isCentralAmerica
                ? 'Explore Guatemala, Belize, Honduras, El Salvador, Nicaragua, Costa Rica, and Panama. Select a country or landmark to discover its famous place, festival, and traditional dish.'
                : 'Explore each region and landmark to discover its signature place, festival, and dish.'}
            </p>
          </div>

          <div className="text-right hidden sm:block shrink-0">
            <span className="font-handwriting text-2xl text-terracotta block">
              {isCentralAmerica
                ? '“Siete países, una región”'
                : '“Explora y descubre”'}
            </span>

            <span className="text-xs text-ink/70">
              {isCentralAmerica
                ? '7 Central American countries'
                : `${regions.length} regions`}
            </span>
          </div>
        </div>

        {/* Country / Region Selector */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {regions.map((reg) => {
            const isSelected =
              reg.id === selectedRegion.id && !activeLandmark;

            return (
              <button
                key={reg.id}
                onClick={() => handleSelectRegion(reg)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-terracotta text-cream shadow-xs scale-105'
                    : 'bg-cream text-ink border border-terracotta/20 hover:border-terracotta hover:text-terracotta'
                }`}
              >
                {reg.name}
              </button>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Map */}
          <div className="lg:col-span-7">
            <MapLeaflet
              regions={regions}
              landmarks={landmarks}
              selectedRegionId={selectedRegion.id}
              onSelectRegion={handleSelectRegion}
              onSelectLandmark={handleSelectLandmark}
            />
          </div>

          {/* Information Panel */}
          <div className="lg:col-span-5 bg-cream rounded-2xl p-6 sm:p-7 border border-terracotta/20 shadow-sm animate-fade-in-up">
            {activeLandmark ? (
              /* Selected Landmark */
              <div className="space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-sand">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">
                      {isCentralAmerica
                        ? 'Lugar destacado · Landmark'
                        : 'Monumento · Landmark'}
                    </span>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-0.5">
                      {activeLandmark.name}
                    </h3>

                    <p className="text-xs text-ink/70 flex items-center gap-1 mt-1 font-body">
                      <MapPin className="w-3.5 h-3.5 text-terracotta" />
                      <span>{activeLandmark.city}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveLandmark(null)}
                    className="p-1 rounded-md text-ink/60 hover:text-ink hover:bg-sand/60 transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative h-48 w-full rounded-xl overflow-hidden border border-sand">
                  <Image
                    src={activeLandmark.image}
                    alt={activeLandmark.name}
                    fill
                    className="object-cover photo-hover-tilt"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>

                <p className="text-sm text-ink font-body leading-relaxed">
                  {renderBilingualContent(activeLandmark.caption)}
                </p>

                <p className="text-[10px] text-ink/50 pt-2 border-t border-sand">
                  Photo: {activeLandmark.credit}
                </p>
              </div>
            ) : (
              /* Selected Country / Region */
              <div className="space-y-5">
                <div className="pb-3 border-b border-sand">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                      {isCentralAmerica
                        ? 'País · Country'
                        : 'Región · Region'}
                    </span>

                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-sand text-ink font-semibold">
                      Capital: {selectedRegion.capital}
                    </span>
                  </div>

                  <h3 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-1">
                    {selectedRegion.name}
                  </h3>

                  <p className="text-xs text-terracotta font-medium italic">
                    {selectedRegion.name_es}
                  </p>

                  {isCentralAmerica &&
                    selectedRegion.id === 'belize' && (
                      <p className="text-xs text-ink/70 mt-2">
                        English is the official language of Belize.
                      </p>
                    )}
                </div>

                {/* Country / Region Details */}
                <div className="space-y-3 font-body text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-sand/40 border border-sand flex items-start gap-3">
                    <span className="text-xl leading-none shrink-0 mt-0.5">
                      🏛️
                    </span>

                    <div>
                      <span className="font-bold text-terracotta block text-xs uppercase tracking-wider">
                        {isCentralAmerica
                          ? 'Lugar destacado:'
                          : 'Lugar famoso:'}
                      </span>

                      <p className="text-ink font-semibold mt-0.5">
                        {selectedRegion.famous_place}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sand/40 border border-sand flex items-start gap-3">
                    <span className="text-xl leading-none shrink-0 mt-0.5">
                      🎉
                    </span>

                    <div>
                      <span className="font-bold text-saffron block text-xs uppercase tracking-wider">
                        {isCentralAmerica
                          ? 'Festival tradicional:'
                          : 'Fiesta insigne:'}
                      </span>

                      <p className="text-ink font-semibold mt-0.5">
                        {selectedRegion.signature_festival}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sand/40 border border-sand flex items-start gap-3">
                    <span className="text-xl leading-none shrink-0 mt-0.5">
                      🥘
                    </span>

                    <div>
                      <span className="font-bold text-terracotta block text-xs uppercase tracking-wider">
                        {isCentralAmerica
                          ? 'Plato típico · Traditional dish:'
                          : 'Plato típico:'}
                      </span>

                      <p className="text-ink font-semibold mt-0.5">
                        {selectedRegion.signature_dish}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-xs text-ink/60 font-handwriting text-base text-terracotta flex items-center justify-between">
                  <span>
                    {isCentralAmerica
                      ? 'Explore each country'
                      : 'Selected via map circle or pills'}
                  </span>

                  <span>Field notes</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};