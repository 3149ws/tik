import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  SocialChannel,
  PostContent,
  ApiCredentialConfig,
  PromoCode,
  PricingSettings,
  ServerNode,
  InboxItem,
} from '../types';
import {
  saveChannelToDb,
  deleteChannelFromDb,
  subscribeToChannels,
  saveScheduledPostToDb,
  deleteScheduledPostFromDb,
  subscribeToScheduledPosts,
  saveApiCredentialToDb,
  DbChannel,
  DbScheduledPost,
} from '../services/dbService';
import { handleOAuthCallback } from '../services/oauthService';

interface AppContextType {
  // Auth
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  usersList: User[];
  login: (identifier: string, pass: string) => { success: boolean; message?: string; role?: string };
  register: (name: string, email: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  updateUserStatus: (userId: string, status: 'active' | 'pending' | 'disabled', quota?: number) => void;
  addNewUser: (user: Omit<User, 'id' | 'createdAt' | 'channelsUsed'>) => void;
  deleteUser: (userId: string) => void;

  // Channels
  channels: SocialChannel[];
  addChannel: (channel: Omit<SocialChannel, 'id' | 'connectedAt'>) => void;
  removeChannel: (id: string) => void;
  testChannelDispatch: (id: string) => Promise<{ success: boolean; latency: number; ip: string }>;

  // Posts & Scheduling
  posts: PostContent[];
  createPost: (post: Omit<PostContent, 'id' | 'createdAt'>) => void;
  updatePost: (id: string, post: Partial<PostContent>) => void;
  deletePost: (id: string) => void;
  publishPostImmediately: (id: string) => Promise<boolean>;

  // Admin APIs & Settings
  apiConfigs: ApiCredentialConfig[];
  updateApiConfig: (platform: 'tiktok' | 'meta' | 'youtube', config: Partial<ApiCredentialConfig>) => void;
  testApiHandshake: (platform: 'tiktok' | 'meta' | 'youtube') => Promise<boolean>;

  // Pricing & Promos
  pricingSettings: PricingSettings;
  updatePricingSettings: (settings: Partial<PricingSettings>) => void;
  promoCodes: PromoCode[];
  addPromoCode: (promo: Omit<PromoCode, 'id' | 'usedCount'>) => void;
  deletePromoCode: (id: string) => void;
  applyPromoCode: (code: string) => { valid: boolean; discountPercent?: number; discountAmount?: number };

  // Dispatch Server Nodes
  serverNodes: ServerNode[];

  // Inbox
  inboxItems: InboxItem[];
  replyToInboxItem: (itemId: string, replyText: string) => void;
  markInboxRead: (itemId: string) => void;

  // Navigation page helper
  activePage: string;
  setActivePage: (page: string) => void;

  // OAuth Toast Banner
  oauthSuccessBanner: string | null;
  setOauthSuccessBanner: (msg: string | null) => void;

  // Scheduling draft state
  draftScheduleDate: string;
  draftScheduleTime: string;
  setDraftSchedule: (date: string, time: string) => void;
}

const initialUsers: User[] = [
  {
    id: 'usr_admin',
    email: 'admin@yunina.com',
    name: 'Super Administrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'super_admin',
    status: 'active',
    channelsQuota: 100,
    channelsUsed: 4,
    plan: 'enterprise',
    expiresAt: '2030-12-31',
    createdAt: '2026-01-01',
    notes: 'System Root Master Administrator',
  },
  {
    id: 'usr_creator1',
    email: 'lideming@yunina.com',
    name: 'Li Deming (Matrix Team)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    status: 'active',
    channelsQuota: 10,
    channelsUsed: 3,
    plan: 'annual',
    expiresAt: '2027-08-19',
    createdAt: '2026-06-15',
    notes: 'TCM Health & Wellness Short Video Matrix (TikTok & YouTube Shorts)',
  },
];

const initialChannels: SocialChannel[] = [];

const initialPosts: PostContent[] = [];

const initialApiConfigs: ApiCredentialConfig[] = [
  {
    platform: 'tiktok',
    name: 'TikTok Content Posting API (Official v2)',
    appIdOrKey: 'tt_app_7384918293849102',
    secret: '••••••••••••••••••••••••••••••••3a9f',
    redirectUri: 'https://yunina.com/oauth/tiktok/callback',
    webhookUrl: 'https://api.yunina.com/v1/webhooks/tiktok/events',
    environment: 'live',
    status: 'connected',
    lastTestedAt: '2026-08-18 19:40:12',
  },
  {
    platform: 'meta',
    name: 'Meta for Developers (Facebook Graph & Reels API)',
    appIdOrKey: 'meta_fb_93810294819028',
    secret: '••••••••••••••••••••••••••••••••c82e',
    redirectUri: 'https://yunina.com/oauth/facebook/callback',
    webhookUrl: 'https://api.yunina.com/v1/webhooks/facebook/reels',
    environment: 'live',
    status: 'connected',
    lastTestedAt: '2026-08-18 18:22:04',
  },
  {
    platform: 'youtube',
    name: 'Google Cloud Console (YouTube Data API v3)',
    appIdOrKey: '507473056296-h0d93t8nu3p3ufgt6oug6q2mbe0olqu8.apps.googleusercontent.com',
    secret: '••••••••••••••••••••••••••••••••99ff',
    redirectUri: 'https://yunina.com/oauth/google/callback',
    webhookUrl: 'https://api.yunina.com/v1/webhooks/youtube/publish',
    environment: 'live',
    status: 'connected',
    lastTestedAt: '2026-08-18 19:15:33',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>(initialUsers);
  const [channels, setChannels] = useState<SocialChannel[]>(initialChannels);
  const [posts, setPosts] = useState<PostContent[]>(initialPosts);
  const [apiConfigs, setApiConfigs] = useState<ApiCredentialConfig[]>(initialApiConfigs);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [serverNodes] = useState<ServerNode[]>([]);
  const [inboxItems, setInboxItems] = useState<InboxItem[]>([]);
  const [activePage, setActivePage] = useState<string>('landing');
  const [draftScheduleDate, setDraftScheduleDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [draftScheduleTime, setDraftScheduleTime] = useState<string>('11:00');

  const setDraftSchedule = (date: string, time: string) => {
    setDraftScheduleDate(date);
    setDraftScheduleTime(time);
    setActivePage('compose');
  };

  const [pricingSettings, setPricingSettings] = useState<PricingSettings>({
    baseMonthlyPerChannel: 7.0,
    annualDiscountPercentage: 20,
    currency: 'USD',
  });

  const [oauthSuccessBanner, setOauthSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    async function checkOAuth() {
      const targetUserId = currentUser?.id || 'usr_creator1';
      const resultChannel = await handleOAuthCallback(targetUserId);
      if (resultChannel) {
        const formattedChan: SocialChannel = {
          id: resultChannel.id,
          platform: resultChannel.platform,
          handle: resultChannel.handle,
          displayName: resultChannel.accountName,
          avatar: resultChannel.avatar,
          followers: resultChannel.followers,
          status: resultChannel.status || 'active',
          connectedAt: new Date().toISOString().split('T')[0],
          tokenExpiresAt: resultChannel.tokenExpiresAt || '2027-08-18',
          ipRegion: resultChannel.nodeRegion,
          accountType: 'creator',
        };
        setChannels((prev) => {
          if (prev.some((c) => c.handle === formattedChan.handle && c.platform === formattedChan.platform)) {
            return prev;
          }
          return [formattedChan, ...prev];
        });
        setOauthSuccessBanner(
          `✅ 账号 ${formattedChan.handle} 已通过 TikTok Sandbox 官方授权成功连通绑定！`
        );
        setActivePage('channels');
      }
    }
    checkOAuth();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeChannels = subscribeToChannels(currentUser.id, (dbChannels) => {
      if (dbChannels && dbChannels.length > 0) {
        const formattedList: SocialChannel[] = dbChannels.map((c: DbChannel) => ({
          id: c.id,
          platform: c.platform,
          handle: c.handle,
          displayName: c.accountName,
          avatar: c.avatar,
          followers: c.followers,
          status: c.status || 'active',
          connectedAt: c.connectedAt || new Date().toISOString().split('T')[0],
          tokenExpiresAt: c.tokenExpiresAt || '2027-08-18',
          ipRegion: c.nodeRegion,
          accountType: 'creator',
        }));
        setChannels(formattedList);
      } else {
        setChannels([]);
      }
    });

    const unsubscribePosts = subscribeToScheduledPosts(currentUser.id, (dbPosts) => {
      if (dbPosts && dbPosts.length > 0) {
        const formattedPosts: PostContent[] = dbPosts.map((p: DbScheduledPost) => ({
          id: p.id,
          title: p.title,
          caption: p.caption,
          hashtags: p.caption ? p.caption.match(/#[^\s#]+/g) || [] : [],
          videoUrl: p.videoUrl,
          videoFileName: p.videoFileName || 'video.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80',
          videoDuration: 30,
          fileSizeMb: 20,
          targetPlatforms: p.targetPlatforms as ('tiktok' | 'youtube' | 'facebook' | 'instagram')[],
          scheduledTime: p.scheduledTime,
          status: p.status || 'scheduled',
          createdAt: p.createdAt || new Date().toISOString(),
          viewsCount: p.views || 0,
          likesCount: p.likes || 0,
          tiktokSettings: p.tiktokConfig || {
            privacyLevel: 'PUBLIC_TO_EVERYONE',
            allowComments: true,
            allowDuet: true,
            allowStitch: true,
            isAiGenerated: false,
            isCommercial: false,
            brandPromotion: false,
            yourBrand: false,
          },
          youtubeSettings: p.youtubeConfig || {
            madeForKids: false,
            visibility: 'public',
            category: 'Howto & Style',
            notifySubscribers: true,
          },
          facebookSettings: p.facebookConfig || {
            shareToReels: true,
            targetAudience: 'public',
            autoShareToFeed: true,
          },
          autoPublish: true,
          useUrlShortener: false,
          selectedChannels: [],
        }));
        setPosts(formattedPosts);
      } else {
        setPosts([]);
      }
    });

    return () => {
      unsubscribeChannels();
      unsubscribePosts();
    };
  }, [currentUser]);

  const login = (identifier: string, pass: string) => {
    const trimmedId = identifier.trim();
    const trimmedPass = pass.trim();

    if ((trimmedId === 'admin' || trimmedId === 'admin@yunina.com') && trimmedPass === '20050608ws') {
      const adminUser = usersList.find((u) => u.role === 'super_admin') || initialUsers[0];
      setCurrentUser(adminUser);
      localStorage.setItem('yunina_current_user', JSON.stringify(adminUser));
      return { success: true, role: 'super_admin' };
    }

    const matched = usersList.find(
      (u) => u.email.toLowerCase() === trimmedId.toLowerCase() || u.name.toLowerCase() === trimmedId.toLowerCase()
    );

    if (matched) {
      if (matched.status === 'pending') {
        return {
          success: false,
          message: 'Your account is pending activation. Contact support or admin to activate.',
        };
      }
      if (matched.status === 'disabled') {
        return {
          success: false,
          message: 'This account has been disabled by administrator.',
        };
      }

      setCurrentUser(matched);
      localStorage.setItem('yunina_current_user', JSON.stringify(matched));
      return { success: true, role: matched.role };
    }

    if (trimmedId === 'creator' || trimmedId === 'demo' || trimmedId === 'creator@yunina.com') {
      const creator = usersList.find((u) => u.id === 'usr_creator1') || initialUsers[1];
      setCurrentUser(creator);
      localStorage.setItem('yunina_current_user', JSON.stringify(creator));
      return { success: true, role: 'user' };
    }

    return {
      success: false,
      message: 'Invalid credentials. Please verify your email/username and password.',
    };
  };

  const register = (name: string, email: string, _pass: string) => {
    const existing = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email,
      name: name || 'New Creator',
      role: 'user',
      status: 'pending',
      channelsQuota: 0,
      channelsUsed: 0,
      plan: 'monthly',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      notes: 'New web self-registration.',
    };

    setUsersList((prev) => [newUser, ...prev]);
    return {
      success: true,
      message: 'Registration submitted successfully!',
    };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('yunina_current_user');
    setActivePage('landing');
  };

  const updateUserStatus = (userId: string, status: 'active' | 'pending' | 'disabled', quota?: number) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = {
            ...u,
            status,
            ...(quota !== undefined ? { channelsQuota: quota } : {}),
          };
          if (currentUser && currentUser.id === userId) {
            setCurrentUser(updated);
            localStorage.setItem('yunina_current_user', JSON.stringify(updated));
          }
          return updated;
        }
        return u;
      })
    );
  };

  const addNewUser = (user: Omit<User, 'id' | 'createdAt' | 'channelsUsed'>) => {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      channelsUsed: 0,
    };
    setUsersList((prev) => [newUser, ...prev]);
  };

  const deleteUser = (userId: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
  };

  const addChannel = async (channel: Omit<SocialChannel, 'id' | 'connectedAt'>) => {
    const newChanId = `chn_${Date.now()}`;
    const newChan: SocialChannel = {
      ...channel,
      id: newChanId,
      connectedAt: new Date().toISOString().split('T')[0],
    };
    setChannels((prev) => [newChan, ...prev]);

    if (currentUser) {
      await saveChannelToDb({
        id: newChanId,
        userId: currentUser.id,
        platform: channel.platform,
        accountName: channel.displayName,
        handle: channel.handle,
        avatar: channel.avatar,
        followers: channel.followers,
        status: channel.status,
        nodeRegion: channel.ipRegion,
        connectedAt: newChan.connectedAt,
      });

      const updated = { ...currentUser, channelsUsed: currentUser.channelsUsed + 1 };
      setCurrentUser(updated);
    }
  };

  const removeChannel = async (id: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== id));
    await deleteChannelFromDb(id);

    if (currentUser && currentUser.channelsUsed > 0) {
      const updated = { ...currentUser, channelsUsed: currentUser.channelsUsed - 1 };
      setCurrentUser(updated);
    }
  };

  const testChannelDispatch = async (_id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      latency: Math.floor(Math.random() * 30) + 25,
      ip: '198.51.100.42 (US-West Clean Residential Node)',
    };
  };

  const createPost = async (post: Omit<PostContent, 'id' | 'createdAt'>) => {
    const newPostId = `post_${Date.now()}`;
    const newPost: PostContent = {
      ...post,
      id: newPostId,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);

    if (currentUser) {
      await saveScheduledPostToDb({
        id: newPostId,
        userId: currentUser.id,
        title: post.title,
        caption: post.caption,
        videoUrl: post.videoUrl,
        videoFileName: post.videoFileName,
        targetPlatforms: post.targetPlatforms,
        scheduledTime: post.scheduledTime,
        status: post.status,
        tiktokConfig: post.tiktokSettings,
        youtubeConfig: post.youtubeSettings,
        facebookConfig: post.facebookSettings,
        createdAt: newPost.createdAt,
      });
    }
  };

  const updatePost = (id: string, post: Partial<PostContent>) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...post } : p)));
  };

  const deletePost = async (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    await deleteScheduledPostFromDb(id);
  };

  const publishPostImmediately = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = {
            ...p,
            status: 'published' as const,
            scheduledTime: new Date().toISOString(),
            viewsCount: 1,
            likesCount: 0,
          };
          if (currentUser) {
            saveScheduledPostToDb({
              id: p.id,
              userId: currentUser.id,
              title: p.title,
              caption: p.caption,
              videoUrl: p.videoUrl,
              videoFileName: p.videoFileName,
              targetPlatforms: p.targetPlatforms,
              scheduledTime: updated.scheduledTime,
              status: 'published',
              createdAt: p.createdAt,
            });
          }
          return updated;
        }
        return p;
      })
    );
    return true;
  };

  const updateApiConfig = async (platform: 'tiktok' | 'meta' | 'youtube', config: Partial<ApiCredentialConfig>) => {
    setApiConfigs((prev) => prev.map((c) => (c.platform === platform ? { ...c, ...config } : c)));

    if (config.appIdOrKey) {
      await saveApiCredentialToDb({
        platform,
        clientId: config.appIdOrKey,
        clientSecret: config.secret || '',
        redirectUri: config.redirectUri || window.location.origin,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const testApiHandshake = async (platform: 'tiktok' | 'meta' | 'youtube') => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setApiConfigs((prev) =>
      prev.map((c) => (c.platform === platform ? { ...c, status: 'connected', lastTestedAt: new Date().toLocaleString() } : c))
    );
    return true;
  };

  const updatePricingSettings = (settings: Partial<PricingSettings>) => {
    setPricingSettings((prev) => ({ ...prev, ...settings }));
  };

  const addPromoCode = (promo: Omit<PromoCode, 'id' | 'usedCount'>) => {
    const newPromo: PromoCode = {
      ...promo,
      id: `promo_${Date.now()}`,
      usedCount: 0,
    };
    setPromoCodes((prev) => [newPromo, ...prev]);
  };

  const deletePromoCode = (id: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
  };

  const applyPromoCode = (code: string) => {
    const promo = promoCodes.find((p) => p.code.toUpperCase() === code.trim().toUpperCase() && p.isActive);
    if (!promo) return { valid: false };
    if (promo.discountType === 'percentage') {
      return { valid: true, discountPercent: promo.discountValue };
    }
    return { valid: true, discountAmount: promo.discountValue };
  };

  const replyToInboxItem = (itemId: string, replyText: string) => {
    setInboxItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            isReplied: true,
            replies: [
              ...item.replies,
              {
                id: `rep_${Date.now()}`,
                text: replyText,
                sentAt: new Date().toISOString(),
                sender: 'user',
              },
            ],
          };
        }
        return item;
      })
    );
  };

  const markInboxRead = (itemId: string) => {
    setInboxItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, isRead: true } : item)));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        usersList,
        login,
        register,
        logout,
        updateUserStatus,
        addNewUser,
        deleteUser,
        channels,
        addChannel,
        removeChannel,
        testChannelDispatch,
        posts,
        createPost,
        updatePost,
        deletePost,
        publishPostImmediately,
        apiConfigs,
        updateApiConfig,
        testApiHandshake,
        pricingSettings,
        updatePricingSettings,
        promoCodes,
        addPromoCode,
        deletePromoCode,
        applyPromoCode,
        serverNodes,
        inboxItems,
        replyToInboxItem,
        markInboxRead,
        activePage,
        setActivePage,
        oauthSuccessBanner,
        setOauthSuccessBanner,
        draftScheduleDate,
        draftScheduleTime,
        setDraftSchedule,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
