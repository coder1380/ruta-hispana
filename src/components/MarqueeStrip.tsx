import React from 'react';

interface MarqueeStripProps {
  theme?: 'sand' | 'azulejo' | 'cream';
  className?: string;
}

export const MarqueeStrip: React.FC<MarqueeStripProps> = ({
  theme = 'sand',
  className = '',
}) => {
  const vocabulary = [
    { es: 'tapas', en: 'small plates' },
    { es: 'siesta', en: 'afternoon rest' },
    { es: 'mercado', en: 'market' },
    { es: 'plaza', en: 'town square' },
    { es: 'fiesta', en: 'celebration' },
    { es: 'sobremesa', en: 'table talk' },
    { es: 'hola', en: 'hello' },
    { es: 'gracias', en: 'thank you' },
    { es: 'vamos', en: 'let’s go' },
    { es: 'duende', en: 'inner soul' },
    { es: 'paella', en: 'saffron rice' },
    { es: 'churros', en: 'pastry fritters' },
    { es: 'sol', en: 'sun' },
    { es: 'azulejo', en: 'ceramic tile' },
  ];

  const bgStyles =
    theme === 'azulejo'
      ? 'bg-azulejo border-cream/20 text-cream'
      : theme === 'sand'
      ? 'bg-sand border-terracotta/20 text-ink'
      : 'bg-cream border-sand text-ink';

  const dotColor = theme === 'azulejo' ? 'text-saffron' : 'text-terracotta';

  return (
    <div
      className={`w-full overflow-hidden border-y py-3 select-none ${bgStyles} ${className}`}
      aria-label="Spanish cultural vocabulary marquee"
    >
      <div className="animate-marquee flex items-center space-x-6 whitespace-nowrap text-xs sm:text-sm font-medium">
        {/* Double array for seamless endless loop */}
        {[...vocabulary, ...vocabulary].map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2 shrink-0">
            <span className="font-display font-bold tracking-wide capitalize">
              {item.es}
            </span>
            <span className="text-[11px] opacity-75 font-body">
              ({item.en})
            </span>
            <span className={`font-bold text-sm ${dotColor}`}>·</span>
          </div>
        ))}
      </div>
    </div>
  );
};
