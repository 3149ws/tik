import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { PlatformType } from '../../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  Plus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  Repeat,
  MoreVertical,
  Check,
} from 'lucide-react';

interface PhonePreviewProps {
  platform: PlatformType;
  onPlatformChange: (platform: PlatformType) => void;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  channelHandle?: string;
  channelAvatar?: string;
  isAiGenerated?: boolean;
  isCommercial?: boolean;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({
  platform,
  onPlatformChange,
  videoUrl,
  thumbnailUrl,
  caption,
  hashtags,
  channelHandle = '@lideming17',
  channelAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  isAiGenerated = false,
  isCommercial = false,
}) => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);

  const fullCaption = caption || (language === 'zh' ? '身体怕冷多揉三阳 #中医 #tcm #Pain #Acupoint' : 'Wellness secrets: 3 essential daily acupoints #wellness #health #fyp');

  return (
    <div className="flex flex-col items-center">
      {/* Top Device Platform Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/90 rounded-2xl mb-4 border border-slate-300 shadow-inner">
        <button
          type="button"
          onClick={() => onPlatformChange('tiktok')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            platform === 'tiktok'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#25F4EE]"></span>
          <span>TikTok</span>
        </button>

        <button
          type="button"
          onClick={() => onPlatformChange('youtube')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            platform === 'youtube'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-white"></span>
          <span>Shorts</span>
        </button>

        <button
          type="button"
          onClick={() => onPlatformChange('facebook')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            platform === 'facebook'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-white"></span>
          <span>FB Reels</span>
        </button>
      </div>

      {/* Realistic Phone Shell (9:16 vertical ratio) */}
      <div className="relative w-[310px] sm:w-[330px] h-[640px] bg-black rounded-[46px] p-3 shadow-2xl ring-8 ring-slate-800/80 border-4 border-slate-700 overflow-hidden select-none">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-blue-950 border border-slate-800"></div>
        </div>

        {/* Screen Bezel Container */}
        <div className="relative w-full h-full bg-slate-950 rounded-[36px] overflow-hidden flex flex-col justify-between">
          {/* Video or Thumbnail Background */}
          <div className="absolute inset-0 z-0">
            {videoUrl ? (
              <video
                src={videoUrl}
                poster={thumbnailUrl}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                autoPlay={isPlaying}
                playsInline
              />
            ) : thumbnailUrl ? (
              <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-950 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                <Play className="w-12 h-12 text-slate-600 mb-2 stroke-1" />
                <span className="text-xs">
                  {language === 'zh' ? '上传视频或选择示例视频以预览' : 'Upload video to preview mobile playback'}
                </span>
              </div>
            )}

            {/* Gradient Dimmer for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none"></div>
          </div>

          {/* Interactive Play/Pause & Sound Button overlay */}
          <div className="absolute top-12 right-3 z-30 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/70 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/70 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* ===================== TIKTOK OVERLAY ===================== */}
          {platform === 'tiktok' && (
            <>
              {/* TikTok Top Nav */}
              <div className="relative z-20 pt-8 px-4 flex items-center justify-center gap-4 text-xs font-bold text-white drop-shadow">
                <span className="text-white/60">Following</span>
                <span className="text-white border-b-2 border-white pb-0.5">For You</span>
              </div>

              {/* TikTok Compliance Pills */}
              {(isAiGenerated || isCommercial) && (
                <div className="relative z-20 px-3 flex flex-wrap gap-1.5">
                  {isAiGenerated && (
                    <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[9px] backdrop-blur-xs border border-white/20">
                      ✨ AI-generated
                    </span>
                  )}
                  {isCommercial && (
                    <span className="px-2 py-0.5 rounded bg-black/60 text-white text-[9px] backdrop-blur-xs border border-white/20">
                      🏷️ Paid partnership
                    </span>
                  )}
                </div>
              )}

              {/* TikTok Right Action Buttons (Avatar + Likes + Comments + Share + Music) */}
              <div className="relative z-20 self-end mr-3 flex flex-col items-center gap-3.5 text-white">
                {/* Author Avatar with Follow Plus */}
                <div className="relative mb-1">
                  <img
                    src={channelAvatar}
                    alt="Channel"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FE2C55] text-white flex items-center justify-center shadow">
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Like Button */}
                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  className="flex flex-col items-center focus:outline-none"
                >
                  <Heart
                    className={`w-7 h-7 filter drop-shadow ${
                      liked ? 'text-[#FE2C55] fill-[#FE2C55]' : 'text-white'
                    }`}
                  />
                  <span className="text-[10px] font-semibold mt-0.5 drop-shadow">28.4K</span>
                </button>

                {/* Comment Button */}
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-7 h-7 text-white fill-white/10 filter drop-shadow" />
                  <span className="text-[10px] font-semibold mt-0.5 drop-shadow">1,420</span>
                </div>

                {/* Bookmark Button */}
                <div className="flex flex-col items-center">
                  <Bookmark className="w-7 h-7 text-white fill-white/10 filter drop-shadow" />
                  <span className="text-[10px] font-semibold mt-0.5 drop-shadow">890</span>
                </div>

                {/* Share Button */}
                <div className="flex flex-col items-center">
                  <Share2 className="w-7 h-7 text-white filter drop-shadow" />
                  <span className="text-[10px] font-semibold mt-0.5 drop-shadow">342</span>
                </div>

                {/* Rotating Vinyl Disc */}
                <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center animate-spin duration-3000">
                  <Music className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* TikTok Bottom Caption & Bottom Nav */}
              <div className="relative z-20 pb-2 px-3 space-y-2">
                <div className="text-white text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 drop-shadow">
                    <span>{channelHandle}</span>
                    <span className="text-[10px] text-white/70">· 1m ago</span>
                  </div>
                  <p className="text-[11px] leading-snug line-clamp-3 drop-shadow text-slate-100">
                    {fullCaption}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/90 drop-shadow">
                    <Music className="w-3 h-3" />
                    <span className="truncate">Original Sound - {channelHandle} (Verified)</span>
                  </div>
                </div>

                {/* TikTok Bottom White/Dark Nav */}
                <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[9px] text-white/70 font-semibold px-2">
                  <span>Home</span>
                  <span>Friends</span>
                  <div className="px-2 py-0.5 bg-gradient-to-r from-[#25F4EE] via-white to-[#FE2C55] rounded text-slate-950 font-bold">
                    +
                  </div>
                  <span>Inbox</span>
                  <span>Profile</span>
                </div>
              </div>
            </>
          )}

          {/* ===================== YOUTUBE SHORTS OVERLAY ===================== */}
          {platform === 'youtube' && (
            <>
              <div className="relative z-20 pt-8 px-4 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full text-[10px] backdrop-blur-xs">
                  <Music className="w-3 h-3" />
                  <span>Original Audio</span>
                </div>
                <MoreVertical className="w-4 h-4" />
              </div>

              {/* YouTube Shorts Right Action Bar */}
              <div className="relative z-20 self-end mr-3 flex flex-col items-center gap-4 text-white">
                <div className="flex flex-col items-center">
                  <ThumbsUp className="w-6 h-6 filter drop-shadow" />
                  <span className="text-[10px] font-semibold mt-0.5">34K</span>
                </div>
                <div className="flex flex-col items-center">
                  <ThumbsDown className="w-6 h-6 filter drop-shadow" />
                  <span className="text-[10px] font-semibold mt-0.5">Dislike</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-6 h-6 filter drop-shadow" />
                  <span className="text-[10px] font-semibold mt-0.5">2.1K</span>
                </div>
                <div className="flex flex-col items-center">
                  <Share2 className="w-6 h-6 filter drop-shadow" />
                  <span className="text-[10px] font-semibold mt-0.5">Share</span>
                </div>
                <div className="flex flex-col items-center">
                  <Repeat className="w-6 h-6 filter drop-shadow" />
                  <span className="text-[10px] font-semibold mt-0.5">Remix</span>
                </div>
              </div>

              {/* YouTube Shorts Bottom Info */}
              <div className="relative z-20 pb-4 px-3 space-y-2 text-white">
                <div className="flex items-center gap-2">
                  <img
                    src={channelAvatar}
                    alt="Channel"
                    className="w-7 h-7 rounded-full object-cover border border-white"
                  />
                  <span className="text-xs font-bold truncate">{channelHandle}</span>
                  <button
                    type="button"
                    className="px-2.5 py-0.5 rounded-full bg-white text-slate-900 text-[10px] font-bold"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-[11px] leading-snug line-clamp-2 text-slate-100">{fullCaption}</p>
              </div>
            </>
          )}

          {/* ===================== FACEBOOK REELS OVERLAY ===================== */}
          {platform === 'facebook' && (
            <>
              <div className="relative z-20 pt-8 px-4 flex items-center justify-between text-xs text-white">
                <span className="font-bold tracking-wider uppercase text-[11px]">Reels</span>
                <MoreVertical className="w-4 h-4" />
              </div>

              {/* FB Reels Right Action Bar */}
              <div className="relative z-20 self-end mr-3 flex flex-col items-center gap-4 text-white">
                <div className="flex flex-col items-center">
                  <Heart className="w-6 h-6 fill-white/20 filter drop-shadow" />
                  <span className="text-[10px] font-semibold mt-0.5">18K</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-6 h-6 filter drop-shadow" />
                  <span className="text-[10px] font-semibold mt-0.5">482</span>
                </div>
                <div className="flex flex-col items-center">
                  <Share2 className="w-6 h-6 filter drop-shadow" />
                  <span className="text-[10px] font-semibold mt-0.5">Share</span>
                </div>
              </div>

              {/* FB Reels Bottom Info */}
              <div className="relative z-20 pb-4 px-3 space-y-2 text-white">
                <div className="flex items-center gap-2">
                  <img
                    src={channelAvatar}
                    alt="Channel"
                    className="w-7 h-7 rounded-full object-cover border border-white"
                  />
                  <span className="text-xs font-bold truncate">{channelHandle}</span>
                  <span className="text-[10px] text-blue-300 font-semibold cursor-pointer">
                    · Follow
                  </span>
                </div>
                <p className="text-[11px] leading-snug line-clamp-2 text-slate-100">{fullCaption}</p>
                <div className="flex items-center gap-1 text-[9px] text-slate-300">
                  <Music className="w-3 h-3" />
                  <span>Original Audio - {channelHandle}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Audit note pill */}
      <div className="mt-3 max-w-[320px] p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-center text-[11px] text-slate-500">
        <span>
          {language === 'zh'
            ? '🔍 拟真预览：实际展示效果以各平台官方审核通过后为准'
            : '🔍 Live Simulation: Previews are pixel-perfect approximations.'}
        </span>
      </div>
    </div>
  );
};
