import { useEffect, useState } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

export default function IntroSplash({ onComplete }: IntroSplashProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 900);
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-background via-card to-background transition-opacity duration-900 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Premium animated background with ultra-rich textures and depth blur */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-primary/30 rounded-full blur-[120px] pro-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-secondary/26 rounded-full blur-[120px] pro-float" style={{ animationDelay: '1.2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-accent/22 rounded-full blur-[140px] pro-float" style={{ animationDelay: '0.6s' }} />
      </div>

      {/* Metallic texture overlay with enhanced opacity */}
      <div className="absolute inset-0 opacity-24 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-secondary/12" />
      </div>

      {/* Logo container with premium styling and cinematic effects */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Animated logo with sophisticated glow, depth, and gradient layering */}
        <div className={`transition-all duration-1200 ${isVisible ? 'scale-100 opacity-100' : 'scale-115 opacity-0'}`}>
          <img
            src="/assets/generated/phonix-logo-animated-glow-transparent.dim_300x100.png"
            alt="PHONIX"
            className="w-96 h-auto pro-logo-glow pro-float"
          />
        </div>

        {/* Animated tagline with metallic shimmer and enhanced effects */}
        <div className={`transition-all duration-1200 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <p className="text-2xl font-semibold text-foreground/85 pro-metallic-text text-center tracking-wide">
            Professional Social Creative Platform
          </p>
        </div>

        {/* Premium loading indicator with depth-based shadows and enhanced motion */}
        <div className={`transition-all duration-1200 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <div className="flex gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse pro-depth-shadow-sm" style={{ animationDelay: '0s' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse pro-depth-shadow-sm" style={{ animationDelay: '0.25s' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse pro-depth-shadow-sm" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>

      {/* Elegant glassmorphism overlay effect with gradient layering */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/65 via-transparent to-background/65 pointer-events-none" />
    </div>
  );
}
