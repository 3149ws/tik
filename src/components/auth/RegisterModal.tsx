import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { YuninaLogo } from '../common/YuninaLogo';
import { Layers, X, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { t, language } = useLanguage();
  const { register } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [channelsNeeded, setChannelsNeeded] = useState('5');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage(language === 'zh' ? '请填写完整信息' : 'Please fill in all required fields');
      return;
    }

    const res = register(name, email, password);
    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMessage(res.message || 'Registration failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="text-center mb-6 flex flex-col items-center">
              <div className="mb-3">
                <YuninaLogo size="xl" showText={true} />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.registerSubtitle}</p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'zh' ? '创作者 / 机构名称' : 'Creator / Agency Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.registerNamePlaceholder}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'zh' ? '工作邮箱' : 'Work Email Address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@yourbrand.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'zh' ? '预估托管矩阵账号数量' : 'Estimated Matrix Channels Needed'}
                </label>
                <select
                  value={channelsNeeded}
                  onChange={(e) => setChannelsNeeded(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                >
                  <option value="1">1 - 3 Channels (Starter)</option>
                  <option value="5">5 - 15 Channels (Pro Matrix)</option>
                  <option value="20">20+ Channels (Agency Scale)</option>
                  <option value="50">50+ Enterprise Dedicated Cluster</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'zh' ? '设置登录密码' : 'Create Password'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>{t.registerSubmit}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="mt-5 text-center text-xs text-slate-500">
              <span>{language === 'zh' ? '已有账号？' : 'Already have an account?'} </span>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-semibold text-indigo-600 hover:underline"
              >
                {t.navLogin}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{t.registerSuccessTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-sm mx-auto">
              {t.registerSuccessMsg}
            </p>
            <div className="mt-6 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-900">
              <div className="font-semibold flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>{language === 'zh' ? '账号激活须知' : 'Activation Notice'}</span>
              </div>
              <p className="text-amber-800 leading-normal">
                {language === 'zh'
                  ? '为保证海外纯净 IP 调度质量，新账号在管理员后台分配独立节点与席位配额后即可使用。'
                  : 'To guarantee overseas dispatch IP reputation, licenses are activated upon quota & residential node allocation.'}
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-6 w-full py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800"
            >
              {language === 'zh' ? '我知道了' : 'Got it'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
