import { useState, useRef } from 'react';
import { useCamera } from '../camera/useCamera';
import { 
  Camera, 
  SwitchCamera, 
  X, 
  Video, 
  Circle, 
  Square,
  Settings,
  Zap,
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSaveMedia } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ExternalBlob } from '../backend';

interface CameraViewProps {
  onPhotoCapture?: (photoUrl: string) => void;
  onLogin?: () => void;
  onGuestMode?: () => void;
  isAuthenticated?: boolean;
  isGuest?: boolean;
}

type CaptureMode = 'photo' | 'video';

export default function CameraView({ onPhotoCapture, onLogin, onGuestMode, isAuthenticated = false, isGuest = false }: CameraViewProps) {
  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: 'user', quality: 0.98 });

  const { identity } = useInternetIdentity();
  const saveMediaMutation = useSaveMedia();

  const [captureMode, setCaptureMode] = useState<CaptureMode>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleCapture = async () => {
    if (captureMode === 'photo') {
      setIsCapturing(true);
      const photo = await capturePhoto();
      if (photo) {
        const url = URL.createObjectURL(photo);
        if (onPhotoCapture) {
          if (!isAuthenticated && !isGuest) {
            toast.info('Please sign in to save photos to Gallery', {
              duration: 3000,
            });
          } else {
            onPhotoCapture(url);
            toast.success('📸 Photo captured! Opening Enhancement...', {
              duration: 2000,
            });
          }
        }
      } else {
        toast.error('Failed to capture photo');
      }
      setTimeout(() => setIsCapturing(false), 400);
    }
  };

  const startRecording = async () => {
    if (!isAuthenticated && !isGuest) {
      toast.info('Please sign in to record videos', {
        duration: 3000,
      });
      return;
    }

    if (!videoRef.current || !videoRef.current.srcObject) {
      toast.error('Camera not ready');
      return;
    }

    try {
      const stream = videoRef.current.srcObject as MediaStream;
      
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4'
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      if (!selectedMimeType) {
        toast.error('Video recording not supported in this browser');
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
      });

      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: selectedMimeType });
        
        if (identity && isAuthenticated) {
          try {
            const videoId = `video-${Date.now()}`;
            const externalBlob = ExternalBlob.fromBytes(new Uint8Array(await blob.arrayBuffer()));
            
            await saveMediaMutation.mutateAsync({
              id: videoId,
              filename: `recording-${Date.now()}.webm`,
              filters: [],
              arEffects: [],
              blob: externalBlob,
              owner: identity.getPrincipal(),
              isVideo: true,
              duration: BigInt(recordingTime),
              tags: ['video', 'recording'],
            });
            
            toast.success('🎥 Video saved to Gallery!');
          } catch (error) {
            console.error('Error saving video:', error);
            toast.error('Failed to save video');
          }
        } else {
          toast.info('Please sign in to save videos to Gallery', {
            duration: 3000,
          });
        }
        
        setRecordingTime(0);
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      toast.success('🎬 Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      toast.success('✅ Recording stopped');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isSupported === false) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-center text-white p-8 premium-glassmorphism-card max-w-md mx-4">
          <Camera className="w-20 h-20 mx-auto mb-6 opacity-60 premium-float" />
          <h3 className="text-2xl font-semibold mb-3 premium-metallic-text">Camera Not Supported</h3>
          <p className="text-white/75 text-lg">Your browser doesn't support camera access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1 overflow-hidden premium-camera-preview">
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-md z-10 cinematic-fade-glow">
            <div className="text-center text-white premium-glassmorphism-card p-14 max-w-lg mx-4">
              <Camera className="w-24 h-24 mx-auto mb-8 opacity-75 premium-float" />
              <p className="text-white/80 mb-8 text-xl leading-relaxed">
                {error ? `Error: ${error.message}` : 'Camera is not active'}
              </p>
              <Button
                onClick={startCamera}
                disabled={isLoading}
                className="bg-gradient-to-r from-primary via-secondary to-accent premium-button-glow text-white px-10 py-7 text-xl premium-button-micro"
                size="lg"
              >
                <Camera className="w-7 h-7 mr-3" />
                {isLoading ? 'Starting Camera...' : 'Start Camera'}
              </Button>
            </div>
          </div>
        )}
        
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ minHeight: '100vh' }}
        />
        <canvas ref={canvasRef} className="hidden" />

        {isCapturing && (
          <div className="absolute inset-0 bg-white animate-pulse z-20 pointer-events-none" style={{ animationDuration: '0.3s' }} />
        )}

        {!isAuthenticated && !isGuest && isActive && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-md px-4">
            <div className="premium-glassmorphism-card p-8 text-center backdrop-blur-3xl bg-black/60 border-2 border-white/30 depth-shadow-xl">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary premium-float" />
              <h3 className="text-2xl font-bold text-white mb-3 premium-metallic-text">Welcome to PHONIX</h3>
              <p className="text-white/80 mb-6 text-lg">Sign in to save your photos and videos, or continue as a guest to explore</p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={onLogin}
                  className="bg-gradient-to-r from-primary via-secondary to-accent premium-button-glow text-white px-8 py-6 text-lg premium-button-micro w-full"
                  size="lg"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In with Internet Identity
                </Button>
                <Button
                  onClick={onGuestMode}
                  variant="outline"
                  className="bg-white/10 backdrop-blur-xl text-white border-2 border-white/40 hover:bg-white/20 px-8 py-6 text-lg premium-button-micro w-full"
                  size="lg"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Continue as Guest
                </Button>
              </div>
            </div>
          </div>
        )}

        {isActive && (
          <>
            <div className="absolute top-0 left-0 right-0 z-30 p-7 cinematic-fade-glow">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <Button
                    onClick={() => setCaptureMode('photo')}
                    size="lg"
                    variant={captureMode === 'photo' ? 'default' : 'ghost'}
                    className={captureMode === 'photo' 
                      ? 'bg-white/30 backdrop-blur-3xl text-white border-2 border-white/60 depth-shadow-md hover:bg-white/40 premium-button-micro' 
                      : 'bg-black/45 backdrop-blur-3xl text-white/85 border border-white/25 hover:bg-black/65 hover:text-white premium-button-micro'}
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Photo
                  </Button>
                  <Button
                    onClick={() => setCaptureMode('video')}
                    size="lg"
                    variant={captureMode === 'video' ? 'default' : 'ghost'}
                    className={captureMode === 'video' 
                      ? 'bg-white/30 backdrop-blur-3xl text-white border-2 border-white/60 depth-shadow-md hover:bg-white/40 premium-button-micro' 
                      : 'bg-black/45 backdrop-blur-3xl text-white/85 border border-white/25 hover:bg-black/65 hover:text-white premium-button-micro'}
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Video
                  </Button>
                </div>

                {isRecording && (
                  <div className="bg-red-600/95 backdrop-blur-3xl text-white px-6 py-3.5 rounded-full animate-pulse depth-shadow-lg flex items-center gap-3 border-2 border-white/35">
                    <Circle className="w-4 h-4 fill-current animate-pulse" />
                    <span className="font-mono text-xl font-bold tracking-wider">REC {formatTime(recordingTime)}</span>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-16 h-16 bg-black/45 backdrop-blur-3xl hover:bg-black/65 text-white depth-shadow-md border border-white/25 premium-button-micro"
                >
                  <Settings className="w-7 h-7" />
                </Button>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-30 p-10 cinematic-fade-glow">
              <div className="flex gap-8 justify-center items-center">
                <Button
                  onClick={() => switchCamera()}
                  variant="ghost"
                  size="icon"
                  disabled={isLoading}
                  className="rounded-full w-18 h-18 bg-black/45 backdrop-blur-3xl hover:bg-black/65 text-white depth-shadow-md border border-white/25 premium-button-micro"
                >
                  <SwitchCamera className="w-8 h-8" />
                </Button>

                {captureMode === 'photo' ? (
                  <Button
                    onClick={handleCapture}
                    disabled={isCapturing || !isActive}
                    size="icon"
                    className="rounded-full w-24 h-24 bg-white/95 hover:bg-white text-black depth-shadow-xl border-4 border-white/60 premium-button-glow premium-button-micro disabled:opacity-50"
                  >
                    <Circle className="w-16 h-16" />
                  </Button>
                ) : (
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={!isActive}
                    size="icon"
                    className={`rounded-full w-24 h-24 depth-shadow-xl border-4 premium-button-micro disabled:opacity-50 ${
                      isRecording
                        ? 'bg-red-600/95 hover:bg-red-700 text-white border-red-400/60 animate-pulse'
                        : 'bg-white/95 hover:bg-white text-red-600 border-white/60 premium-button-glow'
                    }`}
                  >
                    {isRecording ? <Square className="w-12 h-12 fill-current" /> : <Circle className="w-16 h-16 fill-current" />}
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-18 h-18 bg-black/45 backdrop-blur-3xl hover:bg-black/65 text-white depth-shadow-md border border-white/25 premium-button-micro"
                >
                  <Zap className="w-8 h-8" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
