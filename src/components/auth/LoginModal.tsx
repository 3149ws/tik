import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { YuninaLogo } from '../common/YuninaLogo';
import {
  Layers,
  X,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Info,
  QrCode,
  Smartphone,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { t, language } = useLanguage();
  const { login, setActivePage } = useApp();

  const [activeTab, setActiveTab] = useState<'password' | 'qrcode' | 'sso'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // QR Code state
  const [qrCountdown, setQrCountdown] = useState(120);
  const [qrState, setQrState] = useState<'waiting' | 'scanned' | 'success'>('waiting');

  useEffect(() => {
    if (isOpen) {
      setQrCountdown(120);
      setQrState('waiting');
      setErrorMessage(null);
      setSocialNotice(null);
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (!isOpen || activeTab !== 'qrcode' || qrState !== 'waiting') return;
    const timer = setInterval(() => {
      setQrCountdown((prev) => (prev > 1 ? prev - 1 : 120));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, activeTab, qrState]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSocialNotice(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage(language === 'zh' ? '请输入账号和密码' : 'Please enter both username/email and password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(identifier, password);
      setIsLoading(false);

      if (res.success) {
        onClose();
        if (res.role === 'super_admin') {
          setActivePage('admin');
        } else {
          setActivePage('planning');
        }
      } else {
        setErrorMessage(res.message || t.loginInvalid);
      }
    }, 400);
  };

  const handleSimulateQrLogin = () => {
    setQrState('scanned');
    setTimeout(() => {
      setQrState('success');
      // Login with default creator
      login('admin', '20050608ws');
      setTimeout(() => {
        onClose();
        setActivePage('planning');
      }, 800);
    }, 1000);
  };

  const handleSocialLogin = (platformName: string) => {
    setErrorMessage(null);
    setSocialNotice(
      language === 'zh'
        ? `${platformName} 快捷登录需开通企业版授权。请使用已分配的账号密码或扫码登录。`
        : `${platformName} login requires an authorized enterprise account. Please sign in with your assigned credentials or QR code.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5 flex flex-col items-center">
          <div className="mb-3">
            <YuninaLogo size="xl" showText={true} />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.loginSubtitle}</p>
        </div>

        {/* Navigation Tabs (Password vs QR Code vs SSO) */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'password'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                : 'hover:text-slate-900'
            }`}
          >
            {t.loginTabPassword}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qrcode')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeTab === 'qrcode'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                : 'hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t.loginTabQrCode}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sso')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'sso'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                : 'hover:text-slate-900'
            }`}
          >
            {t.loginTabSso}
          </button>
        </div>

        {/* ================= TAB 1: QR CODE LOGIN ================= */}
        {activeTab === 'qrcode' && (
          <div className="text-center py-2 space-y-4">
            <div className="relative w-44 h-44 bg-white p-3 rounded-2xl border-2 border-indigo-100 shadow-md mx-auto flex items-center justify-center overflow-hidden">
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

                <rect x="36" y="8" width="6" height="6" fill="#1e293b" />
                <rect x="48" y="8" width="8" height="6" fill="#4f46e5" />
                <rect x="36" y="20" width="8" height="6" fill="#1e293b" />
                <rect x="8" y="36" width="6" height="6" fill="#1e293b" />
                <rect x="20" y="44" width="8" height="6" fill="#4f46e5" />
                <rect x="68" y="36" width="8" height="6" fill="#1e293b" />
                <rect x="80" y="44" width="8" height="6" fill="#4f46e5" />
                <rect x="36" y="68" width="6" height="6" fill="#1e293b" />
                <rect x="48" y="76" width="8" height="8" fill="#4f46e5" />
                <rect x="68" y="72" width="12" height="12" fill="#1e293b" />

                <circle cx="50" cy="50" r="12" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                <rect x="46" y="46" width="8" height="8" rx="2" fill="#4f46e5" />
              </svg>

              {qrState === 'scanned' && (
                <div className="absolute inset-0 bg-indigo-900/85 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-2 animate-in fade-in">
                  <Smartphone className="w-8 h-8 animate-bounce mb-1" />
                  <span className="text-xs font-bold">{t.loginQrScanned}</span>
                </div>
              )}

              {qrState === 'success' && (
                <div className="absolute inset-0 bg-emerald-900/90 backdrop-blur-xs flex flex-col items-center justify-center text-white text-center p-2 animate-in fade-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-300 mb-1" />
                  <span className="text-xs font-bold">{t.loginQrSuccess}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {t.loginQrScanDesc}
            </p>

            <button
              type="button"
              onClick={handleSimulateQrLogin}
              disabled={qrState !== 'waiting'}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>{t.loginQrSimulate}</span>
            </button>
          </div>
        )}

        {/* ================= TAB 2: PASSWORD LOGIN ================= */}
        {activeTab === 'password' && (
          <div>
            {/* Error Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="font-semibold">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'zh' ? '邮箱账号 / 用户名' : 'Email or Username'}
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t.loginEmailPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {language === 'zh' ? '登录密码' : 'Password'}
                  </label>
                  <span className="text-[11px] text-indigo-600 hover:underline cursor-pointer">
                    {t.loginForgot}
                  </span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.loginPasswordPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{t.loginSubmit}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 3: ENTERPRISE SSO ================= */}
        {activeTab === 'sso' && (
          <div className="space-y-3 py-2">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google Workspace SSO')}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{t.loginWithGoogle}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Meta / Facebook Work')}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-all hover:border-slate-300"
            >
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>{t.loginWithFacebook}</span>
            </button>

            {socialNotice && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 animate-in fade-in">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{socialNotice}</span>
              </div>
            )}
          </div>
        )}

        {/* Footer info & switch to register */}
        <div className="mt-6 text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span>{t.loginNoAccount} </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
          >
            {t.loginRegisterLink}
          </button>
        </div>
      </div>
    </div>
  );
};
