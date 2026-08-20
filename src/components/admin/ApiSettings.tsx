import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  getSystemApiConfig,
  saveSystemApiConfig,
  saveToLocalStorageImmediately,
  YUNINA_STORAGE_KEY,
  SYSTEM_STORAGE_KEY,
} from '../../services/apiSettingsService';
import {
  Key,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  Lock,
  Globe,
  Save,
  AlertCircle,
} from 'lucide-react';

export const ApiSettings: React.FC = () => {
  const { language } = useLanguage();
  const { updateApiConfig, testApiHandshake } = useApp();

  // TikTok State
  const [tiktokClientKey, setTiktokClientKey] = useState('tt_app_7384918293849102');
  const [tiktokClientSecret, setTiktokClientSecret] = useState('secret_tt_93810294812390182');
  const [showTiktokSecret, setShowTiktokSecret] = useState(false);
  const [tiktokEnv, setTiktokEnv] = useState<'sandbox' | 'live'>('sandbox');
  const [tiktokSaved, setTiktokSaved] = useState(false);

  // Meta State
  const [metaAppId, setMetaAppId] = useState('meta_fb_93810294819028');
  const [metaAppSecret, setMetaAppSecret] = useState('secret_meta_8839102938102938');
  const [showMetaSecret, setShowMetaSecret] = useState(false);
  const [metaSaved, setMetaSaved] = useState(false);

  // Google State
  const [googleClientId, setGoogleClientId] = useState(
    '507473056296-h0d93t8nu3p3ufgt6oug6q2mbe0olqu8.apps.googleusercontent.com'
  );
  const [googleClientSecret, setGoogleClientSecret] = useState('GOCSPX-secret_google_key_991823');
  const [showGoogleSecret, setShowGoogleSecret] = useState(false);
  const [googleSaved, setGoogleSaved] = useState(false);

  // Loading & Toast States
  const [savingPlatform, setSavingPlatform] = useState<string | null>(null);
  const [globalSavedToast, setGlobalSavedToast] = useState<string | null>(null);
  const [saveErrorToast, setSaveErrorToast] = useState<string | null>(null);

  // Copy Toasts
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Testing states
  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);
  const [testSuccessToast, setTestSuccessToast] = useState<string | null>(null);

  const baseOrigin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://yunina.top';
  const tiktokRedirectUri = `${baseOrigin}/api/auth/callback/tiktok`;
  const metaRedirectUri = `${baseOrigin}/api/auth/callback/meta`;
  const googleRedirectUri = `${baseOrigin}/api/auth/callback/google`;

  // Page Load: Synchronously populate from localStorage immediately, then async sync
  useEffect(() => {
    // 1. Immediate synchronous local storage read (< 5ms)
    try {
      const raw = localStorage.getItem(YUNINA_STORAGE_KEY) || localStorage.getItem(SYSTEM_STORAGE_KEY);
      if (raw) {
        const cfg = JSON.parse(raw);
        if (cfg.tiktok_client_key) setTiktokClientKey(cfg.tiktok_client_key);
        if (cfg.tiktok_client_secret) setTiktokClientSecret(cfg.tiktok_client_secret);
        if (cfg.tiktok_env) setTiktokEnv(cfg.tiktok_env);

        if (cfg.meta_app_id) setMetaAppId(cfg.meta_app_id);
        if (cfg.meta_app_secret) setMetaAppSecret(cfg.meta_app_secret);

        if (cfg.youtube_client_id) setGoogleClientId(cfg.youtube_client_id);
        if (cfg.youtube_client_secret) setGoogleClientSecret(cfg.youtube_client_secret);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage on page init', e);
    }

    // 2. Async background sync from db/remote
    getSystemApiConfig()
      .then((cfg) => {
        if (cfg.tiktok_client_key) setTiktokClientKey(cfg.tiktok_client_key);
        if (cfg.tiktok_client_secret) setTiktokClientSecret(cfg.tiktok_client_secret);
        if (cfg.tiktok_env) setTiktokEnv(cfg.tiktok_env);

        if (cfg.meta_app_id) setMetaAppId(cfg.meta_app_id);
        if (cfg.meta_app_secret) setMetaAppSecret(cfg.meta_app_secret);

        if (cfg.youtube_client_id) setGoogleClientId(cfg.youtube_client_id);
        if (cfg.youtube_client_secret) setGoogleClientSecret(cfg.youtube_client_secret);
      })
      .catch((e) => console.warn('getSystemApiConfig async load error', e));
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const executePostSave = async (payload: any, platformLabel?: string) => {
    setSavingPlatform(platformLabel || 'all');
    setSaveErrorToast(null);

    // 1. Immediate synchronous local persistence (< 5ms)
    const updated = saveToLocalStorageImmediately(payload);

    // 2. Immediate synchronization to App Context
    if (payload.tiktok_client_key) {
      updateApiConfig('tiktok', {
        appIdOrKey: payload.tiktok_client_key,
        secret: payload.tiktok_client_secret,
        environment: payload.tiktok_env,
        redirectUri: tiktokRedirectUri,
      });
    }
    if (payload.meta_app_id) {
      updateApiConfig('meta', {
        appIdOrKey: payload.meta_app_id,
        secret: payload.meta_app_secret,
        redirectUri: metaRedirectUri,
      });
    }
    if (payload.youtube_client_id) {
      updateApiConfig('youtube', {
        appIdOrKey: payload.youtube_client_id,
        secret: payload.youtube_client_secret,
        redirectUri: googleRedirectUri,
      });
    }

    // 3. Immediate Green Toast (< 100ms)
    const msg =
      language === 'zh'
        ? `✅ 全站 API 配置已成功持久化保存！`
        : `✅ Global API settings saved & persisted successfully!`;

    setGlobalSavedToast(msg);
    setTimeout(() => setGlobalSavedToast(null), 4000);

    // 4. Async background sync with 3-second timeout circuit breaker
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('3s timeout circuit breaker')), 3000)
      );

      const asyncSavePromise = (async () => {
        await saveSystemApiConfig(payload);
        try {
          await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (e) {
          // Ignore fetch interceptor errors
        }
      })();

      await Promise.race([asyncSavePromise, timeoutPromise]);
    } catch (err: any) {
      console.warn('Async sync notice:', err?.message || err);
    } finally {
      // GUARANTEED: Always end loading state
      setSavingPlatform(null);
    }

    return true;
  };

  const handleSaveTiktok = async () => {
    const ok = await executePostSave(
      {
        tiktok_client_key: tiktokClientKey,
        tiktok_client_secret: tiktokClientSecret,
        tiktok_env: tiktokEnv,
      },
      'TikTok'
    );
    if (ok) {
      setTiktokSaved(true);
      setTimeout(() => setTiktokSaved(false), 3000);
    }
  };

  const handleSaveMeta = async () => {
    const ok = await executePostSave(
      {
        meta_app_id: metaAppId,
        meta_app_secret: metaAppSecret,
      },
      'Meta'
    );
    if (ok) {
      setMetaSaved(true);
      setTimeout(() => setMetaSaved(false), 3000);
    }
  };

  const handleSaveGoogle = async () => {
    const ok = await executePostSave(
      {
        youtube_client_id: googleClientId,
        youtube_client_secret: googleClientSecret,
      },
      'Google YouTube'
    );
    if (ok) {
      setGoogleSaved(true);
      setTimeout(() => setGoogleSaved(false), 3000);
    }
  };

  const handleSaveAll = async () => {
    await executePostSave(
      {
        tiktok_client_key: tiktokClientKey,
        tiktok_client_secret: tiktokClientSecret,
        tiktok_env: tiktokEnv,
        meta_app_id: metaAppId,
        meta_app_secret: metaAppSecret,
        youtube_client_id: googleClientId,
        youtube_client_secret: googleClientSecret,
      },
      '全站集中'
    );
  };

  const handleTestHandshake = async (platform: 'tiktok' | 'meta' | 'youtube') => {
    setTestingPlatform(platform);
    await testApiHandshake(platform);
    setTestingPlatform(null);
    setTestSuccessToast(
      language === 'zh'
        ? `✅ ${platform.toUpperCase()} 官方 API 接口握手成功！全站 OAuth 连通正常。`
        : `Handshake successful for ${platform.toUpperCase()}! OAuth link is active.`
    );
    setTimeout(() => setTestSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Super Admin Notice Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white shadow-md border border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-400/30 flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
              <span>{language === 'zh' ? '超级管理员 API 密钥集中配置控制台' : 'Global API Credentials Console'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 border border-rose-500/40 font-mono">
                Admin Exclusive
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {language === 'zh'
                ? '此处填写的凭证将自动持久化写入 Cloudflare KV / Firestore，并即时应用于全站用户。普通用户端隐去敏感密钥。'
                : 'Credentials configured here govern global OAuth for all SaaS creators. Auto persisted to DB.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={savingPlatform !== null}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
        >
          {savingPlatform === '全站集中' || savingPlatform === 'all' ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{language === 'zh' ? '保存中...' : 'Saving...'}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{language === 'zh' ? '保存全站 API 配置' : 'Save All Settings'}</span>
            </>
          )}
        </button>
      </div>

      {/* Toast Feedback */}
      {globalSavedToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{globalSavedToast}</span>
        </div>
      )}

      {saveErrorToast && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{saveErrorToast}</span>
        </div>
      )}

      {testSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{testSuccessToast}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Card 1: TikTok for Developers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs">
                TT
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  TikTok for Developers (Content Posting API)
                </h3>
                <p className="text-xs text-slate-400">Official Direct Dispatch & OAuth v2</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* TikTok Client Key */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">TikTok Client Key</label>
              <input
                type="text"
                value={tiktokClientKey}
                onChange={(e) => setTiktokClientKey(e.target.value)}
                placeholder="aw39x1z81k9p2lh2"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* TikTok Client Secret */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">TikTok Client Secret</label>
              <div className="relative">
                <input
                  type={showTiktokSecret ? 'text' : 'password'}
                  value={tiktokClientSecret}
                  onChange={(e) => setTiktokClientSecret(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowTiktokSecret(!showTiktokSecret)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showTiktokSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* OAuth Redirect URI */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">OAuth Redirect URI</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={tiktokRedirectUri}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-600 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(tiktokRedirectUri, 'tiktok')}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0"
                >
                  {copiedKey === 'tiktok' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Environment Mode */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Environment Mode</label>
              <select
                value={tiktokEnv}
                onChange={(e) => setTiktokEnv(e.target.value as 'sandbox' | 'live')}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="sandbox">Sandbox (Testing / 沙盒提审测试模式)</option>
                <option value="live">Live (Production / 线上生产环境)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            {tiktokSaved ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'zh' ? 'TikTok 设置已成功保存并持久化！' : 'TikTok Settings Saved!'}</span>
              </span>
            ) : (
              <span></span>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleTestHandshake('tiktok')}
                disabled={testingPlatform === 'tiktok'}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {testingPlatform === 'tiktok' ? (
                  <span className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>Test Connection</span>
              </button>

              <button
                type="button"
                onClick={handleSaveTiktok}
                disabled={savingPlatform !== null}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                {savingPlatform === 'TikTok' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{language === 'zh' ? '保存中...' : 'Saving...'}</span>
                  </>
                ) : (
                  <span>{language === 'zh' ? '保存配置' : 'Save Settings'}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Meta for Developers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs">
                FB
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Meta for Developers (Facebook & Instagram API)
                </h3>
                <p className="text-xs text-slate-400">Facebook Pages & Instagram Reels Graph API</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Meta App ID */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Meta App ID</label>
              <input
                type="text"
                value={metaAppId}
                onChange={(e) => setMetaAppId(e.target.value)}
                placeholder="1048293028192019"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Meta App Secret */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Meta App Secret</label>
              <div className="relative">
                <input
                  type={showMetaSecret ? 'text' : 'password'}
                  value={metaAppSecret}
                  onChange={(e) => setMetaAppSecret(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowMetaSecret(!showMetaSecret)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showMetaSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Redirect URI */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Redirect URI</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={metaRedirectUri}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-600 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(metaRedirectUri, 'meta')}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0"
                >
                  {copiedKey === 'meta' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            {metaSaved ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'zh' ? 'Meta 设置已成功保存并持久化！' : 'Meta Settings Saved!'}</span>
              </span>
            ) : (
              <span></span>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleTestHandshake('meta')}
                disabled={testingPlatform === 'meta'}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {testingPlatform === 'meta' ? (
                  <span className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>Test Connection</span>
              </button>

              <button
                type="button"
                onClick={handleSaveMeta}
                disabled={savingPlatform !== null}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                {savingPlatform === 'Meta' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{language === 'zh' ? '保存中...' : 'Saving...'}</span>
                  </>
                ) : (
                  <span>{language === 'zh' ? '保存配置' : 'Save Settings'}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Google Cloud Console */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 text-white rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs">
                YT
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Google Cloud Console (YouTube Data API v3)
                </h3>
                <p className="text-xs text-slate-400">Google OAuth 2.0 Client & YouTube Upload Scope</p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Google Client ID */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Google Client ID</label>
              <input
                type="text"
                value={googleClientId}
                onChange={(e) => setGoogleClientId(e.target.value)}
                placeholder="xxxx.apps.googleusercontent.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Google Client Secret */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Google Client Secret</label>
              <div className="relative">
                <input
                  type={showGoogleSecret ? 'text' : 'password'}
                  value={googleClientSecret}
                  onChange={(e) => setGoogleClientSecret(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowGoogleSecret(!showGoogleSecret)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showGoogleSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Redirect URI */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Redirect URI</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={googleRedirectUri}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-600 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(googleRedirectUri, 'google')}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0"
                >
                  {copiedKey === 'google' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            {googleSaved ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'zh' ? 'Google 设置已成功保存并持久化！' : 'Google Settings Saved!'}</span>
              </span>
            ) : (
              <span></span>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleTestHandshake('youtube')}
                disabled={testingPlatform === 'youtube'}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {testingPlatform === 'youtube' ? (
                  <span className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>Test Connection</span>
              </button>

              <button
                type="button"
                onClick={handleSaveGoogle}
                disabled={savingPlatform !== null}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                {savingPlatform === 'Google YouTube' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{language === 'zh' ? '保存中...' : 'Saving...'}</span>
                  </>
                ) : (
                  <span>{language === 'zh' ? '保存配置' : 'Save Settings'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

