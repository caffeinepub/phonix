import { useState } from 'react';
import { Wand2, Sparkles, CloudSun, Palette, Loader2, Paintbrush, Volume2, Smile, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetMedia } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface AIToolsViewProps {
  selectedMediaId: string | null;
}

export default function AIToolsView({ selectedMediaId }: AIToolsViewProps) {
  const [processingTool, setProcessingTool] = useState<string | null>(null);
  const { data: media, isLoading } = useGetMedia(selectedMediaId || '');

  const aiTools = [
    {
      id: 'auto-enhance',
      name: 'Auto Enhance',
      description: 'Automatically improve photo quality with AI',
      icon: Wand2,
      preview: '/assets/generated/auto-enhance-preview.dim_150x150.png',
      gradient: 'from-primary to-secondary',
    },
    {
      id: 'smart-effects',
      name: 'Smart Effects',
      description: 'AI-powered effect suggestions based on content',
      icon: Sparkles,
      preview: '/assets/generated/smart-effects-preview.dim_200x150.png',
      gradient: 'from-secondary to-accent',
    },
    {
      id: 'sky-replacement',
      name: 'Sky Replacement',
      description: 'Replace sky with stunning AI-generated alternatives',
      icon: CloudSun,
      preview: '/assets/generated/sky-replacement-preview.dim_150x150.png',
      gradient: 'from-accent to-primary',
    },
    {
      id: 'color-pop',
      name: 'Color Pop',
      description: 'Selective color enhancement with AI detection',
      icon: Palette,
      preview: '/assets/generated/color-pop-preview.dim_150x150.png',
      gradient: 'from-primary via-accent to-secondary',
    },
    {
      id: 'style-transfer',
      name: 'Style Transfer',
      description: 'Apply artistic styles to photos and videos',
      icon: Paintbrush,
      preview: '/assets/generated/style-transfer-preview.dim_150x150.png',
      gradient: 'from-secondary via-primary to-accent',
    },
    {
      id: 'noise-reduction',
      name: 'Noise Reduction',
      description: 'Advanced denoising for low-light photos',
      icon: Volume2,
      preview: '/assets/generated/noise-reduction-preview.dim_150x150.png',
      gradient: 'from-accent via-secondary to-primary',
    },
    {
      id: 'facial-refinement',
      name: 'Facial Refinement',
      description: 'Enhance facial features with AI precision',
      icon: Smile,
      preview: '/assets/generated/facial-refinement-preview.dim_150x150.png',
      gradient: 'from-primary to-accent',
    },
    {
      id: 'sky-light-adjust',
      name: 'Sky & Light Adjust',
      description: 'Automated sky and lighting corrections',
      icon: Sun,
      preview: '/assets/generated/sky-adjustment-preview.dim_150x150.png',
      gradient: 'from-secondary to-primary',
    },
  ];

  const handleApplyTool = async (toolId: string) => {
    if (!selectedMediaId) {
      toast.error('Please select a media item from Gallery first');
      return;
    }

    setProcessingTool(toolId);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`${aiTools.find(t => t.id === toolId)?.name} applied successfully!`);
    setProcessingTool(null);
  };

  if (!selectedMediaId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Wand2 className="w-20 h-20 text-primary mb-6 animate-pulse" />
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          AI-Powered Enhancement
        </h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Select a photo or video from your Gallery to unlock powerful AI enhancement tools
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
          {aiTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.id} className="bg-card/60 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.gradient}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-sm">{tool.name}</CardTitle>
                  <CardDescription className="text-xs">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src={tool.preview}
                    alt={tool.name}
                    className="w-full h-24 object-cover rounded-lg border border-primary/20"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            AI Enhancement Tools
          </h1>
          <p className="text-muted-foreground mt-2">
            Transform your media with cutting-edge AI technology
          </p>
        </div>
      </div>

      {/* Media Preview */}
      {media && (
        <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle>Selected Media</CardTitle>
            <CardDescription>{media.filename}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={media.blob.getDirectURL()}
                alt={media.filename}
                className="w-full h-full object-contain"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiTools.map((tool) => {
          const Icon = tool.icon;
          const isProcessing = processingTool === tool.id;
          
          return (
            <Card
              key={tool.id}
              className="bg-card/60 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow-md"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.gradient} shadow-glow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-sm">{tool.name}</CardTitle>
                <CardDescription className="text-xs">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <img
                  src={tool.preview}
                  alt={tool.name}
                  className="w-full h-32 object-cover rounded-lg border border-primary/20"
                />
                <Button
                  onClick={() => handleApplyTool(tool.id)}
                  disabled={isProcessing}
                  className={`w-full bg-gradient-to-r ${tool.gradient} hover:opacity-90 transition-all duration-300 shadow-glow-sm hover:shadow-glow-md text-xs`}
                  size="sm"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Icon className="w-3 h-3 mr-2" />
                      Apply
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
