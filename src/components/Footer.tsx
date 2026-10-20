import React from 'react';
import { Compass, Heart, Code2, Camera } from 'lucide-react';

interface FooterProps {
  photoCredits?: { title: string; photographer: string; license: string; url?: string }[];
}

export const Footer: React.FC<FooterProps> = ({ photoCredits = [] }) => {
  return (
    <footer className="bg-ink text-cream pt-16 pb-12 border-t border-sand/10 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 pb-8 border-b border-cream/10">
          {/* Brand & Project Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-terracotta flex items-center justify-center text-cream">
                <Compass className="w-5 h-5 text-cream" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-cream">
                Ruta <span className="text-saffron">Hispana</span>
              </span>
            </div>
            <p className="text-xs text-cream/70 max-w-sm leading-relaxed">
              University Spanish Coursework: <em>Creative Exploration of the Hispanic World</em>. An interactive travel journal exploring Hispanic regions, architectural icons, street celebrations, and culinary heritage.
            </p>
          </div>

          {/* Photo & Cartography Attribution */}
          <div className="space-y-2">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-saffron flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              Photo credits & Attribution
            </h4>
            <p className="text-xs text-cream/70 leading-relaxed">
              Map Tiles: © OpenStreetMap contributors.
            </p>
            <div className="text-[11px] text-cream/60 space-y-1 max-h-56 overflow-y-auto pr-2">
              {photoCredits.map((c, i) => (
                <div key={i} className="leading-tight">
                  • <span className="text-cream/90 font-medium">{c.title}</span>: {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream/80 hover:text-saffron underline decoration-dotted"
                    >
                      {c.photographer}
                    </a>
                  ) : (
                    <span className="text-cream/80">{c.photographer}</span>
                  )}{' '}
                  <span className="text-cream/40">({c.license})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Note */}
          <div className="space-y-2">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-saffron flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              Modular Architecture
            </h4>
            <p className="text-xs text-cream/70 leading-relaxed">
              Country facts are loaded from <code className="bg-cream/10 px-1 py-0.5 rounded text-cream">/data/countries/</code>. Add a country JSON file to make it available in the country menu.
            </p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/50">
          <p>© 2026 Ruta Hispana · University Spanish Language & Culture Project.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-terracotta fill-current" /> for Spanish coursework.
          </p>
        </div>
      </div>
    </footer>
  );
};
