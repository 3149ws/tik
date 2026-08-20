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
        {activePage === 'admin' && <AdminDashboard />}

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
