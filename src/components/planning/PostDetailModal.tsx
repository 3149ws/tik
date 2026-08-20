import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { PostContent } from '../../types';
import {
  X,
  Calendar,
  Clock,
  Send,
  Trash2,
  Edit,
  ExternalLink,
  ShieldCheck,
  Globe2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface PostDetailModalProps {
  post: PostContent | null;
  onClose: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const { t, language } = useLanguage();
  const { deletePost, publishPostImmediately, setActivePage } = useApp();

  if (!post) return null;

  const handleDelete = () => {
    deletePost(post.id);
    onClose();
  };

  const handlePublishNow = async () => {
    await publishPostImmediately(post.id);
    onClose();
  };

  const formattedDate = new Date(post.scheduledTime).toLocaleString(
    language === 'zh' ? 'zh-CN' : 'en-US',
    {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Status Header */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full ${
              post.status === 'published'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-indigo-100 text-indigo-800'
            }`}
          >
            {post.status === 'published' ? t.planningStatusPublished : t.planningStatusScheduled}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Post Grid Details */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
          {/* Thumbnail preview */}
          <div className="sm:col-span-5 relative rounded-2xl overflow-hidden shadow-md bg-black aspect-[9/16] max-h-72">
            <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 flex gap-1">
              {post.targetPlatforms.map((plat) => (
                <span
                  key={plat}
                  className="px-2 py-0.5 rounded bg-black/70 text-white text-[10px] uppercase font-bold backdrop-blur-xs"
                >
                  {plat}
                </span>
              ))}
            </div>
          </div>

          {/* Metadata info */}
          <div className="sm:col-span-7 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{post.title}</h3>
              <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed max-h-28 overflow-y-auto">
                {post.caption}
              </p>
            </div>

            {/* Performance Stats if Published */}
            {post.status === 'published' && (
              <div className="grid grid-cols-2 gap-2 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">
                    {language === 'zh' ? '视频播放量' : 'Views'}
                  </span>
                  <span className="font-bold text-indigo-700 font-mono text-sm">
                    {post.viewsCount?.toLocaleString() || '14.2K'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">
                    {language === 'zh' ? '互动点赞数' : 'Likes'}
                  </span>
                  <span className="font-bold text-purple-700 font-mono text-sm">
                    {post.likesCount?.toLocaleString() || '1,240'}
                  </span>
                </div>
              </div>
            )}

            {/* Dispatch Node Info */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{language === 'zh' ? '海外直发调度节点' : 'Dispatch Server'}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                US-West (Silicon Valley Clean Residential IP #402)
              </p>
            </div>

            {/* TikTok Compliance Audit Details */}
            <div className="text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1 text-slate-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>TikTok API: {post.tiktokSettings.privacyLevel}</span>
              </div>
              <div>
                AI Generated:{' '}
                <strong>{post.tiktokSettings.isAiGenerated ? 'Yes' : 'No'}</strong> | Commercial:{' '}
                <strong>{post.tiktokSettings.isCommercial ? 'Yes' : 'No'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.delete}</span>
          </button>

          <div className="flex items-center gap-2">
            {post.status !== 'published' && (
              <>
                <button
                  onClick={() => {
                    const datePart = post.scheduledTime.split('T')[0];
                    const timePart = new Date(post.scheduledTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    });
                    onClose();
                    setActivePage('compose');
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>{language === 'zh' ? '修改排期' : 'Edit Post'}</span>
                </button>
                <button
                  onClick={handlePublishNow}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.publishNowButton}</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              {language === 'zh' ? '关闭' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
