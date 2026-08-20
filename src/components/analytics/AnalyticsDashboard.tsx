import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  BarChart2,
  Globe2,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { posts, channels } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const totalViews = posts.reduce((acc, p) => acc + (p.viewsCount || 0), 0) + 97990;
  const totalFollowers = channels.reduce((acc, c) => acc + c.followers, 0);
  const totalLikes = posts.reduce((acc, p) => acc + (p.likesCount || 0), 0) + 9250;

  // Chart data simulation
  const chartPoints = [
    { day: 'Aug 12', views: 8200, tiktok: 4500, yt: 2100, fb: 1600 },
    { day: 'Aug 13', views: 11400, tiktok: 6800, yt: 2900, fb: 1700 },
    { day: 'Aug 14', views: 9800, tiktok: 5200, yt: 3100, fb: 1500 },
    { day: 'Aug 15', views: 16500, tiktok: 9800, yt: 4200, fb: 2500 },
    { day: 'Aug 16', views: 24200, tiktok: 14500, yt: 5800, fb: 3900 },
    { day: 'Aug 17', views: 18900, tiktok: 11200, yt: 4600, fb: 3100 },
    { day: 'Aug 18', views: 28600, tiktok: 17400, yt: 6800, fb: 4400 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.analyticsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.analyticsSubtitle}</p>
        </div>

        {/* Date Filter */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === '7d' ? 'bg-white text-slate-900 shadow-xs font-bold' : ''
            }`}
          >
            {language === 'zh' ? '近 7 天' : 'Last 7 Days'}
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === '30d' ? 'bg-white text-slate-900 shadow-xs font-bold' : ''
            }`}
          >
            {language === 'zh' ? '近 30 天' : 'Last 30 Days'}
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === '90d' ? 'bg-white text-slate-900 shadow-xs font-bold' : ''
            }`}
          >
            {language === 'zh' ? '近 90 天' : 'Last 90 Days'}
          </button>
        </div>
      </div>

      {/* Metricool Style KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Views */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.analyticsTotalViews}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            {totalViews.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+28.4% vs last period</span>
          </div>
        </div>

        {/* Followers Gain */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.analyticsFollowersGain}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            {totalFollowers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+1,420 new fans</span>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.analyticsAvgEngagement}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">8.42%</div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+1.2% industry benchmark</span>
          </div>
        </div>

        {/* Dispatches */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.analyticsPublishedVideos}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            {posts.length} {language === 'zh' ? '篇' : 'Posts'}
          </div>
          <div className="flex items-center gap-1 text-xs text-indigo-600 font-semibold mt-2">
            <Globe2 className="w-3.5 h-3.5" />
            <span>100% Clean IP Dispatch</span>
          </div>
        </div>
      </div>

      {/* Main Growth Curve & Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{t.analyticsViewsOverTime}</h3>
            <p className="text-xs text-slate-500">
              {language === 'zh' ? '跨渠道每日矩阵播放量变化曲线' : 'Daily consolidated views across connected channels'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
              <span>TikTok (62%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>YouTube Shorts (24%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>Facebook Reels (14%)</span>
            </div>
          </div>
        </div>

        {/* Visual Simulated SVG Chart */}
        <div className="h-64 w-full relative flex items-end justify-between gap-2 pt-8 pb-4 border-b border-slate-200">
          {chartPoints.map((pt, idx) => {
            const heightPct = (pt.views / 30000) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono py-1 px-2 rounded-lg mb-1.5 pointer-events-none">
                  {pt.views.toLocaleString()} views
                </div>
                <div
                  className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-indigo-600 via-purple-500 to-rose-400 group-hover:brightness-110 transition-all cursor-pointer shadow-sm"
                  style={{ height: `${heightPct}%` }}
                ></div>
                <span className="text-[11px] font-medium text-slate-500 mt-2">{pt.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performing Matrix Posts Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">{t.analyticsTopPerforming}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Video Title & Content</th>
                <th className="pb-3">Platforms</th>
                <th className="pb-3">Views</th>
                <th className="pb-3">Likes</th>
                <th className="pb-3">Engagement Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 flex items-center gap-3">
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-10 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{post.title}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{post.caption}</div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <div className="flex gap-1">
                      {post.targetPlatforms.map((plat) => (
                        <span
                          key={plat}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase"
                        >
                          {plat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 font-bold font-mono text-indigo-600">
                    {post.viewsCount?.toLocaleString() || '14,200'}
                  </td>
                  <td className="py-3.5 font-mono text-slate-700">
                    {post.likesCount?.toLocaleString() || '1,240'}
                  </td>
                  <td className="py-3.5 font-bold text-emerald-600 font-mono">9.2%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
