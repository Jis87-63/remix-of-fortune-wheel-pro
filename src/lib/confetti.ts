import confetti from 'canvas-confetti';

export const fireConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const colors = ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#ffffff'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  // Big burst in the middle
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.5, y: 0.5 },
    colors: colors,
  });
};
