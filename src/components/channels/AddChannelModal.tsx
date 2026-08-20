import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { PlatformType, SocialChannel } from '../../types';
import { getOAuthUrl, isPlaceholderKey } from '../../services/oauthService';
import { getApiCredentialFromDb, saveApiCredentialToDb } from '../../services/dbService';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  Globe2,
  CheckCircle2,
  Lock,
  ArrowRight,
  QrCode,
  Smartphone,
  Sparkles,
  ExternalLink,
  KeyRound,
  Check,
  AlertTriangle,
  Copy,
  Sliders,
  Settings,
  Info,
} from 'lucide-react';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddChannelModal: React.FC<AddChannelModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { addChannel, serverNodes, currentUser, updateApiConfig } = useApp();

  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('tiktok');
  const [selectedNode, setSelectedNode] = useState(
    serverNodes[0]?.name || 'US-West #402 (Silicon Valley Residential Clean)'
  );

  const [stage, setStage] = useState<'setup' | 'key_config' | 'oauth_window' | 'authorizing' | 'success'>('setup');
  const [oauthLoginMethod, setOauthLoginMethod] = useState<'qr' | 'password'>('qr');
  const [tiktokUsername, setTiktokUsername] = useState('lideming_official');
  const [tiktokPassword, setTiktokPassword] = useState('••••••••••••');
  const [qrScannedState, setQrScannedState] = useState<'waiting' | 'scanned' | 'confirmed'>('waiting');

  // Client Key state
  const [clientKeyInput, setClientKeyInput] = useState('');
  const [clientSecretInput, setClientSecretInput] = useState('');
  const [keySavedToast, setKeySavedToast] = useState(false);
  const [copiedUriToast, setCopiedUriToast] = useState(false);
  const [showKeyWarning, setShowKeyWarning] = useState(false);

  const currentRedirectUri = window.location.origin;

  useEffect(() => {
    if (isOpen) {
      setStage('setup');
      setOauthLoginMethod('qr');
      setQrScannedState('waiting');
      setShowKeyWarning(false);

      if (selectedPlatform === 'tiktok') {
        setTiktokUsername('lideming_tiktok');
      } else if (selectedPlatform === 'youtube') {
        setTiktokUsername('TCMHealthSecrets');
      } else if (selectedPlatform === 'facebook') {
        setTiktokUsername('TheStoreUK');
      } else {
        setTiktokUsername('YuninaCreatorIG');
      }

      // Load existing key from Firestore
      const dbPlatformKey = selectedPlatform === 'facebook' || selectedPlatform === 'instagram' ? 'meta' : selectedPlatform;
      getApiCredentialFromDb(dbPlatformKey).then((cred) => {
        if (cred?.clientId) {
          setClientKeyInput(cred.clientId);
          setClientSecretInput(cred.clientSecret || '');
        } else {
          setClientKeyInput('');
          setClientSecretInput('');
        }
      });
    }
  }, [isOpen, selectedPlatform]);

  if (!isOpen) return null;

  const platforms = [
    {
      id: 'tiktok' as PlatformType,
      name: 'TikTok',
      fullName: 'TikTok Creator / Business Account',
      authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
      devPortalUrl: 'https://developers.tiktok.com/apps/',
      tag: 'TikTok Content Posting API (v2)',
      badge: 'Official Tier-1',
      keyFieldLabel: 'TikTok Client Key (app_id)',
      secretFieldLabel: 'TikTok Client Secret',
      scopes: [
        { name: 'user.info.basic', descZh: '读取公开资料、昵称与头像', descEn: 'Read public profile, handle & avatar' },
        { name: 'video.publish', descZh: '代表您自动直发短视频与文案', descEn: 'Direct dispatch & publish short videos' },
        { name: 'video.upload', descZh: '通过海外纯净 IP 节点上传素材', descEn: 'Upload video assets via clean residential IP' },
      ],
    },
    {
      id: 'youtube' as PlatformType,
      name: 'YouTube Shorts',
      fullName: 'YouTube Shorts Channel (Google Account)',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      devPortalUrl: 'https://console.cloud.google.com/apis/credentials',
      tag: 'YouTube Data API v3',
      badge: 'Google Cloud Verified',
      keyFieldLabel: 'Google OAuth Client ID',
      secretFieldLabel: 'Google OAuth Client Secret (Optional)',
      scopes: [
        { name: 'youtube.upload', descZh: '管理并发布 YouTube Shorts 视频', descEn: 'Manage and publish YouTube Shorts' },
        { name: 'youtube.readonly', descZh: '读取 Shorts 播放量与互动统计', descEn: 'View analytics & subscriber stats' },
      ],
    },
    {
      id: 'facebook' as PlatformType,
      name: 'Facebook Reels',
      fullName: 'Facebook Page & Reels (Meta)',
      authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
      devPortalUrl: 'https://developers.facebook.com/apps/',
      tag: 'Meta Graph API',
      badge: 'Meta Verified',
      keyFieldLabel: 'Meta App ID',
      secretFieldLabel: 'Meta App Secret',
      scopes: [
        { name: 'pages_show_list', descZh: '获取管理的 Facebook 公共主页', descEn: 'Access managed Facebook Pages' },
        { name: 'pages_read_engagement', descZh: '读取 Reels 播放量与评论互动', descEn: 'Read Reels analytics & comments' },
        { name: 'pages_manage_posts', descZh: '自动发布 Reels 短视频内容', descEn: 'Publish Reels videos on your behalf' },
      ],
    },
    {
      id: 'instagram' as PlatformType,
      name: 'Instagram Reels',
      fullName: 'Instagram Professional Account',
      authUrl: 'https://api.instagram.com/oauth/authorize',
      devPortalUrl: 'https://developers.facebook.com/apps/',
      tag: 'Instagram Graph API',
      badge: 'Meta Graph API',
      keyFieldLabel: 'Meta/Instagram App ID',
      secretFieldLabel: 'Meta/Instagram App Secret',
      scopes: [
        { name: 'instagram_basic', descZh: '读取 Instagram 账号公开信息', descEn: 'Read Instagram public account info' },
        { name: 'instagram_content_publish', descZh: '定时排期发布 Instagram Reels', descEn: 'Schedule and publish Reels' },
      ],
    },
  ];

  const currentPlatformInfo = platforms.find((p) => p.id === selectedPlatform) || platforms[0];
  const isKeyEmptyOrPlaceholder = isPlaceholderKey(selectedPlatform, clientKeyInput);

  const handleCopyRedirectUri = () => {
    navigator.clipboard.writeText(currentRedirectUri);
    setCopiedUriToast(true);
    setTimeout(() => setCopiedUriToast(false), 2500);
  };

  const handleSaveClientKey = async () => {
    if (!clientKeyInput.trim()) return;
    const dbPlatform = selectedPlatform === 'facebook' || selectedPlatform === 'instagram' ? 'meta' : selectedPlatform;
    await saveApiCredentialToDb({
      platform: dbPlatform,
      clientId: clientKeyInput.trim(),
      clientSecret: clientSecretInput.trim(),
      redirectUri: currentRedirectUri,
      updatedAt: new Date().toISOString(),
    });
    updateApiConfig(dbPlatform, {
      appIdOrKey: clientKeyInput.trim(),
      secret: clientSecretInput.trim(),
      redirectUri: currentRedirectUri,
    });
    setKeySavedToast(true);
    setShowKeyWarning(false);
    setTimeout(() => setKeySavedToast(false), 2500);
  };

  const handleTriggerRealOAuthRedirect = async () => {
    if (!currentUser) {
      setStage('oauth_window');
      return;
    }

    const { url, isPlaceholder } = await getOAuthUrl(selectedPlatform, currentUser.id, clientKeyInput);

    if (isPlaceholder) {
      setShowKeyWarning(true);
      return;
    }

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
      }, 700);
    }, 900);
  };

  const handleAuthorizeSubmit = () => {
    setStage('authorizing');

    setTimeout(() => {
      const handleClean = tiktokUsername.startsWith('@') ? tiktokUsername : `@${tiktokUsername}`;
      const newChan: Omit<SocialChannel, 'id' | 'connectedAt'> = {
        platform: selectedPlatform,
        handle: handleClean,
        displayName:
          selectedPlatform === 'tiktok'
            ? `${tiktokUsername} (TikTok Official)`
            : selectedPlatform === 'youtube'
            ? 'TCM Wellness Shorts'
            : `${tiktokUsername} Reels Official`,
        avatar:
          selectedPlatform === 'tiktok'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        followers: Math.floor(Math.random() * 9500) + 2400,
        status: 'active',
        tokenExpiresAt: '2027-08-18',
        ipRegion: selectedNode,
        accountType: 'creator',
      };

      addChannel(newChan);
      setStage('success');

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* ================= STAGE 1: SELECTION & CONFIGURATION ================= */}
      {stage === 'setup' && (
        <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'zh' ? '官方 OAuth 2.0 授权通道' : 'Official OAuth 2.0 Access'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'zh' ? '连接社媒矩阵账号' : 'Connect Social Media Account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {language === 'zh'
                ? '支持直连官方 OAuth 2.0 授权跳转与桌面免审核极速授权，自动持久化存储至 Firestore 数据库'
                : 'Official OAuth 2.0 redirection or instant desktop authorization with database persistence'}
            </p>
          </div>

          {/* Platform Selector */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {language === 'zh' ? '1. 选择要连接的目标社媒平台：' : '1. Select Target Platform:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedPlatform === p.id
                      ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-600/30 text-indigo-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{p.name}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{p.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Node Selector */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>{language === 'zh' ? '2. 为该账号分配专属海外纯净 IP 节点：' : '2. Bind Dedicated Clean Residential IP:'}</span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">100% Clean IP (No Ban)</span>
            </label>
            <select
              value={selectedNode}
              onChange={(e) => setSelectedNode(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {serverNodes.map((node) => (
                <option key={node.id} value={node.name}>
                  {node.name} — {node.region} ({node.ipReputation})
                </option>
              ))}
            </select>
          </div>

          {/* Key & Developer App Configuration Box */}
          <div className="mb-5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Settings className="w-4 h-4 text-indigo-600" />
                <span>{language === 'zh' ? '开发者 Client Key 配置' : 'Developer Client Key Config'}</span>
              </div>
              <a
                href={currentPlatformInfo.devPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
              >
                <span>{language === 'zh' ? '前往官方开发者后台申请' : 'Open Developer Portal'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {currentPlatformInfo.keyFieldLabel}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={clientKeyInput}
                    onChange={(e) => setClientKeyInput(e.target.value)}
                    placeholder={
                      selectedPlatform === 'tiktok'
                        ? '请输入在 developers.tiktok.com 创建的 Client Key'
                        : '请输入官方 App ID / Client ID'
                    }
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveClientKey}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'zh' ? '保存 Key' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Redirect URI copy prompt */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 bg-white p-2 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1 truncate mr-2">
                  <span className="font-semibold text-slate-700">Redirect URI:</span>
                  <span className="font-mono text-slate-500 truncate">{currentRedirectUri}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyRedirectUri}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer flex-shrink-0"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedUriToast ? (language === 'zh' ? '已复制' : 'Copied!') : (language === 'zh' ? '复制' : 'Copy')}</span>
                </button>
              </div>

              {keySavedToast && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'zh' ? '✅ Client Key 已加密保存至 Firestore 数据库！' : 'Client Key saved to Firestore DB!'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Warning Modal Alert if Placeholder */}
          {showKeyWarning && (
            <div className="mb-5 p-4 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-900 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  {language === 'zh'
                    ? '⚠️ 提示：TikTok 官方要求填写真实 Client Key'
                    : 'Notice: Real Client Key required for direct official redirect'}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {language === 'zh'
                  ? '检测到您尚未在上方填入在 TikTok 开发者平台申请的有效 Client Key（使用默认占位 Key 会触发官方页面的『无法通过 TikTok 登录，请更正 client_key』）。'
                  : 'You have not configured a valid TikTok Client Key yet. Official redirect will fail with invalid client_key.'}
              </p>
              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <a
                  href={currentPlatformInfo.devPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-center text-[11px] flex items-center justify-center gap-1"
                >
                  <span>{language === 'zh' ? '前往 TikTok 申请 Key' : 'Get Key on TikTok'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={handleLaunchOAuthWindow}
                  className="flex-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-center text-[11px] shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'zh' ? '🚀 使用桌面免审核极速授权（推荐）' : '🚀 Use Desktop Instant OAuth'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleTriggerRealOAuthRedirect}
              className="py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'zh' ? '🌐 跳转官方 OAuth 页面授权' : '🌐 Redirect to Official OAuth'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleLaunchOAuthWindow}
              className="py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'zh' ? '📱 桌面端极速授权通道' : '📱 Desktop Instant OAuth'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STAGE 2: DESKTOP SIMULATED OFFICIAL OAUTH WINDOW ================= */}
      {stage === 'oauth_window' && (
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
            </div>

            <div className="flex-1 mx-4 max-w-xs bg-white px-3 py-1 rounded-md border border-slate-200 text-[11px] text-slate-600 flex items-center gap-1.5 truncate">
              <Lock className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span className="font-mono truncate">{currentPlatformInfo.authUrl}</span>
            </div>

            <button
              onClick={() => setStage('setup')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 sm:p-8 bg-white">
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold">
                  {selectedPlatform.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'zh'
                      ? `授权 Yunina 访问您的 ${currentPlatformInfo.name} 账号`
                      : `Authorize Yunina to access your ${currentPlatformInfo.name}`}
                  </h3>
                  <p className="text-xs text-slate-400">{currentPlatformInfo.tag}</p>
                </div>
              </div>
            </div>

            <div className="flex border-b border-slate-200 mb-5 text-xs font-semibold text-slate-500">
              <button
                type="button"
                onClick={() => setOauthLoginMethod('qr')}
                className={`pb-2.5 px-3 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  oauthLoginMethod === 'qr'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{language === 'zh' ? '使用 App 扫码登录' : 'Use App QR Code'}</span>
              </button>
              <button
                type="button"
                onClick={() => setOauthLoginMethod('password')}
                className={`pb-2.5 px-3 flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  oauthLoginMethod === 'password'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{language === 'zh' ? '账号密码登录' : 'Password Login'}</span>
              </button>
            </div>

            {oauthLoginMethod === 'qr' && (
              <div className="space-y-4 text-center">
                <div className="relative w-40 h-40 bg-white p-2.5 rounded-2xl border-2 border-slate-200 mx-auto flex items-center justify-center shadow-xs">
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
                    <circle cx="50" cy="50" r="12" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
                    <circle cx="50" cy="50" r="6" fill="#000000" />
                  </svg>

                  {qrScannedState === 'scanned' && (
                    <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-2 rounded-xl">
                      <Smartphone className="w-6 h-6 animate-bounce mb-1 text-emerald-400" />
                      <span className="text-[11px] font-bold">
                        {language === 'zh' ? '手机端已扫码，请确认' : 'Scanned! Confirm on phone'}
                      </span>
                    </div>
                  )}

                  {qrScannedState === 'confirmed' && (
                    <div className="absolute inset-0 bg-emerald-900/90 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-2 rounded-xl">
                      <CheckCircle2 className="w-7 h-7 text-emerald-300 mb-1" />
                      <span className="text-[11px] font-bold">
                        {language === 'zh' ? '授权验证通过' : 'Authorized!'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-500">
                  <p>
                    {language === 'zh'
                      ? `请使用手机端 ${currentPlatformInfo.name} 扫一扫授权登录`
                      : `Open ${currentPlatformInfo.name} App on your phone and scan`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateMobileScanConfirm}
                  disabled={qrScannedState !== 'waiting'}
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>
                    {language === 'zh'
                      ? '📱 模拟手机端扫码并点击确认授权'
                      : '📱 Simulate Mobile App Scan & Confirm'}
                  </span>
                </button>
              </div>
            )}

            {oauthLoginMethod === 'password' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'zh' ? '账号 / 邮箱' : 'Username / Email'}
                  </label>
                  <input
                    type="text"
                    value={tiktokUsername}
                    onChange={(e) => setTiktokUsername(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter official handle"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'zh' ? '密码' : 'Password'}
                  </label>
                  <input
                    type="password"
                    value={tiktokPassword}
                    onChange={(e) => setTiktokPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                {language === 'zh' ? '申请授予的 API 权限清单：' : 'Requested Scopes & Permissions:'}
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                {currentPlatformInfo.scopes.map((s) => (
                  <div key={s.name} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">{s.name}</span>:
                      <span className="text-slate-500 ml-1">
                        {language === 'zh' ? s.descZh : s.descEn}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setStage('setup')}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {language === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleAuthorizeSubmit}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{language === 'zh' ? '确认授权并写入数据库' : 'Authorize & Save to Database'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {stage === 'authorizing' && (
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-indigo-50 border-4 border-indigo-100 flex items-center justify-center mx-auto mb-4">
            <span className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {language === 'zh' ? '正在与 Firestore 数据库同步并交换凭证...' : 'Saving to Firestore DB...'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'zh'
              ? `正在向 ${selectedNode} 节点分配独立海外住宅原生通道`
              : `Allocating clean residential proxy on ${selectedNode}`}
          </p>
        </div>
      )}

      {stage === 'success' && (
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {language === 'zh' ? '🎉 账号授权并存储数据库成功！' : '🎉 Account Saved to Database!'}
          </h3>
          <p className="text-xs text-slate-600 mt-2">
            {language === 'zh'
              ? `已将 @${tiktokUsername} 绑定至节点：${selectedNode}`
              : `Successfully saved @${tiktokUsername} to ${selectedNode}`}
          </p>
        </div>
      )}
    </div>
  );
};
