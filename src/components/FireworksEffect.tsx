import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  exploded: boolean;
  particles: Particle[];
  color: string;
}

const COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6eb4', '#9b59b6'];

export const FireworksEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fireworks: Firework[] = [];
    let lastFireworkTime = 0;
    const fireworkInterval = 2500; // New firework every 2.5 seconds - gentle

    const createFirework = (): Firework => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height,
        targetY: Math.random() * (canvas.height * 0.4) + canvas.height * 0.15,
        speed: 2 + Math.random() * 1.5,
        exploded: false,
        particles: [],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    const explodeFirework = (firework: Firework) => {
      const particleCount = 20 + Math.floor(Math.random() * 15); // Less particles
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 1 + Math.random() * 2;
        firework.particles.push({
          x: firework.x,
          y: firework.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 60 + Math.random() * 30,
          color: firework.color,
          size: 1 + Math.random() * 1,
        });
      }
      firework.exploded = true;
    };

    let animationId: number;

    const animate = (timestamp: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new firework gently
      if (timestamp - lastFireworkTime > fireworkInterval && fireworks.length < 2) {
        fireworks.push(createFirework());
        lastFireworkTime = timestamp;
      }

      // Update and draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];

        if (!fw.exploded) {
          fw.y -= fw.speed;
          
          // Draw small trail
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.globalAlpha = 0.6;
          ctx.fill();
          ctx.globalAlpha = 1;

          if (fw.y <= fw.targetY) {
            explodeFirework(fw);
          }
        } else {
          let allDead = true;
          fw.particles.forEach((p) => {
            if (p.life > 0) {
              allDead = false;
              p.x += p.vx;
              p.y += p.vy;
              p.vy += 0.03;
              p.vx *= 0.98;
              p.life -= 1 / p.maxLife;

              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.life * 0.5; // More transparent
              ctx.fill();
              ctx.globalAlpha = 1;
            }
          });

          if (allDead) {
            fireworks.splice(i, 1);
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    // Start with one firework
    fireworks.push(createFirework());
    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
