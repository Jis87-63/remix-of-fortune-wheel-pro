import React, { useState, useEffect } from 'react';
import { Share2, Gift, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'vodacom_share_count';
const REQUIRED_SHARES = 5;

// Generate a unique device ID based on browser fingerprint
const getDeviceId = (): string => {
  const stored = localStorage.getItem('vodacom_device_id');
  if (stored) return stored;
  
  const id = `${navigator.userAgent}-${screen.width}x${screen.height}-${new Date().getTimezoneOffset()}-${Math.random().toString(36).substr(2, 9)}`;
  const hash = btoa(id).slice(0, 32);
  localStorage.setItem('vodacom_device_id', hash);
  return hash;
};

interface ShareProgressProps {
  onShareComplete?: () => void;
}

export const ShareProgress: React.FC<ShareProgressProps> = ({ onShareComplete }) => {
  const [shareCount, setShareCount] = useState(0);
  const [deviceId] = useState(getDeviceId);

  useEffect(() => {
    // Load share count from localStorage
    const stored = localStorage.getItem(`${STORAGE_KEY}_${deviceId}`);
    if (stored) {
      setShareCount(parseInt(stored, 10));
    }
  }, [deviceId]);

  const handleShare = () => {
    const shareText = encodeURIComponent(
      `🎰 Ganhei na Roleta da Sorte! Gire e ganhe até 5.000,00 MT! Jogue agora: ${window.location.href}`
    );
    
    const whatsappUrl = `https://wa.me/?text=${shareText}`;
    window.open(whatsappUrl, '_blank');

    // Increment share count
    const newCount = Math.min(shareCount + 1, REQUIRED_SHARES);
    setShareCount(newCount);
    localStorage.setItem(`${STORAGE_KEY}_${deviceId}`, newCount.toString());

    if (newCount >= REQUIRED_SHARES && onShareComplete) {
      onShareComplete();
    }
  };

  const progress = (shareCount / REQUIRED_SHARES) * 100;
  const isComplete = shareCount >= REQUIRED_SHARES;

  return (
    <section className="w-full max-w-md mx-auto">
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <Share2 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Partilha e Ganhe Mais Giros
          </h3>
        </div>

        {/* Progress bar */}
        <div className="relative mb-3">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-muted-foreground">
              {shareCount}/{REQUIRED_SHARES} partilhas
            </span>
            {isComplete && (
              <span className="text-xs text-primary font-medium flex items-center gap-1">
                <Check className="w-3 h-3" />
                Completo!
              </span>
            )}
          </div>
        </div>

        {/* Share button */}
        <Button
          onClick={handleShare}
          disabled={isComplete}
          className={`w-full h-11 text-sm font-semibold rounded-xl transition-all ${
            isComplete 
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/20'
          }`}
        >
          {isComplete ? (
            <>
              <Gift className="w-4 h-4 mr-2" />
              Giros Desbloqueados!
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Partilhar no WhatsApp
            </>
          )}
        </Button>

        <p className="text-[10px] text-muted-foreground/70 text-center mt-2">
          Partilhe {REQUIRED_SHARES} vezes para desbloquear giros extra
        </p>
      </div>
    </section>
  );
};
