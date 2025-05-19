import React, { useState, useEffect } from 'react';
import { BookOpen, PenLine, Search, Calendar, ArrowUpCircle, RefreshCw, AlertCircle, WifiOff } from 'lucide-react';
import { CreateJournalEntry } from '../components/CreateJournalEntry';
import { JournalDetailModal } from '../components/JournalDetailModal';
import { getJournalEntries, JournalEntry } from '../lib/mockData';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Journal: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEntries = async () => {
    try {
      setError(null);
      setIsRefreshing(true);
      const entries = getJournalEntries();
      setJournalEntries(entries.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (err) {
      console.error('Error fetching journal entries:', err);
      setError('获取日志失败，请稍后重试');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetail = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setShowDetailModal(true);
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

  if (error) {
    return (
      <div className="py-6">
        <div className="bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-700/40 text-center">
          <WifiOff className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">加载失败</h3>
          <p className="text-red-200/90 mb-4">{error}</p>
          <button
            onClick={fetchEntries}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '重试中...' : '重试'}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="py-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">塔罗日志</h2>
        <div className="flex space-x-3">
          <button 
            onClick={fetchEntries}
            className="p-2 rounded-full bg-blue-800/50 text-indigo-200 disabled:opacity-50"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-2 rounded-full bg-blue-800/50 text-indigo-200">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-blue-800/50 text-indigo-200">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white px-4 py-3 rounded-xl mb-8 transition-all duration-300 flex items-center justify-center shadow-lg"
      >
        <PenLine className="w-5 h-5 mr-2" />
        写新日志
      </button>
      
      {journalEntries.length > 0 ? (
        <div className="space-y-5">
          {journalEntries.map((entry) => (
            <div 
              key={entry.id}
              className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-5 border border-blue-700/40 shadow-lg hover:border-blue-600/50 transition-colors cursor-pointer"
              onClick={() => handleViewDetail(entry)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white">{entry.title}</h3>
                <div className={`text-xs py-1 px-2 rounded-full ${getLevelStyle(entry.level)}`}>
                  {getLevelLabel(entry.level)}
                </div>
              </div>
              
              <p className="text-sm text-indigo-200/80 mb-3 line-clamp-2">
                {entry.content}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="text-xs text-indigo-200/70">
                  {new Date(entry.timestamp).toLocaleString('zh-CN')}
                </div>
                <button 
                  className="text-indigo-300 text-sm hover:text-indigo-200 transition-colors flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetail(entry);
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-indigo-300/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">暂无日志</h3>
          <p className="text-indigo-200/70">点击上方按钮创建你的第一篇日志</p>
        </div>
      )}
      
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 bg-indigo-600/80 text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-indigo-600"
          aria-label="返回顶部"
        >
          <ArrowUpCircle className="w-6 h-6" />
        </button>
      )}

      {showCreateModal && (
        <CreateJournalEntry
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchEntries}
        />
      )}

      {selectedEntry && (
        <JournalDetailModal
          entry={selectedEntry}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedEntry(null);
          }}
        />
      )}
    </div>
  );
};