import React, { useEffect, useRef, useState } from 'react';
import { Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  location: string;
  prize: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  { name: 'Carlos M.', location: 'Maputo', prize: '500 MT', avatar: 'CM' },
  { name: 'Ana S.', location: 'Beira', prize: '1.000 MT', avatar: 'AS' },
  { name: 'João P.', location: 'Nampula', prize: '100 MT', avatar: 'JP' },
  { name: 'Maria L.', location: 'Matola', prize: '5.000 MT', avatar: 'ML' },
  { name: 'Pedro F.', location: 'Chimoio', prize: '500 MT', avatar: 'PF' },
  { name: 'Sofia R.', location: 'Tete', prize: '1.000 MT', avatar: 'SR' },
  { name: 'Lucas D.', location: 'Quelimane', prize: '10.000 MT', avatar: 'LD' },
  { name: 'Rita C.', location: 'Pemba', prize: '100 MT', avatar: 'RC' },
];

export const Testimonials: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPos = 0;

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPos += 0.5;
        if (scrollPos >= scrollContainer.scrollWidth / 2) {
          scrollPos = 0;
        }
        scrollContainer.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <section className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Quote className="w-4 h-4 text-gold" />
        <h2 className="text-base font-display font-semibold text-foreground">
          Ganhadores Recentes
        </h2>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Duplicate for infinite scroll */}
        {[...testimonials, ...testimonials].map((t, i) => (
          <div 
            key={i}
            className="flex-shrink-0 flex items-center gap-3 bg-gradient-to-r from-card/80 to-card/40 backdrop-blur-sm border border-border/30 rounded-full py-2 px-4"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-xs font-bold text-primary-foreground">
              {t.avatar}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground whitespace-nowrap">
                {t.name} <span className="text-muted-foreground">• {t.location}</span>
              </span>
              <span className="text-xs text-primary font-semibold">
                Ganhou {t.prize}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
