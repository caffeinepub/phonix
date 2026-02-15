import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalSidebar from './components/GlobalSidebar';
import IntroSplash from './components/IntroSplash';
import LoginView from './components/LoginView';
import CameraView from './components/CameraView';
import GalleryView from './components/GalleryView';
import EnhanceView from './components/EnhanceView';
import AdvancedEditView from './components/AdvancedEditView';
import AIToolsView from './components/AIToolsView';
import SettingsView from './components/SettingsView';
import Nearby20View from './components/Nearby20View';
import ProfileView from './components/ProfileView';
import StoriesView from './components/StoriesView';
import EntertainmentView from './components/EntertainmentView';
import LuckyView from './components/LuckyView';
import ProfileSetupModal from './components/ProfileSetupModal';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';

export type WindowType = 'login' | 'camera' | 'gallery' | 'editing' | 'enhance' | 'aiTools' | 'settings' | 'nearby20' | 'profile' | 'stories' | 'entertainment' | 'lucky';
export type AppTheme = 'neon-night' | 'sun-glow' | 'dreamscape' | 'ocean-breeze' | 'sunset-vibes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { identity, isInitializing, clear, login } = useInternetIdentity();
  const [showIntro, setShowIntro] = useState(true);
  const [activeWindow, setActiveWindow] = useState<WindowType>('camera');
  const [selectedMediaForEnhance, setSelectedMediaForEnhance] = useState<string | null>(null);
  const [selectedMediaForEdit, setSelectedMediaForEdit] = useState<string | null>(null);
  const [selectedMediaForAI, setSelectedMediaForAI] = useState<string | null>(null);
  const [appTheme, setAppTheme] = useState<AppTheme>('neon-night');
  const [capturedPhotoForEnhance, setCapturedPhotoForEnhance] = useState<string | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    const themeClass = appTheme === 'neon-night' ? '' : `theme-${appTheme}`;
    document.body.className = document.body.className.replace(/theme-\S+/g, '');
    if (themeClass) {
      document.body.classList.add(themeClass);
    }
  }, [appTheme]);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleEnhanceMedia = (mediaId: string) => {
    setSelectedMediaForEnhance(mediaId);
    setActiveWindow('enhance');
  };

  const handleEditMedia = (mediaId: string) => {
    setSelectedMediaForEdit(mediaId);
    setActiveWindow('editing');
  };

  const handleAIEnhanceMedia = (mediaId: string) => {
    setSelectedMediaForAI(mediaId);
    setActiveWindow('aiTools');
  };

  const handleCapturedPhoto = (photoUrl: string) => {
    setCapturedPhotoForEnhance(photoUrl);
    setActiveWindow('enhance');
  };

  const handleGuestMode = () => {
    setIsGuestMode(true);
    if (activeWindow === 'login') {
      setActiveWindow('camera');
    }
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    setIsGuestMode(false);
    setActiveWindow('camera');
  };

  if (showIntro) {
    return <IntroSplash onComplete={handleIntroComplete} />;
  }

  const renderWindow = () => {
    switch (activeWindow) {
      case 'camera':
        return (
          <CameraView 
            onPhotoCapture={handleCapturedPhoto}
            onLogin={handleLogin}
            onGuestMode={handleGuestMode}
            isAuthenticated={isAuthenticated}
            isGuest={isGuestMode}
          />
        );
      case 'login':
        return <LoginView onGuestMode={handleGuestMode} />;
      case 'gallery':
        if (!isAuthenticated) {
          return <LoginView onGuestMode={handleGuestMode} />;
        }
        return (
          <GalleryView
            onEnhanceMedia={handleEnhanceMedia}
            onEditMedia={handleEditMedia}
            onAIEnhance={handleAIEnhanceMedia}
          />
        );
      case 'enhance':
        if (!isAuthenticated) {
          return <LoginView onGuestMode={handleGuestMode} />;
        }
        return <EnhanceView selectedMediaId={selectedMediaForEnhance} capturedPhotoUrl={capturedPhotoForEnhance} />;
      case 'editing':
        if (!isAuthenticated) {
          return <LoginView onGuestMode={handleGuestMode} />;
        }
        return <AdvancedEditView selectedMediaId={selectedMediaForEdit} />;
      case 'aiTools':
        if (!isAuthenticated) {
          return <LoginView onGuestMode={handleGuestMode} />;
        }
        return <AIToolsView selectedMediaId={selectedMediaForAI} />;
      case 'settings':
        return <SettingsView appTheme={appTheme} onThemeChange={setAppTheme} onLogout={handleLogout} />;
      case 'nearby20':
        return <Nearby20View isGuest={!isAuthenticated} />;
      case 'profile':
        if (!isAuthenticated) {
          return <LoginView onGuestMode={handleGuestMode} />;
        }
        return <ProfileView onNavigateToCamera={() => setActiveWindow('camera')} onNavigateToGallery={() => setActiveWindow('gallery')} />;
      case 'stories':
        return <StoriesView isGuest={!isAuthenticated} onNavigateToLogin={() => setActiveWindow('login')} />;
      case 'entertainment':
        return <EntertainmentView isGuest={!isAuthenticated} onNavigateToLogin={() => setActiveWindow('login')} />;
      case 'lucky':
        return <LuckyView />;
      default:
        return (
          <CameraView 
            onPhotoCapture={handleCapturedPhoto}
            onLogin={handleLogin}
            onGuestMode={handleGuestMode}
            isAuthenticated={isAuthenticated}
            isGuest={isGuestMode}
          />
        );
    }
  };

  if (activeWindow === 'camera') {
    return (
      <div className="min-h-screen">
        {renderWindow()}
        <Toaster />
        {showProfileSetup && <ProfileSetupModal />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {(isAuthenticated || isGuestMode) && <Header appTheme={appTheme} />}
      
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {(isAuthenticated || isGuestMode) && (
          <GlobalSidebar 
            activeWindow={activeWindow} 
            onWindowChange={setActiveWindow}
            isGuest={!isAuthenticated}
          />
        )}
        
        <main className={`flex-1 ${(isAuthenticated || isGuestMode) ? 'container mx-auto px-4 py-8 max-w-7xl lg:ml-20 pb-24 lg:pb-8' : ''} relative z-10 window-transition`}>
          {renderWindow()}
        </main>
      </div>

      {(isAuthenticated || isGuestMode) && <Footer />}
      <Toaster />
      
      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AppContent />
        </ThemeProvider>
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}

export default App;
