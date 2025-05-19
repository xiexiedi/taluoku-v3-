import React from 'react';
import { X, CalendarDays, Clock, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { JournalEntry } from '../lib/mockData';

interface JournalDetailModalProps {
  entry: JournalEntry;
  isOpen: boolean;
  onClose: () => void;
}

export const JournalDetailModal: React.FC<JournalDetailModalProps> = ({
  entry,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const getLevelIcon = (level: JournalEntry['level']) => {
    switch (level) {
      case 'ERROR':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'WARNING':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getLevelStyle = (level: JournalEntry['level']) => {
    switch (level) {
      case 'ERROR':
        return 'bg-red-700/50 text-red-200';
      case 'WARNING':
        return 'bg-yellow-700/50 text-yellow-200';
      default:
        return 'bg-blue-700/50 text-blue-200';
    }
  };

  const getLevelLabel = (level: JournalEntry['level']) => {
    switch (level) {
      case 'ERROR':
        return '重要';
      case 'WARNING':
        return '警示';
      default:
        return '普通';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-b from-blue-900/90 to-purple-900/90 rounded-2xl border border-blue-700/50 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700/50">
          <div className="flex items-center space-x-3">
            {getLevelIcon(entry.level)}
            <h2 className="text-xl font-semibold text-white">
              {entry.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-800/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-indigo-200" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-indigo-200/70">
                <CalendarDays className="w-4 h-4 mr-1" />
                {new Date(entry.timestamp).toLocaleDateString('zh-CN')}
              </div>
              <div className="flex items-center text-sm text-indigo-200/70">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(entry.timestamp).toLocaleTimeString('zh-CN')}
              </div>
            </div>
            <div className={`text-xs py-1 px-2 rounded-full ${getLevelStyle(entry.level)}`}>
              {getLevelLabel(entry.level)}
            </div>
          </div>

          <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-700/30">
            <h3 className="text-lg font-medium text-white mb-4">日志内容</h3>
            <p className="text-indigo-200/90 whitespace-pre-line leading-relaxed">
              {entry.content}
            </p>
          </div>

          <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-700/30">
            <div className="flex items-center text-sm text-indigo-200/70">
              <Info className="w-4 h-4 mr-2" />
              记录时间：{new Date(entry.timestamp).toLocaleString('zh-CN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};