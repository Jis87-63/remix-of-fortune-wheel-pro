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
    const fireworkInterval = 3000; // New firework every 3 seconds

    const createFirework = (): Firework => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height,
        targetY: Math.random() * (canvas.height * 0.4) + canvas.height * 0.1,
        speed: 3 + Math.random() * 2,
        exploded: false,
        particles: [],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    const explodeFirework = (firework: Firework) => {
      const particleCount = 30 + Math.floor(Math.random() * 20);
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 1 + Math.random() * 3;
        firework.particles.push({
          x: firework.x,
          y: firework.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 60 + Math.random() * 40,
          color: firework.color,
          size: 1.5 + Math.random() * 1.5,
        });
      }
      firework.exploded = true;
    };

    let animationId: number;

    const animate = (timestamp: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new firework periodically
      if (timestamp - lastFireworkTime > fireworkInterval && fireworks.length < 3) {
        fireworks.push(createFirework());
        lastFireworkTime = timestamp;
      }

      // Update and draw fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];

        if (!fw.exploded) {
          // Rising firework
          fw.y -= fw.speed;
          
          // Draw trail
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.fill();

          // Check if reached target
          if (fw.y <= fw.targetY) {
            explodeFirework(fw);
          }
        } else {
          // Update particles
          let allDead = true;
          fw.particles.forEach((p) => {
            if (p.life > 0) {
              allDead = false;
              p.x += p.vx;
              p.y += p.vy;
              p.vy += 0.03; // gravity
              p.life -= 1 / p.maxLife;

              // Draw particle
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.life;
              ctx.fill();
              ctx.globalAlpha = 1;
            }
          });

          // Remove dead firework
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
      className="fixed inset-0 pointer-events-none z-20"
    />
  );
};
