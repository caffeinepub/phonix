import List "mo:core/List";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  include MixinStorage();

  // Include access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type Window = {
    #camera;
    #gallery;
    #editing;
    #enhance;
    #aiTools;
    #settings;
    #nearby20;
    #stories;
    #entertainment;
    #lucky;
  };

  public type Ratings = {
    overall : Float;
    creative : Float;
    technical : Float;
    funFactor : Float;
  };

  public type Transformation = {
    x : Float;
    y : Float;
    scale : Float;
    rotation : Float;
  };

  public type FilterPreset = {
    name : Text;
    settings : { brightness : Float; contrast : Float; saturation : Float };
  };

  public type AREffect = {
    name : Text;
    description : Text;
    assetReference : Text;
    isAnimated : Bool;
  };

  public type Sticker = {
    name : Text;
    emoji : Text;
    color : Text;
    size : Nat;
    transformation : Transformation;
  };

  public type FilterCategory = {
    name : Text;
    filters : [Text];
  };

  public type AREffectCategory = {
    name : Text;
    effects : [AREffect];
  };

  public type VideoProcessingSettings = {
    speed : Float;
    transitions : [Text];
    overlays : [Text];
    effects : [Text];
  };

  public type UserSettings = {
    theme : Text;
    language : Text;
    photoResolution : Nat;
    privacy : Text;
  };

  public type AIEnhancementTask = {
    taskId : Text;
    mediaId : Text;
    enhancementType : Text;
    status : Text;
    resultBlob : ?Storage.ExternalBlob;
  };

  public type NearbyPost = {
    id : Text;
    owner : Principal;
    location : Text;
    originalId : Text;
    metadata : MediaMetadata;
  };

  public type Story = {
    id : Text;
    owner : Principal;
    mediaId : Text;
    creationDate : Time.Time;
    expirationDate : Time.Time;
    viewers : [Principal];
    tags : [Text];
  };

  public type EntertainmentPost = {
    id : Text;
    content : Text;
    mediaId : ?Text;
    author : Principal;
    creationDate : Time.Time;
    likes : Nat;
    comments : [Comment];
    tags : [Text];
  };

  public type Comment = {
    author : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  public type SidebarState = {
    isOpen : Bool;
    position : Text;
    activeWindow : Window;
  };

  public type EnhancedSidebarState = SidebarState;

  public type MediaMetadata = {
    id : Text;
    filename : Text;
    creationDate : Time.Time;
    filtersApplied : [Text];
    arEffectsApplied : [Text];
    owner : Principal;
    blob : Storage.ExternalBlob;
    likes : Nat;
    likedBy : [Principal];
    comments : [Comment];
    isFavorite : Bool;
    ratings : Ratings;
    isVideo : Bool;
    duration : ?Nat;
    tags : [Text];
  };

  module MediaMetadata {
    public func compareByCreationDate(metadata1 : MediaMetadata, metadata2 : MediaMetadata) : Order.Order {
      if (metadata1.creationDate < metadata2.creationDate) {
        #less;
      } else if (metadata1.creationDate > metadata2.creationDate) {
        #greater;
      } else {
        Text.compare(metadata1.id, metadata2.id);
      };
    };
  };

  public type UserProfile = {
    username : Text;
    bio : Text;
    profilePictureBlob : ?Storage.ExternalBlob;
    videos : [Text];
    stories : [Text];
    posts : [Text];
  };

  module UserProfile {
    public func compareByUser(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      if (profile1.username < profile2.username) { return #less };
      if (profile1.username > profile2.username) { return #greater };
      #equal;
    };
  };

  // Data Structures
  let userProfiles = Map.empty<Principal, UserProfile>();
  let media = Map.empty<Text, MediaMetadata>();
  let filterPresets = Map.empty<Text, FilterPreset>();
  let arEffects = Map.empty<Text, AREffect>();
  let stickers = Map.empty<Text, Sticker>();
  let filterCategories = Map.empty<Text, FilterCategory>();
  let arEffectCategories = Map.empty<Text, AREffectCategory>();
  let videoProcessing = Map.empty<Text, VideoProcessingSettings>();
  let sharedMediaCounter = Map.empty<Text, Nat>();
  let mediaShares = Map.empty<Text, Text>();
  let userSettings = Map.empty<Principal, UserSettings>();
  let aiEnhancements = Map.empty<Text, AIEnhancementTask>();
  let nearbyPosts = List.empty<NearbyPost>();
  let stories = Map.empty<Text, Story>();
  let entertainmentPosts = Map.empty<Text, EntertainmentPost>();

  var currentWindow : Window = #camera;
  var sidebarState : SidebarState = {
    isOpen = false;
    position = "left";
    activeWindow = #camera;
  };

  var storiesTimeMinutes = 180; // 3 hours (180 minutes)

  // Define SideBarResponse as a datatype
  public type SideBarResponse = {
    #success : EnhancedSidebarState;
    #error : Text;
  };

  // User Profile Management
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Social platform: any authenticated user (including guests) can view public profiles
    userProfiles.get(user);
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    // Social platform: require at least user permission to browse all profiles
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse all profiles");
    };
    userProfiles.values().toArray();
  };

  public query ({ caller }) func getUserProfilesByUsername() : async [UserProfile] {
    // Social platform: require at least user permission to browse profiles
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse profiles");
    };
    userProfiles.values().toArray().sort(UserProfile.compareByUser);
  };

  public shared ({ caller }) func switchWindow(window : Window) : async () {
    // UI state modification requires user permission
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can switch windows");
    };
    currentWindow := window;
    sidebarState := { sidebarState with activeWindow = window };
  };

  public query ({ caller }) func getCurrentWindow() : async Window {
    // UI state query requires user permission
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view window state");
    };
    currentWindow;
  };

  public shared ({ caller }) func toggleSidebar() : async () {
    // UI state modification requires user permission
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can toggle sidebar");
    };
    sidebarState := { sidebarState with isOpen = not sidebarState.isOpen };
  };

  public shared ({ caller }) func setSidebarPosition(position : Text) : async () {
    // UI state modification requires user permission
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set sidebar position");
    };
    sidebarState := { sidebarState with position };
  };

  public query ({ caller }) func getSidebarState() : async SideBarResponse {
    // UI state query requires user permission
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sidebar state");
    };
    getEnhancedSidebar();
  };

  // Media Management
  public shared ({ caller }) func saveMedia(
    id : Text,
    filename : Text,
    filters : [Text],
    arEffects : [Text],
    blob : Storage.ExternalBlob,
    owner : Principal,
    isVideo : Bool,
    duration : ?Nat,
    tags : [Text],
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save media");
    };

    if (caller != owner) {
      Runtime.trap("Unauthorized: Can only save media for yourself");
    };

    switch (media.get(id)) {
      case (?_) { Runtime.trap("Media with this ID already exists") };
      case (null) {
        let mediaItem : MediaMetadata = {
          id;
          filename;
          creationDate = Time.now();
          filtersApplied = filters;
          arEffectsApplied = arEffects;
          blob;
          owner;
          likes = 0;
          likedBy = [];
          comments = [];
          isFavorite = false;
          ratings = { overall = 0.0; creative = 0.0; technical = 0.0; funFactor = 0.0 };
          isVideo;
          duration;
          tags;
        };
        media.add(id, mediaItem);
      };
    };
  };

  public shared ({ caller }) func deleteMedia(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete media");
    };

    switch (media.get(id)) {
      case (null) { Runtime.trap("Media not found") };
      case (?mediaItem) {
        if (caller != mediaItem.owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own media");
        };
        media.remove(id);
      };
    };
  };

  public query ({ caller }) func getMediaMetadata(id : Text) : async ?MediaMetadata {
    // Social platform: public media viewing (no auth required for discovery)
    media.get(id);
  };

  public query ({ caller }) func getAllMediaMetadata() : async [MediaMetadata] {
    // Social platform: public media browsing (no auth required for discovery)
    media.values().toArray().sort(MediaMetadata.compareByCreationDate);
  };

  public query ({ caller }) func getMediaByTag(tag : Text) : async [MediaMetadata] {
    // Social platform: public tag-based discovery (no auth required)
    let filteredMediaList = List.empty<MediaMetadata>();
    for (mediaItem in media.values()) {
      if (mediaItem.tags.find(func(t) { t == tag }) != null) {
        filteredMediaList.add(mediaItem);
      };
    };
    filteredMediaList.toArray();
  };

  // Filter and Effect Management - Admin only
  public shared ({ caller }) func addFilterPreset(name : Text, settings : { brightness : Float; contrast : Float; saturation : Float }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add filter presets");
    };
    filterPresets.add(name, { name; settings });
  };

  public query ({ caller }) func getAllFilterPresets() : async [FilterPreset] {
    // Public discovery feature: no auth required
    filterPresets.values().toArray();
  };

  public query ({ caller }) func getMostPopularMedia(limit : Nat) : async [MediaMetadata] {
    // Public discovery feature: no auth required
    let valuesArray = media.values().toArray();
    let sortedMedia = valuesArray.sort(
      func(a, b) {
        if (a.likes == b.likes) { return #equal };
        if (a.likes < b.likes) { return #greater } else { return #less };
      }
    );
    sortedMedia.sliceToArray(0, Nat.min(limit, sortedMedia.size()));
  };

  func getEnhancedSidebar() : SideBarResponse {
    if (sidebarState.isOpen and sidebarState.position == "left") {
      #success({
        sidebarState with
        activeWindow = currentWindow;
        isOpen = true;
        position = "left";
      });
    } else if (sidebarState.isOpen and sidebarState.position == "right") {
      #success({
        sidebarState with
        activeWindow = currentWindow;
        isOpen = true;
        position = "right";
      });
    } else if (sidebarState.isOpen and not (sidebarState.position == "left" or sidebarState.position == "right")) {
      #error("Realy undefined pos: " # sidebarState.position);
    } else if (sidebarState.isOpen) {
      #success({
        sidebarState with
        activeWindow = currentWindow;
        isOpen = true;
      });
    } else if (not sidebarState.isOpen and (sidebarState.position == "left" or sidebarState.position == "right")) {
      #success({
        sidebarState with
        activeWindow = currentWindow;
      });
    } else if (not sidebarState.isOpen) {
      #success({
        sidebarState with
        activeWindow = currentWindow;
      });
    } else {
      #error("Sidebar: Unexpected ");
    };
  };

  // Additional Refactor Functions for Filter and Effect Management
  public shared ({ caller }) func saveAREffect(name : Text, description : Text, assetReference : Text, isAnimated : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add AR effects");
    };
    let newEffect = {
      name;
      description;
      assetReference;
      isAnimated;
    };
    arEffects.add(name, newEffect);
  };

  // Stories Ownership and Expiry
  public shared ({ caller }) func saveUserStory(story : Story) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save stories");
    };

    if (caller != story.owner) {
      Runtime.trap("Unauthorized: Can only save stories for yourself");
    };

    if (Time.now() >= story.expirationDate) {
      Runtime.trap("The story has expired and cannot be saved");
    };

    stories.add(story.id, story);
  };

  public query ({ caller }) func getStory(storyId : Text) : async ?Story {
    // Require authentication to view stories
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view stories");
    };
    stories.get(storyId);
  };

  public query ({ caller }) func getNonExpiredUserStories(owner : Principal) : async [Story] {
    // Require authentication to view stories
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view stories");
    };
    let allStories = stories.values().toArray();
    let currentTime = Time.now();
    let filteredStories = allStories.filter(
      func(story) {
        story.owner == owner and story.expirationDate > currentTime
      }
    );
    filteredStories;
  };

  public query ({ caller }) func getUserStories(owner : Principal) : async [Story] {
    // Require authentication to view stories
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view stories");
    };
    let allStories = stories.values().toArray();
    allStories.filter(
      func(story) {
        story.owner == owner;
      }
    );
  };

  public query ({ caller }) func getAllNonExpiredStories() : async [Story] {
    // Require authentication to browse stories
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse stories");
    };
    let allStories = stories.values().toArray();
    allStories.filter(
      func(story) {
        story.expirationDate > Time.now();
      }
    );
  };

  public query ({ caller }) func getAllStories() : async [Story] {
    // Require authentication to browse all stories
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse stories");
    };
    stories.values().toArray();
  };

  // Entertainment Feed Management
  public shared ({ caller }) func saveEntertainmentPost(post : EntertainmentPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save entertainment posts");
    };

    if (caller != post.author) {
      Runtime.trap("Unauthorized: Can only save posts for yourself");
    };

    entertainmentPosts.add(post.id, post);
  };

  public query ({ caller }) func getEntertainmentPost(postId : Text) : async ?EntertainmentPost {
    // Social platform: public post viewing (no auth required for discovery)
    entertainmentPosts.get(postId);
  };

  public query ({ caller }) func getPostsByAuthor(author : Principal) : async [EntertainmentPost] {
    // Social platform: public browsing by author (no auth required)
    let allPosts = entertainmentPosts.values().toArray();
    allPosts.filter(func(post) { post.author == author });
  };

  public query ({ caller }) func getAllEntertainmentPosts() : async [EntertainmentPost] {
    // Social platform: public browsing (no auth required)
    entertainmentPosts.values().toArray();
  };

  public query ({ caller }) func getAllEntertainmentPostsSorted() : async [EntertainmentPost] {
    // Social platform: public browsing (no auth required)
    entertainmentPosts.values().toArray().reverse();
  };

  // Nearby Posts Management
  public shared ({ caller }) func saveNearbyPost(post : NearbyPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save nearby posts");
    };

    if (caller != post.owner) {
      Runtime.trap("Unauthorized: Can only save posts for yourself");
    };

    let location = post.location;
    let existingPostIndex = nearbyPosts.findIndex(
      func(p) {
        p.location == location and p.originalId == post.originalId
      }
    );

    switch (existingPostIndex) {
      case (null) { nearbyPosts.add(post) };
      case (?index) {
        nearbyPosts.put(index, post);
      };
    };
  };

  public query ({ caller }) func getNearbyPosts(owner : Principal) : async [NearbyPost] {
    // Social platform: public media by owner (no auth required)
    let postsList = List.empty<NearbyPost>();

    for (post in nearbyPosts.values()) {
      if (post.owner == owner) {
        postsList.add(post);
      };
    };

    postsList.toArray();
  };

  public query ({ caller }) func getNearbyPostsWithinTimeRange(location : Text, startTime : Time.Time, endTime : Time.Time) : async [NearbyPost] {
    // Social platform: public location-based browsing (no auth required)
    let postsList = List.empty<NearbyPost>();

    for (post in nearbyPosts.values()) {
      if (post.location == location and post.metadata.creationDate >= startTime and post.metadata.creationDate <= endTime) {
        postsList.add(post);
      };
    };

    postsList.toArray();
  };

  public shared ({ caller }) func addCommentToMedia(mediaId : Text, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can comment on media");
    };

    if (comment.size() == 0) {
      Runtime.trap("Comment cannot be empty");
    };

    switch (media.get(mediaId)) {
      case (?mediaEntry) {
        let newComment : Comment = {
          author = caller;
          content = comment;
          timestamp = Time.now();
        };
        let updatedComments = mediaEntry.comments.concat([newComment]);
        let updatedMetadata = { mediaEntry with comments = updatedComments };
        media.add(mediaId, updatedMetadata);
      };
      case (null) { Runtime.trap("Media not found") };
    };
  };

  public query ({ caller }) func getMediaByOwner(owner : Principal) : async [MediaMetadata] {
    // Social platform: public browsing by owner (no auth required)
    let filteredMediaList = List.empty<MediaMetadata>();

    for (mediaItem in media.values()) {
      if (mediaItem.owner == owner) {
        filteredMediaList.add(mediaItem);
      };
    };

    filteredMediaList.toArray();
  };

  public shared ({ caller }) func setLikeStatusForMedia(mediaId : Text, isLiked : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like media");
    };

    switch (media.get(mediaId)) {
      case (null) { Runtime.trap("Media metadata not found. Failed to update like count") };
      case (?existingEntry) {
        let alreadyLiked = existingEntry.likedBy.find(func(p) { p == caller }) != null;
        
        if (isLiked and not alreadyLiked) {
          // Add like
          let updatedLikedBy = existingEntry.likedBy.concat([caller]);
          let updatedMetadata = {
            existingEntry with
            likes = existingEntry.likes + 1;
            likedBy = updatedLikedBy;
          };
          media.add(mediaId, updatedMetadata);
        } else if (not isLiked and alreadyLiked) {
          // Remove like
          let updatedLikedBy = existingEntry.likedBy.filter(func(p) { p != caller });
          let updatedMetadata = {
            existingEntry with
            likes = if (existingEntry.likes > 0) { existingEntry.likes - 1 } else { 0 };
            likedBy = updatedLikedBy;
          };
          media.add(mediaId, updatedMetadata);
        };
        // If already in desired state, do nothing
      };
    };
  };

  public shared ({ caller }) func setFavoriteStatusForMedia(mediaId : Text, isFavorite : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can favorite media");
    };

    switch (media.get(mediaId)) {
      case (null) { Runtime.trap("Media not found. Failed to update favorite status") };
      case (?existingEntry) {
        // Only allow users to set favorite status for their own media
        if (caller != existingEntry.owner) {
          Runtime.trap("Unauthorized: Can only favorite your own media");
        };
        media.add(mediaId, { existingEntry with isFavorite });
      };
    };
  };
};
