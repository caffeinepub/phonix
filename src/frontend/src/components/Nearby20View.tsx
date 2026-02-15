import { useState } from 'react';
import { Users, MapPin, Heart, MessageCircle, Share2, TrendingUp, Search, Tag, X, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetAllMedia } from '../hooks/useQueries';

interface Nearby20ViewProps {
  isGuest: boolean;
}

export default function Nearby20View({ isGuest }: Nearby20ViewProps) {
  const [activeTab, setActiveTab] = useState('trending');
  const [searchTag, setSearchTag] = useState('');
  const [activeSearchTag, setActiveSearchTag] = useState('');
  
  const { data: allMedia = [] } = useGetAllMedia();

  const mockPosts = allMedia.slice(0, 20).map((media, index) => ({
    id: media.id,
    username: media.owner.toString().slice(0, 8),
    location: `${(index * 0.5 + 0.5).toFixed(1)} km away`,
    likes: Number(media.likes),
    comments: media.comments.length,
    image: media.blob.getDirectURL(),
    caption: media.filename,
    trending: index < 5,
    tags: media.tags,
  }));

  let displayPosts = activeTab === 'trending' 
    ? mockPosts.filter(p => p.trending)
    : mockPosts;

  if (activeSearchTag) {
    displayPosts = displayPosts.filter(p => 
      p.tags.some(tag => tag.toLowerCase().includes(activeSearchTag.toLowerCase()))
    );
  }

  const allTags = Array.from(
    new Set(mockPosts.flatMap(p => p.tags))
  ).sort();

  const handleSearchByTag = () => {
    if (searchTag.trim()) {
      setActiveSearchTag(searchTag.trim().toLowerCase());
    }
  };

  const handleClearSearch = () => {
    setSearchTag('');
    setActiveSearchTag('');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6 premium-fade-glow">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold premium-metallic-text">
            Nearby 20
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover trending posts from users near you
          </p>
        </div>
        <Users className="w-8 h-8 text-primary animate-pulse" />
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
                  You're browsing as a guest. Sign in to interact with posts and create your own content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20 premium-glassmorphism-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{mockPosts.length}</div>
              <div className="text-sm text-muted-foreground">Nearby Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">{mockPosts.filter(p => p.trending).length}</div>
              <div className="text-sm text-muted-foreground">Trending</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">5 km</div>
              <div className="text-sm text-muted-foreground">Radius</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-glassmorphism-card depth-shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="nearby-tag-search" className="text-sm mb-2 block">
                  Search by Tag
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="nearby-tag-search"
                    placeholder="e.g., sunset, party, neon..."
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchByTag()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearchByTag} className="gap-2 premium-button-micro">
                    <Search className="w-4 h-4" />
                    Search
                  </Button>
                  {activeSearchTag && (
                    <Button onClick={handleClearSearch} variant="outline" className="gap-2 premium-button-micro">
                      <X className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {allTags.length > 0 && (
              <div>
                <Label className="text-sm mb-2 block">Popular Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map((tag) => (
                    <Badge
                      key={tag}
                      variant={activeSearchTag === tag ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/20 transition-colors premium-button-micro"
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 premium-glassmorphism-card">
          <TabsTrigger value="trending" className="gap-2 premium-button-micro">
            <TrendingUp className="w-4 h-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="recent" className="gap-2 premium-button-micro">
            <MapPin className="w-4 h-4" />
            Recent
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {displayPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayPosts.map((post) => (
                <Card key={post.id} className="premium-glassmorphism-card depth-shadow-md overflow-hidden group premium-slide-zoom">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/generated/gallery-placeholder.dim_300x200.png';
                      }}
                    />
                    {post.trending && (
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-primary to-secondary premium-neon-glow">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-10 h-10 border-2 border-primary/40">
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-sm">
                          {post.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{post.username}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {post.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm mb-3 line-clamp-2">{post.caption}</p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button 
                        className="flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-50"
                        disabled={isGuest}
                      >
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button 
                        className="flex items-center gap-1 hover:text-secondary transition-colors disabled:opacity-50"
                        disabled={isGuest}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button 
                        className="flex items-center gap-1 hover:text-accent transition-colors ml-auto disabled:opacity-50"
                        disabled={isGuest}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="premium-glassmorphism-card depth-shadow-md">
              <CardContent className="py-12 text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Posts Found</h3>
                <p className="text-muted-foreground">
                  {activeSearchTag 
                    ? `No posts found with tag "${activeSearchTag}"`
                    : 'No nearby posts available at the moment'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
