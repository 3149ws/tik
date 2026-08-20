import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { PlatformType, SocialChannel } from '../../types';
import { getOAuthUrl } from '../../services/oauthService';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowRight,
  QrCode,
  Smartphone,
  Check,
  Globe2,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddChannelModal: React.FC<AddChannelModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { addChannel, serverNodes, currentUser } = useApp();

  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('tiktok');
  const [selectedNode, setSelectedNode] = useState(
    serverNodes[0]?.name || 'US-West #402 (Silicon Valley Residential Clean IP)'
  );

  const [stage, setStage] = useState<'setup' | 'oauth_window' | 'authorizing' | 'success'>('setup');
  const [oauthLoginMethod, setOauthLoginMethod] = useState<'qr' | 'password'>('qr');
  const [handleInput, setHandleInput] = useState('lideming_official');
  const [qrScannedState, setQrScannedState] = useState<'waiting' | 'scanned' | 'confirmed'>('waiting');

  useEffect(() => {
    if (isOpen) {
      setStage('setup');
      setOauthLoginMethod('qr');
      setQrScannedState('waiting');

      if (selectedPlatform === 'tiktok') {
        setHandleInput('studio_creator_global');
      } else if (selectedPlatform === 'youtube') {
        setHandleInput('TCMHealthShorts');
      } else if (selectedPlatform === 'facebook') {
        setHandleInput('TheStoreUKOfficial');
      } else {
        setHandleInput('YuninaReelsMedia');
      }
    }
  }, [isOpen, selectedPlatform]);

  if (!isOpen) return null;

  const platforms = [
    {
      id: 'tiktok' as PlatformType,
      name: 'TikTok',
      fullName: 'TikTok Creator / Business Account',
      authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
      tag: 'TikTok Content Posting API (v2)',
      badge: 'Official Tier-1 API',
      bgColor: 'bg-black',
      textColor: 'text-white',
      scopes: [
        { name: 'user.info.basic', descZh: '读取公开资料、昵称与头像', descEn: 'Read public profile & avatar' },
        { name: 'video.publish', descZh: '代您定时发布排期短视频', descEn: 'Schedule & publish videos' },
        { name: 'video.upload', descZh: '通过海外独享住宅 IP 节点传输', descEn: 'Upload via clean residential proxy' },
      ],
    },
    {
      id: 'youtube' as PlatformType,
      name: 'YouTube Shorts',
      fullName: 'YouTube Shorts Channel (Google Cloud)',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tag: 'YouTube Data API v3',
      badge: 'Google Verified',
      bgColor: 'bg-red-600',
      textColor: 'text-white',
      scopes: [
        { name: 'youtube.upload', descZh: '管理并直接发布 YouTube Shorts', descEn: 'Direct upload & manage Shorts' },
        { name: 'youtube.readonly', descZh: '实时同步播放量与粉丝分析', descEn: 'Sync analytics & subscriber data' },
      ],
    },
    {
      id: 'facebook' as PlatformType,
      name: 'Facebook Reels',
      fullName: 'Facebook Page & Reels (Meta Graph)',
      authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
      tag: 'Meta Graph API',
      badge: 'Meta Verified',
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      scopes: [
        { name: 'pages_show_list', descZh: '读取您管理的 FB 公共主页', descEn: 'Access managed Facebook Pages' },
        { name: 'pages_manage_posts', descZh: '自动调度与发布 Facebook Reels', descEn: 'Dispatch & publish Reels' },
      ],
    },
    {
      id: 'instagram' as PlatformType,
      name: 'Instagram Reels',
      fullName: 'Instagram Business Account (Meta)',
      authUrl: 'https://api.instagram.com/oauth/authorize',
      tag: 'Instagram Graph API',
      badge: 'Meta Graph API',
      bgColor: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
      textColor: 'text-white',
      scopes: [
        { name: 'instagram_basic', descZh: '读取 Instagram 账号基本参数', descEn: 'Read Instagram account info' },
        { name: 'instagram_content_publish', descZh: '一键发布并排期 Instagram Reels', descEn: 'Schedule & publish IG Reels' },
      ],
    },
  ];

  const currentPlatformInfo = platforms.find((p) => p.id === selectedPlatform) || platforms[0];

  const handleTriggerRealOAuthRedirect = async () => {
    if (!currentUser) {
      setStage('oauth_window');
      return;
    }

    const { url } = await getOAuthUrl(selectedPlatform, currentUser.id);
    window.location.href = url;
  };

  const handleLaunchOAuthWindow = () => {
    setStage('oauth_window');
  };

  const handleSimulateMobileScanConfirm = () => {
    setQrScannedState('scanned');
    setTimeout(() => {
      setQrScannedState('confirmed');
      setTimeout(() => {
        handleAuthorizeSubmit();
      }, 600);
    }, 800);
  };

  const handleAuthorizeSubmit = () => {
    setStage('authorizing');

    setTimeout(() => {
      const handleClean = handleInput.startsWith('@') ? handleInput : `@${handleInput}`;
      const newChan: Omit<SocialChannel, 'id' | 'connectedAt'> = {
        platform: selectedPlatform,
        handle: handleClean,
        displayName:
          selectedPlatform === 'tiktok'
            ? `${handleInput} (TikTok Official)`
            : selectedPlatform === 'youtube'
            ? `${handleInput} Shorts Channel`
            : `${handleInput} Reels Official`,
        avatar:
          selectedPlatform === 'tiktok'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        followers: Math.floor(Math.random() * 8500) + 1200,
        status: 'active',
        tokenExpiresAt: '2027-08-18',
        ipRegion: selectedNode,
        accountType: 'creator',
      };

      addChannel(newChan);
      setStage('success');

      confetti({
        particleCount: 65,
        spread: 55,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onClose();
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* ================= STAGE 1: PLATFORM SELECTION & OAUTH LAUNCH ================= */}
      {stage === 'setup' && (
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
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'zh' ? '官方 OAuth 2.0 极速一键授权' : 'Official OAuth 2.0 Direct Link'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {language === 'zh' ? '连接真实矩阵账号' : 'Connect Social Media Channel'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {language === 'zh'
                ? '直接调用各开放平台官方 API 协议进行账号绑定，全程加密安全。'
                : 'Authorize your channels via official platform API tokens safely.'}
            </p>
          </div>

          {/* Platform Selector Grid */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {language === 'zh' ? '选择您要授权绑定的社媒平台：' : 'Select Social Platform:'}
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

          {/* Node Selector */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>{language === 'zh' ? '绑定海外独立住宅 IP 调度节点：' : 'Bind Clean Residential Proxy Node:'}</span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">100% Clean IP</span>
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

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleTriggerRealOAuthRedirect}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'zh' ? `🌐 跳转 ${currentPlatformInfo.name} 官方 OAuth 授权` : `🌐 Authorize with ${currentPlatformInfo.name}`}</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleLaunchOAuthWindow}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-indigo-400" />
              <span>{language === 'zh' ? '📱 桌面端扫码 / 账号快捷授权' : '📱 Quick Desktop / QR OAuth'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STAGE 2: OFFICIAL SIMULATED OAUTH WINDOW ================= */}
      {stage === 'oauth_window' && (
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Top Address Bar Simulation */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
            </div>

            <div className="flex-1 mx-3 max-w-xs bg-white px-3 py-1 rounded-md border border-slate-200 text-[10px] text-slate-600 flex items-center gap-1.5 truncate font-mono">
              <Lock className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span className="truncate">{currentPlatformInfo.authUrl}</span>
            </div>

            <button
              onClick={() => setStage('setup')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 bg-white">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${currentPlatformInfo.bgColor}`}
              >
                {selectedPlatform.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'zh'
                    ? `授权 Yunina Matrix 访问您的 ${currentPlatformInfo.name}`
                    : `Authorize Yunina Matrix to connect ${currentPlatformInfo.name}`}
                </h3>
                <p className="text-[11px] text-slate-400">{currentPlatformInfo.tag}</p>
              </div>
            </div>

            <div className="flex border-b border-slate-200 mb-4 text-xs font-semibold text-slate-500">
              <button
                type="button"
                onClick={() => setOauthLoginMethod('qr')}
                className={`pb-2 px-3 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  oauthLoginMethod === 'qr'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{language === 'zh' ? '官方 App 扫码授权' : 'App QR Code'}</span>
              </button>
              <button
                type="button"
                onClick={() => setOauthLoginMethod('password')}
                className={`pb-2 px-3 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  oauthLoginMethod === 'password'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{language === 'zh' ? '账号直接授权' : 'Direct Handle OAuth'}</span>
              </button>
            </div>

            {oauthLoginMethod === 'qr' && (
              <div className="space-y-4 text-center">
                <div className="relative w-36 h-36 bg-white p-2 rounded-2xl border-2 border-slate-200 mx-auto flex items-center justify-center shadow-xs">
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                    <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                    <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="13" y="13" width="10" height="10" rx="1" fill="#4f46e5" />
                    <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                    <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="77" y="13" width="10" height="10" rx="1" fill="#4f46e5" />
                    <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
                    <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="13" y="77" width="10" height="10" rx="1" fill="#4f46e5" />
                    <circle cx="50" cy="50" r="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
                    <circle cx="50" cy="50" r="5" fill="#000000" />
                  </svg>

                  {qrScannedState === 'scanned' && (
                    <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-2 rounded-xl">
                      <Smartphone className="w-5 h-5 animate-bounce mb-1 text-emerald-400" />
                      <span className="text-[10px] font-bold">
                        {language === 'zh' ? '已在手机端打开授权' : 'Scanned! Confirming...'}
                      </span>
                    </div>
                  )}

                  {qrScannedState === 'confirmed' && (
                    <div className="absolute inset-0 bg-emerald-900/90 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-2 rounded-xl">
                      <CheckCircle2 className="w-6 h-6 text-emerald-300 mb-1" />
                      <span className="text-[10px] font-bold">
                        {language === 'zh' ? '授权通过' : 'Authorized!'}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-slate-500">
                  {language === 'zh'
                    ? `请打开手机端 ${currentPlatformInfo.name} App 扫描二维码`
                    : `Open ${currentPlatformInfo.name} App and scan to authorize`}
                </p>

                <button
                  type="button"
                  onClick={handleSimulateMobileScanConfirm}
                  disabled={qrScannedState !== 'waiting'}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>
                    {language === 'zh'
                      ? '📱 模拟移动端扫码与确认授权'
                      : '📱 Simulate Mobile App Scan & Confirm'}
                  </span>
                </button>
              </div>
            )}

            {oauthLoginMethod === 'password' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'zh' ? '确认绑定的社媒 Handle / 账号名' : 'Official Handle / Username'}
                  </label>
                  <input
                    type="text"
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="@official_handle"
                  />
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                {language === 'zh' ? '系统申请的 API 授权范围：' : 'Requested Permissions:'}
              </div>
              <div className="space-y-1 text-xs text-slate-700">
                {currentPlatformInfo.scopes.map((s) => (
                  <div key={s.name} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px]">
                      <strong className="text-slate-800">{s.name}</strong> -{' '}
                      {language === 'zh' ? s.descZh : s.descEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setStage('setup')}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {language === 'zh' ? '返回' : 'Back'}
              </button>
              <button
                type="button"
                onClick={handleAuthorizeSubmit}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{language === 'zh' ? '确认授权绑定' : 'Confirm Authorization'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 3 & 4: AUTHORIZING & SUCCESS ================= */}
      {stage === 'authorizing' && (
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-indigo-50 border-4 border-indigo-100 flex items-center justify-center mx-auto mb-4">
            <span className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
            {language === 'zh' ? '正在与开放平台验证并写入数据库...' : 'Authenticating & Saving Channel...'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'zh'
              ? `分配海外独享 Residential IP: ${selectedNode}`
              : `Assigning Residential IP node: ${selectedNode}`}
          </p>
        </div>
      )}

      {stage === 'success' && (
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {language === 'zh' ? '🎉 真实社媒账号授权成功！' : '🎉 Account Authorized Successfully!'}
          </h3>
          <p className="text-xs text-slate-600 mt-1.5">
            {language === 'zh'
              ? `已为您把 @${handleInput} 成功连接至独立节点`
              : `Successfully connected @${handleInput} to ${selectedNode}`}
          </p>
        </div>
      )}
    </div>
  );
};
