import React, { useState, useCallback } from 'react';
import { SpinWheel, WheelSegment } from '@/components/SpinWheel';
import { VictoryModal } from '@/components/VictoryModal';
import { SoundToggle } from '@/components/SoundToggle';
import { Testimonials } from '@/components/Testimonials';
import { VideoSection } from '@/components/VideoSection';
import { useSounds } from '@/hooks/useSounds';
import { Sparkles } from 'lucide-react';

// Segmentos baseados na imagem da roleta (sentido horário a partir do topo)
const WHEEL_SEGMENTS: WheelSegment[] = [
  { label: '500 METICAIS', value: '500 METICAIS', isLoss: false },
  { label: 'BOA SORTE', value: 'BOA SORTE', isLoss: true },
  { label: '500 METICAIS', value: '500 METICAIS', isLoss: false },
  { label: '10.000 METICAIS', value: '10.000 METICAIS', isLoss: false },
  { label: '5.000 METICAIS', value: '5.000 METICAIS', isLoss: false },
  { label: '1.000 METICAIS', value: '1.000 METICAIS', isLoss: false },
  { label: 'BOA SORTE', value: 'BOA SORTE', isLoss: true },
  { label: '5.000 METICAIS', value: '5.000 METICAIS', isLoss: false },
  { label: '1.000 METICAIS', value: '1.000 METICAIS', isLoss: false },
  { label: 'BOA SORTE', value: 'BOA SORTE', isLoss: true },
  { label: '1.000 METICAIS', value: '1.000 METICAIS', isLoss: false },
  { label: '10 METICAIS', value: '10 METICAIS', isLoss: false },
  { label: '100 METICAIS', value: '100 METICAIS', isLoss: false },
];

const REDIRECT_URL = 'https://www.placard.co.mz';

const Index: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wonPrize, setWonPrize] = useState<WheelSegment | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  
  const { isMuted, toggleMute, playClick, playSpinStart, playTick, playWin } = useSounds();

  const handleSpinStart = useCallback(() => {
    playClick();
    setTimeout(() => playSpinStart(), 100);
    setCanSpin(false);
  }, [playClick, playSpinStart]);

  const handleSpinEnd = useCallback((segment: WheelSegment) => {
    if (!segment.isLoss) {
      playWin();
    }
    setWonPrize(segment);
    setTimeout(() => setIsModalOpen(true), 500);
    
    // Cooldown de 3 segundos
    setCooldownSeconds(3);
    const interval = setInterval(() => {
      setCooldownSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanSpin(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [playWin]);

  const handleRedeem = useCallback(() => {
    window.open(REDIRECT_URL, '_blank');
    setIsModalOpen(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-main relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <SoundToggle isMuted={isMuted} onToggle={toggleMute} />

      <main className="container relative z-10 py-6 px-4 flex flex-col items-center">
        {/* Header */}
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-card/50 backdrop-blur-sm rounded-full border border-border mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs text-muted-foreground font-medium">
              Gire e Ganhe Prêmios
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
            <span className="text-gradient-gold">Roleta da Sorte</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Teste a sua sorte e ganhe recompensas incríveis!
          </p>
        </header>

        {/* Wheel Section */}
        <section className="mb-8">
          <SpinWheel
            segments={WHEEL_SEGMENTS}
            onSpinEnd={handleSpinEnd}
            onSpinStart={handleSpinStart}
            onTick={playTick}
            disabled={!canSpin}
          />
          
          {cooldownSeconds > 0 && (
            <p className="mt-3 text-muted-foreground text-xs text-center">
              Aguarde {cooldownSeconds}s...
            </p>
          )}
        </section>

        {/* Video Section */}
        <div className="mb-8 w-full">
          <VideoSection />
        </div>

        {/* Testimonials */}
        <div className="mb-8 w-full">
          <Testimonials />
        </div>

        {/* Footer */}
        <footer className="text-center pb-4">
          <p className="text-[10px] text-muted-foreground/60">
            © {new Date().getFullYear()} Roleta da Sorte
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
