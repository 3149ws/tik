import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Play,
  CheckCircle2,
  Calendar,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const { t, language } = useLanguage();
  const { setActivePage } = useApp();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-pink-200/20 blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-semibold text-indigo-900 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
            <span>{t.heroBadge}</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            {t.heroTitlePrefix}{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 bg-clip-text text-transparent">
              {t.heroTitleHighlight}
            </span>{' '}
            {t.heroTitleSuffix}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <span>{t.heroCtaStart}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePage('planning')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-xs transition-all hover:border-slate-300 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span>{t.heroCtaDemo}</span>
            </button>
          </div>

          {/* Trust Metrics Pill */}
          <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{language === 'zh' ? '全自动智能排版' : 'Automated Smart Formatting'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{language === 'zh' ? '一键统一管理多平台' : 'One-Click Matrix Management'}</span>
            </div>
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{language === 'zh' ? '解放双手 专注创作' : 'Focus on Content Creation'}</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Floating Console Mockup */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto relative">
          <div className="rounded-3xl bg-slate-900 p-2 sm:p-4 shadow-2xl border border-slate-800 shadow-indigo-500/10">
            {/* Top Browser Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="ml-2 font-mono text-[11px] text-slate-400">
                  app.yunina.com/matrix/planning
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800">
                  Matrix Scheduler: Connected (Active)
                </span>
              </div>
            </div>

            {/* Dashboard Inner Visual */}
            <div className="bg-slate-950 rounded-2xl p-4 sm:p-6 text-white grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Planning Column */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs sm:text-sm font-semibold">
                      {language === 'zh' ? '矩阵日历排期队列 (Aug 18 - 22)' : 'Scheduled Matrix Queue (Aug 18 - 22)'}
                    </span>
                  </div>
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full font-medium border border-indigo-500/30">
                    {language === 'zh' ? '已排期 5 篇短视频' : '5 Posts Scheduled'}
                  </span>
                </div>

                {/* Simulated Post Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-start gap-3 hover:border-indigo-500/50 transition-colors">
                    <img
                      src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=120&auto=format&fit=crop&q=80"
                      alt="Thumbnail"
                      className="w-14 h-18 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Aug 19, 11:00 AM
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        身体怕冷多揉三阳 #中医 #tcm
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium">
                          TikTok
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 text-[10px] font-medium">
                          YouTube Shorts
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-start gap-3 hover:border-indigo-500/50 transition-colors">
                    <img
                      src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=120&auto=format&fit=crop&q=80"
                      alt="Thumbnail"
                      className="w-14 h-18 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                        <span className="text-[10px] text-indigo-400 font-mono">
                          Aug 18, 11:30 AM (Published)
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        手掌七星穴口诀#易水百会
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-amber-400 font-mono">
                          🔥 14.2K Views
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          +120 Followers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dispatch Progress bar indicator */}
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300">
                      {language === 'zh'
                        ? '智能排版引擎: 自动适配多平台视频规范 | 一键分发'
                        : 'Smart Formatting Engine: Multi-Platform Specs Auto-Adapted'}
                    </span>
                  </div>
                  <span className="text-emerald-400 font-semibold font-mono">READY TO DISPATCH</span>
                </div>
              </div>

              {/* Right Mini Matrix Stats (Metricool Style) */}
              <div className="lg:col-span-4 bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'zh' ? '多平台流量汇总' : 'Matrix Performance'}
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">97.99K</div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span>↑ +21.4% this week</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                  <div className="flex justify-between text-slate-400">
                    <span>TikTok (@lideming17)</span>
                    <span className="text-white font-mono font-medium">1,012 Fans</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>YT Shorts (@TCMHealth)</span>
                    <span className="text-white font-mono font-medium">45.8K Subs</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>FB Reels (The Store UK)</span>
                    <span className="text-white font-mono font-medium">97.9K Likes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
