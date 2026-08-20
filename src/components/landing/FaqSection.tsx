import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { language } = useLanguage();

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: language === 'zh' ? 'Yunina 如何为创作者提供稳定的短视频分发体验？' : 'How does Yunina ensure reliable short video dispatch for creators?',
      a: language === 'zh'
        ? 'Yunina 拥有部署在美西（硅谷）、美东（弗吉尼亚）、欧洲（法兰克福）等地的分布式高可用调度节点。创作者在工作台上传视频后，系统直接调用 TikTok、YouTube、Meta 官方 API 进行精准定时排期与分发发布，告别手动操作的不稳定性。'
        : 'Yunina utilizes dedicated direct carrier-grade cloud dispatch nodes deployed in Silicon Valley, Virginia, Frankfurt, and Tokyo. Your videos are queued and dispatched through official APIs.',
    },
    {
      q: language === 'zh' ? '系统是否完全符合 TikTok Content Posting API 及 Meta 官方审核规范？' : 'Is Yunina fully compliant with official TikTok and Meta Developer API audit policies?',
      a: language === 'zh'
        ? '是的。Yunina 严格遵循 TikTok Content Posting API v2 规范，在发帖编辑器中完整提供了公开范围 (Privacy Level)、评论/合拍/拼接开关 (Allow comments/Duet/Stitch)、以及必须填写的 AI 生成内容声明 (AI-generated disclosure) 和商业推广声明 (Commercial content declaration)。同时支持 YouTube COPPA 儿童声明及 Facebook Reels 规范。'
        : 'Yes. Yunina strictly adheres to Tier-1 API verification standards. The editor includes all mandatory TikTok audit compliance parameters (Privacy levels, Duet/Stitch toggles, AI-generated disclosure, commercial content tags) alongside YouTube COPPA and Meta Reels compliance controls.',
    },
    {
      q: language === 'zh' ? '什么是按账号席位（Per-Channel）灵活计费？' : 'How does the Per-Channel seat pricing work?',
      a: language === 'zh'
        ? '我们的定价为灵活的每账号 $7.00 USD/月（年付享 20% 折扣后低至 $5.60 USD/月）。每个账号席位可绑定一个 TikTok、YouTube Shorts 或 Facebook 页面，享有该账号的无限次短视频定时排期与统一互动功能。您可以随时根据矩阵规模增减席位。'
        : 'Pricing is billed at $7.00 USD / channel / month (or $5.60 USD / channel / month on annual plans with a 20% discount). Each channel seat includes unlimited video scheduling, mobile preview simulation, and unified inbox management.',
    },
    {
      q: language === 'zh' ? '支持哪些视频格式和分辨率要求？' : 'What video specifications and formats are supported?',
      a: language === 'zh'
        ? '支持标准的 9:16 竖屏短视频（MP4, MOV 编码），分辨率推荐 1080x1920，帧率 30fps/60fps，时长支持 5 秒至 10 分钟。系统在上传时会自动检测视频规格并生成高保真移动端真机预览。'
        : 'We support standard 9:16 vertical short video formats (MP4, MOV). Recommended resolution is 1080x1920 with duration from 5 seconds up to 10 minutes. Video duration and specs are verified automatically upon upload.',
    },
    {
      q: language === 'zh' ? '新账号注册后如何开通使用？' : 'How do new user registrations get activated?',
      a: language === 'zh'
        ? '为确保海外直发 IP 节点的高纯净度与独享带宽质量，普通用户注册后账号处于待审核激活（Pending）状态。管理员在后台配置分配账号席位配额与独立调度节点后即可立即登录使用。'
        : 'To ensure residential IP cleanliness and high bandwidth quality, new user accounts undergo administrator quota assignment. Once approved, all scheduling and dispatch tools are unlocked.',
    },
  ];

  return (
    <div className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
            {language === 'zh' ? '常见问题与合规答疑' : 'FAQ & Technical Support'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            {language === 'zh' ? '关于海外直发与 API 调度的常见问题' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/50 overflow-hidden transition-colors hover:border-slate-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
