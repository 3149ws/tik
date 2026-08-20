import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { PlatformType, PostContent } from '../../types';
import confetti from 'canvas-confetti';
import {
  UploadCloud,
  Film,
  Sparkles,
  Calendar,
  Clock,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  Hash,
  Smile,
  Globe2,
  Eye,
  Sliders,
  Check,
  ChevronDown,
  Info,
} from 'lucide-react';

export const ComposeEditor: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    channels,
    createPost,
    setActivePage,
    currentUser,
    draftScheduleDate,
    draftScheduleTime,
  } = useApp();

  // Selected Target Platforms
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>(['tiktok', 'youtube']);
  const [previewPlatform, setPreviewPlatform] = useState<PlatformType>('tiktok');

  // Video & Assets
  const [videoUrl, setVideoUrl] = useState<string>(
    'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-outdoors-42861-large.mp4'
  );
  const [videoFileName, setVideoFileName] = useState<string>('health_acupoint_3yang.mp4');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80'
  );

  // Caption & Hashtags
  const [caption, setCaption] = useState<string>('身体怕冷多揉三阳 #中医 #tcm #Pain #Acupoint');
  const [hashtags, setHashtags] = useState<string[]>(['#中医', '#tcm', '#Pain', '#Acupoint', '#健康养生']);

  // TikTok specific settings (API Audit Critical)
  const [tiktokPrivacy, setTiktokPrivacy] = useState<'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY'>('PUBLIC_TO_EVERYONE');
  const [tiktokAllowComments, setTiktokAllowComments] = useState(true);
  const [tiktokAllowDuet, setTiktokAllowDuet] = useState(true);
  const [tiktokAllowStitch, setTiktokAllowStitch] = useState(true);
  const [tiktokIsAiGenerated, setTiktokIsAiGenerated] = useState(false);
  const [tiktokIsCommercial, setTiktokIsCommercial] = useState(false);
  const [tiktokYourBrand, setTiktokYourBrand] = useState(false);

  // YouTube specific settings
  const [ytMadeForKids, setYtMadeForKids] = useState(false);
  const [ytVisibility, setYtVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const [ytCategory, setYtCategory] = useState('Howto & Style');

  // Facebook specific settings
  const [fbShareReels, setFbShareReels] = useState(true);
  const [fbAutoFeed, setFbAutoFeed] = useState(true);

  // Global presets
  const [autoPublish, setAutoPublish] = useState(true);
  const [useUrlShortener, setUseUrlShortener] = useState(false);

  // Dynamic Real Date & Time system
  const getFormatYMD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = getFormatYMD(new Date());

  const [scheduleDate, setScheduleDate] = useState<string>(() => draftScheduleDate || todayStr);
  const [scheduleTime, setScheduleTime] = useState<string>(() => draftScheduleTime || '11:00');

  useEffect(() => {
    if (draftScheduleDate) setScheduleDate(draftScheduleDate);
    if (draftScheduleTime) setScheduleTime(draftScheduleTime);
  }, [draftScheduleDate, draftScheduleTime]);

  const generateQuickDates = () => {
    const list = [];
    const now = new Date();
    const dayNamesZh = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 5; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dateVal = getFormatYMD(d);
      const m = d.getMonth() + 1;
      const dayNum = d.getDate();

      let labelStr = '';
      if (i === 0) {
        labelStr = language === 'zh' ? `今天 (${m}/${dayNum})` : `Today (${m}/${dayNum})`;
      } else if (i === 1) {
        labelStr = language === 'zh' ? `明天 (${m}/${dayNum})` : `Tomorrow (${m}/${dayNum})`;
      } else if (i === 2) {
        labelStr = language === 'zh' ? `后天 (${m}/${dayNum})` : `Day After (${m}/${dayNum})`;
      } else {
        const dayName = language === 'zh' ? dayNamesZh[d.getDay()] : dayNamesEn[d.getDay()];
        labelStr = `${dayName} (${m}/${dayNum})`;
      }

      list.push({ label: labelStr, date: dateVal });
    }
    return list;
  };

  const quickDates = generateQuickDates();

  const quickTimes = [
    { label: language === 'zh' ? '09:00 早高峰' : '09:00 Morning', time: '09:00' },
    { label: language === 'zh' ? '11:00 上午档' : '11:00 Midday', time: '11:00' },
    { label: language === 'zh' ? '13:00 午休档' : '13:00 Lunch', time: '13:00' },
    { label: language === 'zh' ? '15:00 下午档' : '15:00 Afternoon', time: '15:00' },
    { label: language === 'zh' ? '18:00 晚高峰' : '18:00 Evening', time: '18:00' },
    { label: language === 'zh' ? '20:00 黄金档' : '20:00 Prime', time: '20:00' },
    { label: language === 'zh' ? '22:00 深夜档' : '22:00 Night', time: '22:00' },
  ];

  // State feedback
  const [isPublishing, setIsPublishing] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'info' } | null>(null);

  const sampleVideos = [
    {
      name: language === 'zh' ? '中医养生与经络穴位' : 'TCM Wellness & Acupoints',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-outdoors-42861-large.mp4',
      thumb: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80',
      caption: '身体怕冷多揉三阳 #中医 #tcm #Pain #Acupoint',
      tags: ['#中医', '#tcm', '#Pain', '#Acupoint'],
    },
    {
      name: language === 'zh' ? '清晨冥想与能量复原' : 'Morning Routine & Meditation',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-sunset-over-the-clouds-43615-large.mp4',
      thumb: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80',
      caption: '3 Steps to Reset Your Energy in 60 Seconds ✨ #mindfulness #wellness #relaxation',
      tags: ['#mindfulness', '#wellness', '#relaxation', '#shorts'],
    },
    {
      name: language === 'zh' ? '现代轻食与健康习惯' : 'Modern Lifestyle & Fitness',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-laptop-43527-large.mp4',
      thumb: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&auto=format&fit=crop&q=80',
      caption: '手掌七星穴口诀#易水百会#中医 每天三分钟通体舒畅！',
      tags: ['#易水百会', '#中医', '#tcm', '#Pain'],
    },
  ];

  const popularHashtagPresets = [
    '#中医',
    '#tcm',
    '#Pain',
    '#Acupoint',
    '#健康养生',
    '#wellness',
    '#fyp',
    '#viral',
    '#shorts',
    '#reels',
  ];

  const togglePlatform = (p: PlatformType) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleInsertTag = (tag: string) => {
    if (!caption.includes(tag)) {
      setCaption((prev) => `${prev} ${tag}`);
      if (!hashtags.includes(tag)) {
        setHashtags((prev) => [...prev, tag]);
      }
    }
  };

  const handleSelectSampleVideo = (sample: (typeof sampleVideos)[0]) => {
    setVideoUrl(sample.url);
    setThumbnailUrl(sample.thumb);
    setVideoFileName(`${sample.name.toLowerCase().replace(/\s+/g, '_')}.mp4`);
    setCaption(sample.caption);
    setHashtags(sample.tags);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFileName(file.name);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleSave = async (isImmediatePublish = false) => {
    setIsPublishing(true);
    setNotification(null);

    const postData: Omit<PostContent, 'id' | 'createdAt'> = {
      title: caption.slice(0, 30) || 'Untitled Post',
      caption,
      hashtags,
      videoUrl,
      videoFileName,
      thumbnailUrl,
      videoDuration: 35,
      fileSizeMb: 22.4,
      targetPlatforms: selectedPlatforms,
      scheduledTime: `${scheduleDate}T${scheduleTime}:00.000Z`,
      status: isImmediatePublish ? 'published' : 'scheduled',
      tiktokSettings: {
        privacyLevel: tiktokPrivacy,
        allowComments: tiktokAllowComments,
        allowDuet: tiktokAllowDuet,
        allowStitch: tiktokAllowStitch,
        isAiGenerated: tiktokIsAiGenerated,
        isCommercial: tiktokIsCommercial,
        brandPromotion: tiktokIsCommercial,
        yourBrand: tiktokYourBrand,
      },
      youtubeSettings: {
        madeForKids: ytMadeForKids,
        visibility: ytVisibility,
        category: ytCategory,
        notifySubscribers: true,
      },
      facebookSettings: {
        shareToReels: fbShareReels,
        targetAudience: 'public',
        autoShareToFeed: fbAutoFeed,
      },
      autoPublish,
      useUrlShortener,
      selectedChannels: channels.map((c) => c.id),
    };

    setTimeout(() => {
      createPost(postData);
      setIsPublishing(false);

      if (isImmediatePublish) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setNotification({
          type: 'success',
          msg: t.publishedSuccess,
        });
      } else {
        setNotification({
          type: 'info',
          msg: language === 'zh' ? '短视频已成功加入矩阵排期日历！' : 'Post scheduled in matrix calendar!',
        });
      }

      setTimeout(() => {
        setActivePage('planning');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification Toast */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm shadow-xs animate-in fade-in ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-indigo-50 text-indigo-900 border border-indigo-200'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{notification.msg}</span>
          </div>
        )}

        {/* 3-Column Sleek Interface Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT ASIDE / SIDEBAR ================= */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-6">
            <div>
              <button
                type="button"
                onClick={() => {
                  setCaption('');
                  setVideoFileName('');
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 px-4 font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>+</span>
                <span>{t.planningCreatePost}</span>
              </button>
            </div>

            {/* Managed Platforms */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {t.managedPlatforms} ({channels.length})
                </span>
                <button
                  type="button"
                  onClick={() => setActivePage('channels')}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  + {language === 'zh' ? '管理账号' : 'Manage'}
                </button>
              </div>

              <div className="space-y-1.5">
                {channels.length > 0 ? (
                  channels.map((ch) => (
                    <div
                      key={ch.id}
                      onClick={() => setActivePage('channels')}
                      className="flex items-center gap-3 p-2.5 bg-slate-50 hover:bg-indigo-50/70 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px] ${
                          ch.platform === 'tiktok'
                            ? 'bg-black'
                            : ch.platform === 'youtube'
                            ? 'bg-red-600'
                            : 'bg-blue-600'
                        }`}
                      >
                        {ch.platform === 'tiktok' ? 'TT' : ch.platform === 'youtube' ? 'YT' : 'FB'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 truncate">{ch.displayName}</div>
                        <div className="text-[10px] text-indigo-600 truncate">{ch.handle}</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center space-y-2">
                    <p className="text-xs text-slate-500">
                      {language === 'zh' ? '暂未绑定社交矩阵账号' : 'No channels connected yet.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActivePage('channels')}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
                    >
                      + {language === 'zh' ? '点击连接账号' : 'Connect Account'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Subscription Quota Widget */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-auto space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t.subscriptionLabel}
              </div>
              <div className="text-sm font-bold text-slate-800">
                {currentUser?.plan === 'annual'
                  ? (language === 'zh' ? 'Pro Matrix 矩阵年度专业版' : 'Pro Matrix Annual')
                  : (language === 'zh' ? 'Pro Matrix 矩阵方案' : 'Pro Matrix Plan')}
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all"
                  style={{
                    width: `${((currentUser?.channelsUsed || 3) / (currentUser?.channelsQuota || 5)) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 font-medium">
                {language === 'zh'
                  ? `已使用 ${currentUser?.channelsUsed || 3} / ${currentUser?.channelsQuota || 5} 个账号席位 (60%)`
                  : `${currentUser?.channelsUsed || 3} of ${currentUser?.channelsQuota || 5} ${t.channelSeatsUsed} (60%)`}
              </div>
            </div>
          </aside>

          {/* ================= CENTER COLUMN: CREATE NEW VIDEO POST ================= */}
          <section className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                {t.composeTitle}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  disabled={isPublishing}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
                >
                  {t.scheduleButton}
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  disabled={isPublishing}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isPublishing ? (
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      <span>{t.publishNowButton}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Main Form Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              {/* Platforms to Publish */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {t.composePlatformSelect}
                </label>
                <div className="flex flex-wrap gap-2.5">
                  <div
                    onClick={() => {
                      togglePlatform('tiktok');
                      setPreviewPlatform('tiktok');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-pointer transition-all ${
                      selectedPlatforms.includes('tiktok')
                        ? 'border-2 border-indigo-600 bg-indigo-50/80 shadow-xs'
                        : 'border border-slate-200 bg-slate-50/60 opacity-60'
                    }`}
                  >
                    <div className="w-5 h-5 bg-black rounded text-[10px] flex items-center justify-center text-white font-bold">
                      T
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        selectedPlatforms.includes('tiktok') ? 'text-indigo-700' : 'text-slate-600'
                      }`}
                    >
                      TikTok
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      togglePlatform('youtube');
                      setPreviewPlatform('youtube');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-pointer transition-all ${
                      selectedPlatforms.includes('youtube')
                        ? 'border-2 border-red-600 bg-red-50/80 shadow-xs'
                        : 'border border-slate-200 bg-slate-50/60 opacity-60'
                    }`}
                  >
                    <div className="w-5 h-5 bg-red-600 rounded text-[10px] flex items-center justify-center text-white font-bold">
                      Y
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        selectedPlatforms.includes('youtube') ? 'text-red-700' : 'text-slate-600'
                      }`}
                    >
                      Shorts
                    </span>
                  </div>

                  <div
                    onClick={() => {
                      togglePlatform('facebook');
                      setPreviewPlatform('facebook');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-pointer transition-all ${
                      selectedPlatforms.includes('facebook')
                        ? 'border-2 border-blue-600 bg-blue-50/80 shadow-xs'
                        : 'border border-slate-200 bg-slate-50/60 opacity-60'
                    }`}
                  >
                    <div className="w-5 h-5 bg-blue-600 rounded text-[10px] flex items-center justify-center text-white font-bold">
                      F
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        selectedPlatforms.includes('facebook') ? 'text-blue-700' : 'text-slate-600'
                      }`}
                    >
                      Reels
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Content Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {t.composeUploadVideo}
                </label>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-5 flex flex-col items-center justify-center bg-slate-50/80 hover:bg-slate-100/60 transition-colors cursor-pointer text-center">
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 mb-0.5">
                    {t.composeUploadDragDrop}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {t.composeUploadSpecs}
                  </span>
                  {videoFileName && (
                    <span className="mt-2 text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {t.assetPrefix} {videoFileName}
                    </span>
                  )}
                </div>

                {/* Sample quick pickers */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">{t.demoPrefix}</span>
                  {sampleVideos.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSampleVideo(s)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors cursor-pointer"
                    >
                      {s.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption & Hashtags */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t.composeCaption}
                  </label>
                  <span className="text-xs text-slate-400 font-mono">
                    {caption.length} / 2200
                  </span>
                </div>

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={t.composeCaptionPlaceholder}
                  className="w-full border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none h-24 bg-slate-50/50 text-slate-900"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                  <div className="flex flex-wrap gap-1">
                    {popularHashtagPresets.slice(0, 5).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleInsertTag(tag)}
                        className="text-[11px] text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2 py-0.5 rounded transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInsertTag('#viral')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                  >
                    {t.suggestedHashtagsBtn}
                  </button>
                </div>
              </div>

              {/* TikTok Privacy & Compliance Settings */}
              {selectedPlatforms.includes('tiktok') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {t.tiktokPrivacyLabel}
                    </label>
                    <select
                      value={tiktokPrivacy}
                      onChange={(e: any) => setTiktokPrivacy(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 text-slate-800 focus:outline-none"
                    >
                      <option value="PUBLIC_TO_EVERYONE">{t.tiktokPrivacyPublic}</option>
                      <option value="MUTUAL_FOLLOW_FRIENDS">{t.tiktokPrivacyFriends}</option>
                      <option value="SELF_ONLY">{t.tiktokPrivacySelf}</option>
                    </select>

                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="comments-toggle"
                        checked={tiktokAllowComments}
                        onChange={(e) => setTiktokAllowComments(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600"
                      />
                      <label htmlFor="comments-toggle" className="text-xs text-slate-600 font-medium cursor-pointer">
                        {t.tiktokAllowDuetStitchComments}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {language === 'zh' ? '合规与商业声明 (API 提审)' : 'Compliance Disclosure'}
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tiktokIsAiGenerated}
                          onChange={(e) => setTiktokIsAiGenerated(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600"
                        />
                        <span className="text-xs text-slate-600 font-medium">
                          {t.tiktokAiGeneratedLabel}
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tiktokIsCommercial}
                          onChange={(e) => setTiktokIsCommercial(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600"
                        />
                        <span className="text-xs text-slate-600 font-medium">
                          {t.tiktokCommercialLabel}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Schedule time row & Time System */}
              <div className="pt-4 border-t border-slate-100 space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>{language === 'zh' ? '多平台矩阵排期时间系统' : 'Matrix Multi-Platform Scheduling'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Globe2 className="w-3 h-3" />
                    <span>{t.cleanResidentialNode}</span>
                  </div>
                </div>

                {/* Quick Date Presets */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {language === 'zh' ? '快捷日期' : 'Quick Dates'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickDates.map((item) => (
                      <button
                        key={item.date}
                        type="button"
                        onClick={() => setScheduleDate(item.date)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          scheduleDate === item.date
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Time Slots */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {language === 'zh' ? '黄金流量时段' : 'Peak Traffic Hours'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickTimes.map((item) => (
                      <button
                        key={item.time}
                        type="button"
                        onClick={() => setScheduleTime(item.time)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                          scheduleTime === item.time
                            ? 'bg-indigo-600 text-white shadow-xs font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Precision Date & Time Inputs */}
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-600">{language === 'zh' ? '排期日期:' : 'Date:'}</span>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-600">{language === 'zh' ? '精准时间:' : 'Time:'}</span>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-100">
                    ⏰ {scheduleDate} {scheduleTime} (自动按时区调度)
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= RIGHT ASIDE: LIVE MOBILE PREVIEW ================= */}
          <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center shadow-xs">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              {t.liveMobilePreview}
            </div>

            {/* Phone simulator container */}
            <div className="w-[280px] h-[560px] bg-slate-900 rounded-[40px] border-[8px] border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-black flex flex-col">
                {/* Simulated video/poster */}
                <div className="flex-1 relative overflow-hidden">
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      poster={thumbnailUrl}
                      className="w-full h-full object-cover"
                      loop
                      autoPlay
                      muted
                      playsInline
                    />
                  ) : (
                    <img src={thumbnailUrl} alt="Poster" className="w-full h-full object-cover" />
                  )}

                  {/* Gradient shadow for text */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none"></div>

                  {/* Bottom Caption */}
                  <div className="absolute bottom-16 left-3 right-12 text-white drop-shadow">
                    <div className="font-bold text-xs mb-1">
                      {channels[0]?.handle || '@YourBrand'}
                    </div>
                    <div className="text-[11px] leading-snug line-clamp-2 opacity-90 text-slate-100">
                      {caption || (language === 'zh' ? '体验 Yunina 海外纯净节点直发与多平台矩阵排期！ #养生 #tcm' : 'Check out our latest multi-platform strategy with Yunina! #viral #saas')}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-300">
                      <div className="w-2.5 h-2.5 bg-white/40 rounded-full animate-pulse"></div>
                      <span className="truncate">{t.originalSoundLabel} - {channels[0]?.handle || '@YourBrand'}</span>
                    </div>
                  </div>

                  {/* Right side interaction buttons */}
                  <div className="absolute right-2 bottom-16 flex flex-col gap-3 items-center">
                    <div className="w-8 h-8 bg-white/10 rounded-full backdrop-blur-xs flex items-center justify-center text-white text-xs">
                      ❤
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-full backdrop-blur-xs flex items-center justify-center text-white text-xs">
                      💬
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-full backdrop-blur-xs flex items-center justify-center text-white text-xs">
                      ⤴
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="h-10 bg-black/80 flex items-center justify-around border-t border-white/10 px-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center text-black font-bold text-[10px]">
                    +
                  </div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Platform Icon Pickers below Phone */}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setPreviewPlatform('tiktok')}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  previewPlatform === 'tiktok'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="w-3.5 h-3.5 bg-black rounded-xs"></div>
              </button>
              <button
                type="button"
                onClick={() => setPreviewPlatform('youtube')}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  previewPlatform === 'youtube'
                    ? 'bg-red-600 border-red-600 text-white shadow-xs'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="w-3.5 h-3.5 bg-red-600 rounded-xs"></div>
              </button>
              <button
                type="button"
                onClick={() => setPreviewPlatform('facebook')}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  previewPlatform === 'facebook'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="w-3.5 h-3.5 bg-blue-600 rounded-xs"></div>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
