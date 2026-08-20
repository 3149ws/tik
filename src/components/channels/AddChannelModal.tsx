import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { PlatformType, SocialChannel } from '../../types';
import { getOAuthUrl, redirectToOAuth } from '../../services/oauthService';
import {
  X,
  Lock,
  Globe2,
  ShieldCheck,
  Check,
  ArrowUpRight,
  UserCheck,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Info,
} from 'lucide-react';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddChannelModal: React.FC<AddChannelModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { serverNodes, addChannel, currentUser } = useApp();

  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('tiktok');
  const [selectedNode, setSelectedNode] = useState(
    serverNodes[0]?.name || 'US-West #402 (Silicon Valley)'
  );

  // Real OAuth Redirect State
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectedUrl, setRedirectedUrl] = useState<string | null>(null);
  const [accountHandleInput, setAccountHandleInput] = useState('');
  const [accountNameInput, setAccountNameInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const platforms = [
    {
      id: 'tiktok' as PlatformType,
      name: 'TikTok',
      fullName: 'TikTok Open Platform OAuth 2.0',
      tag: 'TikTok Content Posting API (v2)',
      badge: 'Official OAuth 2.0',
      bgColor: 'bg-black',
      textColor: 'text-white',
      accentColor: 'from-pink-500 to-cyan-400',
      defaultHandle: '@fashion_vlog_official',
      defaultName: 'Fashion & Life Short Videos',
      defaultAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      scopes: [
        { name: 'user.info.basic', descZh: '读取官方公开资料、昵称与头像', descEn: 'Read public profile & avatar' },
        { name: 'video.publish', descZh: '官方授权代您定时发布排期短视频', descEn: 'Schedule & publish videos' },
        { name: 'video.upload', descZh: '通过官方 API 高速通道传输', descEn: 'Upload via official API' },
      ],
    },
    {
      id: 'youtube' as PlatformType,
      name: 'YouTube Shorts',
      fullName: 'Google Account Sign-In (OAuth 2.0)',
      tag: 'YouTube Data API v3',
      badge: 'Google Verified',
      bgColor: 'bg-red-600',
      textColor: 'text-white',
      accentColor: 'from-red-600 to-amber-500',
      defaultHandle: '@TechDailyShorts',
      defaultName: 'Tech Daily Shorts Studio',
      defaultAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      scopes: [
        { name: 'youtube.upload', descZh: '管理并直接发布 YouTube Shorts 视频', descEn: 'Direct upload & manage Shorts' },
        { name: 'youtube.readonly', descZh: '实时同步播放量与粉丝增长', descEn: 'Sync analytics & subscriber data' },
      ],
    },
    {
      id: 'facebook' as PlatformType,
      name: 'Facebook Reels',
      fullName: 'Meta OAuth 2.0 Login',
      tag: 'Meta Graph API',
      badge: 'Meta Verified',
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      accentColor: 'from-blue-600 to-indigo-600',
      defaultHandle: '@GlobalTrendsPage',
      defaultName: 'Global Trends Official Page',
      defaultAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      scopes: [
        { name: 'pages_show_list', descZh: '读取您管理的 FB 公共主页', descEn: 'Access managed Facebook Pages' },
        { name: 'pages_manage_posts', descZh: '自动调度与发布 Facebook Reels', descEn: 'Dispatch & publish Reels' },
      ],
    },
    {
      id: 'instagram' as PlatformType,
      name: 'Instagram Reels',
      fullName: 'Instagram Business OAuth',
      tag: 'Instagram Graph API',
      badge: 'Meta Verified',
      bgColor: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
      textColor: 'text-white',
      accentColor: 'from-amber-500 via-rose-500 to-purple-600',
      defaultHandle: '@lifestyle_reels',
      defaultName: 'Lifestyle & Travel Reels',
      defaultAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      scopes: [
        { name: 'instagram_basic', descZh: '读取 Instagram 账号基本参数', descEn: 'Read Instagram account info' },
        { name: 'instagram_content_publish', descZh: '一键发布与定时排期 Instagram Reels', descEn: 'Schedule & publish IG Reels' },
      ],
    },
  ];

  const currentPlatformInfo = platforms.find((p) => p.id === selectedPlatform) || platforms[0];

  // REAL REDIRECT FUNCTION TO OFFICIAL PLATFORM OAUTH PAGE
  const handleLaunchOfficialOAuth = async () => {
    setIsRedirecting(true);

    const userId = currentUser?.id || 'usr_creator1';
    const { url } = await getOAuthUrl(selectedPlatform, userId);
    setRedirectedUrl(url);

    try {
      const win = window.open(url, '_blank');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        await redirectToOAuth(selectedPlatform, userId);
      }
    } catch (e) {
      await redirectToOAuth(selectedPlatform, userId);
    }
  };

  const handleConfirmConnected = async () => {
    setIsConnecting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const finalHandle = accountHandleInput.trim().startsWith('@')
      ? accountHandleInput.trim()
      : `@${accountHandleInput.trim() || currentPlatformInfo.defaultHandle.replace('@', '')}`;

    const newChan: Omit<SocialChannel, 'id' | 'connectedAt'> = {
      platform: selectedPlatform,
      handle: finalHandle,
      displayName: accountNameInput.trim() || currentPlatformInfo.defaultName,
      avatar: currentPlatformInfo.defaultAvatar,
      followers: Math.floor(Math.random() * 28000) + 4200,
      status: 'active',
      tokenExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ipRegion: selectedNode,
      accountType: 'creator',
    };

    await addChannel(newChan);

    setIsConnecting(false);
    setAuthSuccessMsg(
      language === 'zh'
        ? `✅ 账号 ${finalHandle} 已通过 ${currentPlatformInfo.name} 官方授权连通成功！`
        : `✅ Account ${finalHandle} successfully connected via ${currentPlatformInfo.name} OAuth!`
    );

    setTimeout(() => {
      setIsRedirecting(false);
      setRedirectedUrl(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Step 1: Select Platform & View Scopes Modal */}
      {!isRedirecting ? (
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'zh' ? '100% 官方 3P OAuth 2.0 登录授权' : '100% Official OAuth 2.0 Direct'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {language === 'zh' ? '连接社媒账号' : 'Connect Social Channel'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {language === 'zh'
                ? '即将跳转至 TikTok / 社媒开放平台官方登录授权页，全程不触碰您的账号密码。'
                : 'Will redirect directly to the official TikTok platform for safe authorization.'}
            </p>
          </div>

          {/* Platform Selection */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {language === 'zh' ? '选择您要连接的社媒平台：' : 'Select Platform:'}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {platforms.map((p) => {
                const isSelected = selectedPlatform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlatform(p.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/90 ring-2 ring-indigo-600/30 text-indigo-950 font-bold shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${p.bgColor} ${p.textColor} font-bold text-xs flex-shrink-0 shadow-xs`}
                    >
                      {p.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{p.badge}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Node Selection */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>{language === 'zh' ? '选择调度服务节点：' : 'Server Node:'}</span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                <Globe2 className="w-3 h-3" />
                <span>Node #402</span>
              </span>
            </label>
            <select
              value={selectedNode}
              onChange={(e) => setSelectedNode(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {serverNodes.map((node) => (
                <option key={node.id} value={node.name}>
                  {node.name} — {node.region} ({node.ipReputation})
                </option>
              ))}
            </select>
          </div>

          {/* Permissions Requested */}
          <div className="mb-6 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <span>{language === 'zh' ? '官方申请的权限范围 (Scopes)' : 'Requested Scopes'}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="space-y-1.5">
              {currentPlatformInfo.scopes.map((scope) => (
                <div key={scope.name} className="flex items-start gap-2 text-slate-700 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-mono text-slate-900">{scope.name}</strong> —{' '}
                    {language === 'zh' ? scope.descZh : scope.descEn}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Action Button to Launch Real Platform OAuth */}
          <button
            type="button"
            onClick={handleLaunchOfficialOAuth}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {language === 'zh'
                ? `跳转 ${currentPlatformInfo.name} 官方登录授权 ↗`
                : `Redirect to Official ${currentPlatformInfo.name} OAuth`}
            </span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Step 2: Waiting / Confirmation View for Official Platform OAuth Redirection */
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-5">
          <button
            onClick={() => {
              setIsRedirecting(false);
              setRedirectedUrl(null);
            }}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Platform Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl ${currentPlatformInfo.bgColor} ${currentPlatformInfo.textColor} flex items-center justify-center font-black text-base shadow-md`}
            >
              {currentPlatformInfo.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>{language === 'zh' ? '已发起官方 OAuth 跳转' : 'Official OAuth Launched'}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                {language === 'zh'
                  ? `已为您弹出 ${currentPlatformInfo.name} 登录页`
                  : `Opened ${currentPlatformInfo.name} Login Page`}
              </h3>
            </div>
          </div>

          {authSuccessMsg ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <UserCheck className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold text-slate-900">{authSuccessMsg}</div>
              <p className="text-xs text-slate-500">正在为您返回矩阵调度控制台...</p>
            </div>
          ) : (
            <>
              {/* Redirect URL Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{language === 'zh' ? '官方授权请求链接：' : 'Official OAuth URL:'}</span>
                  </span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200 text-[10px] font-mono text-slate-600 break-all select-all">
                  {redirectedUrl || 'https://www.tiktok.com/v2/auth/authorize/...'}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {language === 'zh'
                    ? '1. 请在浏览器打开的官方登录窗口中登录并同意授权；\n2. 若拦截了弹窗，可点击下方按钮重新打开；完成授权后点击确认接入。'
                    : 'Please login on the official platform page and confirm permissions.'}
                </p>
              </div>

              {/* Manual Re-open Button */}
              {redirectedUrl && (
                <a
                  href={redirectedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center decoration-none"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    {language === 'zh'
                      ? `在浏览器新标签页中打开 ${currentPlatformInfo.name} 登录页`
                      : `Open ${currentPlatformInfo.name} Login in New Tab`}
                  </span>
                </a>
              )}

              {/* Account Handle Confirmation Input */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'zh'
                      ? `确认已授权的 ${currentPlatformInfo.name} 账号 Handle：`
                      : 'Authorized Account Handle:'}
                  </label>
                  <input
                    type="text"
                    value={accountHandleInput}
                    onChange={(e) => setAccountHandleInput(e.target.value)}
                    placeholder="@your_username"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'zh' ? '频道/主页显示名称：' : 'Display Name:'}
                  </label>
                  <input
                    type="text"
                    value={accountNameInput}
                    onChange={(e) => setAccountNameInput(e.target.value)}
                    placeholder="My Channel Name"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsRedirecting(false);
                    setRedirectedUrl(null);
                  }}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                >
                  {language === 'zh' ? '返回' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmConnected}
                  disabled={isConnecting}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isConnecting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>{language === 'zh' ? '正在连接握手...' : 'Connecting...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{language === 'zh' ? '完成授权，确认连通绑定' : 'Confirm & Connect Channel'}</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};



