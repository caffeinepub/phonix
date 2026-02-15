import { Sparkles } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AppTheme } from '../App';

interface HeaderProps {
  appTheme: AppTheme;
}

export default function Header({ appTheme }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const text = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      toast.success('Logged out successfully');
    } else {
      try {
        await login();
        toast.success('Logged in successfully!');
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        } else {
          toast.error('Login failed. Please try again.');
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-3xl bg-background/80 premium-glass-overlay">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="w-8 h-8 text-primary premium-logo-glow" />
          </div>
          <h1 className="text-2xl font-bold premium-metallic-text tracking-tight">
            PHONIX
          </h1>
        </div>

        <Button
          onClick={handleAuth}
          disabled={disabled}
          className={`px-6 py-2 rounded-full transition-all duration-300 font-medium premium-button-micro ${
            isAuthenticated
              ? 'bg-gradient-to-r from-muted to-muted-foreground/20 hover:from-muted-foreground/30 hover:to-muted text-foreground'
              : 'bg-gradient-to-r from-primary via-secondary to-accent premium-button-glow text-white'
          } disabled:opacity-50`}
        >
          {text}
        </Button>
      </div>
    </header>
  );
}
