import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { saveJournalEntry } from '../lib/mockData';

interface CreateJournalEntryProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateJournalEntry: React.FC<CreateJournalEntryProps> = ({
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [level, setLevel] = useState<'INFO' | 'WARNING' | 'ERROR'>('INFO');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('请先登录后再创建日志');
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await saveJournalEntry({
        title: title.trim(),
        content: content.trim(),
        level
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving journal entry:', err);
      setError(err instanceof Error ? err.message : '保存日志时发生错误，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-blue-900/80 backdrop-blur-md rounded-xl border border-blue-700/50 w-full max-w-2xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-blue-700/50">
          <h2 className="text-xl font-semibold text-white">写新日志</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-800/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-indigo-200" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-2">
              日志标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
              className="w-full bg-blue-950/50 border border-blue-700/50 rounded-lg px-4 py-2 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入日志标题..."
            />
            <div className="mt-1 text-xs text-indigo-300/70">
              {title.length}/100 字符
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-2">
              日志内容
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="w-full bg-blue-950/50 border border-blue-700/50 rounded-lg px-4 py-2 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="记录你的塔罗感悟..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-2">
              日志级别
            </label>
            <div className="flex space-x-4">
              {(['INFO', 'WARNING', 'ERROR'] as const).map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={option}
                    checked={level === option}
                    onChange={(e) => setLevel(e.target.value as typeof level)}
                    className="form-radio text-indigo-600 focus:ring-indigo-500 bg-blue-950/50 border-blue-700/50"
                  />
                  <span className="text-indigo-200">
                    {option === 'INFO' && '普通'}
                    {option === 'WARNING' && '警示'}
                    {option === 'ERROR' && '重要'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700/50 text-red-200 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-blue-800/50 hover:bg-blue-800/70 text-indigo-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '保存中...' : '保存日志'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};