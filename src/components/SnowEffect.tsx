import React, { useEffect, useRef } from 'react';

export const SnowEffect: React.FC = () => {
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

    interface Snowflake {
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
      swing: number;
      swingSpeed: number;
      rotation: number;
      rotationSpeed: number;
    }

    const snowflakes: Snowflake[] = [];
    const numSnowflakes = 25; // Fewer snowflakes for lighter effect

    for (let i = 0; i < numSnowflakes; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5, // Smaller snowflakes
        speed: Math.random() * 0.4 + 0.15, // Slower falling
        opacity: Math.random() * 0.35 + 0.15, // More transparent
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.015 + 0.005, // Gentler sway
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.01 - 0.005, // Slower rotation
      });
    }

    // Draw snowflake shape
    const drawSnowflake = (x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = size * 0.3;
      ctx.lineCap = 'round';

      // Draw 6 arms of the snowflake
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * i);
        
        // Main arm
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -size);
        ctx.stroke();

        // Small branches
        if (size > 2) {
          ctx.beginPath();
          ctx.moveTo(0, -size * 0.4);
          ctx.lineTo(-size * 0.3, -size * 0.6);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(0, -size * 0.4);
          ctx.lineTo(size * 0.3, -size * 0.6);
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore();
    };

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakes.forEach((flake) => {
        // Draw snowflake with shape
        drawSnowflake(flake.x, flake.y, flake.radius * 2.5, flake.rotation, flake.opacity);

        // Move snowflake
        flake.y += flake.speed;
        flake.swing += flake.swingSpeed;
        flake.x += Math.sin(flake.swing) * 0.5;
        flake.rotation += flake.rotationSpeed;

        // Reset if out of screen
        if (flake.y > canvas.height + 10) {
          flake.y = -10;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width + 10) {
          flake.x = -10;
        }
        if (flake.x < -10) {
          flake.x = canvas.width + 10;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};