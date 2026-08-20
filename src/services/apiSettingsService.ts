import { saveApiCredentialToDb, getApiCredentialFromDb, ApiCredential } from './dbService';

export interface SystemApiConfig {
  tiktok_client_key: string;
  tiktok_client_secret: string;
  tiktok_env: 'sandbox' | 'live';
  meta_app_id: string;
  meta_app_secret: string;
  youtube_client_id: string;
  youtube_client_secret: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'SYSTEM_API_CONFIG';

// Default initial config
const defaultConfig: SystemApiConfig = {
  tiktok_client_key: 'tt_app_7384918293849102',
  tiktok_client_secret: 'secret_tt_93810294812390182',
  tiktok_env: 'sandbox',
  meta_app_id: 'meta_fb_93810294819028',
  meta_app_secret: 'secret_meta_8839102938102938',
  youtube_client_id: '507473056296-h0d93t8nu3p3ufgt6oug6q2mbe0olqu8.apps.googleusercontent.com',
  youtube_client_secret: 'GOCSPX-secret_google_key_991823',
};

// Get System Config (from localStorage & Firestore)
export async function getSystemApiConfig(): Promise<SystemApiConfig> {
  let config: SystemApiConfig = { ...defaultConfig };

  // Try local storage first
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      config = { ...config, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to parse SYSTEM_API_CONFIG from localStorage', e);
  }

  // Also query Firestore dbService for each platform to stay synced
  const [ttCred, metaCred, ytCred] = await Promise.all([
    getApiCredentialFromDb('tiktok'),
    getApiCredentialFromDb('meta'),
    getApiCredentialFromDb('youtube'),
  ]);

  if (ttCred?.clientId) config.tiktok_client_key = ttCred.clientId;
  if (ttCred?.clientSecret) config.tiktok_client_secret = ttCred.clientSecret;
  if (ttCred?.environment) config.tiktok_env = ttCred.environment;

  if (metaCred?.clientId) config.meta_app_id = metaCred.clientId;
  if (metaCred?.clientSecret) config.meta_app_secret = metaCred.clientSecret;

  if (ytCred?.clientId) config.youtube_client_id = ytCred.clientId;
  if (ytCred?.clientSecret) config.youtube_client_secret = ytCred.clientSecret;

  return config;
}

// Save System Config to localStorage & Firestore
export async function saveSystemApiConfig(newConfig: Partial<SystemApiConfig>): Promise<{ success: boolean; message: string; data: SystemApiConfig }> {
  const current = await getSystemApiConfig();
  const updated: SystemApiConfig = {
    ...current,
    ...newConfig,
    updatedAt: new Date().toISOString(),
  };

  // 1. Save into LocalStorage for KV-like speed
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to write SYSTEM_API_CONFIG to localStorage', e);
  }

  // 2. Persist to Firestore DB for all platforms
  const ttPromise = saveApiCredentialToDb({
    platform: 'tiktok',
    clientId: updated.tiktok_client_key,
    clientSecret: updated.tiktok_client_secret,
    environment: updated.tiktok_env,
    redirectUri: `${window.location.origin}/api/auth/callback/tiktok`,
    updatedAt: updated.updatedAt,
  });

  const metaPromise = saveApiCredentialToDb({
    platform: 'meta',
    clientId: updated.meta_app_id,
    clientSecret: updated.meta_app_secret,
    redirectUri: `${window.location.origin}/api/auth/callback/meta`,
    updatedAt: updated.updatedAt,
  });

  const ytPromise = saveApiCredentialToDb({
    platform: 'youtube',
    clientId: updated.youtube_client_id,
    clientSecret: updated.youtube_client_secret,
    redirectUri: `${window.location.origin}/api/auth/callback/google`,
    updatedAt: updated.updatedAt,
  });

  await Promise.all([ttPromise, metaPromise, ytPromise]);

  return {
    success: true,
    message: '配置保存成功！已安全存储并即时应用于全站系统。',
    data: updated,
  };
}

// Setup fetch interceptor safely without breaking read-only window.fetch properties
export function initApiSettingsFetchInterceptor() {
  if (typeof window === 'undefined') return;

  try {
    const originalFetch = window.fetch;
    if (typeof originalFetch !== 'function') return;

    const customFetch = async function (this: any, input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

      if (url.includes('/api/admin/settings')) {
        const method = (init?.method || 'GET').toUpperCase();

        if (method === 'GET') {
          const config = await getSystemApiConfig();
          return new Response(
            JSON.stringify({
              success: true,
              data: config,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        if (method === 'POST') {
          let bodyObj: Partial<SystemApiConfig> = {};
          if (init?.body) {
            try {
              bodyObj = JSON.parse(init.body.toString());
            } catch (e) {
              console.warn('Failed to parse POST body', e);
            }
          }
          const result = await saveSystemApiConfig(bodyObj);
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      return originalFetch.apply(this, [input, init]);
    };

    // Attempt safe property definition
    try {
      Object.defineProperty(window, 'fetch', {
        value: customFetch,
        writable: true,
        configurable: true,
      });
    } catch (e) {
      try {
        (window as any).fetch = customFetch;
      } catch (err) {
        console.warn('Unable to override window.fetch on this platform', err);
      }
    }
  } catch (err) {
    console.warn('initApiSettingsFetchInterceptor skipped', err);
  }
}
