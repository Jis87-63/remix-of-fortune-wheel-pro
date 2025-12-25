import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import wheelImage from '@/assets/wheel.png';

export interface WheelSegment {
  label: string;
  value: string;
  isLoss: boolean;
}

interface SpinWheelProps {
  segments: WheelSegment[];
  onSpinEnd: (segment: WheelSegment, forceWin: boolean) => void;
  onSpinStart?: () => void;
  onTick?: () => void;
  disabled?: boolean;
  spinCount: number;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({
  segments,
  onSpinEnd,
  onSpinStart,
  onTick,
  disabled = false,
  spinCount,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const segmentAngle = 360 / segments.length;

  // Encontra o índice do segmento "BOA SORTE" e "5000 MT"
  const lossIndex = segments.findIndex(s => s.isLoss);
  const jackpotIndex = segments.findIndex(s => s.value === '5000 MT');

  const spin = useCallback(() => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);
    onSpinStart?.();

    // Primeiro giro vai para "BOA SORTE", segundo vai para "5000 MT"
    const isFirstSpin = spinCount === 0;
    const targetIndex = isFirstSpin ? lossIndex : jackpotIndex;
    
    // Random number of full rotations (5-8)
    const fullRotations = 5 + Math.random() * 3;
    
    // Calculate the exact rotation to land on the target segment
    const segmentCenterAngle = targetIndex * segmentAngle + segmentAngle / 2;
    const targetRotation = fullRotations * 360 + (360 - segmentCenterAngle);
    
    const newRotation = rotation + targetRotation;
    setRotation(newRotation);

    // Play tick sounds during spin
    let tickCount = 0;
    const maxTicks = 40;
    tickIntervalRef.current = setInterval(() => {
      tickCount++;
      if (tickCount <= maxTicks) {
        onTick?.();
      }
      if (tickCount >= maxTicks) {
        if (tickIntervalRef.current) {
          clearInterval(tickIntervalRef.current);
        }
      }
    }, 100);

    // End spin after animation
    setTimeout(() => {
      setIsSpinning(false);
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
      onSpinEnd(segments[targetIndex], !isFirstSpin);
    }, 4000);
  }, [isSpinning, disabled, rotation, segments, segmentAngle, onSpinEnd, onSpinStart, onTick, spinCount, lossIndex, jackpotIndex]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Pointer Arrow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
        <div 
          className="w-0 h-0 drop-shadow-lg"
          style={{
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderTop: '28px solid #FFD700',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }}
        />
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '22px solid #FFC107',
          }}
        />
      </div>

      {/* Wheel Container */}
      <div 
        className={cn(
          "relative cursor-pointer select-none",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={spin}
      >
        {/* Wheel Image */}
        <div
          className="w-[240px] h-[240px] md:w-[260px] md:h-[260px] rounded-full overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning 
              ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' 
              : 'none',
          }}
        >
          <img 
            src={wheelImage} 
            alt="Roleta de Prêmios" 
            className="w-full h-full object-cover scale-[1.02]"
            draggable={false}
          />
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning || disabled}
        className={cn(
          "mt-5 px-8 py-3 rounded-lg font-display font-bold text-base uppercase tracking-wider",
          "bg-gradient-to-r from-primary to-emerald-600 text-primary-foreground",
          "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40",
          "transform transition-all duration-200",
          "hover:scale-105 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          isSpinning && "animate-pulse"
        )}
      >
        {isSpinning ? 'Girando...' : 'Girar Roleta'}
      </button>
    </div>
  );
};
