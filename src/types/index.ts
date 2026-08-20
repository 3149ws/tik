export type Language = 'en' | 'zh';

export type UserRole = 'super_admin' | 'user';

export type UserStatus = 'active' | 'pending' | 'disabled';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  channelsQuota: number;
  channelsUsed: number;
  plan: 'monthly' | 'annual' | 'enterprise';
  expiresAt: string;
  createdAt: string;
  notes?: string;
}

export type PlatformType = 'tiktok' | 'facebook' | 'youtube' | 'instagram';

export interface SocialChannel {
  id: string;
  platform: PlatformType;
  handle: string;
  displayName: string;
  avatar: string;
  followers: number;
  status: 'active' | 'expired' | 'connecting';
  connectedAt: string;
  tokenExpiresAt: string;
  ipRegion: string; // e.g. "US-West (Silicon Valley)"
  accountType: 'business' | 'creator' | 'personal';
}

export type PostStatus = 'scheduled' | 'publishing' | 'published' | 'draft' | 'failed';

export interface PostContent {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  videoUrl: string;
  videoFileName: string;
  thumbnailUrl: string;
  videoDuration: number; // in seconds
  fileSizeMb: number;
  targetPlatforms: PlatformType[];
  scheduledTime: string; // ISO string
  status: PostStatus;
  createdAt: string;
  publishedUrls?: Partial<Record<PlatformType, string>>;
  viewsCount?: number;
  likesCount?: number;
  
  // TikTok specific audit fields
  tiktokSettings: {
    privacyLevel: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
    allowComments: boolean;
    allowDuet: boolean;
    allowStitch: boolean;
    isAiGenerated: boolean;
    isCommercial: boolean;
    brandPromotion: boolean;
    yourBrand: boolean;
  };

  // YouTube Shorts specific fields
  youtubeSettings: {
    madeForKids: boolean;
    visibility: 'public' | 'unlisted' | 'private';
    category: string;
    notifySubscribers: boolean;
  };

  // Facebook Reels specific fields
  facebookSettings: {
    shareToReels: boolean;
    targetAudience: 'public' | 'friends';
    autoShareToFeed: boolean;
  };

  // Global presets
  autoPublish: boolean;
  useUrlShortener: boolean;
  selectedChannels: string[]; // Channel IDs
}

export interface ApiCredentialConfig {
  platform: 'tiktok' | 'meta' | 'youtube';
  name: string;
  appIdOrKey: string;
  secret: string;
  redirectUri: string;
  webhookUrl: string;
  environment: 'sandbox' | 'live';
  status: 'connected' | 'unconfigured' | 'error';
  lastTestedAt?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface PricingSettings {
  baseMonthlyPerChannel: number; // e.g. 7.00
  annualDiscountPercentage: number; // e.g. 20 (meaning 5.60/month)
  currency: string;
}

export interface ServerNode {
  id: string;
  name: string;
  region: string;
  ipAddress: string;
  ipReputation: 'Clean (100%)' | 'Residential-Grade A+' | 'Safe';
  latencyMs: number;
  activeDispatches: number;
  status: 'online' | 'degraded' | 'maintenance';
}

export interface InboxItem {
  id: string;
  platform: PlatformType;
  channelHandle: string;
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  type: 'comment' | 'dm' | 'mention';
  content: string;
  postThumbnail?: string;
  postTitle?: string;
  createdAt: string;
  isRead: boolean;
  isReplied: boolean;
  tag: 'VIP' | 'Lead' | 'Pending' | 'General';
  replies: Array<{
    id: string;
    text: string;
    sentAt: string;
    sender: 'user' | 'author';
  }>;
}
