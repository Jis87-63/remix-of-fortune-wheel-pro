import React from 'react';
import { Sparkles } from 'lucide-react';
import promoVideo from '@/assets/promo-video.mp4';

export const VideoSection: React.FC = () => {
  return (
    <section className="w-full max-w-md mx-auto">
      {/* Título Super véspera */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-gold" />
          <h2 className="text-xl md:text-2xl font-display font-bold text-gradient-gold">
            Super Véspera
          </h2>
          <Sparkles className="w-5 h-5 text-gold" />
        </div>
      </div>
      
      {/* Vídeo */}
      <div className="relative aspect-video bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-lg">
        <video
          src={promoVideo}
          className="w-full h-full object-cover"
          controls
          playsInline
          preload="metadata"
        >
          Seu navegador não suporta vídeos.
        </video>
      </div>
    </section>
  );
};
