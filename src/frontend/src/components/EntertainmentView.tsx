import { useState } from 'react';
import { Tv, Plus, Heart, MessageCircle, Share2, TrendingUp, Film, Users, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useGetAllEntertainmentPosts, useSaveEntertainmentPost } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { EntertainmentPost } from '../backend';

interface EntertainmentViewProps {
  isGuest: boolean;
  onNavigateToLogin: () => void;
}

export default function EntertainmentView({ isGuest, onNavigateToLogin }: EntertainmentViewProps) {
  const { identity } = useInternetIdentity();
  const { data: allPosts = [] } = useGetAllEntertainmentPosts();
  const savePostMutation = useSaveEntertainmentPost();
  
  const [activeTab, setActiveTab] = useState('trending');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [postContent, setPostContent] = useState('');

  const trendingPosts = allPosts.slice(0, 10);

  const handleCreatePost = async () => {
    if (isGuest) {
      toast.error('Please sign in to create posts');
      onNavigateToLogin();
      return;
    }

    if (!postContent.trim() || !identity) {
      toast.error('Please enter post content');
      return;
    }

    try {
      const newPost: EntertainmentPost = {
        id: `post-${Date.now()}`,
        content: postContent.trim(),
        mediaId: undefined,
        author: identity.getPrincipal(),
        creationDate: BigInt(Date.now() * 1000000),
        likes: BigInt(0),
        comments: [],
        tags: ['entertainment', 'new'],
      };

      await savePostMutation.mutateAsync(newPost);
      toast.success('Post created successfully!');
      setShowCreateDialog(false);
      setPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6 premium-fade-glow">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold premium-metallic-text">Entertainment Feed</h1>
          <p className="text-muted-foreground mt-2">
            Discover trending content and connect with the community
          </p>
        </div>
        <Button 
          onClick={() => {
            if (isGuest) {
              toast.error('Please sign in to create posts');
              onNavigateToLogin();
            } else {
              setShowCreateDialog(true);
            }
          }}
          className="bg-gradient-to-r from-primary to-secondary premium-neon-glow premium-button-micro"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Post
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
                  You're browsing as a guest. Sign in to create posts and interact with content.
                </p>
              </div>
              <Button onClick={onNavigateToLogin} className="bg-gradient-to-r from-primary to-secondary premium-button-micro">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 premium-glassmorphism-card">
          <TabsTrigger value="trending" className="gap-2 premium-button-micro">
            <TrendingUp className="w-4 h-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="stories" className="gap-2 premium-button-micro">
            <Film className="w-4 h-4" />
            Stories
          </TabsTrigger>
          <TabsTrigger value="profiles" className="gap-2 premium-button-micro">
            <Users className="w-4 h-4" />
            Profiles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="mt-6">
          <div className="space-y-4">
            {trendingPosts.length > 0 ? (
              trendingPosts.map((post) => (
                <Card key={post.id} className="premium-glassmorphism-card depth-shadow-md premium-slide-zoom">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12 border-2 border-primary/40">
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                          {post.author.toString().slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold">User {post.author.toString().slice(0, 8)}</p>
                          <Badge variant="outline" className="text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        </div>
                        <p className="text-sm mb-4">{post.content}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <button 
                            className="flex items-center gap-2 hover:text-primary transition-colors disabled:opacity-50"
                            disabled={isGuest}
                          >
                            <Heart className="w-4 h-4" />
                            <span>{Number(post.likes)}</span>
                          </button>
                          <button 
                            className="flex items-center gap-2 hover:text-secondary transition-colors disabled:opacity-50"
                            disabled={isGuest}
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments.length}</span>
                          </button>
                          <button 
                            className="flex items-center gap-2 hover:text-accent transition-colors disabled:opacity-50"
                            disabled={isGuest}
                          >
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="premium-glassmorphism-card depth-shadow-md">
                <CardContent className="py-12 text-center">
                  <Tv className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                  <p className="text-muted-foreground">Be the first to create a post!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stories" className="mt-6">
          <Card className="premium-glassmorphism-card depth-shadow-md">
            <CardContent className="py-12 text-center">
              <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Stories</h3>
              <p className="text-muted-foreground mb-4">View stories from the community</p>
              <Button className="bg-gradient-to-r from-primary to-secondary premium-button-micro">
                View Stories
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles" className="mt-6">
          <Card className="premium-glassmorphism-card depth-shadow-md">
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Discover Profiles</h3>
              <p className="text-muted-foreground mb-4">Connect with other users</p>
              <Button className="bg-gradient-to-r from-primary to-secondary premium-button-micro">
                Explore Profiles
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="premium-glassmorphism-card">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="What's on your mind?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreatePost}
                disabled={savePostMutation.isPending}
                className="bg-gradient-to-r from-primary to-secondary premium-button-micro"
              >
                {savePostMutation.isPending ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
