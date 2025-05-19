import React from 'react';
import { X } from 'lucide-react';
import { TarotCard } from './TarotCard';

interface FortuneModalProps {
  isOpen: boolean;
  onClose: () => void;
  fortune: {
    card: string;
    isReversed: boolean;
    fortune: {
      general: string;
      love: string;
      career: string;
      health: string;
      luckyColor: string;
      luckyNumber: number;
    };
  };
}

export const FortuneModal: React.FC<FortuneModalProps> = ({
  isOpen,
  onClose,
  fortune
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-b from-blue-900/90 to-purple-900/90 rounded-2xl border border-blue-700/50 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300 scrollbar-hide"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-blue-700/50 bg-gradient-to-b from-blue-900/90 to-blue-900/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white">今日运势详解</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-800/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-indigo-200" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <div className="lg:sticky lg:top-24">
                <TarotCard 
                  name={fortune.card} 
                  isReversed={fortune.isReversed} 
                />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium text-white">
                    {fortune.card}
                  </h3>
                  <p className="text-sm text-indigo-200/80 mt-1">
                    {fortune.isReversed ? '逆位' : '正位'}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-6">
              <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-700/30">
                <h3 className="text-lg font-medium text-white mb-3">总体运势</h3>
                <p className="text-indigo-200/90 leading-relaxed">{fortune.fortune.general}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-700/30">
                  <span className="text-indigo-300 text-sm block mb-2">幸运色彩</span>
                  <span className="text-white text-xl font-medium">{fortune.fortune.luckyColor}</span>
                </div>
                <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-700/30">
                  <span className="text-indigo-300 text-sm block mb-2">幸运数字</span>
                  <span className="text-white text-xl font-medium">{fortune.fortune.luckyNumber}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-700/30">
                  <h4 className="text-lg font-medium text-white mb-3">爱情运势</h4>
                  <p className="text-indigo-200/90 leading-relaxed">{fortune.fortune.love}</p>
                </div>
                <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-700/30">
                  <h4 className="text-lg font-medium text-white mb-3">事业运势</h4>
                  <p className="text-indigo-200/90 leading-relaxed">{fortune.fortune.career}</p>
                </div>
                <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-700/30">
                  <h4 className="text-lg font-medium text-white mb-3">健康运势</h4>
                  <p className="text-indigo-200/90 leading-relaxed">{fortune.fortune.health}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};