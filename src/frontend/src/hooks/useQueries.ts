import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MediaMetadata, UserProfile, FilterPreset, Story, EntertainmentPost, NearbyPost, Comment } from '../backend';
import { ExternalBlob } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

export function useGetAllMedia() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaMetadata[]>({
    queryKey: ['media'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMediaMetadata();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMedia(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaMetadata | null>({
    queryKey: ['media', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getMediaMetadata(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetMediaByTag(tag: string) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaMetadata[]>({
    queryKey: ['media', 'tag', tag],
    queryFn: async () => {
      if (!actor || !tag) return [];
      return actor.getMediaByTag(tag);
    },
    enabled: !!actor && !isFetching && !!tag,
  });
}

export function useGetMediaByOwner(owner: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaMetadata[]>({
    queryKey: ['media', 'owner', owner.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMediaByOwner(owner);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      filename,
      filters,
      arEffects,
      blob,
      owner,
      isVideo,
      duration,
      tags,
    }: {
      id: string;
      filename: string;
      filters: string[];
      arEffects: string[];
      blob: ExternalBlob;
      owner: Principal;
      isVideo: boolean;
      duration: bigint | null;
      tags: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveMedia(id, filename, filters, arEffects, blob, owner, isVideo, duration, tags);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useDeleteMedia() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteMedia(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useSetLikeStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mediaId, isLiked }: { mediaId: string; isLiked: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setLikeStatusForMedia(mediaId, isLiked);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mediaId, comment }: { mediaId: string; comment: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addCommentToMedia(mediaId, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAllFilterPresets() {
  const { actor, isFetching } = useActor();

  return useQuery<FilterPreset[]>({
    queryKey: ['filterPresets'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFilterPresets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMostPopularMedia(limit: number) {
  const { actor, isFetching } = useActor();

  return useQuery<MediaMetadata[]>({
    queryKey: ['media', 'popular', limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMostPopularMedia(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUserProfiles() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['userProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllStories() {
  const { actor, isFetching } = useActor();

  return useQuery<Story[]>({
    queryKey: ['stories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNonExpiredStories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserStories(owner: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<Story[]>({
    queryKey: ['stories', 'user', owner.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNonExpiredUserStories(owner);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveStory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (story: Story) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveUserStory(story);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
    },
  });
}

export function useGetAllEntertainmentPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<EntertainmentPost[]>({
    queryKey: ['entertainmentPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntertainmentPostsSorted();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveEntertainmentPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: EntertainmentPost) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveEntertainmentPost(post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entertainmentPosts'] });
    },
  });
}

export function useGetNearbyPosts(owner: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<NearbyPost[]>({
    queryKey: ['nearbyPosts', owner.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNearbyPosts(owner);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveNearbyPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: NearbyPost) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveNearbyPost(post);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nearbyPosts'] });
    },
  });
}
