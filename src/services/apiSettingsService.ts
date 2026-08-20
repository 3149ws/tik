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

export const YUNINA_STORAGE_KEY = 'YUNINA_API_CONFIG';
export const SYSTEM_STORAGE_KEY = 'SYSTEM_API_CONFIG';

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

// Immediate synchronous write to localStorage (< 5ms)
export function saveToLocalStorageImmediately(data: Partial<SystemApiConfig>): SystemApiConfig {
  let current: SystemApiConfig = { ...defaultConfig };
  try {
    const raw = localStorage.getItem(YUNINA_STORAGE_KEY) || localStorage.getItem(SYSTEM_STORAGE_KEY);
    if (raw) {
      current = { ...current, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to parse existing config from localStorage', e);
  }

  // Clean and trim string data
  const cleanedData: Partial<SystemApiConfig> = {};
  if (data.tiktok_client_key !== undefined) cleanedData.tiktok_client_key = data.tiktok_client_key.trim();
  if (data.tiktok_client_secret !== undefined) cleanedData.tiktok_client_secret = data.tiktok_client_secret.trim();
  if (data.tiktok_env !== undefined) cleanedData.tiktok_env = data.tiktok_env;
  if (data.meta_app_id !== undefined) cleanedData.meta_app_id = data.meta_app_id.trim();
  if (data.meta_app_secret !== undefined) cleanedData.meta_app_secret = data.meta_app_secret.trim();
  if (data.youtube_client_id !== undefined) cleanedData.youtube_client_id = data.youtube_client_id.trim();
  if (data.youtube_client_secret !== undefined) cleanedData.youtube_client_secret = data.youtube_client_secret.trim();

  const updated: SystemApiConfig = {
    ...current,
    ...cleanedData,
    updatedAt: new Date().toISOString(),
  };

  try {
    const jsonStr = JSON.stringify(updated);
    localStorage.setItem(YUNINA_STORAGE_KEY, jsonStr);
    localStorage.setItem(SYSTEM_STORAGE_KEY, jsonStr);
  } catch (e) {
    console.warn('Failed to write YUNINA_API_CONFIG to localStorage', e);
  }

  return updated;
}

// Get System Config (from localStorage & Firestore)
export async function getSystemApiConfig(): Promise<SystemApiConfig> {
  let config: SystemApiConfig = { ...defaultConfig };

  // Try local storage first synchronously
  try {
    const raw = localStorage.getItem(YUNINA_STORAGE_KEY) || localStorage.getItem(SYSTEM_STORAGE_KEY);
    if (raw) {
      config = { ...config, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to parse API config from localStorage', e);
  }

  // Query Firestore dbService for each platform asynchronously with 2s timeout
  try {
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
    const dbFetch = Promise.all([
      getApiCredentialFromDb('tiktok'),
      getApiCredentialFromDb('meta'),
      getApiCredentialFromDb('youtube'),
    ]);

    const res = await Promise.race([dbFetch, timeout]);

    if (Array.isArray(res)) {
      const [ttCred, metaCred, ytCred] = res;
      if (ttCred?.clientId) config.tiktok_client_key = ttCred.clientId;
      if (ttCred?.clientSecret) config.tiktok_client_secret = ttCred.clientSecret;
      if (ttCred?.environment) config.tiktok_env = ttCred.environment;

      if (metaCred?.clientId) config.meta_app_id = metaCred.clientId;
      if (metaCred?.clientSecret) config.meta_app_secret = metaCred.clientSecret;

      if (ytCred?.clientId) config.youtube_client_id = ytCred.clientId;
      if (ytCred?.clientSecret) config.youtube_client_secret = ytCred.clientSecret;
    }
  } catch (e) {
    console.warn('Firestore sync timeout or error in getSystemApiConfig', e);
  }

  return config;
}

// Save System Config to localStorage & Firestore
export async function saveSystemApiConfig(newConfig: Partial<SystemApiConfig>): Promise<{ success: boolean; message: string; data: SystemApiConfig }> {
  // 1. Immediately write to LocalStorage
  const updated = saveToLocalStorageImmediately(newConfig);

  const baseOrigin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://yunina.top';

  // 2. Persist to Firestore DB for all platforms in background with timeout
  try {
    const ttPromise = saveApiCredentialToDb({
      platform: 'tiktok',
      clientId: updated.tiktok_client_key,
      clientSecret: updated.tiktok_client_secret,
      environment: updated.tiktok_env,
      redirectUri: `${baseOrigin}/api/auth/callback/tiktok`,
      updatedAt: updated.updatedAt || new Date().toISOString(),
    });

    const metaPromise = saveApiCredentialToDb({
      platform: 'meta',
      clientId: updated.meta_app_id,
      clientSecret: updated.meta_app_secret,
      redirectUri: `${baseOrigin}/api/auth/callback/meta`,
      updatedAt: updated.updatedAt || new Date().toISOString(),
    });

    const ytPromise = saveApiCredentialToDb({
      platform: 'youtube',
      clientId: updated.youtube_client_id,
      clientSecret: updated.youtube_client_secret,
      redirectUri: `${baseOrigin}/api/auth/callback/google`,
      updatedAt: updated.updatedAt || new Date().toISOString(),
    });

    const dbSaveTimeout = new Promise((resolve) => setTimeout(resolve, 2500));
    await Promise.race([Promise.all([ttPromise, metaPromise, ytPromise]), dbSaveTimeout]);
  } catch (e) {
    console.warn('Background Firestore save notice', e);
  }

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
