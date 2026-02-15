import { useState } from 'react';
import { Settings, Moon, Sun, Globe, Camera, Shield, Save, Palette, Check, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import type { AppTheme } from '../App';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface SettingsViewProps {
  appTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  onLogout: () => Promise<void>;
}

const THEME_OPTIONS: { value: AppTheme; label: string; description: string; preview: string }[] = [
  { 
    value: 'neon-night', 
    label: 'Neon Night', 
    description: 'Dark with bright neon accents',
    preview: '/assets/generated/neon-night-theme-bg.dim_1920x1080.png'
  },
  { 
    value: 'sun-glow', 
    label: 'Sun Glow', 
    description: 'Warm golden gradients',
    preview: '/assets/generated/sun-glow-theme-bg.dim_1920x1080.png'
  },
  { 
    value: 'dreamscape', 
    label: 'Dreamscape', 
    description: 'Purple-pink ethereal tones',
    preview: '/assets/generated/dreamscape-theme-bg.dim_1920x1080.png'
  },
  { 
    value: 'ocean-breeze', 
    label: 'Ocean Breeze', 
    description: 'Blue-teal flowing gradients',
    preview: '/assets/generated/ocean-breeze-theme-bg.dim_1920x1080.png'
  },
  { 
    value: 'sunset-vibes', 
    label: 'Sunset Vibes', 
    description: 'Orange-red warm transitions',
    preview: '/assets/generated/sunset-vibes-theme-bg.dim_1920x1080.png'
  },
];

export default function SettingsView({ appTheme, onThemeChange, onLogout }: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const { identity } = useInternetIdentity();
  
  const [language, setLanguage] = useState('en');
  const [photoResolution, setPhotoResolution] = useState('1080');
  const [privacy, setPrivacy] = useState('public');
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const handleThemeChange = (newTheme: AppTheme) => {
    onThemeChange(newTheme);
    toast.success(`Theme changed to ${THEME_OPTIONS.find(t => t.value === newTheme)?.label}!`);
  };

  const handleSaveSettings = async () => {
    toast.success('Settings saved successfully!');
  };

  const handleLogout = async () => {
    try {
      await onLogout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6 premium-fade-glow">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold premium-metallic-text">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Customize your professional experience
          </p>
        </div>
        <Settings className="w-8 h-8 text-primary premium-neon-glow" />
      </div>

      {/* Theme Selection */}
      <Card className="premium-glassmorphism-card depth-shadow-md premium-slide-zoom">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary premium-neon-glow">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">App Theme</CardTitle>
              <CardDescription>Choose your visual style - changes apply instantly</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEME_OPTIONS.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => handleThemeChange(themeOption.value)}
                className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 group premium-button-micro ${
                  appTheme === themeOption.value 
                    ? 'border-primary premium-neon-glow scale-105' 
                    : 'border-border hover:border-primary/50 hover:scale-102'
                }`}
              >
                <div className="aspect-video relative">
                  <img
                    src={themeOption.preview}
                    alt={themeOption.label}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/generated/gradient-bg-main.dim_1920x1080.png';
                    }}
                  />
                  {appTheme === themeOption.value && (
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent flex items-end justify-center pb-2">
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <Check className="w-4 h-4" />
                        <span>Active</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-card/80 backdrop-blur-sm">
                  <p className="font-bold text-sm">{themeOption.label}</p>
                  <p className="text-xs text-muted-foreground">{themeOption.description}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card className="premium-glassmorphism-card depth-shadow-md premium-slide-zoom">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary premium-neon-glow">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-white" />
                ) : (
                  <Sun className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Light or dark mode</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="text-base">Mode</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-32 premium-curved-corners">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="premium-curved-corners">
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save" className="text-base">Auto-save edits</Label>
              <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="premium-glassmorphism-card depth-shadow-md premium-slide-zoom">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-secondary to-accent premium-neon-glow">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Language</CardTitle>
                <CardDescription>Choose your language</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="language" className="text-base">App Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32 premium-curved-corners">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="premium-curved-corners">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-base">Notifications</Label>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* Camera Settings */}
        <Card className="premium-glassmorphism-card depth-shadow-md premium-slide-zoom">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-accent to-primary premium-neon-glow">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Camera</CardTitle>
                <CardDescription>Configure camera</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="resolution" className="text-base">Photo Resolution</Label>
              <Select value={photoResolution} onValueChange={setPhotoResolution}>
                <SelectTrigger className="w-32 premium-curved-corners">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="premium-curved-corners">
                  <SelectItem value="720">720p</SelectItem>
                  <SelectItem value="1080">1080p</SelectItem>
                  <SelectItem value="1440">1440p</SelectItem>
                  <SelectItem value="2160">4K</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="premium-glassmorphism-card depth-shadow-md premium-slide-zoom">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary premium-neon-glow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>Manage privacy</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="privacy" className="text-base">Default Privacy</Label>
              <Select value={privacy} onValueChange={setPrivacy}>
                <SelectTrigger className="w-32 premium-curved-corners">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="premium-curved-corners">
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        {isAuthenticated && (
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-destructive/30 hover:bg-destructive/10 text-destructive hover:text-destructive transition-all duration-300 premium-button-micro px-8 py-6 text-lg"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        )}
        <Button
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all duration-300 premium-neon-glow hover:scale-105 premium-curved-corners px-8 py-6 text-lg premium-button-micro"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
