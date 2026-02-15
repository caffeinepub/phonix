import { useState } from 'react';
import { Film, Plus, Eye, Clock, Play, Heart, MessageCircle, X, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useGetAllStories, useSaveStory } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { Story } from '../backend';

interface StoriesViewProps {
  isGuest: boolean;
  onNavigateToLogin: () => void;
}

export default function StoriesView({ isGuest, onNavigateToLogin }: StoriesViewProps) {
  const { identity } = useInternetIdentity();
  const { data: allStories = [] } = useGetAllStories();
  const saveStoryMutation = useSaveStory();
  
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [storyContent, setStoryContent] = useState('');

  const userPrincipal = identity?.getPrincipal().toString();
  const myStories = allStories.filter(s => s.owner.toString() === userPrincipal);
  const nearbyStories = allStories.filter(s => s.owner.toString() !== userPrincipal);

  const handleCreateStory = async () => {
    if (isGuest) {
      toast.error('Please sign in to create stories');
      onNavigateToLogin();
      return;
    }

    if (!storyContent.trim() || !identity) {
      toast.error('Please enter story content');
      return;
    }

    try {
      const newStory: Story = {
        id: `story-${Date.now()}`,
        owner: identity.getPrincipal(),
        mediaId: `media-${Date.now()}`,
        creationDate: BigInt(Date.now() * 1000000),
        expirationDate: BigInt((Date.now() + 24 * 60 * 60 * 1000) * 1000000),
        viewers: [],
        tags: ['story', 'new'],
      };

      await saveStoryMutation.mutateAsync(newStory);
      toast.success('Story created successfully!');
      setShowCreateDialog(false);
      setStoryContent('');
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Failed to create story');
    }
  };

  const handleViewStory = (story: Story) => {
    setSelectedStory(story);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6 premium-fade-glow">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold premium-metallic-text">Stories & Posts</h1>
          <p className="text-muted-foreground mt-2">
            Share your moments with the community
          </p>
        </div>
        <Button 
          onClick={() => {
            if (isGuest) {
              toast.error('Please sign in to create stories');
              onNavigateToLogin();
            } else {
              setShowCreateDialog(true);
            }
          }}
          className="bg-gradient-to-r from-primary to-secondary premium-neon-glow premium-button-micro"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Story
        </Button>
      </div>

      {isGuest && (
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/30 premium-glassmorphism-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20">
                <LogIn className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Guest Mode</h3>
                <p className="text-sm text-muted-foreground">
                  You're browsing as a guest. Sign in to create stories and interact with content.
                </p>
              </div>
              <Button onClick={onNavigateToLogin} className="bg-gradient-to-r from-primary to-secondary premium-button-micro">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isGuest && myStories.length > 0 && (
        <Card className="premium-glassmorphism-card depth-shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="w-5 h-5 text-primary" />
              My Stories
            </CardTitle>
            <CardDescription>Your active stories and posts</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4 pb-4">
                {myStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => handleViewStory(story)}
                    className="flex-shrink-0 w-32 cursor-pointer group"
                  >
                    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/40 group-hover:border-primary transition-all premium-button-micro">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center gap-2 text-white text-xs">
                          <Eye className="w-3 h-3" />
                          <span>{story.viewers.length}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-center mt-2 truncate">Story {story.id.slice(0, 8)}</p>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Card className="premium-glassmorphism-card depth-shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-secondary" />
            Community Stories
            <Badge variant="secondary" className="ml-2">{nearbyStories.length} active</Badge>
          </CardTitle>
          <CardDescription>Stories from the community</CardDescription>
        </CardHeader>
        <CardContent>
          {nearbyStories.length > 0 ? (
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-4 pb-4">
                {nearbyStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => handleViewStory(story)}
                    className="flex-shrink-0 w-32 cursor-pointer group"
                  >
                    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent/40 group-hover:border-accent transition-all premium-button-micro">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute top-3 left-3">
                        <Avatar className="w-8 h-8 border-2 border-white">
                          <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
                            {story.owner.toString().slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center gap-2 text-white text-xs">
                          <Eye className="w-3 h-3" />
                          <span>{story.viewers.length}</span>
                          <Clock className="w-3 h-3 ml-auto" />
                          <span>2h</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-center mt-2 truncate">User {story.owner.toString().slice(0, 8)}</p>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Stories Yet</h3>
              <p className="text-muted-foreground">Check back later for new stories from the community</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="premium-glassmorphism-card">
          <DialogHeader>
            <DialogTitle>Create New Story</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="What's on your mind?"
              value={storyContent}
              onChange={(e) => setStoryContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateStory}
                disabled={saveStoryMutation.isPending}
                className="bg-gradient-to-r from-primary to-secondary premium-button-micro"
              >
                {saveStoryMutation.isPending ? 'Creating...' : 'Create Story'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedStory && (
        <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
          <DialogContent className="premium-glassmorphism-card max-w-md">
            <DialogHeader>
              <DialogTitle>Story Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Story ID: {selectedStory.id}
              </p>
              <p className="text-sm text-muted-foreground">
                Viewers: {selectedStory.viewers.length}
              </p>
              <div className="flex gap-2">
                {selectedStory.tags.map((tag) => (
                  <Badge key={tag} variant="outline">#{tag}</Badge>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
