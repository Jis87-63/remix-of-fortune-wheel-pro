import React, { useState, useCallback } from 'react';
import { SpinWheel, WheelSegment } from '@/components/SpinWheel';
import { VictoryModal } from '@/components/VictoryModal';
import { SoundToggle } from '@/components/SoundToggle';
import { VideoSection } from '@/components/VideoSection';
import { ShareProgress } from '@/components/ShareProgress';
import { FireworksEffect } from '@/components/FireworksEffect';
import { useSounds } from '@/hooks/useSounds';
import { useSpinTracker } from '@/hooks/useSpinTracker';
import { fireConfetti } from '@/lib/confetti';

// Segmentos da roleta - prêmio máximo 5000MT
const WHEEL_SEGMENTS: WheelSegment[] = [
  { label: '100 MT', value: '100 MT', isLoss: false },
  { label: 'BOA SORTE', value: 'BOA SORTE', isLoss: true },
  { label: '500 MT', value: '500 MT', isLoss: false },
  { label: '5000 MT', value: '5000 MT', isLoss: false },
  { label: '200 MT', value: '200 MT', isLoss: false },
  { label: 'BOA SORTE', value: 'BOA SORTE', isLoss: true },
  { label: '1000 MT', value: '1000 MT', isLoss: false },
  { label: '50 MT', value: '50 MT', isLoss: false },
];

const REDIRECT_URL = 'https://sshortly.net/18839e8';

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wonPrize, setWonPrize] = useState<WheelSegment | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  
  const { 
    spinCount, 
    remainingSpins, 
    isInCooldown, 
    cooldownHoursLeft, 
    recordSpin, 
    addBonusSpins,
    isLoading 
  } = useSpinTracker();
  
  const { isMuted, toggleMute, playClick, playSpinStart, playTick, playWin } = useSounds();

  const handleSpinStart = useCallback(() => {
    playClick();
    setTimeout(() => playSpinStart(), 100);
    setCanSpin(false);
  }, [playClick, playSpinStart]);

  const handleSpinEnd = useCallback((segment: WheelSegment, forceWin: boolean) => {
    const newSpinCount = recordSpin();
    
    if (newSpinCount === 1) {
      setWonPrize({ label: 'BOA SORTE', value: 'BOA SORTE', isLoss: true });
      setTimeout(() => setIsModalOpen(true), 500);
    } else {
      playWin();
      fireConfetti();
      setWonPrize({ label: '5000 MT', value: '5000 MT', isLoss: false });
      setTimeout(() => setIsModalOpen(true), 500);
    }
    
    setCooldownSeconds(3);
    const interval = setInterval(() => {
      setCooldownSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (newSpinCount < 2) {
            setCanSpin(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [playWin, recordSpin]);

  const handleRedeem = useCallback(() => {
    window.open(REDIRECT_URL, '_blank');
    setIsModalOpen(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleShareComplete = useCallback(() => {
    addBonusSpins(2);
  }, [addBonusSpins]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main relative overflow-hidden">
      {/* Fireworks Effect */}
      <FireworksEffect />

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <SoundToggle isMuted={isMuted} onToggle={toggleMute} />

      <main className="container relative z-10 py-6 px-4 flex flex-col items-center">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
            <span className="text-gradient-gold">Roleta da Sorte</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Teste a sua sorte e ganhe até <span className="text-gold font-semibold">5.000,00 MT</span>!
          </p>
          {remainingSpins > 0 && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 rounded-full">
              <span className="text-xs text-primary font-medium">
                {remainingSpins} {remainingSpins === 1 ? 'giro restante' : 'giros restantes'}
              </span>
            </div>
          )}
        </header>

        {/* Wheel Section */}
        <section className="mb-0">
          <SpinWheel
            segments={WHEEL_SEGMENTS}
            onSpinEnd={handleSpinEnd}
            onSpinStart={handleSpinStart}
            onTick={playTick}
            disabled={!canSpin || remainingSpins <= 0}
            spinCount={spinCount}
          />
          
          {cooldownSeconds > 0 && (
            <p className="mt-3 text-muted-foreground text-xs text-center">
              Aguarde {cooldownSeconds}s...
            </p>
          )}
          
          {remainingSpins <= 0 && isInCooldown && (
            <div className="mt-3 text-center">
              <p className="text-gold text-sm font-medium">
                Você já usou todos os seus giros!
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Aguarde {cooldownHoursLeft}h ou convide amigos para ganhar mais 2 giros
              </p>
            </div>
          )}
        </section>

        {/* WhatsApp Share - 40px abaixo da roleta */}
        <div className="mt-[40px] w-full">
          <ShareProgress onShareComplete={handleShareComplete} />
        </div>

        {/* Video Section - abaixo do WhatsApp */}
        <div className="mt-6 w-full">
          <VideoSection />
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 pb-4">
          <p className="text-[11px] text-muted-foreground/70">
            Copyright © Vodacom Presentes
          </p>
        </footer>
      </main>

      {/* Victory Modal */}
      {wonPrize && (
        <VictoryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          prizeName={wonPrize.value}
          isLoss={wonPrize.isLoss}
          onRedeem={handleRedeem}
        />
      )}
    </div>
  );
};

export default Index;
