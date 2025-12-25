import React from 'react';
import { Play } from 'lucide-react';

interface VideoSectionProps {
  videoUrl?: string;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videoUrl }) => {
  return (
    <section className="w-full max-w-md mx-auto">
      <h2 className="text-lg font-display font-semibold text-foreground text-center mb-3">
        Veja como funciona
      </h2>
      <div className="relative aspect-video bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <Play className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs">Vídeo em breve</p>
          </div>
        )}
      </div>
    </section>
  );
};
