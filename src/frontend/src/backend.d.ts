import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export type SideBarResponse = {
    __kind__: "error";
    error: string;
} | {
    __kind__: "success";
    success: EnhancedSidebarState;
};
export interface Comment {
    content: string;
    author: Principal;
    timestamp: Time;
}
export interface Story {
    id: string;
    owner: Principal;
    tags: Array<string>;
    creationDate: Time;
    expirationDate: Time;
    viewers: Array<Principal>;
    mediaId: string;
}
export interface FilterPreset {
    name: string;
    settings: {
        contrast: number;
        brightness: number;
        saturation: number;
    };
}
export interface EntertainmentPost {
    id: string;
    content: string;
    tags: Array<string>;
    author: Principal;
    likes: bigint;
    creationDate: Time;
    comments: Array<Comment>;
    mediaId?: string;
}
export interface EnhancedSidebarState {
    isOpen: boolean;
    activeWindow: Window;
    position: string;
}
export interface NearbyPost {
    id: string;
    originalId: string;
    owner: Principal;
    metadata: MediaMetadata;
    location: string;
}
export interface Ratings {
    funFactor: number;
    creative: number;
    technical: number;
    overall: number;
}
export interface MediaMetadata {
    id: string;
    duration?: bigint;
    owner: Principal;
    blob: ExternalBlob;
    tags: Array<string>;
    ratings: Ratings;
    likedBy: Array<Principal>;
    isFavorite: boolean;
    likes: bigint;
    filename: string;
    creationDate: Time;
    comments: Array<Comment>;
    isVideo: boolean;
    arEffectsApplied: Array<string>;
    filtersApplied: Array<string>;
}
export interface UserProfile {
    bio: string;
    username: string;
    stories: Array<string>;
    posts: Array<string>;
    profilePictureBlob?: ExternalBlob;
    videos: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Window {
    editing = "editing",
    entertainment = "entertainment",
    stories = "stories",
    aiTools = "aiTools",
    lucky = "lucky",
    enhance = "enhance",
    settings = "settings",
    nearby20 = "nearby20",
    camera = "camera",
    gallery = "gallery"
}
export interface backendInterface {
    addCommentToMedia(mediaId: string, comment: string): Promise<void>;
    addFilterPreset(name: string, settings: {
        contrast: number;
        brightness: number;
        saturation: number;
    }): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMedia(id: string): Promise<void>;
    getAllEntertainmentPosts(): Promise<Array<EntertainmentPost>>;
    getAllEntertainmentPostsSorted(): Promise<Array<EntertainmentPost>>;
    getAllFilterPresets(): Promise<Array<FilterPreset>>;
    getAllMediaMetadata(): Promise<Array<MediaMetadata>>;
    getAllNonExpiredStories(): Promise<Array<Story>>;
    getAllStories(): Promise<Array<Story>>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentWindow(): Promise<Window>;
    getEntertainmentPost(postId: string): Promise<EntertainmentPost | null>;
    getMediaByOwner(owner: Principal): Promise<Array<MediaMetadata>>;
    getMediaByTag(tag: string): Promise<Array<MediaMetadata>>;
    getMediaMetadata(id: string): Promise<MediaMetadata | null>;
    getMostPopularMedia(limit: bigint): Promise<Array<MediaMetadata>>;
    getNearbyPosts(owner: Principal): Promise<Array<NearbyPost>>;
    getNearbyPostsWithinTimeRange(location: string, startTime: Time, endTime: Time): Promise<Array<NearbyPost>>;
    getNonExpiredUserStories(owner: Principal): Promise<Array<Story>>;
    getPostsByAuthor(author: Principal): Promise<Array<EntertainmentPost>>;
    getSidebarState(): Promise<SideBarResponse>;
    getStory(storyId: string): Promise<Story | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProfilesByUsername(): Promise<Array<UserProfile>>;
    getUserStories(owner: Principal): Promise<Array<Story>>;
    isCallerAdmin(): Promise<boolean>;
    saveAREffect(name: string, description: string, assetReference: string, isAnimated: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveEntertainmentPost(post: EntertainmentPost): Promise<void>;
    saveMedia(id: string, filename: string, filters: Array<string>, arEffects: Array<string>, blob: ExternalBlob, owner: Principal, isVideo: boolean, duration: bigint | null, tags: Array<string>): Promise<void>;
    saveNearbyPost(post: NearbyPost): Promise<void>;
    saveUserStory(story: Story): Promise<void>;
    setFavoriteStatusForMedia(mediaId: string, isFavorite: boolean): Promise<void>;
    setLikeStatusForMedia(mediaId: string, isLiked: boolean): Promise<void>;
    setSidebarPosition(position: string): Promise<void>;
    switchWindow(window: Window): Promise<void>;
    toggleSidebar(): Promise<void>;
}
