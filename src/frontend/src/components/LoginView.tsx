import { LogIn, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface LoginViewProps {
  onGuestMode: () => void;
}

export default function LoginView({ onGuestMode }: LoginViewProps) {
  const { login, loginStatus, clear } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  const handleGuestMode = () => {
    onGuestMode();
    toast.info('Guest mode: Browse public content. Sign in to create and save.');
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md premium-glassmorphism-card depth-shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center premium-neon-glow animate-float">
            <img 
              src="/assets/generated/phonix-logo-neon-glow-transparent.dim_300x100.png" 
              alt="PHONIX" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold premium-metallic-text">
            Welcome to PHONIX
          </CardTitle>
          <CardDescription className="text-base">
            Capture, enhance, and share your moments with powerful AI tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full h-14 text-lg bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all duration-300 premium-neon-glow premium-button-micro"
            size="lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            {isLoggingIn ? 'Signing in...' : 'Sign in with Internet Identity'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            onClick={handleGuestMode}
            disabled={isLoggingIn}
            variant="outline"
            className="w-full h-14 text-lg border-primary/30 hover:bg-primary/10 transition-all duration-300 premium-button-micro"
            size="lg"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Continue as Guest
          </Button>

          <div className="pt-4 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
