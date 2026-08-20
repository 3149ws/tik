import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { PostContent, PlatformType } from '../../types';
import { PostDetailModal } from './PostDetailModal';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Grid,
  List,
  Clock,
  Sparkles,
  CheckCircle2,
  Send,
  Eye,
  RotateCcw,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { t, language } = useLanguage();
  const { posts, setActivePage, setDraftSchedule } = useApp();

  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');
  const [selectedPost, setSelectedPost] = useState<PostContent | null>(null);

  // Dynamic Week State: initialize with Sunday of current week (2026-08-16)
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const d = new Date('2026-08-16T00:00:00');
    return isNaN(d.getTime()) ? new Date() : d;
  });

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() - 7);
      return next;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 7);
      return next;
    });
  };

  const handleToday = () => {
    const today = new Date('2026-08-19T00:00:00');
    const dayOfWeek = today.getDay(); // 0 is Sunday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    setCurrentWeekStart(startOfWeek);
  };

  // Generate 7 days of the selected week
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateNum = String(d.getDate()).padStart(2, '0');
    const fullDate = `${year}-${month}-${dateNum}`;

    const dayNamesZh = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Check if this date is "today" in system (2026-08-19)
    const isToday = fullDate === '2026-08-19';

    return {
      name: language === 'zh' ? dayNamesZh[d.getDay()] : dayNamesEn[d.getDay()],
      date: String(d.getDate()),
      fullDate,
      isToday,
      rawDate: d,
    };
  });

  // Calculate week range display string
  const startDay = days[0].rawDate;
  const endDay = days[6].rawDate;

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dateRangeDisplay = language === 'zh'
    ? `${startDay.getFullYear()}年${startDay.getMonth() + 1}月${startDay.getDate()}日 – ${endDay.getMonth() + 1}月${endDay.getDate()}日`
    : `${monthNamesEn[startDay.getMonth()]} ${startDay.getDate()} – ${monthNamesEn[endDay.getMonth()]} ${endDay.getDate()}, ${endDay.getFullYear()}`;

  // Time slots on Y-Axis
  const timeSlots = [
    { label: '09:00 am', time: '09:00', hour: 9 },
    { label: '11:00 am', time: '11:00', hour: 11 },
    { label: '01:00 pm', time: '13:00', hour: 13 },
    { label: '03:00 pm', time: '15:00', hour: 15 },
    { label: '05:00 pm', time: '17:00', hour: 17 },
    { label: '06:00 pm', time: '18:00', hour: 18 },
    { label: '08:00 pm', time: '20:00', hour: 20 },
  ];

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesPlatform =
      filterPlatform === 'all' || post.targetPlatforms.includes(filterPlatform as PlatformType);
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const getPlatformIcon = (plat: PlatformType) => {
    if (plat === 'tiktok') {
      return (
        <span className="w-4 h-4 rounded bg-black flex items-center justify-center text-white text-[9px] font-bold">
          TT
        </span>
      );
    }
    if (plat === 'youtube') {
      return (
        <span className="w-4 h-4 rounded bg-red-600 flex items-center justify-center text-white text-[9px] font-bold">
          YT
        </span>
      );
    }
    if (plat === 'facebook') {
      return (
        <span className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">
          FB
        </span>
      );
    }
    return (
      <span className="w-4 h-4 rounded bg-purple-600 flex items-center justify-center text-white text-[9px] font-bold">
        IG
      </span>
    );
  };

  const handleCellClick = (fullDate: string, timeStr: string) => {
    setDraftSchedule(fullDate, timeStr);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Title & Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.planningTitle}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
              {posts.length} {language === 'zh' ? '篇短视频' : 'Posts in Matrix'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.planningSubtitle}</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{t.planningWeekView}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{t.planningListView}</span>
            </button>
          </div>

          {/* New Post Button */}
          <button
            onClick={() => {
              setDraftSchedule('2026-08-19', '11:00');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.planningCreatePost}</span>
          </button>
        </div>
      </div>

      {/* Date Navigation & Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Date Selector with Working Next/Prev Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
            <button
              type="button"
              onClick={handlePrevWeek}
              title={language === 'zh' ? '上一周' : 'Previous Week'}
              className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleToday}
              title={language === 'zh' ? '回到今天' : 'Back to Today'}
              className="px-2 py-1 hover:bg-white rounded-lg text-[11px] font-bold text-slate-700 transition-all cursor-pointer"
            >
              {language === 'zh' ? '今天' : 'Today'}
            </button>
            <button
              type="button"
              onClick={handleNextWeek}
              title={language === 'zh' ? '下一周' : 'Next Week'}
              className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition-all cursor-pointer active:scale-95 shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
            <span>{dateRangeDisplay}</span>
          </div>

          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
            {language === 'zh' ? '海外原生 Clean IP 直连' : 'Clean Residential Dispatch Ready'}
          </span>
        </div>

        {/* Platform filter & Search */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.planningSearchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">{t.planningFilterPlatform}</option>
            <option value="tiktok">TikTok Matrix</option>
            <option value="youtube">YouTube Shorts</option>
            <option value="facebook">Facebook Reels</option>
          </select>
        </div>
      </div>

      {/* ================= WEEK VIEW GRID ================= */}
      {viewMode === 'week' ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Header Row: 7 Days */}
          <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-700 divide-x divide-slate-200">
            {/* Time Axis corner */}
            <div className="p-3 text-center text-slate-400 font-mono text-[11px] flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>TIME</span>
            </div>

            {/* 7 Days Columns */}
            {days.map((d, i) => (
              <div
                key={i}
                className={`p-3 text-center transition-colors ${
                  d.isToday ? 'bg-indigo-50/80 text-indigo-950 font-bold border-b-2 border-indigo-600' : ''
                }`}
              >
                <div className={`text-[11px] uppercase ${d.isToday ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
                  {d.name}
                </div>
                <div className={`text-base font-extrabold mt-0.5 ${d.isToday ? 'text-indigo-700' : 'text-slate-900'}`}>
                  {d.date}
                </div>
                {d.isToday && (
                  <span className="inline-block text-[9px] px-1.5 py-0.2 bg-indigo-600 text-white rounded-full font-bold">
                    {language === 'zh' ? '今日' : 'Today'}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Time Slots Rows */}
          <div className="divide-y divide-slate-100">
            {timeSlots.map((slotObj, tIdx) => (
              <div
                key={tIdx}
                className="grid grid-cols-8 divide-x divide-slate-100 min-h-[95px] text-xs hover:bg-slate-50/30 transition-colors"
              >
                {/* Time Axis Label */}
                <div className="p-2 text-right text-slate-400 font-mono text-[11px] select-none bg-slate-50/30 flex items-center justify-end">
                  {slotObj.label}
                </div>

                {/* 7 Day Cells */}
                {days.map((dayObj, dIdx) => {
                  // Find matching posts in this date/time slot
                  const cellPosts = filteredPosts.filter((p) => {
                    const postDate = p.scheduledTime.split('T')[0];
                    const postHour = new Date(p.scheduledTime).getUTCHours();
                    return postDate === dayObj.fullDate && Math.abs(postHour - slotObj.hour) <= 1;
                  });

                  return (
                    <div
                      key={dIdx}
                      onClick={() => {
                        if (cellPosts.length === 0) {
                          handleCellClick(dayObj.fullDate, slotObj.time);
                        }
                      }}
                      className="p-1.5 relative group cursor-pointer hover:bg-indigo-50/20 transition-colors"
                    >
                      {cellPosts.map((post) => (
                        <div
                          key={post.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPost(post);
                          }}
                          className={`rounded-xl p-2 shadow-xs border transition-all duration-200 hover:shadow-md hover:scale-[1.02] flex items-start gap-2 ${
                            post.status === 'published'
                              ? 'bg-slate-900 text-white border-slate-800'
                              : 'bg-white text-slate-800 border-indigo-200 ring-1 ring-indigo-500/20'
                          }`}
                        >
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            className="w-9 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 mb-0.5">
                              {post.targetPlatforms.map((plat) => (
                                <span key={plat}>{getPlatformIcon(plat)}</span>
                              ))}
                              <span
                                className={`text-[9px] font-mono ml-auto ${
                                  post.status === 'published'
                                    ? 'text-emerald-400'
                                    : 'text-indigo-600 font-bold'
                                }`}
                              >
                                {new Date(post.scheduledTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-[11px] font-semibold truncate leading-tight">
                              {post.title}
                            </p>
                            {post.status === 'published' && (
                              <div className="text-[9px] text-amber-300 font-mono mt-0.5">
                                🔥 {post.viewsCount ? `${(post.viewsCount / 1000).toFixed(1)}k` : '14k'}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Hover Slot Quick Add Button with precise date & time */}
                      {cellPosts.length === 0 && (
                        <div className="hidden group-hover:flex absolute inset-0 items-center justify-center p-1 bg-indigo-50/50 backdrop-blur-2xs rounded-lg animate-in fade-in duration-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCellClick(dayObj.fullDate, slotObj.time);
                            }}
                            className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-md transition-all scale-95 group-hover:scale-100 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{language === 'zh' ? `+ 排期 ${slotObj.time}` : `+ Schedule ${slotObj.time}`}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ================= LIST VIEW ================= */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-14 h-18 rounded-xl object-cover shadow-xs flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {post.targetPlatforms.map((plat) => (
                        <span key={plat}>{getPlatformIcon(plat)}</span>
                      ))}
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          post.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-indigo-50 text-indigo-800'
                        }`}
                      >
                        {post.status === 'published'
                          ? t.planningStatusPublished
                          : t.planningStatusScheduled}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(post.scheduledTime).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{post.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{post.caption}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  {post.viewsCount && (
                    <div className="text-right">
                      <div className="text-indigo-600 font-mono text-sm font-bold">
                        {post.viewsCount.toLocaleString()}
                      </div>
                      <span className="text-slate-400 text-[10px]">Views</span>
                    </div>
                  )}
                  <button className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors">
                    {t.preview}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">{t.planningNoPosts}</p>
            </div>
          )}
        </div>
      )}

      {/* Post Detail Modal */}
      <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
};
