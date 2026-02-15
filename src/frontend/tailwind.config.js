/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'oklch(var(--primary))',
          foreground: 'oklch(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary))',
          foreground: 'oklch(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted))',
          foreground: 'oklch(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent))',
          foreground: 'oklch(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive))',
          foreground: 'oklch(var(--destructive-foreground))',
        },
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring))',
        chart: {
          1: 'oklch(var(--chart-1))',
          2: 'oklch(var(--chart-2))',
          3: 'oklch(var(--chart-3))',
          4: 'oklch(var(--chart-4))',
          5: 'oklch(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'oklch(var(--sidebar))',
          foreground: 'oklch(var(--sidebar-foreground))',
          primary: 'oklch(var(--sidebar-primary))',
          'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
          accent: 'oklch(var(--sidebar-accent))',
          'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
          border: 'oklch(var(--sidebar-border))',
          ring: 'oklch(var(--sidebar-ring))',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 18px oklch(var(--primary) / 0.45), 0 0 36px oklch(var(--secondary) / 0.25)',
        'glow-md': '0 0 30px oklch(var(--primary) / 0.55), 0 0 60px oklch(var(--secondary) / 0.35)',
        'glow-lg': '0 0 48px oklch(var(--primary) / 0.65), 0 0 96px oklch(var(--secondary) / 0.45)',
        'glow-neon': '0 0 60px oklch(var(--primary) / 0.85), 0 0 120px oklch(var(--secondary) / 0.55)',
        'glass': '0 10px 40px oklch(var(--primary) / 0.15), 0 20px 80px oklch(var(--secondary) / 0.12), inset 0 1px 0 oklch(var(--foreground) / 0.08)',
        'glass-hover': '0 18px 60px oklch(var(--primary) / 0.25), 0 36px 120px oklch(var(--secondary) / 0.22), inset 0 1px 0 oklch(var(--foreground) / 0.12)',
        'premium-sm': '0 4px 16px oklch(var(--primary) / 0.18), 0 8px 32px oklch(var(--secondary) / 0.12), inset 0 1px 0 oklch(var(--foreground) / 0.08)',
        'premium-md': '0 8px 32px oklch(var(--primary) / 0.25), 0 16px 64px oklch(var(--secondary) / 0.18), inset 0 1px 0 oklch(var(--foreground) / 0.10)',
        'premium-lg': '0 16px 64px oklch(var(--primary) / 0.32), 0 32px 128px oklch(var(--secondary) / 0.24), inset 0 2px 0 oklch(var(--foreground) / 0.12)',
        'premium-xl': '0 24px 96px oklch(var(--primary) / 0.40), 0 48px 192px oklch(var(--secondary) / 0.32), inset 0 2px 0 oklch(var(--foreground) / 0.15)',
      },
      keyframes: {
        'premium-fade-glow': {
          '0%': { opacity: '0', filter: 'blur(16px) brightness(0.3)', transform: 'scale(0.96) translateY(8px)' },
          '100%': { opacity: '1', filter: 'blur(0px) brightness(1)', transform: 'scale(1) translateY(0)' },
        },
        'premium-slide-zoom': {
          '0%': { opacity: '0', transform: 'translateY(50px) scale(0.92) rotateX(5deg)', filter: 'blur(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1) rotateX(0deg)', filter: 'blur(0px)' },
        },
        'premium-glass-float': {
          '0%, 100%': { 
            transform: 'translateY(0px) rotateX(0deg)',
            boxShadow: '0 16px 64px oklch(var(--primary) / 0.30), 0 32px 128px oklch(var(--primary) / 0.22), inset 0 2px 0 oklch(var(--foreground) / 0.12), inset 0 -1px 0 oklch(var(--primary) / 0.08)'
          },
          '50%': { 
            transform: 'translateY(-12px) rotateX(1deg)',
            boxShadow: '0 24px 80px oklch(var(--primary) / 0.42), 0 48px 160px oklch(var(--secondary) / 0.34), inset 0 2px 0 oklch(var(--foreground) / 0.18), inset 0 -1px 0 oklch(var(--primary) / 0.12)'
          },
        },
        'premium-neon-glow': {
          '0%, 100%': { boxShadow: '0 0 30px oklch(var(--primary) / 0.55), 0 0 60px oklch(var(--secondary) / 0.42), 0 0 90px oklch(var(--accent) / 0.28), inset 0 1px 0 oklch(var(--foreground) / 0.12)' },
          '50%': { boxShadow: '0 0 45px oklch(var(--primary) / 0.75), 0 0 90px oklch(var(--secondary) / 0.62), 0 0 135px oklch(var(--accent) / 0.48), inset 0 1px 0 oklch(var(--foreground) / 0.18)' },
        },
        'premium-focus-pulse': {
          '0%': { boxShadow: '0 0 0 0 oklch(var(--primary) / 0.9)' },
          '70%': { boxShadow: '0 0 0 16px oklch(var(--primary) / 0)' },
          '100%': { boxShadow: '0 0 0 0 oklch(var(--primary) / 0)' },
        },
        'premium-metallic-shimmer': {
          '0%, 100%': { 
            textShadow: '0 0 15px oklch(var(--primary) / 0.95), 0 0 30px oklch(var(--primary) / 0.75), 0 0 45px oklch(var(--secondary) / 0.55), 0 0 60px oklch(var(--accent) / 0.35), 2px 2px 4px oklch(0 0 0 / 0.3)',
            filter: 'brightness(1) contrast(1.1)'
          },
          '50%': { 
            textShadow: '0 0 22px oklch(var(--primary) / 1), 0 0 44px oklch(var(--primary) / 0.95), 0 0 66px oklch(var(--secondary) / 0.75), 0 0 88px oklch(var(--accent) / 0.55), 2px 2px 6px oklch(0 0 0 / 0.4)',
            filter: 'brightness(1.3) contrast(1.15)'
          },
        },
        'premium-button-glow': {
          '0%, 100%': { boxShadow: '0 6px 24px oklch(var(--primary) / 0.60), 0 12px 48px oklch(var(--secondary) / 0.42), inset 0 2px 0 oklch(var(--foreground) / 0.12), inset 0 -1px 0 oklch(0 0 0 / 0.15)', transform: 'translateY(0px)' },
          '50%': { boxShadow: '0 8px 32px oklch(var(--primary) / 0.82), 0 16px 64px oklch(var(--secondary) / 0.64), inset 0 2px 0 oklch(var(--foreground) / 0.18), inset 0 -1px 0 oklch(0 0 0 / 0.2)', transform: 'translateY(-2px)' },
        },
        'premium-float': {
          '0%, 100%': { transform: 'translateY(0px) translateZ(0px)' },
          '50%': { transform: 'translateY(-15px) translateZ(10px)' },
        },
        'premium-shimmer': {
          '0%': { backgroundPosition: '-1400px 0' },
          '100%': { backgroundPosition: '1400px 0' },
        },
        'premium-camera-pulse': {
          '0%, 100%': { boxShadow: '0 0 45px oklch(var(--primary) / 0.85), 0 0 90px oklch(var(--secondary) / 0.65), 0 0 135px oklch(var(--accent) / 0.45), inset 0 2px 0 oklch(var(--foreground) / 0.15)' },
          '50%': { boxShadow: '0 0 75px oklch(var(--primary) / 1), 0 0 150px oklch(var(--secondary) / 0.85), 0 0 225px oklch(var(--accent) / 0.65), inset 0 2px 0 oklch(var(--foreground) / 0.22)' },
        },
        'premium-logo-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 22px oklch(var(--primary) / 0.92)) drop-shadow(0 0 44px oklch(var(--secondary) / 0.72)) drop-shadow(0 0 66px oklch(var(--accent) / 0.52))' },
          '50%': { filter: 'drop-shadow(0 0 30px oklch(var(--primary) / 1)) drop-shadow(0 0 60px oklch(var(--secondary) / 0.92)) drop-shadow(0 0 90px oklch(var(--accent) / 0.72))' },
        },
        'premium-metallic-gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'premium-parallax-bg': {
          '0%': { backgroundPosition: '0% 0%, 100% 100%, 50% 50%, 0% 0%' },
          '33%': { backgroundPosition: '100% 50%, 0% 50%, 60% 40%, 50% 50%' },
          '66%': { backgroundPosition: '50% 100%, 50% 0%, 40% 60%, 100% 100%' },
          '100%': { backgroundPosition: '0% 50%, 100% 50%, 50% 50%, 50% 50%' },
        },
        'ambient-lighting-drift': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(20px, -20px) scale(1.05)' },
          '100%': { transform: 'translate(-20px, 20px) scale(1)' },
        },
        'texture-drift': {
          '0%': { backgroundPosition: '0 0, 0% 0%, 0% 0%' },
          '100%': { backgroundPosition: '400px 400px, 100% 100%, 100% 100%' },
        },
        // Legacy animations
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'refined-shimmer': {
          '0%': { backgroundPosition: '-1200px 0' },
          '100%': { backgroundPosition: '1200px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'refined-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-glow': {
          '0%': { opacity: '0', filter: 'blur(10px) brightness(0.5)' },
          '100%': { opacity: '1', filter: 'blur(0px) brightness(1)' },
        },
        'refined-fade-glow': {
          '0%': { opacity: '0', filter: 'blur(12px) brightness(0.4)', transform: 'scale(0.98)' },
          '100%': { opacity: '1', filter: 'blur(0px) brightness(1)', transform: 'scale(1)' },
        },
        'slide-zoom': {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'refined-slide-zoom': {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.94)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0px)' },
        },
        'float-card': {
          '0%, 100%': { 
            transform: 'translateY(0px)',
            boxShadow: '0 10px 40px oklch(var(--primary) / 0.2), 0 20px 80px oklch(var(--secondary) / 0.15)'
          },
          '50%': { 
            transform: 'translateY(-8px)',
            boxShadow: '0 15px 50px oklch(var(--primary) / 0.3), 0 30px 100px oklch(var(--secondary) / 0.25)'
          },
        },
        'glass-float-card': {
          '0%, 100%': { 
            transform: 'translateY(0px)',
            boxShadow: '0 12px 48px oklch(var(--primary) / 0.25), 0 24px 96px oklch(var(--secondary) / 0.18), inset 0 1px 0 oklch(var(--foreground) / 0.1)'
          },
          '50%': { 
            transform: 'translateY(-10px)',
            boxShadow: '0 18px 60px oklch(var(--primary) / 0.35), 0 36px 120px oklch(var(--secondary) / 0.28), inset 0 1px 0 oklch(var(--foreground) / 0.15)'
          },
        },
        'soft-glow': {
          '0%, 100%': { boxShadow: '0 0 20px oklch(var(--primary) / 0.4), 0 0 40px oklch(var(--secondary) / 0.3)' },
          '50%': { boxShadow: '0 0 30px oklch(var(--primary) / 0.6), 0 0 60px oklch(var(--secondary) / 0.5)' },
        },
        'glass-glow': {
          '0%, 100%': { boxShadow: '0 0 24px oklch(var(--primary) / 0.45), 0 0 48px oklch(var(--secondary) / 0.35), inset 0 1px 0 oklch(var(--foreground) / 0.1)' },
          '50%': { boxShadow: '0 0 36px oklch(var(--primary) / 0.65), 0 0 72px oklch(var(--secondary) / 0.55), inset 0 1px 0 oklch(var(--foreground) / 0.15)' },
        },
        'neon-shimmer': {
          '0%, 100%': { 
            textShadow: '0 0 10px oklch(var(--primary) / 0.8), 0 0 20px oklch(var(--primary) / 0.6), 0 0 30px oklch(var(--secondary) / 0.4)',
            filter: 'brightness(1)'
          },
          '50%': { 
            textShadow: '0 0 15px oklch(var(--primary) / 1), 0 0 30px oklch(var(--primary) / 0.8), 0 0 45px oklch(var(--secondary) / 0.6)',
            filter: 'brightness(1.2)'
          },
        },
        'layered-neon-shimmer': {
          '0%, 100%': { 
            textShadow: '0 0 12px oklch(var(--primary) / 0.9), 0 0 24px oklch(var(--primary) / 0.7), 0 0 36px oklch(var(--secondary) / 0.5), 0 0 48px oklch(var(--accent) / 0.3)',
            filter: 'brightness(1)'
          },
          '50%': { 
            textShadow: '0 0 18px oklch(var(--primary) / 1), 0 0 36px oklch(var(--primary) / 0.9), 0 0 54px oklch(var(--secondary) / 0.7), 0 0 72px oklch(var(--accent) / 0.5)',
            filter: 'brightness(1.25)'
          },
        },
        'button-glow': {
          '0%, 100%': { boxShadow: '0 4px 15px oklch(var(--primary) / 0.5), 0 8px 30px oklch(var(--secondary) / 0.3)' },
          '50%': { boxShadow: '0 6px 20px oklch(var(--primary) / 0.7), 0 12px 40px oklch(var(--secondary) / 0.5)' },
        },
        'futuristic-button-glow': {
          '0%, 100%': { boxShadow: '0 4px 18px oklch(var(--primary) / 0.55), 0 8px 36px oklch(var(--secondary) / 0.35), inset 0 1px 0 oklch(var(--foreground) / 0.1)' },
          '50%': { boxShadow: '0 6px 24px oklch(var(--primary) / 0.75), 0 12px 48px oklch(var(--secondary) / 0.55), inset 0 1px 0 oklch(var(--foreground) / 0.15)' },
        },
        'pulse-glow-camera': {
          '0%, 100%': { boxShadow: '0 0 30px oklch(var(--primary) / 0.7), 0 0 60px oklch(var(--secondary) / 0.5)' },
          '50%': { boxShadow: '0 0 50px oklch(var(--primary) / 1), 0 0 100px oklch(var(--secondary) / 0.7)' },
        },
        'refined-pulse-glow-camera': {
          '0%, 100%': { boxShadow: '0 0 36px oklch(var(--primary) / 0.75), 0 0 72px oklch(var(--secondary) / 0.55), inset 0 1px 0 oklch(var(--foreground) / 0.1)' },
          '50%': { boxShadow: '0 0 60px oklch(var(--primary) / 1), 0 0 120px oklch(var(--secondary) / 0.75), inset 0 1px 0 oklch(var(--foreground) / 0.15)' },
        },
        'logo-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 15px oklch(var(--primary) / 0.8)) drop-shadow(0 0 30px oklch(var(--secondary) / 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 20px oklch(var(--primary) / 1)) drop-shadow(0 0 40px oklch(var(--secondary) / 0.8))' },
        },
        'refined-logo-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 18px oklch(var(--primary) / 0.85)) drop-shadow(0 0 36px oklch(var(--secondary) / 0.65))' },
          '50%': { filter: 'drop-shadow(0 0 24px oklch(var(--primary) / 1)) drop-shadow(0 0 48px oklch(var(--secondary) / 0.85))' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'layered-gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'parallax-bg': {
          '0%': { backgroundPosition: '0% 0%, 100% 100%, 50% 50%, 0% 0%' },
          '50%': { backgroundPosition: '100% 100%, 0% 0%, 60% 40%, 100% 100%' },
          '100%': { backgroundPosition: '50% 50%, 50% 50%, 40% 60%, 50% 50%' },
        },
        'layered-parallax-bg': {
          '0%': { backgroundPosition: '0% 0%, 100% 100%, 50% 50%, 0% 0%' },
          '50%': { backgroundPosition: '100% 100%, 0% 0%, 60% 40%, 100% 100%' },
          '100%': { backgroundPosition: '50% 50%, 50% 50%, 40% 60%, 50% 50%' },
        },
      },
      animation: {
        'premium-fade-glow': 'premium-fade-glow 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'premium-slide-zoom': 'premium-slide-zoom 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        'premium-glass-float': 'premium-glass-float 5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        'premium-neon-glow': 'premium-neon-glow 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        'premium-focus-pulse': 'premium-focus-pulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'premium-metallic-shimmer': 'premium-metallic-shimmer 3.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        'premium-button-glow': 'premium-button-glow 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        'premium-float': 'premium-float 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        'premium-shimmer': 'premium-shimmer 4s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95)',
        'premium-camera-pulse': 'premium-camera-pulse 3s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        'premium-logo-glow': 'premium-logo-glow 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        'premium-metallic-gradient': 'premium-metallic-gradient 6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
        'premium-parallax-bg': 'premium-parallax-bg 25s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
        'ambient-lighting-drift': 'ambient-lighting-drift 15s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate',
        'texture-drift': 'texture-drift 40s linear infinite',
        // Legacy animations
        shimmer: 'shimmer 3s infinite linear',
        'refined-shimmer': 'refined-shimmer 3.5s infinite linear',
        float: 'float 3s ease-in-out infinite',
        'refined-float': 'refined-float 3.5s ease-in-out infinite',
        'fade-glow': 'fade-glow 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'refined-fade-glow': 'refined-fade-glow 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-zoom': 'slide-zoom 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'refined-slide-zoom': 'refined-slide-zoom 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'float-card': 'float-card 4s ease-in-out infinite',
        'glass-float-card': 'glass-float-card 4.5s ease-in-out infinite',
        'soft-glow': 'soft-glow 3s ease-in-out infinite',
        'glass-glow': 'glass-glow 3.5s ease-in-out infinite',
        'neon-shimmer': 'neon-shimmer 2.5s ease-in-out infinite',
        'layered-neon-shimmer': 'layered-neon-shimmer 3s ease-in-out infinite',
        'button-glow': 'button-glow 2s ease-in-out infinite',
        'futuristic-button-glow': 'futuristic-button-glow 2.5s ease-in-out infinite',
        'pulse-glow-camera': 'pulse-glow-camera 2s ease-in-out infinite',
        'refined-pulse-glow-camera': 'refined-pulse-glow-camera 2.5s ease-in-out infinite',
        'logo-glow': 'logo-glow 3s ease-in-out infinite',
        'refined-logo-glow': 'refined-logo-glow 3.5s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'layered-gradient-shift': 'layered-gradient-shift 5s ease infinite',
        'parallax-bg': 'parallax-bg 20s ease-in-out infinite alternate',
        'layered-parallax-bg': 'layered-parallax-bg 20s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

