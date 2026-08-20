import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, Lock, ExternalLink, Code2, Globe2, CheckCircle2 } from 'lucide-react';

export const ApiDocs: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Developer Tier-1 Audit Compliance</span>
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'zh'
            ? 'Yunina 官方 API 对接与提审合规说明文档'
            : 'Yunina API Audit & Integration Specifications'}
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          {language === 'zh'
            ? '本规范由 Yunina 架构技术团队维护，旨在向 TikTok Developer Platform、Meta for Developers 及 Google Cloud Console 审核团队披露本平台所使用的权限范围、数据流转及隐私保护机制。'
            : 'Technical audit specifications and scope disclosure for TikTok Content Posting API, Meta Graph API, and YouTube Data API v3.'}
        </p>
      </div>

      {/* TikTok Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs">
            TT
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">TikTok Content Posting API (v2)</h2>
            <span className="text-xs text-slate-400 font-mono">Scope: video.upload, video.publish</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Yunina strictly obeys TikTok's direct publishing compliance rules. For each video upload transaction, the client applet mandates:
        </p>

        <ul className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono">
          <li>• <strong className="text-slate-900">privacy_level:</strong> PUBLIC_TO_EVERYONE, MUTUAL_FOLLOW_FRIENDS, SELF_ONLY</li>
          <li>• <strong className="text-slate-900">disable_comment:</strong> boolean</li>
          <li>• <strong className="text-slate-900">disable_duet:</strong> boolean</li>
          <li>• <strong className="text-slate-900">disable_stitch:</strong> boolean</li>
          <li>• <strong className="text-slate-900">video_cover_timestamp_ms:</strong> number</li>
          <li>• <strong className="text-slate-900">is_ai_generated:</strong> boolean (Mandatory AI Disclosure)</li>
          <li>• <strong className="text-slate-900">brand_content_toggle:</strong> boolean (Commercial Content Labeling)</li>
        </ul>
      </div>

      {/* Meta Facebook Reels Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            FB
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Meta Graph API & Instagram Reels API</h2>
            <span className="text-xs text-slate-400 font-mono">Scope: pages_manage_posts, instagram_content_publish</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Short videos targeted for Facebook Pages and Instagram Reels are published through official graph endpoints via two-phase resumable video upload protocol with dedicated clean overseas residential IP handshakes.
        </p>
      </div>

      {/* YouTube Shorts Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs">
            YT
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">YouTube Data API v3</h2>
            <span className="text-xs text-slate-400 font-mono">Scope: https://www.googleapis.com/auth/youtube.upload</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          YouTube Shorts uploads strictly enforce COPPA compliance ("Made for Kids" declaration), categorization, and public/unlisted/private visibility filters.
        </p>
      </div>

      {/* Overseas Clean IP Architecture Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400">
          <Globe2 className="w-5 h-5" />
          <h2 className="text-base font-bold text-white">
            {language === 'zh'
              ? '海外独立纯净 IP 直发技术白皮书概要'
              : 'Dedicated Clean IP Node Technical Architecture'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {language === 'zh'
            ? '传统多账号分发常因公用代理网络导致 IP 污染和关联限流。Yunina 将每个经过授权的频道与当地运营商（如 AT&T, Deutsche Telekom, Singtel）住宅纯净节点 1:1 独立绑定，发帖请求全部通过本地网关直达，保障账号资产的长期健康稳定。'
            : 'Traditional matrix distribution often suffers from blacklisted shared proxies. Yunina binds each authorized channel seat 1:1 to dedicated local residential nodes (AT&T, Deutsche Telekom, Singtel), ensuring long-term channel health.'}
        </p>
      </div>
    </div>
  );
};
