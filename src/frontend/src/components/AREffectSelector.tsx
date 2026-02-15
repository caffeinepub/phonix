import { useEffect, useState } from 'react';

interface AREffectSelectorProps {
  selectedEffect: string | null;
  onEffectChange: (effect: string | null) => void;
}

const AR_EFFECT_ASSETS: Record<string, string> = {
  'carnival-mask': '/assets/generated/carnival-mask-transparent.dim_200x200.png',
  'aviator-glasses': '/assets/generated/aviator-sunglasses-transparent.dim_200x200.png',
  'heart-glasses': '/assets/generated/heart-sunglasses-transparent.dim_200x200.png',
  'rainbow-emoji': '/assets/generated/rainbow-emoji-overlay-transparent.dim_200x200.png',
  'sparkle-emoji': '/assets/generated/sparkle-emoji-overlay-transparent.dim_200x200.png',
};

export default function AREffectSelector({ selectedEffect }: AREffectSelectorProps) {
  const [position, setPosition] = useState({ x: 50, y: 40 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Enhanced animation for dynamic AR effects with face tracking simulation
    const interval = setInterval(() => {
      setPosition((prev) => ({
        x: Math.max(45, Math.min(55, prev.x + (Math.random() - 0.5) * 0.8)),
        y: Math.max(35, Math.min(45, prev.y + (Math.random() - 0.5) * 0.8)),
      }));
      
      // Subtle scale animation for breathing effect
      setScale(1 + Math.sin(Date.now() / 1000) * 0.03);
      
      // Slight rotation for natural movement
      setRotation((Math.random() - 0.5) * 2);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  if (!selectedEffect) return null;

  const effectImage = AR_EFFECT_ASSETS[selectedEffect];
  if (!effectImage) return null;

  // Different sizes and positions for different effects
  const effectConfig = {
    'carnival-mask': { width: 'w-40 md:w-56', height: 'h-40 md:h-56', yOffset: 0 },
    'aviator-glasses': { width: 'w-32 md:w-44', height: 'h-32 md:h-44', yOffset: -5 },
    'heart-glasses': { width: 'w-32 md:w-44', height: 'h-32 md:h-44', yOffset: -5 },
    'rainbow-emoji': { width: 'w-36 md:w-48', height: 'h-36 md:h-48', yOffset: -10 },
    'sparkle-emoji': { width: 'w-28 md:w-40', height: 'h-28 md:h-40', yOffset: -8 },
  };

  const config = effectConfig[selectedEffect as keyof typeof effectConfig] || effectConfig['carnival-mask'];

  return (
    <div
      className="ar-overlay"
      style={{
        left: `${position.x}%`,
        top: `${position.y + config.yOffset}%`,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        transition: 'transform 0.08s ease-out',
      }}
    >
      <img
        src={effectImage}
        alt="AR Effect"
        className={`${config.width} ${config.height} object-contain opacity-95 drop-shadow-2xl`}
      />
    </div>
  );
}
