import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-slate-800">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">
          {language === 'zh' ? 'Yunina 隐私政策 (Privacy Policy)' : 'Yunina Privacy Policy'}
        </h1>
        <p className="text-xs text-slate-500 mt-2 font-mono">Last Updated: August 18, 2026</p>
      </div>

      <div className="prose prose-sm max-w-none space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <p>
          At <strong>Yunina</strong>, we respect and protect the privacy of creators, agencies, and enterprise matrix operators. This Privacy Policy details how we collect, store, and utilize information when you connect and manage your social channels across TikTok, Meta (Facebook & Instagram), and YouTube.
        </p>

        <h3 className="text-base font-bold text-slate-900 mt-6">1. Information We Collect</h3>
        <p>
          We only collect essential account identifiers through official OAuth 2.0 protocol authorization tokens. We never ask for or store your raw account passwords. Token credentials are encrypted using AES-256 in dedicated secure vaults.
        </p>

        <h3 className="text-base font-bold text-slate-900 mt-6">2. Use of Official Third-Party APIs</h3>
        <p>
          Yunina acts solely as an authorized scheduling conduit. Content created and scheduled by you is dispatched directly via official API endpoints (TikTok Content Posting API, Meta Graph API, YouTube Data API v3). We do not sell, rent, or transfer your video assets or analytics to third parties.
        </p>

        <h3 className="text-base font-bold text-slate-900 mt-6">3. Overseas Clean Residential Dispatch Nodes</h3>
        <p>
          When you schedule or publish short video assets, requests are transmitted over encrypted TLS 1.3 channels through dedicated overseas clean IP proxy nodes. Network routing logs are maintained solely for latency diagnostics and compliance security audits.
        </p>

        <h3 className="text-base font-bold text-slate-900 mt-6">4. Data Deletion and Revocation</h3>
        <p>
          You may disconnect any social channel at any time via the "Channels" tab. Upon disconnection, stored authorization tokens are permanently purged from our database immediately.
        </p>

        <h3 className="text-base font-bold text-slate-900 mt-6">5. Contact Information</h3>
        <p>
          For privacy inquiries or compliance requests, please email us at <strong className="text-indigo-600">privacy@yunina.com</strong>.
        </p>
      </div>
    </div>
  );
};

export const TermsOfService: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-slate-800">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">
          {language === 'zh' ? 'Yunina 服务条款 (Terms of Service)' : 'Yunina Terms of Service'}
        </h1>
        <p className="text-xs text-slate-500 mt-2 font-mono">Last Updated: August 18, 2026</p>
      </div>

      <div className="prose prose-sm max-w-none space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <p>
          Welcome to <strong>Yunina</strong> ("Platform"). By accessing our workspace, connecting social media channels, or subscribing to our per-channel matrix packages, you agree to be bound by these Terms of Service.
        </p>

        <h3 className="text-base font-bold text-slate-900 mt-6">1. Platform Compliance & User Responsibility</h3>
        <p>
          Users must strictly adhere to the Community Guidelines and Terms of Service of connected platforms, including TikTok Community Guidelines, Meta Platform Terms, and YouTube Community Guidelines. Dissemination of prohibited, copyright-infringing, or abusive content is strictly forbidden.
        </p>

        <h3 className="text-base font-bold text-slate-900 mt-6">2. Per-Channel License Quotas</h3>
        <p>
          Subscribers are allocated a set quota of active channel seats (billed at $7.00 USD/month or $5.60 USD/month on annual billing). Each channel seat permits unlimited scheduled short video dispatches during the active license duration.
        </p>

        <h3 className="text-base font-bold text-slate-900 mt-6">3. Account Activation & Node Allocation</h3>
        <p>
          To maintain high dispatch IP reputation and eliminate proxy pollution, new accounts undergo administrative quota provisioning before activation.
        </p>
      </div>
    </div>
  );
};
