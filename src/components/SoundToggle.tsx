import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SoundToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ isMuted, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "fixed top-4 right-4 z-50 p-3 rounded-full",
        "bg-card/80 backdrop-blur-sm border border-border",
        "hover:bg-card transition-colors duration-200",
        "shadow-lg"
      )}
      aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-muted-foreground" />
      ) : (
        <Volume2 className="w-5 h-5 text-primary" />
      )}
    </button>
  );
};
