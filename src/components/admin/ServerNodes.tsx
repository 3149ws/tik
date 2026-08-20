import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Globe2, Activity, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';

export const ServerNodes: React.FC = () => {
  const { t, language } = useLanguage();
  const { serverNodes } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <h3 className="text-base font-bold text-white">
              {language === 'zh'
                ? '全球海外纯净住宅 IP 直发集群'
                : 'Global Overseas Clean Residential IP Dispatch Cluster'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {language === 'zh'
              ? '节点直接绑定当地运营商原生住宅网络，专线直连 TikTok / YouTube / Meta 数据中心，消除梯子跳 IP 限流风险。'
              : 'Directly bound to local tier-1 residential carrier networks, eliminating proxy pollution.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
            Cluster Health: 100%
          </span>
        </div>
      </div>

      {/* Nodes Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Node Name & Identifier</th>
                <th className="py-3 px-4">Region / Location</th>
                <th className="py-3 px-4">IP Type & Reputation</th>
                <th className="py-3 px-4">Latency Ping</th>
                <th className="py-3 px-4">Active Dispatches</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {serverNodes.map((node) => (
                <tr key={node.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-indigo-600" />
                    <span>{node.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{node.region}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-700 text-[11px]">{node.ipAddress}</div>
                    <span className="text-[10px] text-emerald-600 font-semibold font-mono">
                      {node.ipReputation}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    <span className="text-emerald-600">{node.latencyMs} ms</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                    {node.activeDispatches} active streams
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                      {node.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
