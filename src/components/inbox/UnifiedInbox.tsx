import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { InboxItem } from '../../types';
import {
  MessageSquare,
  Search,
  Send,
  CheckCircle2,
  Tag,
  UserCheck,
  Sparkles,
  Filter,
  Check,
} from 'lucide-react';

export const UnifiedInbox: React.FC = () => {
  const { t, language } = useLanguage();
  const { inboxItems, replyToInboxItem, markInboxRead } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'comment' | 'dm' | 'unread'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string>(inboxItems[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = inboxItems.filter((item) => {
    const matchesType =
      activeFilter === 'all'
        ? true
        : activeFilter === 'unread'
        ? !item.isRead
        : item.type === activeFilter;
    const matchesSearch =
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const selectedItem = inboxItems.find((i) => i.id === selectedItemId) || filteredItems[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedItem) return;

    replyToInboxItem(selectedItem.id, replyText);
    setReplyText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.inboxTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">{t.inboxSubtitle}</p>
      </div>

      {/* 2-Panel Inbox Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left List Column */}
        <div className="lg:col-span-5 border-r border-slate-200 flex flex-col">
          {/* Filters & Search */}
          <div className="p-4 border-b border-slate-200 space-y-3 bg-slate-50/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.inboxSearchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {t.inboxFilterAll}
              </button>
              <button
                onClick={() => setActiveFilter('comment')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === 'comment'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {t.inboxFilterComments}
              </button>
              <button
                onClick={() => setActiveFilter('dm')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === 'dm'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {t.inboxFilterDms}
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeFilter === 'unread'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {t.inboxFilterUnread}
              </button>
            </div>
          </div>

          {/* List items */}
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1 max-h-[500px]">
            {filteredItems.map((item) => {
              const isSelected = item.id === (selectedItem?.id || '');
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItemId(item.id);
                    markInboxRead(item.id);
                  }}
                  className={`p-4 cursor-pointer transition-all hover:bg-slate-50 flex items-start gap-3 ${
                    isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : ''
                  } ${!item.isRead ? 'font-semibold' : ''}`}
                >
                  <img
                    src={item.authorAvatar}
                    alt={item.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.authorName}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-indigo-600 uppercase font-bold">
                        {item.platform}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[10px] text-slate-500">{item.channelHandle}</span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                          item.tag === 'VIP'
                            ? 'bg-amber-100 text-amber-800'
                            : item.tag === 'Lead'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.tag}
                      </span>

                      {item.isReplied && (
                        <span className="text-[10px] text-indigo-600 flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          <span>Replied</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail & Reply Column */}
        {selectedItem ? (
          <div className="lg:col-span-7 flex flex-col justify-between p-6 bg-white">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedItem.authorAvatar}
                    alt={selectedItem.authorName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{selectedItem.authorName}</h3>
                    <p className="text-xs text-slate-500 font-mono">{selectedItem.authorHandle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                    {selectedItem.platform.toUpperCase()} {selectedItem.type.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Related Post Preview if comment */}
              {selectedItem.postTitle && (
                <div className="mb-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  {selectedItem.postThumbnail && (
                    <img
                      src={selectedItem.postThumbnail}
                      alt="Thumbnail"
                      className="w-10 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Video Post
                    </span>
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {selectedItem.postTitle}
                    </span>
                  </div>
                </div>
              )}

              {/* Message Content Bubble */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 text-xs sm:text-sm text-slate-800 leading-relaxed">
                {selectedItem.content}
              </div>

              {/* Conversation replies thread */}
              {selectedItem.replies.length > 0 && (
                <div className="mt-4 space-y-3 pl-4 border-l-2 border-indigo-200">
                  {selectedItem.replies.map((r) => (
                    <div key={r.id} className="p-3 bg-slate-100 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500 font-medium text-[10px]">
                        <span>{language === 'zh' ? '您回复了：' : 'You replied:'}</span>
                        <span>{new Date(r.sentAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-800">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Reply Form */}
            <form onSubmit={handleSendReply} className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t.inboxReplyPlaceholder}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.inboxSendReply}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-12 text-slate-400">
            <MessageSquare className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
            <p className="text-xs sm:text-sm">Select an interaction to view conversation details</p>
          </div>
        )}
      </div>
    </div>
  );
};
