import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ApiCredentialConfig } from '../../types';
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Sliders,
  Lock,
} from 'lucide-react';

export const ApiSettings: React.FC = () => {
  const { t, language } = useLanguage();
  const { apiConfigs, updateApiConfig, testApiHandshake } = useApp();

  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleTest = async (platform: 'tiktok' | 'meta' | 'youtube') => {
    setTestingPlatform(platform);
    await testApiHandshake(platform);
    setTestingPlatform(null);
    setSuccessToast(`Handshake successful for ${platform.toUpperCase()}!`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {successToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {apiConfigs.map((config) => (
          <div
            key={config.platform}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${
                    config.platform === 'tiktok'
                      ? 'bg-black'
                      : config.platform === 'youtube'
                      ? 'bg-red-600'
                      : 'bg-blue-600'
                  }`}
                >
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{config.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Last Verified: {config.lastTestedAt || 'Never'}
                  </p>
                </div>
              </div>

              {/* Status & Environment Pill */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  {config.status.toUpperCase()}
                </span>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                  <button
                    onClick={() => updateApiConfig(config.platform, { environment: 'sandbox' })}
                    className={`px-2 py-0.5 rounded transition-all ${
                      config.environment === 'sandbox' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Sandbox
                  </button>
                  <button
                    onClick={() => updateApiConfig(config.platform, { environment: 'live' })}
                    className={`px-2 py-0.5 rounded transition-all ${
                      config.environment === 'live' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Live (Prod)
                  </button>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Client ID / App Key
                </label>
                <input
                  type="text"
                  value={config.appIdOrKey}
                  onChange={(e) => updateApiConfig(config.platform, { appIdOrKey: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Client Secret (Encrypted)
                </label>
                <input
                  type="password"
                  value={config.secret}
                  onChange={(e) => updateApiConfig(config.platform, { secret: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  OAuth Redirect Callback URI
                </label>
                <input
                  type="text"
                  value={config.redirectUri}
                  onChange={(e) => updateApiConfig(config.platform, { redirectUri: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Webhook Event Dispatch URL
                </label>
                <input
                  type="text"
                  value={config.webhookUrl}
                  onChange={(e) => updateApiConfig(config.platform, { webhookUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Test Handshake Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleTest(config.platform)}
                disabled={testingPlatform === config.platform}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {testingPlatform === config.platform ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t.adminTestApi}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
