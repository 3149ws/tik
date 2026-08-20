import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar, DashboardNav } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { PlatformsBar } from './components/landing/PlatformsBar';
import { FeaturesGrid } from './components/landing/FeaturesGrid';
import { DynamicPricing } from './components/landing/DynamicPricing';
import { FaqSection } from './components/landing/FaqSection';
import { ComposeEditor } from './components/compose/ComposeEditor';
import { CalendarView } from './components/planning/CalendarView';
import { ChannelsManager } from './components/channels/ChannelsManager';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { UnifiedInbox } from './components/inbox/UnifiedInbox';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ApiDocs } from './components/legal/ApiDocs';
import { PrivacyPolicy, TermsOfService } from './components/legal/PrivacyPolicy';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activePage, setActivePage, currentUser } = useApp();
  const { language } = useLanguage();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  useEffect(() => {
    document.title = language === 'zh'
      ? 'Yunina Matrix - 跨平台短视频智能排版与矩阵调度 SaaS'
      : 'Yunina Matrix - Multi-Platform Short Video Management SaaS';
  }, [language]);

  const isDashboardView = ['planning', 'compose', 'channels', 'analytics', 'inbox', 'admin'].includes(
    activePage
  );

  const handleOpenLogin = () => {
    setRegisterModalOpen(false);
    setLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar onOpenLogin={handleOpenLogin} onOpenRegister={handleOpenRegister} />

      {/* Sub Navigation for Dashboard */}
      {isDashboardView && currentUser && <DashboardNav />}

      {/* Main Page Routing */}
      <main className="flex-1">
        {activePage === 'landing' && (
          <div>
            <HeroSection onGetStarted={handleOpenRegister} />
            <PlatformsBar />
            <FeaturesGrid />
            <DynamicPricing onSelectPlan={() => setActivePage('compose')} />
            <FaqSection />
          </div>
        )}

        {activePage === 'pricing' && (
          <div className="py-6">
            <DynamicPricing onSelectPlan={() => setActivePage('compose')} />
            <FaqSection />
          </div>
        )}

        {activePage === 'planning' && <CalendarView />}
        {activePage === 'compose' && <ComposeEditor />}
        {activePage === 'channels' && <ChannelsManager />}
        {activePage === 'analytics' && <AnalyticsDashboard />}
        {activePage === 'inbox' && <UnifiedInbox />}

        {/* Admin Protection Guard */}
        {activePage === 'admin' && (
          currentUser?.role === 'super_admin' ? (
            <AdminDashboard />
          ) : (
            <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-rose-200 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {language === 'zh' ? '403 访问受限 - 需要超级管理员权限' : '403 Access Denied - Admin Role Required'}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                {language === 'zh'
                  ? '管理控制台 (/admin) 和全站 API 密钥配置面板仅面向超级管理员账号 (admin / 20050608ws) 开放。普通创作者账号已严格隔离。'
                  : 'The admin dashboard (/admin) and global API credentials console are strictly reserved for Super Administrator accounts. Access restricted for creators.'}
              </p>
              <button
                onClick={() => setActivePage('planning')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{language === 'zh' ? '返回创作工作台' : 'Back to Workspace'}</span>
              </button>
            </div>
          )
        )}

        {activePage === 'api-docs' && <ApiDocs />}
        {activePage === 'privacy' && <PrivacyPolicy />}
        {activePage === 'terms' && <TermsOfService />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToRegister={handleOpenRegister}
      />

      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSwitchToLogin={handleOpenLogin}
      />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;
