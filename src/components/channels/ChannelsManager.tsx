import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { PlatformType } from '../../types';
import { AddChannelModal } from './AddChannelModal';
import { redirectToOAuth } from '../../services/oauthService';
import {
  ShieldCheck,
  Globe2,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Plus,
  Radio,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

export const ChannelsManager: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    channels,
    removeChannel,
    testChannelDispatch,
    currentUser,
    setActivePage,
    oauthSuccessBanner,
    setOauthSuccessBanner,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; latency: number; ip: string } | null>(
    null
  );

  const quota = currentUser?.channelsQuota || 5;
  const used = channels.length;
  const isQuotaFull = used >= quota;

  const handleDirectConnect = async (platform: 'tiktok' | 'youtube' | 'facebook') => {
    const userId = currentUser?.id || 'usr_creator1';
    await redirectToOAuth(platform, userId);
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    setTestResult(null);
    const res = await testChannelDispatch(id);
    setTestingId(null);
    setTestResult({ id, latency: res.latency, ip: res.ip });
  };

  const getPlatformIcon = (platform: PlatformType) => {
    if (platform === 'tiktok') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-xs">
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.4a6.33 6.33 0 0 0-6.61 6.33 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.35-6.34V8.65a8.28 8.28 0 0 0 4.17 1.48V6.69z" />
          </svg>
        </div>
      );
    }
    if (platform === 'youtube') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* OAuth Success Banner Toast */}
      {oauthSuccessBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{oauthSuccessBanner}</span>
          </div>
          <button
            onClick={() => setOauthSuccessBanner(null)}
            className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.channelsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.channelsSubtitle}</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          disabled={isQuotaFull}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer ${
            isQuotaFull
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:scale-[1.02]'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{t.channelsAddButton}</span>
        </button>
      </div>

      {/* Direct OAuth Redirect Quick Bar */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-900/50 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-400/30">
                <Zap className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-base font-extrabold">
                {language === 'zh'
                  ? 'TikTok 官方 Sandbox 授权 302 连通通道'
                  : 'TikTok Official Sandbox 302 Direct Connect'}
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              {language === 'zh'
                ? '点击直接跳转 TikTok 官方授权域，无需弹窗或手动输入凭证。完成授权后将自动重定向回控制台并生成 @Sandbox_Test 绑定。'
                : 'Clicking redirects directly to TikTok Sandbox OAuth. Auto binds @Sandbox_Test on callback return.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => handleDirectConnect('tiktok')}
              className="px-4 py-2.5 bg-black hover:bg-slate-950 text-white border border-slate-700 rounded-xl text-xs font-bold shadow-xs hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.4a6.33 6.33 0 0 0-6.61 6.33 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.35-6.34V8.65a8.28 8.28 0 0 0 4.17 1.48V6.69z" />
              </svg>
              <span>{language === 'zh' ? 'Connect TikTok' : 'Connect TikTok'}</span>
            </button>

            <button
              onClick={() => handleDirectConnect('youtube')}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>Connect YouTube</span>
            </button>

            <button
              onClick={() => handleDirectConnect('facebook')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Connect Meta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quota Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.channelsQuotaUsed}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {used} / {quota}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {t.channelsConnectedCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-48 sm:w-64 bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-500 ${
                  isQuotaFull ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-600 to-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (used / quota) * 100)}%` }}
              ></div>
            </div>

            <button
              onClick={() => setActivePage('pricing')}
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.upgradeQuota}
            </button>
          </div>
        </div>
      </div>

      {/* Channels Cards Grid */}
      {channels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((ch) => (
            <div
              key={ch.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Icon + Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(ch.platform)}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{ch.displayName}</h3>
                      <p className="text-xs text-indigo-600 font-semibold">{ch.handle}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {t.channelsStatusActive}
                  </span>
                </div>

                {/* Channel Stats & Node details */}
                <div className="space-y-2.5 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.channelsFollowers}</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {ch.followers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.channelsDispatchNode}</span>
                    <span className="font-medium text-slate-800 text-right truncate max-w-[180px]">
                      {ch.ipRegion}
                    </span>
                  </div>
                </div>

                {/* Handshake Ping Result */}
                {testResult && testResult.id === ch.id && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 text-emerald-900 text-xs flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Ping: {testResult.latency}ms</span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-700 font-bold">100% Clean</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleTest(ch.id)}
                  disabled={testingId === ch.id}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {testingId === ch.id ? (
                    <span className="inline-block w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>{t.channelsTestConnection}</span>
                  )}
                </button>

                <button
                  onClick={() => removeChannel(ch.id)}
                  className="text-xs font-medium text-rose-500 hover:text-rose-700 cursor-pointer"
                >
                  {t.channelsDisconnect}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-slate-200/90 shadow-xs text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
            <Radio className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'zh' ? '暂无连接的矩阵账号' : 'No Connected Social Channels'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {language === 'zh'
                ? '点击下方的按钮，通过 TikTok、YouTube Shorts 或 Facebook OAuth 官方授权绑定您的社媒账号。'
                : 'Click the button below to authorize and connect your TikTok, YouTube Shorts, or Facebook accounts via official OAuth.'}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.channelsAddButton}</span>
          </button>
        </div>
      )}

      {/* Add Modal */}
      <AddChannelModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
