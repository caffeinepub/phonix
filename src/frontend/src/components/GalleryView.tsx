import { useState } from 'react';
import { Image as ImageIcon, Video, Trash2, Share2, Sparkles, Scissors, Wand2, X, Search, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useGetAllMedia, useDeleteMedia, useGetMediaByTag } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface GalleryViewProps {
  onEnhanceMedia: (mediaId: string) => void;
  onEditMedia: (mediaId: string) => void;
  onAIEnhance?: (mediaId: string) => void;
}

export default function GalleryView({ onEnhanceMedia, onEditMedia, onAIEnhance }: GalleryViewProps) {
  const { data: allMedia, isLoading } = useGetAllMedia();
  const deleteMedia = useDeleteMedia();
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchTag, setSearchTag] = useState('');
  const [activeSearchTag, setActiveSearchTag] = useState('');

  const { data: tagFilteredMedia } = useGetMediaByTag(activeSearchTag);

  const media = activeSearchTag ? tagFilteredMedia : allMedia;

  const selectedMediaData = media?.find(m => m.id === selectedMedia);

  const handleDelete = async () => {
    if (!selectedMedia) return;
    
    try {
      await deleteMedia.mutateAsync(selectedMedia);
      toast.success('Media deleted successfully');
      setShowDeleteDialog(false);
      setSelectedMedia(null);
    } catch (error) {
      toast.error('Failed to delete media');
    }
  };

  const handleShare = async () => {
    if (!selectedMediaData) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedMediaData.filename,
          text: 'Check out this photo!',
          url: selectedMediaData.blob.getDirectURL(),
        });
      } else {
        await navigator.clipboard.writeText(selectedMediaData.blob.getDirectURL());
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      toast.error('Failed to share media');
    }
  };

  const handleSearchByTag = () => {
    if (searchTag.trim()) {
      setActiveSearchTag(searchTag.trim().toLowerCase());
    }
  };

  const handleClearSearch = () => {
    setSearchTag('');
    setActiveSearchTag('');
  };

  // Get all unique tags from media
  const allTags = Array.from(
    new Set(allMedia?.flatMap(m => m.tags) || [])
  ).sort();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    );
  }

  if (!allMedia || allMedia.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ImageIcon className="w-20 h-20 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Media Yet</h2>
        <p className="text-muted-foreground max-w-md">
          Start capturing photos and videos with the Camera to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Gallery
          </h1>
          <p className="text-muted-foreground mt-2">
            {media?.length || 0} {media?.length === 1 ? 'item' : 'items'}
            {activeSearchTag && ` with tag "${activeSearchTag}"`}
          </p>
        </div>
      </div>

      {/* Tag Search */}
      <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="tag-search" className="text-sm mb-2 block">
                  Search by Tag
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="tag-search"
                    placeholder="e.g., sunset, party, neon..."
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchByTag()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearchByTag} className="gap-2">
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                  {activeSearchTag && (
                    <Button onClick={handleClearSearch} variant="outline" className="gap-2">
                      <X className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Popular Tags */}
            {allTags.length > 0 && (
              <div>
                <Label className="text-sm mb-2 block">Popular Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map((tag) => (
                    <Badge
                      key={tag}
                      variant={activeSearchTag === tag ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => {
                        setSearchTag(tag);
                        setActiveSearchTag(tag);
                      }}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      {media && media.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <Card
              key={item.id}
              className="group relative overflow-hidden cursor-pointer bg-card/60 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow-md"
              onClick={() => setSelectedMedia(item.id)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <img
                    src={item.blob.getDirectURL()}
                    alt={item.filename}
                    className="w-full h-full object-cover"
                  />
                  {item.isVideo && (
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full p-2">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {item.tags.length > 0 && (
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                      <Tag className="w-3 h-3 text-white inline" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
          <Search className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground max-w-md">
            No media found with tag "{activeSearchTag}". Try a different tag or clear the search.
          </p>
        </div>
      )}

      {/* Media Details Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
        <DialogContent className="max-w-4xl bg-card/95 backdrop-blur-xl border-primary/20">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedMediaData?.filename}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedMedia(null)}
                className="hover:bg-primary/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Created {selectedMediaData?.creationDate ? new Date(Number(selectedMediaData.creationDate) / 1000000).toLocaleDateString() : ''}
            </DialogDescription>
          </DialogHeader>

          {selectedMediaData && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedMediaData.blob.getDirectURL()}
                  alt={selectedMediaData.filename}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Tags Display */}
              {selectedMediaData.tags.length > 0 && (
                <div>
                  <Label className="text-sm mb-2 block">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedMediaData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    onEnhanceMedia(selectedMedia!);
                    setSelectedMedia(null);
                  }}
                  className="gap-2 border-primary/30 hover:bg-primary/10"
                >
                  <Sparkles className="w-4 h-4" />
                  Enhance
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    onEditMedia(selectedMedia!);
                    setSelectedMedia(null);
                  }}
                  className="gap-2 border-secondary/30 hover:bg-secondary/10"
                >
                  <Scissors className="w-4 h-4" />
                  Edit
                </Button>
                {onAIEnhance && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onAIEnhance(selectedMedia!);
                      setSelectedMedia(null);
                    }}
                    className="gap-2 border-accent/30 hover:bg-accent/10"
                  >
                    <Wand2 className="w-4 h-4" />
                    AI Tools
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="gap-2 border-primary/30 hover:bg-primary/10"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-primary/20">
          <DialogHeader>
            <DialogTitle>Delete Media</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this media? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMedia.isPending}
            >
              {deleteMedia.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
