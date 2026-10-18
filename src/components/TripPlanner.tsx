'use client';

import React, { useState } from 'react';
import { TripPlanResult, ItineraryDay } from '@/app/api/planner/route';
import { StudentBadge } from './StudentBadge';
import { renderBilingualContent } from './SpanishTooltip';
import {
  Calendar,
  Sparkles,
  Loader2,
  Leaf,
  IndianRupee,
  Utensils,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  Copy,
  Check,
  BookOpen,
} from 'lucide-react';

interface TripPlannerProps {
  studentName?: string;
  countryId: string;
  countryName: string;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({
  studentName = 'Priya Sharma',
  countryId,
  countryName,
}) => {
  const [days, setDays] = useState<number>(3);
  const [budgetInr, setBudgetInr] = useState<number>(45000);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Culture & Art',
    'Gastronomy & Tapas',
  ]);
  const [isVegetarian, setIsVegetarian] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<TripPlanResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const interestOptions = [
    'Culture & Art',
    'Gastronomy & Tapas',
    'Castles & Moorish History',
    'Architecture & Gaudí',
    'Beaches & Mediterranean',
    'Flamenco & Music',
  ];

  const budgetPresets = [
    { label: '₹30,000 (Budget)', value: 30000 },
    { label: '₹45,000 (Classic)', value: 45000 },
    { label: '₹75,000 (Comfort)', value: 75000 },
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryId,
          days,
          budgetInr,
          interests: selectedInterests,
          isVegetarian,
        }),
      });

      if (res.ok) {
        const data: TripPlanResult = await res.json();
        setItinerary(data);
      }
    } catch (err) {
      console.warn('Planner fetch error handled gracefully:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyItinerary = () => {
    if (!itinerary) return;
    const text = `${itinerary.title}\n\nBudget: ${itinerary.estimated_cost_inr}\nDiet: ${
      itinerary.is_vegetarian ? 'Strictly Vegetarian' : 'Standard'
    }\n\n${itinerary.days
      .map(
        (d) =>
          `Day ${d.day_number}: ${d.title} (${d.location})\n- Morning: ${d.morning}\n- Afternoon: ${d.afternoon}\n- Evening: ${d.evening}\n- Food: ${d.food_recommendation.dish} - ${d.food_recommendation.description}`
      )
      .join('\n\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="planner" className="py-16 sm:py-24 bg-[#FCFAF6] border-t border-[#E6DCCD] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Understated, Quiet AI Assistant */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#E6DCCD]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold tracking-widest uppercase text-[#C25B38]">
                Cuaderno de Itinerario · Study Travel Notebook
              </span>
              <StudentBadge studentName={studentName} role="Itinerary Modeling & Schema" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#1C1917]">
              Planificador de Ruta · Custom Itinerary
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#57524E] max-w-2xl font-body">
              A quiet planning companion grounded in our research. Adjust trip length, INR budget, and vegetarian dietary requirements to draft a realistic day-by-day journey.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="font-handwriting text-xl text-[#943A1E] block">
              Grounded in {countryName} data
            </span>
            <span className="text-xs text-[#57524E]">Strict JSON output · Zero tech clutter</span>
          </div>
        </div>

        {/* Form Inputs: Editorial Paper Card */}
        <form
          onSubmit={handleGeneratePlan}
          className="bg-cream rounded-2xl p-6 sm:p-8 border border-sand shadow-xs mb-12 text-ink"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* 1. Duration (Days) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-terracotta mb-2 font-display flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-terracotta" />
                Días · Duration
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 5, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDays(num)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      days === num
                        ? 'bg-terracotta text-cream shadow-xs'
                        : 'bg-sand/40 border border-sand text-ink hover:border-terracotta'
                    }`}
                  >
                    {num}d
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Budget in INR */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#943A1E] mb-2 font-display flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-[#D99B26]" />
                Presupuesto · Budget (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#57524E]">
                  ₹
                </span>
                <input
                  type="number"
                  min={10000}
                  max={500000}
                  step={5000}
                  value={budgetInr}
                  onChange={(e) => setBudgetInr(Number(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-[#E6DCCD] bg-[#FCFAF6] text-xs font-bold text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#C25B38]"
                />
              </div>
              <div className="flex gap-1.5 mt-1.5">
                {budgetPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setBudgetInr(preset.value)}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#F4EFE6] text-[#943A1E] hover:bg-[#C25B38] hover:text-white transition-colors"
                  >
                    ₹{(preset.value / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Vegetarian Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#943A1E] mb-2 font-display flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-[#4A582F]" />
                Dieta Vegetariana
              </label>
              <button
                type="button"
                onClick={() => setIsVegetarian(!isVegetarian)}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-between border transition-all ${
                  isVegetarian
                    ? 'bg-[#EEF3E6] border-[#4A582F]/30 text-[#354020]'
                    : 'bg-[#FCFAF6] border-[#E6DCCD] text-[#57524E]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5" />
                  {isVegetarian ? '🌱 Strictly Vegetarian' : '🍖 Standard Tapas'}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-[#E6DCCD] font-mono">
                  {isVegetarian ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>

            {/* 4. Action Button */}
            <div className="flex flex-col justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-lg bg-[#943A1E] text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-[#7D2E16] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Calculando ruta...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>Generar Itinerario</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interests Multi-Select Chips */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-[#57524E] mb-2 font-display">
              Intereses Culturales:
            </span>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((item) => {
                const selected = selectedInterests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`px-3 py-1 rounded-full text-xs font-body transition-all ${
                      selected
                        ? 'bg-[#F4E8E2] border border-[#C25B38] text-[#943A1E] font-semibold'
                        : 'bg-[#FCFAF6] border border-[#E6DCCD] text-[#57524E] hover:border-[#C25B38]'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Rendered Itinerary Display */}
        {itinerary && (
          <div className="space-y-6">
            {/* Header Summary */}
            <div className="p-6 rounded-2xl bg-[#F4EFE6] border border-[#E6DCCD] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#943A1E] font-display">
                  Itinerario Sugerido · {itinerary.days.length} Días
                </span>
                <h3 className="font-display text-2xl font-bold text-[#1C1917] mt-1">
                  {itinerary.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#57524E] font-body mt-1 max-w-2xl leading-relaxed">
                  {itinerary.summary}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-[#FCFAF6] px-3 py-1.5 rounded-lg border border-[#E6DCCD] text-xs">
                  <span className="text-[#57524E] block text-[10px]">Cálculo Estimado:</span>
                  <span className="font-bold text-[#943A1E]">{itinerary.estimated_cost_inr}</span>
                </div>
                <button
                  onClick={copyItinerary}
                  className="px-3 py-2 rounded-lg bg-[#FCFAF6] border border-[#E6DCCD] text-xs font-semibold text-[#1C1917] hover:bg-[#F9F6F0] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itinerary.days.map((day) => (
                <div
                  key={day.day_number}
                  className="bg-[#F9F6F0] p-6 rounded-2xl border border-[#E6DCCD] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E6DCCD]">
                      <span className="font-display font-bold text-lg text-[#943A1E]">
                        Día {day.day_number}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#FCFAF6] border border-[#E6DCCD] text-[#57524E]">
                        {day.location}
                      </span>
                    </div>

                    <h4 className="font-display text-lg font-bold text-[#1C1917] mb-3">
                      {day.title}
                    </h4>

                    <div className="space-y-2.5 text-xs text-[#1C1917] font-body leading-relaxed">
                      <div className="p-2 rounded-lg bg-[#FCFAF6] border border-[#E6DCCD]/60">
                        <span className="font-bold text-[#943A1E] block text-[11px]">Mañana:</span>
                        <p>{renderBilingualContent(day.morning)}</p>
                      </div>

                      <div className="p-2 rounded-lg bg-[#FCFAF6] border border-[#E6DCCD]/60">
                        <span className="font-bold text-[#D99B26] block text-[11px]">Tarde:</span>
                        <p>{renderBilingualContent(day.afternoon)}</p>
                      </div>

                      <div className="p-2 rounded-lg bg-[#FCFAF6] border border-[#E6DCCD]/60">
                        <span className="font-bold text-[#4A582F] block text-[11px]">Noche:</span>
                        <p>{renderBilingualContent(day.evening)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-[#E6DCCD] text-xs">
                    <span className="text-[11px] font-bold text-[#943A1E] block">
                      Comida sugerida: {day.food_recommendation.dish}
                    </span>
                    <span className="text-[#57524E] text-[11px] font-body">
                      {day.food_recommendation.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
