import { useState } from 'react';
import { User, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        username: username.trim(),
        bio: bio.trim(),
        profilePictureBlob: undefined,
        videos: [],
        stories: [],
        posts: [],
      });
      toast.success('Profile created successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to create profile');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md floating-card soft-shadow" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center soft-glow mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl text-center gradient-text">
            Welcome to PHONIX!
          </DialogTitle>
          <DialogDescription className="text-center">
            Let's set up your profile to get started
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={saveProfile.isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={saveProfile.isPending}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary soft-glow"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Profile...
              </>
            ) : (
              'Create Profile'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
