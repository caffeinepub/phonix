import { useState } from 'react';
import { User, Upload, Video, FileText, Image as ImageIcon, Edit2, Camera, Film } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useGetCallerUserProfile, useGetAllMedia } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface ProfileViewProps {
  onNavigateToCamera: () => void;
  onNavigateToGallery: () => void;
}

export default function ProfileView({ onNavigateToCamera, onNavigateToGallery }: ProfileViewProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: allMedia } = useGetAllMedia();
  const [activeTab, setActiveTab] = useState('videos');

  const userMedia = allMedia?.filter(m => m.owner.toString() === identity?.getPrincipal().toString()) || [];
  const userVideos = userMedia.filter(m => m.isVideo);
  const userPhotos = userMedia.filter(m => !m.isVideo);

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <Card className="premium-glassmorphism-card depth-shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <Card className="premium-glassmorphism-card depth-shadow-md">
        <CardContent className="p-8 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
          <p className="text-muted-foreground">Please set up your profile to continue.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6 premium-fade-glow">
      <Card className="premium-glassmorphism-card depth-shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary/20 premium-neon-glow">
              {userProfile.profilePictureBlob ? (
                <AvatarImage src={userProfile.profilePictureBlob.getDirectURL()} alt={userProfile.username} />
              ) : (
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-3xl">
                  {userProfile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold premium-metallic-text mb-1">
                  {userProfile.username}
                </h1>
                <p className="text-muted-foreground">{userProfile.bio || 'No bio yet'}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{userVideos.length}</p>
                  <p className="text-xs text-muted-foreground">Videos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{userProfile.stories.length}</p>
                  <p className="text-xs text-muted-foreground">Stories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">{userProfile.posts.length}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button className="bg-gradient-to-r from-primary to-secondary premium-neon-glow premium-button-micro">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="premium-glassmorphism-card depth-shadow-md">
        <CardHeader>
          <CardTitle className="premium-metallic-text">My Content</CardTitle>
          <CardDescription>Manage your videos, stories, and posts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="videos" className="gap-2">
                <Video className="w-4 h-4" />
                Videos
                <Badge variant="secondary" className="ml-1">{userVideos.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="stories" className="gap-2">
                <Film className="w-4 h-4" />
                Stories
                <Badge variant="secondary" className="ml-1">{userProfile.stories.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="posts" className="gap-2">
                <FileText className="w-4 h-4" />
                Posts
                <Badge variant="secondary" className="ml-1">{userProfile.posts.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="mt-6">
              {userVideos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userVideos.map((video) => (
                    <Card key={video.id} className="overflow-hidden group cursor-pointer hover:shadow-glow-md transition-all premium-button-micro">
                      <div className="relative aspect-square bg-black">
                        <img
                          src={video.blob.getDirectURL()}
                          alt={video.filename}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white text-xs font-medium truncate">{video.filename}</p>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary/80">
                            <Video className="w-3 h-3 mr-1" />
                            {video.duration ? `${Number(video.duration)}s` : 'Video'}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Videos Yet</h3>
                  <p className="text-muted-foreground mb-4">Start recording videos to see them here</p>
                  <Button onClick={onNavigateToCamera} className="bg-gradient-to-r from-primary to-secondary premium-button-micro">
                    <Camera className="w-4 h-4 mr-2" />
                    Open Camera
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="stories" className="mt-6">
              <div className="text-center py-12">
                <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Stories Yet</h3>
                <p className="text-muted-foreground mb-4">Share your moments as stories</p>
                <Button onClick={onNavigateToGallery} className="bg-gradient-to-r from-primary to-secondary premium-button-micro">
                  <Upload className="w-4 h-4 mr-2" />
                  Create Story from Gallery
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="posts" className="mt-6">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                <p className="text-muted-foreground mb-4">Share your thoughts and updates</p>
                <Button onClick={onNavigateToGallery} className="bg-gradient-to-r from-primary to-secondary premium-button-micro">
                  <Upload className="w-4 h-4 mr-2" />
                  Create Post from Gallery
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
