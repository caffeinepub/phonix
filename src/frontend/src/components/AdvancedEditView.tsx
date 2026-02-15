import { useState, useRef, useEffect } from 'react';
import { Upload, Scissors, RotateCw, Crop, Zap, Layers, Download, RotateCcw, Play, Pause, Tag, Plus, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useGetAllMedia } from '../hooks/useQueries';

interface AdvancedEditViewProps {
  selectedMediaId: string | null;
}

interface EditSettings {
  rotation: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  speed: number;
  transition: string;
  overlay: string;
}

const TRANSITIONS = ['None', 'Fade', 'Slide', 'Zoom', 'Dissolve'];
const OVERLAYS = ['None', 'Vignette', 'Light Leak', 'Film Grain', 'Bokeh'];
const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

export default function AdvancedEditView({ selectedMediaId }: AdvancedEditViewProps) {
  const { data: media } = useGetAllMedia();
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: 'photo' | 'video'; id?: string } | null>(null);
  const [originalMedia, setOriginalMedia] = useState<{ url: string; type: 'photo' | 'video'; id?: string } | null>(null);
  const [editSettings, setEditSettings] = useState<EditSettings>({
    rotation: 0,
    cropX: 0,
    cropY: 0,
    cropWidth: 100,
    cropHeight: 100,
    speed: 1,
    transition: 'None',
    overlay: 'None',
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (selectedMediaId && media) {
      const mediaItem = media.find((m) => m.id === selectedMediaId);
      if (mediaItem) {
        const mediaUrl = mediaItem.blob.getDirectURL();
        const mediaData = { 
          url: mediaUrl, 
          type: mediaItem.isVideo ? 'video' as const : 'photo' as const,
          id: mediaItem.id
        };
        setSelectedMedia(mediaData);
        setOriginalMedia(mediaData);
        setTags(mediaItem.tags || []);
      }
    }
  }, [selectedMediaId, media]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onload = (e) => {
        const mediaUrl = e.target?.result as string;
        const mediaData = { url: mediaUrl, type: isVideo ? 'video' as const : 'photo' as const };
        setSelectedMedia(mediaData);
        setOriginalMedia(mediaData);
        setTags([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRotate = () => {
    setEditSettings((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  };

  const handleReset = () => {
    setEditSettings({
      rotation: 0,
      cropX: 0,
      cropY: 0,
      cropWidth: 100,
      cropHeight: 100,
      speed: 1,
      transition: 'None',
      overlay: 'None',
    });
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
      toast.success(`Tag "${trimmedTag}" added`);
    } else if (tags.includes(trimmedTag)) {
      toast.error('Tag already exists');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    toast.success(`Tag "${tagToRemove}" removed`);
  };

  const handleDownload = () => {
    if (!selectedMedia) return;

    if (selectedMedia.type === 'photo' && canvasRef.current) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((editSettings.rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `edited_${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('Edited photo downloaded!');
          }
        }, 'image/jpeg', 0.95);
      };
      img.src = selectedMedia.url;
    } else if (selectedMedia.type === 'video') {
      toast.info('Video download with edits requires server-side processing');
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (videoRef.current && selectedMedia?.type === 'video') {
      videoRef.current.playbackRate = editSettings.speed;
    }
  }, [editSettings.speed, selectedMedia]);

  if (!selectedMedia) {
    return (
      <Card className="p-8 text-center card-gradient">
        <div className="max-w-md mx-auto">
          <Scissors className="w-16 h-16 mx-auto mb-4 text-primary glow-effect" />
          <h3 className="text-lg font-semibold mb-2">Advanced Editing Studio</h3>
          <p className="text-muted-foreground mb-6">
            Upload a photo or video to access professional editing tools including crop, rotate, speed control, transitions, and effects layering
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-primary via-accent to-secondary shadow-glow-md"
            size="lg"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Media
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </Card>
    );
  }

  const mediaStyle = {
    transform: `rotate(${editSettings.rotation}deg)`,
    transition: 'transform 0.3s ease',
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload New
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button
          onClick={handleDownload}
          className="flex-1 bg-gradient-to-r from-primary via-accent to-secondary shadow-glow-md"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Tags Section */}
      <Card className="p-4 bg-card/60 backdrop-blur-sm border-primary/20">
        <div className="space-y-3">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Media Tags
          </Label>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add tag (e.g., sunset, party, neon)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              className="flex-1"
            />
            <Button onClick={handleAddTag} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="gap-1 pr-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive/20"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <div className="p-3 bg-muted/50 border-b">
            <p className="text-sm font-medium">Original</p>
          </div>
          <div className="aspect-video bg-black flex items-center justify-center">
            {originalMedia?.type === 'video' ? (
              <video
                src={originalMedia.url}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <img
                src={originalMedia?.url || ''}
                alt="Original"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-3 bg-muted/50 border-b flex items-center justify-between">
            <p className="text-sm font-medium">Edited Preview</p>
            {selectedMedia.type === 'video' && (
              <Button size="sm" variant="ghost" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            )}
          </div>
          <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
            {selectedMedia.type === 'video' ? (
              <video
                ref={videoRef}
                src={selectedMedia.url}
                className="max-w-full max-h-full object-contain"
                style={mediaStyle}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            ) : (
              <img
                src={selectedMedia.url}
                alt="Edited"
                className="max-w-full max-h-full object-contain"
                style={mediaStyle}
              />
            )}
          </div>
        </Card>
      </div>

      <Card className="p-4 card-gradient">
        <Tabs defaultValue="transform" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transform">
              <RotateCw className="w-4 h-4 mr-2" />
              Transform
            </TabsTrigger>
            <TabsTrigger value="crop">
              <Crop className="w-4 h-4 mr-2" />
              Crop
            </TabsTrigger>
            {selectedMedia.type === 'video' && (
              <TabsTrigger value="video">
                <Zap className="w-4 h-4 mr-2" />
                Video
              </TabsTrigger>
            )}
            <TabsTrigger value="effects">
              <Layers className="w-4 h-4 mr-2" />
              Effects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transform" className="space-y-4 mt-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm">Rotation: {editSettings.rotation}°</Label>
                <Button size="sm" onClick={handleRotate} variant="outline">
                  <RotateCw className="w-4 h-4 mr-1" />
                  Rotate 90°
                </Button>
              </div>
              <Slider
                value={[editSettings.rotation]}
                onValueChange={([value]) => setEditSettings({ ...editSettings, rotation: value })}
                min={0}
                max={360}
                step={1}
                className="mt-2"
              />
            </div>
          </TabsContent>

          <TabsContent value="crop" className="space-y-4 mt-4">
            <div>
              <Label className="text-sm">Crop Width: {editSettings.cropWidth}%</Label>
              <Slider
                value={[editSettings.cropWidth]}
                onValueChange={([value]) => setEditSettings({ ...editSettings, cropWidth: value })}
                min={10}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm">Crop Height: {editSettings.cropHeight}%</Label>
              <Slider
                value={[editSettings.cropHeight]}
                onValueChange={([value]) => setEditSettings({ ...editSettings, cropHeight: value })}
                min={10}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm">Horizontal Position: {editSettings.cropX}%</Label>
              <Slider
                value={[editSettings.cropX]}
                onValueChange={([value]) => setEditSettings({ ...editSettings, cropX: value })}
                min={0}
                max={100 - editSettings.cropWidth}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm">Vertical Position: {editSettings.cropY}%</Label>
              <Slider
                value={[editSettings.cropY]}
                onValueChange={([value]) => setEditSettings({ ...editSettings, cropY: value })}
                min={0}
                max={100 - editSettings.cropHeight}
                step={1}
                className="mt-2"
              />
            </div>
          </TabsContent>

          {selectedMedia.type === 'video' && (
            <TabsContent value="video" className="space-y-4 mt-4">
              <div>
                <Label className="text-sm">Playback Speed: {editSettings.speed}x</Label>
                <Select
                  value={editSettings.speed.toString()}
                  onValueChange={(value) => setEditSettings({ ...editSettings, speed: parseFloat(value) })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SPEED_OPTIONS.map((speed) => (
                      <SelectItem key={speed} value={speed.toString()}>
                        {speed}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Transition</Label>
                <Select
                  value={editSettings.transition}
                  onValueChange={(value) => setEditSettings({ ...editSettings, transition: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSITIONS.map((transition) => (
                      <SelectItem key={transition} value={transition}>
                        {transition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          )}

          <TabsContent value="effects" className="space-y-4 mt-4">
            <div>
              <Label className="text-sm">Overlay Effect</Label>
              <Select
                value={editSettings.overlay}
                onValueChange={(value) => setEditSettings({ ...editSettings, overlay: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OVERLAYS.map((overlay) => (
                    <SelectItem key={overlay} value={overlay}>
                      {overlay}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Advanced effects layering and compositing features coming soon. Current preview shows basic transformations.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
