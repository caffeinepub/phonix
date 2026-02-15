import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-primary/20 floating-card mt-auto">
      <div className="container mx-auto px-4 py-6 text-center relative z-10">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          © 2025. Built with{' '}
          <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" />
          {' '}using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-text font-semibold hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

