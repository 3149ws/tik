import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { YuninaLogo } from '../common/YuninaLogo';
import { Layers, ShieldCheck, Mail, Globe, ExternalLink, Lock, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { setActivePage } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <YuninaLogo size="lg" variant="light" showText={true} />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.brandDescription}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>
                  {language === 'zh'
                    ? '解放双手 · 智能排版'
                    : 'Smart Formatting & Automation'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {language === 'zh'
                    ? '官方 API 认证提审标准'
                    : 'Official Tier-1 API Standard'}
                </span>
              </div>
            </div>
          </div>

          {/* Product Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {language === 'zh' ? '产品矩阵' : 'Product & Workspace'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setActivePage('planning')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t.tabPlanning}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('compose')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t.tabCompose}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('channels')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t.tabChannels}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('analytics')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t.tabAnalytics}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('pricing')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {t.navPricing}
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Platforms & Tech */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {language === 'zh' ? '支持平台与 API' : 'Supported APIs'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>TikTok Content Posting API</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Meta Graph API (FB Reels)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span>YouTube Data API v3 (Shorts)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                <span>Instagram Graph API</span>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('api-docs')}
                  className="text-indigo-400 hover:underline text-xs flex items-center gap-1 mt-2 font-medium cursor-pointer"
                >
                  <span>{t.navApiDocs}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              {language === 'zh' ? '合规与支持' : 'Trust & Legal'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setActivePage('privacy')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {language === 'zh' ? '隐私政策 (Privacy Policy)' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('terms')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {language === 'zh' ? '服务条款 (Terms of Service)' : 'Terms of Service'}
                </button>
              </li>
              <li className="pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300 mb-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold">support@yunina.com</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {language === 'zh'
                    ? '多平台短视频智能调度与创作者技术支持'
                    : '24/7 Creator Technical Support'}
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Yunina SaaS Workspace. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>TikTok / Meta / YouTube are trademarks of their respective owners.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
