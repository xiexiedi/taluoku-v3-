import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TarotCard } from '../components/TarotCard';
import { CalendarDays, Clock, ArrowLeft, WifiOff } from 'lucide-react';
import { supabase, withOnlineCheck } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface ReadingDetail {
  id: string;
  type: 'daily' | 'reading';
  timestamp: string;
  spreadName: string;
  spreadId: string;
  question?: string;
  notes?: string;
  cards: Array<{
    name: string;
    isReversed: boolean;
    position?: string;
  }>;
  interpretation: {
    general: string;
    cards?: Array<{
      position: string;
      meaning: string;
    }>;
  };
}

export const ReadingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reading, setReading] = useState<ReadingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReading = async () => {
      if (!id) return;

      try {
        await withOnlineCheck(async () => {
          const { data, error } = await supabase
            .from('readings')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;

          if (data) {
            setReading(data as ReadingDetail);
          }
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : '加载解读详情时出错，请稍后重试。');
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <WifiOff className="w-16 h-16 text-indigo-300/50 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">{error}</h3>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-white mb-4">未找到该解读记录</h2>
        <button
          onClick={() => navigate('/favorites')}
          className="text-indigo-300 hover:text-indigo-200 transition-colors"
        >
          返回历史记录
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/favorites')}
          className="p-2 rounded-full hover:bg-blue-800/30 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-indigo-200" />
        </button>
        <h1 className="text-2xl font-bold text-white">{reading.spreadName}</h1>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center text-indigo-200/70">
          <CalendarDays className="w-5 h-5 mr-2" />
          {formatDate(reading.timestamp)}
        </div>
        <div className="flex items-center text-indigo-200/70">
          <Clock className="w-5 h-5 mr-2" />
          {formatTime(reading.timestamp)}
        </div>
      </div>

      {reading.question && (
        <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-700/40">
          <h2 className="text-lg font-semibold text-white mb-3">占卜问题</h2>
          <p className="text-indigo-200/90">{reading.question}</p>
        </div>
      )}

      <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-700/40">
        <h2 className="text-lg font-semibold text-white mb-4">牌阵布局</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {reading.cards.map((card, index) => (
            <div key={index} className="space-y-3">
              <div className="aspect-[2/3]">
                <TarotCard 
                  name={card.name} 
                  isReversed={card.isReversed} 
                />
              </div>
              {card.position && (
                <p className="text-sm text-center text-indigo-200/90">
                  {card.position}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-700/40">
        <h2 className="text-lg font-semibold text-white mb-4">解读详情</h2>
        <div className="space-y-6">
          <div className="bg-blue-800/30 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">整体解读</h3>
            <p className="text-indigo-200/90">{reading.interpretation.general}</p>
          </div>

          {reading.interpretation.cards && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reading.interpretation.cards.map((interpretation, index) => (
                <div key={index} className="bg-blue-800/30 rounded-lg p-4">
                  <h4 className="text-indigo-300 font-medium mb-2">
                    {interpretation.position}
                  </h4>
                  <p className="text-sm text-indigo-200/90">
                    {interpretation.meaning}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {reading.notes && (
        <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-700/40">
          <h2 className="text-lg font-semibold text-white mb-3">个人感悟</h2>
          <p className="text-indigo-200/90 whitespace-pre-line">{reading.notes}</p>
        </div>
      )}
    </div>
  );
};