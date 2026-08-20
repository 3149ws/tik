import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Sparkles,
  Smartphone,
  Calendar,
  Layers,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
      title: t.platformDirectDispatch,
      desc: t.platformDirectDispatchDesc,
      tag: language === 'zh' ? '智能提效' : 'Smart Workflow',
    },
    {
      icon: <Smartphone className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50',
      title: t.platformPhoneSimulation,
      desc: t.platformPhoneSimulationDesc,
      tag: language === 'zh' ? '1:1 真机拟真' : 'True-to-Life',
    },
    {
      icon: <Calendar className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: t.platformMatrixScheduling,
      desc: t.platformMatrixSchedulingDesc,
      tag: language === 'zh' ? '可视化矩阵' : 'Matrix Scheduler',
    },
    {
      icon: <Layers className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50',
      title: t.platformAuditCompliant,
      desc: t.platformAuditCompliantDesc,
      tag: language === 'zh' ? '一键聚合' : 'One-Click Matrix',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50',
      title: t.inboxTitle,
      desc: t.inboxSubtitle,
      tag: language === 'zh' ? '统一互动' : 'Unified Inbox',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-sky-600" />,
      bg: 'bg-sky-50',
      title: t.analyticsTitle,
      desc: t.analyticsSubtitle,
      tag: language === 'zh' ? '数据看板' : 'Growth Insights',
    },
  ];

  return (
    <div id="features-section" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
            {language === 'zh' ? '核心创作与调度能力' : 'Matrix Superpowers'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            {language === 'zh'
              ? '专为短视频创作者打造的智能排版与矩阵运营套件'
              : 'Engineered for High-Growth Short Video Creators & Teams'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            {language === 'zh'
              ? '告别多手机切换与机械手工搬运。一次编辑，多端自动排版与批量定时排期，解放双手专注打造优质内容。'
              : 'Say goodbye to repetitive manual uploading across devices. Automate formatting, schedule effortlessly, and focus on great storytelling.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-slate-50/70 hover:bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                    {f.icon}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === 'zh' ? '极简上手 · 自动化工作流' : 'Automated Workflow'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
