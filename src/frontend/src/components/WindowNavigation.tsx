import { Camera, Image as ImageIcon, Sparkles, Scissors, Wand2, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { WindowType } from '../App';

interface WindowNavigationProps {
  activeWindow: WindowType;
  onWindowChange: (window: WindowType) => void;
}

export default function WindowNavigation({ activeWindow, onWindowChange }: WindowNavigationProps) {
  const windows = [
    { id: 'camera' as WindowType, label: 'Camera', icon: Camera, gradient: 'from-primary to-secondary' },
    { id: 'gallery' as WindowType, label: 'Gallery', icon: ImageIcon, gradient: 'from-secondary to-accent' },
    { id: 'editing' as WindowType, label: 'Editing', icon: Scissors, gradient: 'from-accent to-primary' },
    { id: 'enhance' as WindowType, label: 'Enhance', icon: Sparkles, gradient: 'from-primary via-accent to-secondary' },
    { id: 'aiTools' as WindowType, label: 'AI Tools', icon: Wand2, gradient: 'from-secondary via-primary to-accent' },
    { id: 'nearby20' as WindowType, label: 'Nearby 20', icon: Users, gradient: 'from-accent via-secondary to-primary' },
    { id: 'settings' as WindowType, label: 'Settings', icon: Settings, gradient: 'from-primary to-accent' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-primary/20 bg-card/40 backdrop-blur-xl sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
        <nav className="p-4 space-y-2">
          <div className="mb-6">
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              PHONIX
            </h2>
            <p className="text-xs text-muted-foreground">Navigate between app sections</p>
          </div>
          
          {windows.map((window) => {
            const Icon = window.icon;
            const isActive = activeWindow === window.id;
            
            return (
              <Button
                key={window.id}
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 transition-all duration-300 h-12',
                  isActive && `bg-gradient-to-r ${window.gradient} text-white shadow-glow-md hover:shadow-glow-lg`,
                  !isActive && 'hover:bg-primary/10 hover:text-primary hover:shadow-glow-sm'
                )}
                onClick={() => onWindowChange(window.id)}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{window.label}</span>
              </Button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-primary/20 bg-card/95 backdrop-blur-xl">
        <div className="flex justify-around items-center px-2 py-2">
          {windows.map((window) => {
            const Icon = window.icon;
            const isActive = activeWindow === window.id;
            
            return (
              <Button
                key={window.id}
                variant="ghost"
                size="sm"
                className={cn(
                  'flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-300',
                  isActive && 'text-primary shadow-glow-sm',
                  !isActive && 'text-muted-foreground hover:text-primary'
                )}
                onClick={() => onWindowChange(window.id)}
              >
                <Icon className={cn('w-5 h-5', isActive && 'animate-pulse')} />
                <span className="text-[10px] font-medium">{window.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
