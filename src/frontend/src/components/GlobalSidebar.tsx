import { Camera, Image, Sparkles, Settings, MapPin, User, Film, Tv, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import type { WindowType } from '../App';

interface GlobalSidebarProps {
  activeWindow: WindowType;
  onWindowChange: (window: WindowType) => void;
  isGuest: boolean;
}

export default function GlobalSidebar({ activeWindow, onWindowChange, isGuest }: GlobalSidebarProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  const navItems = [
    { id: 'camera' as WindowType, icon: Camera, label: 'Camera', gradient: 'from-primary to-secondary', authRequired: false },
    { id: 'gallery' as WindowType, icon: Image, label: 'Gallery', gradient: 'from-secondary to-accent', authRequired: true },
    { id: 'aiTools' as WindowType, icon: Sparkles, label: 'AI Tools', gradient: 'from-accent to-primary', authRequired: true },
    { id: 'stories' as WindowType, icon: Film, label: 'Stories', gradient: 'from-primary via-accent to-secondary', authRequired: false },
    { id: 'entertainment' as WindowType, icon: Tv, label: 'Entertainment', gradient: 'from-secondary via-primary to-accent', authRequired: false },
    { id: 'nearby20' as WindowType, icon: MapPin, label: 'Nearby', gradient: 'from-primary to-accent', authRequired: false },
    { id: 'lucky' as WindowType, icon: MessageCircle, label: 'Lucky AI', gradient: 'from-accent via-secondary to-primary', authRequired: false },
    { id: 'settings' as WindowType, icon: Settings, label: 'Settings', gradient: 'from-secondary to-primary', authRequired: false },
  ];

  const availableNavItems = isGuest ? navItems.filter(item => !item.authRequired) : navItems;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-20 flex-col items-center py-6 gap-4 border-r border-border/40 backdrop-blur-3xl bg-background/80 premium-sidebar z-40">
        <TooltipProvider delayDuration={0}>
          {/* Profile Button */}
          {!isGuest && userProfile && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onWindowChange('profile')}
                  className={`w-14 h-14 rounded-2xl transition-all duration-300 premium-button-micro ${
                    activeWindow === 'profile'
                      ? 'bg-gradient-to-br from-primary to-secondary premium-neon-glow scale-110'
                      : 'hover:bg-primary/10 hover:scale-105'
                  }`}
                >
                  <Avatar className="w-10 h-10 border-2 border-primary/40">
                    {userProfile.profilePictureBlob ? (
                      <AvatarImage src={userProfile.profilePictureBlob.getDirectURL()} alt={userProfile.username} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                        {userProfile.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="premium-glassmorphism-card">
                <p className="font-semibold">Profile</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Navigation Items */}
          {availableNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onWindowChange(item.id)}
                    className={`w-14 h-14 rounded-2xl transition-all duration-300 premium-button-micro ${
                      activeWindow === item.id
                        ? `bg-gradient-to-br ${item.gradient} premium-neon-glow scale-110 text-white`
                        : 'hover:bg-primary/10 hover:scale-105'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="premium-glassmorphism-card">
                  <p className="font-semibold">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 border-t border-border/40 backdrop-blur-3xl bg-background/95 premium-glass-overlay z-50">
        <div className="flex items-center justify-around h-full px-2">
          {availableNavItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                onClick={() => onWindowChange(item.id)}
                className={`w-14 h-14 rounded-2xl transition-all duration-300 premium-button-micro ${
                  activeWindow === item.id
                    ? `bg-gradient-to-br ${item.gradient} premium-neon-glow scale-110 text-white`
                    : 'hover:bg-primary/10'
                }`}
              >
                <Icon className="w-5 h-5" />
              </Button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
