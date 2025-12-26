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

const COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6eb4', '#9b59b6', '#ffffff'];

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
    const fireworkInterval = 800; // New firework every 0.8 seconds - more frequent

    const createFirework = (): Firework => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height,
        targetY: Math.random() * (canvas.height * 0.5) + canvas.height * 0.1,
        speed: 4 + Math.random() * 3,
        exploded: false,
        particles: [],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    const explodeFirework = (firework: Firework) => {
      const particleCount = 40 + Math.floor(Math.random() * 30);
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 2 + Math.random() * 4;
        firework.particles.push({
          x: firework.x,
          y: firework.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 80 + Math.random() * 50,
          color: firework.color,
          size: 2 + Math.random() * 2,
        });
      }
      firework.exploded = true;
    };

    let animationId: number;

    const animate = (timestamp: number) => {
      // Fade effect for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new firework frequently
      if (timestamp - lastFireworkTime > fireworkInterval) {
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
          ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = fw.color;
          ctx.fill();
          ctx.shadowBlur = 0;

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
              p.vy += 0.04; // gravity
              p.vx *= 0.99; // friction
              p.life -= 1 / p.maxLife;

              // Draw particle with glow
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.life * 0.8;
              ctx.shadowBlur = 8;
              ctx.shadowColor = p.color;
              ctx.fill();
              ctx.shadowBlur = 0;
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

    // Start with multiple fireworks
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        fireworks.push(createFirework());
      }, i * 300);
    }
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
