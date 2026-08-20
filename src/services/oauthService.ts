import { getApiCredentialFromDb, saveChannelToDb, DbChannel } from './dbService';

export function isPlaceholderKey(platform: string, key?: string): boolean {
  if (!key || key.trim() === '') return true;
  if (platform === 'tiktok') {
    return key.startsWith('aw39x1') || key.startsWith('tt_app_') || key.includes('••••');
  }
  if (platform === 'facebook' || platform === 'instagram' || platform === 'meta') {
    return key.startsWith('104829') || key.startsWith('meta_fb_') || key.includes('••••');
  }
  return false;
}

export function generateOAuthState(platform: string, userId: string): string {
  const state = JSON.stringify({
    platform,
    userId,
    timestamp: Date.now(),
    nonce: Math.random().toString(36).substring(2, 9),
  });
  sessionStorage.setItem(`oauth_state_${platform}`, state);
  return btoa(state);
}

export async function getOAuthUrl(
  platform: 'tiktok' | 'youtube' | 'facebook' | 'instagram',
  userId: string,
  overrideClientKey?: string
): Promise<{ url: string; clientId: string; isPlaceholder: boolean }> {
  const redirectUri = `${window.location.origin}/api/auth/callback/${platform === 'facebook' || platform === 'instagram' ? 'meta' : platform}`;
  const encodedRedirectUri = encodeURIComponent(redirectUri);
  const state = generateOAuthState(platform, userId);

  if (platform === 'youtube') {
    const cred = await getApiCredentialFromDb('youtube');
    const clientId =
      overrideClientKey ||
      cred?.clientId ||
      '507473056296-h0d93t8nu3p3ufgt6oug6q2mbe0olqu8.apps.googleusercontent.com';
    const scope = encodeURIComponent(
      'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
    );
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodedRedirectUri}&response_type=token&scope=${scope}&state=${state}&include_granted_scopes=true&prompt=consent`;
    return { url, clientId, isPlaceholder: false };
  }

  if (platform === 'tiktok') {
    const cred = await getApiCredentialFromDb('tiktok');
    const clientKey = overrideClientKey || cred?.clientId || 'aw39x1z81k9p2lh2';
    const isPlaceholder = isPlaceholderKey('tiktok', clientKey);
    const scope = 'user.info.basic,video.upload,video.publish';
    
    // TikTok official Sandbox OAuth 2.0 URL format
    const url = `https://auth.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&redirect_uri=${encodedRedirectUri}&response_type=code&state=${state}`;
    return { url, clientId: clientKey, isPlaceholder };
  }

  if (platform === 'facebook' || platform === 'instagram') {
    const cred = await getApiCredentialFromDb('meta');
    const appId = overrideClientKey || cred?.clientId || '1048293028192019';
    const isPlaceholder = isPlaceholderKey('meta', appId);
    const scope = encodeURIComponent(
      'pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish'
    );
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodedRedirectUri}&response_type=token&scope=${scope}&state=${state}`;
    return { url, clientId: appId, isPlaceholder };
  }

  throw new Error(`Unsupported platform: ${platform}`);
}

export async function redirectToOAuth(
  platform: 'tiktok' | 'youtube' | 'facebook' | 'instagram',
  userId: string,
  overrideClientKey?: string
): Promise<boolean> {
  const { url } = await getOAuthUrl(platform, userId, overrideClientKey);
  try {
    if (window.top && window.top !== window) {
      window.top.location.href = url;
    } else {
      window.location.href = url;
    }
  } catch (e) {
    window.location.href = url;
  }
  return true;
}

export async function handleOAuthCallback(
  currentUserId: string
): Promise<DbChannel | null> {
  const pathname = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));

  const code = urlParams.get('code');
  const accessToken = hashParams.get('access_token') || urlParams.get('access_token');
  const rawState = urlParams.get('state') || hashParams.get('state');
  const isCallbackPath = pathname.includes('/api/auth/callback') || pathname.includes('/callback');

  if (!code && !accessToken && !isCallbackPath) {
    return null;
  }

  let platform: 'tiktok' | 'youtube' | 'facebook' | 'instagram' = 'tiktok';
  let userId = currentUserId || 'usr_creator1';

  if (rawState) {
    try {
      const decoded = JSON.parse(atob(rawState));
      platform = decoded.platform || 'tiktok';
      if (decoded.userId) userId = decoded.userId;
    } catch (e) {
      console.warn('Failed to parse OAuth state token', e);
    }
  } else if (pathname.includes('meta') || pathname.includes('facebook')) {
    platform = 'facebook';
  } else if (pathname.includes('youtube') || pathname.includes('google')) {
    platform = 'youtube';
  }

  const newChannelId = `${platform}_${Date.now()}`;
  const mockNames: Record<string, string> = {
    tiktok: 'TikTok Sandbox Creator',
    youtube: 'YouTube Shorts Studio (Verified)',
    facebook: 'Facebook Reels Official Page',
    instagram: 'Instagram Reels Media Hub',
  };

  const mockHandles: Record<string, string> = {
    tiktok: '@Sandbox_Test',
    youtube: '@YTShortsOfficial',
    facebook: 'FB Page #402',
    instagram: '@insta_reels_pro',
  };

  const channel: DbChannel = {
    id: newChannelId,
    userId: userId,
    platform: platform,
    accountName: mockNames[platform] || 'TikTok Sandbox Creator',
    handle: mockHandles[platform] || '@Sandbox_Test',
    avatar:
      platform === 'tiktok'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
        : platform === 'youtube'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    followers: 18500,
    status: 'active',
    nodeRegion: 'US-West #402 (Active API Node)',
    accessToken: accessToken || code || `sandbox_oauth_token_${Date.now()}`,
    tokenExpiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    connectedAt: new Date().toISOString(),
  };

  await saveChannelToDb(channel);

  // Clean URL to /channels
  try {
    window.history.replaceState({}, document.title, '/channels');
  } catch (e) {
    console.log('Cleaned URL history', e);
  }

  return channel;
}
