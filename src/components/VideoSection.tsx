import React, { useRef, useState } from 'react';
import { Sparkles, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import promoVideo from '@/assets/promo-video.mp4';

export const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        if (hasEnded) {
          videoRef.current.currentTime = 0;
          setHasEnded(false);
        }
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
  };

  return (
    <section className="w-full flex justify-center">
      {/* Título Super véspera */}
      <div className="w-full max-w-[280px]">
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <h2 className="text-lg font-display font-bold text-gradient-gold">
              Super Véspera
            </h2>
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
        </div>
        
        {/* Vídeo - Player simples, pequeno, sem loop */}
        <div className="relative aspect-video bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-lg group">
          <video
            ref={videoRef}
            src={promoVideo}
            className="w-full h-full object-cover"
            muted={isMuted}
            playsInline
            preload="metadata"
            onClick={togglePlay}
            onEnded={handleEnded}
          >
            Seu navegador não suporta vídeos.
          </video>
          
          {/* Overlay de controles */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-[#1c1c1e]" />
              ) : (
                <Play className="w-5 h-5 text-[#1c1c1e] ml-0.5" />
              )}
            </button>
          </div>

          {/* Botão de mudo */}
          <button
            onClick={toggleMute}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-white" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-white" />
            )}
          </button>

          {/* Play overlay quando pausado */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 text-[#1c1c1e] ml-0.5" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
