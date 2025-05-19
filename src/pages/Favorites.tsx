import React, { useState, useEffect } from 'react';
import { TarotCard } from '../components/TarotCard';
import { CalendarDays, Clock, Search, Edit2, Trash2, Check, X, AlertTriangle, WifiOff, Star } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { getReadings, deleteReading, toggleFavorite } from '../lib/readings';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { Reading } from '../lib/types';

export const Favorites: React.FC = () => {
  const { user } = useAuth();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const getSpreadName = (spreadType: string): string => {
    const spreadNames: Record<string, string> = {
      'single': '单张牌阵',
      'three': '三张牌阵',
      'celtic': '凯尔特十字',
      'daily': '每日运势'
    };
    return spreadNames[spreadType] || spreadType;
  };

  const fetchReadings = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getReadings(user.id);
      setReadings(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '加载历史记录时出错，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, [user]);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedItems(new Set());
  };

  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === readings.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(readings.map(item => item.id)));
    }
  };

  const handleDelete = async () => {
    if (!user || selectedItems.size === 0) return;
    
    setDeleting(true);
    try {
      await Promise.all(
        Array.from(selectedItems).map(id => deleteReading(id, user.id))
      );
      
      setReadings(prev => prev.filter(item => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
      setShowDeleteConfirm(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : '删除记录时出错，请稍后重试');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleFavorite = async (readingId: string, currentStatus: boolean) => {
    if (!user) return;
    
    try {
      const updated = await toggleFavorite(readingId, user.id, !currentStatus);
      setReadings(prev => 
        prev.map(reading => 
          reading.id === readingId ? updated : reading
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <WifiOff className="w-16 h-16 text-indigo-300/50 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">{error}</h3>
        <button
          onClick={fetchReadings}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">历史记录</h2>
        <div className="flex items-center space-x-3">
          {readings.length > 0 && (
            <>
              {isEditMode ? (
                <>
                  <button
                    onClick={handleSelectAll}
                    className="px-4 py-2 bg-blue-800/50 text-indigo-200 rounded-lg hover:bg-blue-800/70 transition-colors"
                  >
                    {selectedItems.size === readings.length ? '取消全选' : '全选'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={selectedItems.size === 0}
                    className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    删除
                  </button>
                  <button
                    onClick={toggleEditMode}
                    className="px-4 py-2 bg-blue-800/50 text-indigo-200 rounded-lg hover:bg-blue-800/70 transition-colors flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    完成
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleEditMode}
                  className="px-4 py-2 bg-blue-800/50 text-indigo-200 rounded-lg hover:bg-blue-800/70 transition-colors flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  编辑
                </button>
              )}
            </>
          )}
          <button className="p-2 rounded-full bg-blue-800/50 text-indigo-200 hover:bg-blue-800/70 transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {readings.length > 0 ? (
        <div className="space-y-6">
          {readings.map(reading => (
            <div 
              key={reading.id}
              className={`bg-blue-900/20 backdrop-blur-sm rounded-xl border ${
                isEditMode ? 'border-blue-700/40' : selectedItems.has(reading.id) ? 'border-indigo-500' : 'border-blue-700/40'
              } shadow-lg transition-all duration-300 overflow-hidden`}
            >
              <div className="p-6 border-b border-blue-700/40">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    {isEditMode && (
                      <div 
                        className="mr-4 mt-1"
                        onClick={() => toggleItemSelection(reading.id)}
                      >
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer ${
                          selectedItems.has(reading.id) 
                            ? 'bg-indigo-600 border-indigo-600' 
                            : 'border-white/50 hover:border-white'
                        }`}>
                          {selectedItems.has(reading.id) && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-wide">{getSpreadName(reading.spread_type)}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-sm text-indigo-200/70">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          {formatDate(reading.created_at)}
                        </div>
                        <div className="flex items-center text-sm text-indigo-200/70">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(reading.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleFavorite(reading.id, reading.is_favorite)}
                      className={`p-2 rounded-full transition-colors ${
                        reading.is_favorite 
                          ? 'text-yellow-400 hover:text-yellow-500' 
                          : 'text-indigo-300/50 hover:text-indigo-300'
                      }`}
                    >
                      <Star className="w-5 h-5" fill={reading.is_favorite ? 'currentColor' : 'none'} />
                    </button>
                    <div className="text-xs bg-blue-700/50 text-blue-200 py-1 px-2 rounded-full">
                      {reading.type === 'daily' ? '每日运势' : getSpreadName(reading.spread_type)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-blue-700/40">
                  <div className="p-6">
                    <div className="relative">
                      <div className={`flex gap-4 ${reading.cards.length > 3 ? 'overflow-x-auto scrollbar-hide' : ''}`}>
                        {reading.cards.map((card, index) => (
                          <div key={index} className="w-24 flex-shrink-0">
                            <div className="relative">
                              <TarotCard 
                                name={card.name} 
                                isReversed={card.isReversed} 
                              />
                              {card.position && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                  <p className="text-xs text-white text-center">{card.position}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3 p-6">
                  <div className="space-y-4">
                    <div className="bg-blue-900/20 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">整体解读</h4>
                      <p className="text-indigo-200/90 line-clamp-3">{reading.interpretation.general}</p>
                    </div>

                    {reading.interpretation.cards && reading.interpretation.cards.length > 0 && (
                      <div className="grid grid-cols-1 gap-4">
                        {reading.interpretation.cards.slice(0, 2).map((interpretation, index) => (
                          <div key={index} className="bg-blue-900/20 rounded-lg p-4">
                            <h5 className="text-indigo-300 font-medium mb-2">
                              {interpretation.position}
                            </h5>
                            <p className="text-sm text-indigo-200/90 line-clamp-2">
                              {interpretation.meaning}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CalendarDays className="w-12 h-12 text-indigo-300/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">暂无历史记录</h3>
          <p className="text-indigo-200/70 max-w-xs mx-auto">
            您的塔罗牌解读历史将会显示在这里，方便回顾过往的占卜结果。
          </p>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-blue-900/90 rounded-xl border border-blue-700/50 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-400 mr-2" />
                <h3 className="text-xl font-semibold text-white">确认删除</h3>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-1 hover:bg-blue-800/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-indigo-200" />
              </button>
            </div>
            <p className="text-indigo-200 mb-6">
              确定要删除选中的 {selectedItems.size} 条记录吗？此操作不可撤销。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-blue-800/50 text-indigo-200 rounded-lg hover:bg-blue-800/70 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    删除中...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    确认删除
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};