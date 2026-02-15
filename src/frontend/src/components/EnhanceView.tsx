import { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, Download, RotateCcw, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useGetAllMedia, useSaveMedia } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ExternalBlob } from '../backend';

interface EnhanceViewProps {
  selectedMediaId: string | null;
  capturedPhotoUrl?: string | null;
}

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hueRotate: number;
  sepia: number;
  warmth: number;
  glow: number;
}

// Generate 3000 filters across categories
const generateFilters = () => {
  const categories = [
    { name: 'Vibrant', count: 500, baseHue: 0, baseSat: 150 },
    { name: 'Warm', count: 500, baseHue: 30, baseSat: 120 },
    { name: 'Cool', count: 500, baseHue: 200, baseSat: 130 },
    { name: 'Vintage', count: 400, baseHue: 40, baseSat: 80 },
    { name: 'Neon', count: 400, baseHue: 280, baseSat: 180 },
    { name: 'Pastel', count: 300, baseHue: 320, baseSat: 100 },
    { name: 'Dramatic', count: 200, baseHue: 0, baseSat: 140 },
    { name: 'Soft', count: 200, baseHue: 0, baseSat: 90 },
  ];

  const allFilters: any[] = [];
  
  categories.forEach(category => {
    for (let i = 0; i < category.count; i++) {
      const variation = i / category.count;
      allFilters.push({
        name: `${category.name} ${i + 1}`,
        category: category.name,
        settings: {
          brightness: 90 + Math.random() * 30,
          contrast: 90 + Math.random() * 60,
          saturation: category.baseSat + (Math.random() - 0.5) * 40,
          blur: Math.random() < 0.3 ? Math.random() * 2 : 0,
          hueRotate: (category.baseHue + variation * 60) % 360,
          sepia: category.name === 'Vintage' ? 20 + Math.random() * 40 : Math.random() * 20,
          warmth: category.name === 'Warm' ? 20 + Math.random() * 30 : (Math.random() - 0.5) * 20,
          glow: category.name === 'Neon' ? 30 + Math.random() * 40 : Math.random() * 20,
        },
        preview: '/assets/generated/brightness-filter-preview.dim_100x100.png'
      });
    }
  });

  return allFilters;
};

const ALL_FILTERS = generateFilters();
const FILTER_CATEGORIES = Array.from(new Set(ALL_FILTERS.map(f => f.category)));

export default function EnhanceView({ selectedMediaId, capturedPhotoUrl }: EnhanceViewProps) {
  const { identity } = useInternetIdentity();
  const { data: media } = useGetAllMedia();
  const saveMediaMutation = useSaveMedia();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hueRotate: 0,
    sepia: 0,
    warmth: 0,
    glow: 0,
  });
  const [selectedPreset, setSelectedPreset] = useState('None');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Vibrant');
  const [filterPage, setFilterPage] = useState(0);
  const filtersPerPage = 20;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (capturedPhotoUrl) {
      setSelectedImage(capturedPhotoUrl);
      setOriginalImage(capturedPhotoUrl);
    } else if (selectedMediaId && media) {
      const mediaItem = media.find((m) => m.id === selectedMediaId);
      if (mediaItem && !mediaItem.isVideo) {
        const imageUrl = mediaItem.blob.getDirectURL();
        setSelectedImage(imageUrl);
        setOriginalImage(imageUrl);
      }
    }
  }, [selectedMediaId, capturedPhotoUrl, media]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        setOriginalImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (preset: any) => {
    setFilters(preset.settings);
    setSelectedPreset(preset.name);
  };

  const handleReset = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      hueRotate: 0,
      sepia: 0,
      warmth: 0,
      glow: 0,
    });
    setSelectedPreset('None');
  };

  const handleSaveToGallery = async () => {
    if (!selectedImage || !canvasRef.current || !identity) {
      toast.error('Please log in to save to gallery');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const warmthFilter = filters.warmth > 0 
        ? `sepia(${filters.warmth}%)` 
        : filters.warmth < 0 
        ? `hue-rotate(${filters.warmth}deg)` 
        : '';

      ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) hue-rotate(${filters.hueRotate}deg) sepia(${filters.sepia}%) ${warmthFilter}`.trim();
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            const externalBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
              setUploadProgress(percentage);
            });

            const mediaId = `enhanced_${Date.now()}`;
            const filename = `enhanced_${new Date().toISOString()}.jpg`;
            const appliedFilters = selectedPreset !== 'None' ? [selectedPreset] : [];

            await saveMediaMutation.mutateAsync({
              id: mediaId,
              filename,
              filters: appliedFilters,
              arEffects: [],
              blob: externalBlob,
              owner: identity.getPrincipal(),
              isVideo: false,
              duration: null,
              tags: ['enhanced'],
            });

            toast.success('Enhanced photo saved to gallery!');
            setUploadProgress(0);
          } catch (error) {
            console.error('Error saving to gallery:', error);
            toast.error('Failed to save to gallery');
            setUploadProgress(0);
          }
        }
      }, 'image/jpeg', 0.95);
    };
    img.src = selectedImage;
  };

  const handleDownload = () => {
    if (!selectedImage || !canvasRef.current) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const warmthFilter = filters.warmth > 0 
        ? `sepia(${filters.warmth}%)` 
        : filters.warmth < 0 
        ? `hue-rotate(${filters.warmth}deg)` 
        : '';

      ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) hue-rotate(${filters.hueRotate}deg) sepia(${filters.sepia}%) ${warmthFilter}`.trim();
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `enhanced_${Date.now()}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('Enhanced photo downloaded!');
        }
      }, 'image/jpeg', 0.95);
    };
    img.src = selectedImage;
  };

  const categoryFilters = ALL_FILTERS.filter(f => f.category === selectedCategory);
  const paginatedFilters = categoryFilters.slice(filterPage * filtersPerPage, (filterPage + 1) * filtersPerPage);
  const totalPages = Math.ceil(categoryFilters.length / filtersPerPage);

  const warmthFilter = filters.warmth > 0 
    ? `sepia(${filters.warmth}%)` 
    : filters.warmth < 0 
    ? `hue-rotate(${filters.warmth}deg)` 
    : '';

  const glowStyle = filters.glow > 0 
    ? { filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) hue-rotate(${filters.hueRotate}deg) sepia(${filters.sepia}%) ${warmthFilter} drop-shadow(0 0 ${filters.glow / 2}px rgba(255, 255, 255, ${filters.glow / 100}))`.trim() }
    : { filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) hue-rotate(${filters.hueRotate}deg) sepia(${filters.sepia}%) ${warmthFilter}`.trim() };

  if (!selectedImage) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="p-12 text-center floating-card soft-shadow max-w-md">
          <Sparkles className="w-20 h-20 mx-auto mb-6 text-primary glow-effect" />
          <h3 className="text-2xl font-bold mb-3 gradient-text">Enhance Your Photos</h3>
          <p className="text-muted-foreground mb-8">
            Upload a photo or capture one with the camera to apply professional filters from our collection of 3000+ creative enhancements
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-primary to-secondary shadow-glow-md"
            size="lg"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Photo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="flex-1 min-w-[120px]"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload New
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex-1 min-w-[120px]">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button
          onClick={handleSaveToGallery}
          disabled={saveMediaMutation.isPending}
          className="flex-1 min-w-[120px] bg-gradient-to-r from-primary to-secondary shadow-glow-md"
        >
          <Save className="w-4 h-4 mr-2" />
          {saveMediaMutation.isPending ? `Saving... ${uploadProgress}%` : 'Save to Gallery'}
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex-1 min-w-[120px]"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Image Comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="overflow-hidden floating-card soft-shadow">
          <div className="p-3 bg-muted/50 border-b">
            <p className="text-sm font-medium">Original</p>
          </div>
          <div className="aspect-square bg-black">
            <img
              src={originalImage || ''}
              alt="Original"
              className="w-full h-full object-contain"
            />
          </div>
        </Card>

        <Card className="overflow-hidden floating-card soft-shadow">
          <div className="p-3 bg-muted/50 border-b">
            <p className="text-sm font-medium">Enhanced</p>
          </div>
          <div className="aspect-square bg-black">
            <img
              src={selectedImage}
              alt="Enhanced"
              className="w-full h-full object-contain"
              style={glowStyle}
            />
          </div>
        </Card>
      </div>

      {/* Filter Categories */}
      <Card className="p-6 floating-card soft-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary glow-effect" />
            3000+ Creative Filters
          </h3>
          <Badge variant="secondary" className="text-xs">
            {categoryFilters.length} in {selectedCategory}
          </Badge>
        </div>

        <Tabs value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setFilterPage(0); }}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-4">
            {FILTER_CATEGORIES.map(cat => (
              <TabsTrigger key={cat} value={cat} className="text-xs">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {FILTER_CATEGORIES.map(cat => (
            <TabsContent key={cat} value={cat}>
              <div className="space-y-4">
                <ScrollArea className="w-full">
                  <div className="flex gap-3 pb-4">
                    {paginatedFilters.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handlePresetSelect(preset)}
                        className={`flex-shrink-0 text-center filter-preview transition-all ${
                          selectedPreset === preset.name ? 'ring-2 ring-primary scale-105 shadow-glow-md' : 'hover:scale-105'
                        }`}
                      >
                        <div className="relative w-20 h-20 rounded-lg mb-2 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white/80">
                            {preset.name.slice(-3)}
                          </div>
                          {selectedPreset === preset.name && (
                            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]" />
                          )}
                        </div>
                        <span className="text-xs font-medium block truncate w-20">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilterPage(Math.max(0, filterPage - 1))}
                      disabled={filterPage === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {filterPage + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilterPage(Math.min(totalPages - 1, filterPage + 1))}
                      disabled={filterPage === totalPages - 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Custom Adjustments */}
      <Card className="p-6 space-y-4 floating-card soft-shadow">
        <h3 className="font-semibold text-lg">Custom Adjustments</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Brightness: {filters.brightness}%</Label>
            <Slider
              value={[filters.brightness]}
              onValueChange={([value]) => setFilters({ ...filters, brightness: value })}
              min={50}
              max={150}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm">Contrast: {filters.contrast}%</Label>
            <Slider
              value={[filters.contrast]}
              onValueChange={([value]) => setFilters({ ...filters, contrast: value })}
              min={50}
              max={150}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm">Saturation: {filters.saturation}%</Label>
            <Slider
              value={[filters.saturation]}
              onValueChange={([value]) => setFilters({ ...filters, saturation: value })}
              min={0}
              max={200}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm">Color Warmth: {filters.warmth}</Label>
            <Slider
              value={[filters.warmth]}
              onValueChange={([value]) => setFilters({ ...filters, warmth: value })}
              min={-50}
              max={50}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm">Glow Effect: {filters.glow}%</Label>
            <Slider
              value={[filters.glow]}
              onValueChange={([value]) => setFilters({ ...filters, glow: value })}
              min={0}
              max={100}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm">Blur: {filters.blur}px</Label>
            <Slider
              value={[filters.blur]}
              onValueChange={([value]) => setFilters({ ...filters, blur: value })}
              min={0}
              max={10}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm">Hue Rotate: {filters.hueRotate}°</Label>
            <Slider
              value={[filters.hueRotate]}
              onValueChange={([value]) => setFilters({ ...filters, hueRotate: value })}
              min={0}
              max={360}
              step={1}
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm">Sepia: {filters.sepia}%</Label>
            <Slider
              value={[filters.sepia]}
              onValueChange={([value]) => setFilters({ ...filters, sepia: value })}
              min={0}
              max={100}
              step={1}
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
