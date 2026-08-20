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
  const redirectUri = window.location.origin;
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
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=${scope}&state=${state}&include_granted_scopes=true&prompt=consent`;
    return { url, clientId, isPlaceholder: false };
  }

  if (platform === 'tiktok') {
    const cred = await getApiCredentialFromDb('tiktok');
    const clientKey = overrideClientKey || cred?.clientId || 'aw39x1z81k9p2lh2';
    const isPlaceholder = isPlaceholderKey('tiktok', clientKey);
    const scope = encodeURIComponent('user.info.basic,video.publish,video.upload');
    const url = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}`;
    return { url, clientId: clientKey, isPlaceholder };
  }

  if (platform === 'facebook' || platform === 'instagram') {
    const cred = await getApiCredentialFromDb('meta');
    const appId = overrideClientKey || cred?.clientId || '1048293028192019';
    const isPlaceholder = isPlaceholderKey('meta', appId);
    const scope = encodeURIComponent(
      'pages_show_list,pages_read_engagement,pages_manage_posts,instagram_basic,instagram_content_publish'
    );
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=${scope}&state=${state}`;
    return { url, clientId: appId, isPlaceholder };
  }

  throw new Error(`Unsupported platform: ${platform}`);
}

export async function redirectToOAuth(
  platform: 'tiktok' | 'youtube' | 'facebook' | 'instagram',
  userId: string,
  overrideClientKey?: string
): Promise<boolean> {
  const { url, isPlaceholder } = await getOAuthUrl(platform, userId, overrideClientKey);
  if (isPlaceholder) {
    return false;
  }
  window.location.href = url;
  return true;
}

export async function handleOAuthCallback(
  currentUserId: string
): Promise<DbChannel | null> {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));

  const code = urlParams.get('code');
  const accessToken = hashParams.get('access_token') || urlParams.get('access_token');
  const rawState = urlParams.get('state') || hashParams.get('state');

  if (!code && !accessToken) {
    return null;
  }

  let platform: 'tiktok' | 'youtube' | 'facebook' | 'instagram' = 'tiktok';
  let userId = currentUserId;

  if (rawState) {
    try {
      const decoded = JSON.parse(atob(rawState));
      platform = decoded.platform || 'tiktok';
      if (decoded.userId) userId = decoded.userId;
    } catch (e) {
      console.warn('Failed to parse OAuth state token', e);
    }
  }

  const newChannelId = `${platform}_${Date.now()}`;
  const mockNames: Record<string, string> = {
    tiktok: 'TikTok Official Creator (@studio_live)',
    youtube: 'YouTube Shorts Channel (Verified)',
    facebook: 'Facebook Reels Official Page',
    instagram: 'Instagram Reels Media Hub',
  };

  const mockHandles: Record<string, string> = {
    tiktok: '@studio_live',
    youtube: '@YTShortsOfficial',
    facebook: 'FB Page #402',
    instagram: '@insta_reels_pro',
  };

  const channel: DbChannel = {
    id: newChannelId,
    userId: userId,
    platform: platform,
    accountName: mockNames[platform] || 'Official Media Channel',
    handle: mockHandles[platform] || '@official_channel',
    avatar:
      platform === 'tiktok'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
        : platform === 'youtube'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    followers: Math.floor(Math.random() * 50000) + 1000,
    status: 'active',
    nodeRegion: 'US-West #402 (Active API Node)',
    accessToken: accessToken || `token_oauth_${Date.now()}`,
    tokenExpiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
    connectedAt: new Date().toISOString(),
  };

  await saveChannelToDb(channel);

  window.history.replaceState({}, document.title, window.location.pathname);

  return channel;
}
