import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { UserManagement } from './UserManagement';
import { ApiSettings } from './ApiSettings';
import { PricingManager } from './PricingManager';
import { ServerNodes } from './ServerNodes';
import {
  ShieldCheck,
  Users,
  Radio,
  Send,
  Activity,
  Key,
  DollarSign,
  Server,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { usersList, channels, posts, serverNodes } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'api' | 'pricing' | 'nodes'>('users');

  const totalUsers = usersList.length;
  const pendingUsers = usersList.filter((u) => u.status === 'pending').length;
  const totalChannels = usersList.reduce((acc, u) => acc + u.channelsUsed, 0) + 12;

  const tabs = [
    { id: 'users' as const, label: t.adminTabUsers, icon: <Users className="w-4 h-4" /> },
    { id: 'api' as const, label: t.adminTabApi, icon: <Key className="w-4 h-4" /> },
    { id: 'pricing' as const, label: t.adminTabPricing, icon: <DollarSign className="w-4 h-4" /> },
    { id: 'nodes' as const, label: t.adminTabNodes, icon: <Server className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-100 text-rose-700 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.adminTitle}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.adminSubtitle}</p>
        </div>

        {pendingUsers > 0 && (
          <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-xs text-amber-900 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>
              {pendingUsers} {language === 'zh' ? '个新用户待审核开通配额' : 'pending user approvals'}
            </span>
          </div>
        )}
      </div>

      {/* Admin Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.adminTotalUsers}
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono mt-1">{totalUsers}</div>
          <span className="text-xs text-indigo-600 font-semibold">
            {pendingUsers} pending activation
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.adminActiveChannelsTotal}
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono mt-1">{totalChannels}</div>
          <span className="text-xs text-emerald-600 font-semibold">Across 4 Social Platforms</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.adminDailyDispatches}
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono mt-1">1,420</div>
          <span className="text-xs text-purple-600 font-semibold">0 Shadowbans / 100% Success</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.adminNodeHealth}
          </span>
          <div className="text-3xl font-black text-emerald-600 font-mono mt-1">100%</div>
          <span className="text-xs text-emerald-700 font-semibold">4 Overseas Nodes Online</span>
        </div>
      </div>

      {/* Admin Tab Controller */}
      <div className="border-b border-slate-200">
        <div className="flex space-x-2 sm:space-x-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  isActive
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'api' && <ApiSettings />}
        {activeTab === 'pricing' && <PricingManager />}
        {activeTab === 'nodes' && <ServerNodes />}
      </div>
    </div>
  );
};
