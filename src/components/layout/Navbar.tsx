import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Plus,
  Zap,
  Menu,
  X,
  Radio,
} from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onOpenRegister }) => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, logout, activePage, setActivePage } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const isPublicPage = ['landing', 'pricing', 'api-docs', 'privacy', 'terms'].includes(activePage);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs transition-colors">
      {/* Top Banner Notice for Compliance & Overseas Dispatch */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-medium text-slate-200">
          {language === 'zh'
            ? '支持 TikTok / YouTube Shorts / Facebook Reels'
            : 'TikTok, YouTube Shorts & FB Reels Ready'}
        </span>
        <span className="hidden sm:inline text-slate-500">|</span>
        <button
          onClick={() => setActivePage('api-docs')}
          className="hidden sm:inline text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
        >
          {language === 'zh' ? '查看 API 审核合规说明 →' : 'View API Audit Compliance →'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActivePage('landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                Y
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">
                {t.brandName}
              </span>
            </button>

            {/* Public Links */}
            {isPublicPage && (
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
                <button
                  onClick={() => {
                    setActivePage('landing');
                    setTimeout(() => {
                      document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {t.navFeatures}
                </button>
                <button
                  onClick={() => {
                    setActivePage('landing');
                    setTimeout(() => {
                      document.getElementById('platforms-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {t.navPlatforms}
                </button>
                <button
                  onClick={() => setActivePage('pricing')}
                  className={`hover:text-indigo-600 transition-colors ${
                    activePage === 'pricing' ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  {t.navPricing}
                </button>
                <button
                  onClick={() => setActivePage('api-docs')}
                  className={`hover:text-indigo-600 transition-colors ${
                    activePage === 'api-docs' ? 'text-indigo-600 font-semibold' : ''
                  }`}
                >
                  {t.navApiDocs}
                </button>
              </nav>
            )}
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Active Quota Pill */}
            {currentUser && (
              <div className="bg-slate-100 rounded-full px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200 hidden sm:block">
                {language === 'zh' ? '已连接席位' : 'Active Channels'}: {currentUser.channelsUsed}/{currentUser.channelsQuota}
              </div>
            )}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-widest px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              title="Switch Language / 切换语言"
            >
              {language === 'en' ? 'EN / 中文' : '中文 / EN'}
            </button>

            {currentUser ? (
              // Logged in User Bar
              <div className="flex items-center gap-3">
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {currentUser.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] font-bold text-slate-600 uppercase bg-slate-100 px-2 py-0.5 rounded">
                            {currentUser.plan}
                          </span>
                          {currentUser.role === 'super_admin' && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                              SUPER ADMIN
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActivePage('planning');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 text-xs font-medium"
                      >
                        <Layers className="w-4 h-4 text-indigo-600" />
                        <span>{t.tabPlanning}</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePage('channels');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 text-xs font-medium"
                      >
                        <Radio className="w-4 h-4 text-indigo-600" />
                        <span>{t.tabChannels}</span>
                      </button>

                      {currentUser.role === 'super_admin' && (
                        <button
                          onClick={() => {
                            setActivePage('admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 font-semibold flex items-center gap-2 text-xs"
                        >
                          <ShieldCheck className="w-4 h-4 text-rose-600" />
                          <span>{t.adminTitle}</span>
                        </button>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 text-xs font-semibold"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>{t.navLogout}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Public Auth Actions
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {t.navLogin}
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all hover:shadow"
                >
                  {t.navGetStarted}
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-2 text-sm font-medium text-slate-700">
            <button
              onClick={() => {
                setActivePage('landing');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              {t.navFeatures}
            </button>
            <button
              onClick={() => {
                setActivePage('pricing');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              {t.navPricing}
            </button>
            <button
              onClick={() => {
                setActivePage('api-docs');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              {t.navApiDocs}
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  setActivePage('planning');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-3 rounded-lg bg-indigo-50 text-indigo-700 font-semibold"
              >
                {t.navDashboard}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export const DashboardNav: React.FC = () => {
  const { t, language } = useLanguage();
  const { activePage, setActivePage, currentUser } = useApp();

  const tabs = [
    { id: 'planning', label: t.tabPlanning },
    { id: 'compose', label: t.tabCompose },
    { id: 'analytics', label: t.tabAnalytics },
    { id: 'channels', label: t.tabChannels },
    { id: 'inbox', label: t.tabInbox },
  ];

  if (currentUser?.role === 'super_admin') {
    tabs.push({ id: 'admin', label: t.tabAdmin });
  }

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
          {/* Main sleek navigation tabs */}
          <nav className="flex items-center gap-8 text-sm font-medium text-slate-500">
            {tabs.map((tab) => {
              const isActive = activePage === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePage(tab.id)}
                  className={`py-4 transition-colors flex items-center gap-1.5 relative ${
                    isActive
                      ? 'text-indigo-600 font-bold border-b-2 border-indigo-600'
                      : 'hover:text-indigo-600 text-slate-600'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.id === 'inbox' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick status node */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium">
                {language === 'zh'
                  ? '直发 IP 状态: 纯净原生住宅'
                  : 'Dispatch Node: Clean Residential'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
