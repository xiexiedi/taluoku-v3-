import React, { useState } from 'react';
import { TarotCard } from '../components/TarotCard';
import { Info, Share2, Save, ArrowLeft, WifiOff } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { saveReading } from '../lib/readings';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface DrawnCard {
  name: string;
  isReversed: boolean;
  position?: string;
  meaning?: string;
}

interface ReadingInterpretation {
  general: string;
  cards: Array<{
    position: string;
    meaning: string;
  }>;
}

export const DrawCards: React.FC = () => {
  const { user } = useAuth();
  const [selectedSpread, setSelectedSpread] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);

  const spreads = [
    { id: 'single', name: '单张牌阵', count: 1, description: '简单直接的指引' },
    { id: 'three', name: '三张牌阵', count: 3, description: '过去、现在与未来' },
    { id: 'celtic', name: '凯尔特十字', count: 10, description: '深入全面的解读' }
  ];

  const allCardNames = [
    'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 
    'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot',
    'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice',
    'The Hanged Man', 'Death', 'Temperance', 'The Devil',
    'The Tower', 'The Star', 'The Moon', 'The Sun',
    'Judgement', 'The World'
  ];

  const celticPositions = [
    { name: '当前处境', desc: '反映当前的核心问题或状态' },
    { name: '面临挑战', desc: '当前面对的主要困难或阻碍' },
    { name: '潜在可能', desc: '可能的发展方向和潜在机遇' },
    { name: '过去基础', desc: '过往经历对现状的影响' },
    { name: '当前想法', desc: '内心的想法和期待' },
    { name: '近期发展', desc: '即将发生的变化和发展' },
    { name: '自我认知', desc: '自身态度和行为方式' },
    { name: '外在影响', desc: '环境因素和他人影响' },
    { name: '希望恐惧', desc: '内心的期望和担忧' },
    { name: '最终结果', desc: '事情的可能结果和建议' }
  ];

  const getPositionName = (spreadId: string, index: number): string => {
    if (spreadId === 'three') {
      return ['过去', '现在', '未来'][index];
    } else if (spreadId === 'celtic') {
      return celticPositions[index].name;
    }
    return '主要指引';
  };

  const getPositionDesc = (spreadId: string, index: number): string => {
    if (spreadId === 'celtic') {
      return celticPositions[index].desc;
    }
    return '';
  };

  const generateCardMeaning = (card: DrawnCard): string => {
    return `${card.name} ${card.isReversed ? '逆位' : '正位'} - ${
      card.isReversed 
        ? '需要注意内在的阻碍和挑战。建议深入反思，寻找突破口。'
        : '显示积极的发展方向和机遇。保持当前的态度和行动方向。'
    }`;
  };

  const generateInterpretation = (cards: DrawnCard[], spreadId: string): ReadingInterpretation => {
    const cardInterpretations = cards.map((card, index) => ({
      position: getPositionName(spreadId, index),
      meaning: generateCardMeaning(card)
    }));

    return {
      general: '塔罗牌显示这是一个适合内省和个人成长的时期。请留意周围的征兆，相信自己的直觉。',
      cards: cardInterpretations
    };
  };

  const handleSaveReading = async (
    cards: DrawnCard[],
    spreadName: string,
    spreadId: string
  ) => {
    if (!user) {
      setError('请先登录再进行占卜');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const interpretation = generateInterpretation(cards, spreadId);
      
      await saveReading(
        user.id,
        'reading',
        spreadId,
        cards.map((card, index) => ({
          ...card,
          position: getPositionName(spreadId, index),
          meaning: generateCardMeaning(card)
        })),
        interpretation
      );
    } catch (err) {
      console.error('Error saving reading:', err);
      setError(err instanceof Error ? err.message : '保存解读时出错，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  const drawCards = async (count: number, spreadName: string, spreadId: string) => {
    setIsDrawing(true);
    setError(null);
    setShowLoadingAnimation(true);
    
    try {
      // 模拟抽牌延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const shuffled = [...allCardNames].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count).map(name => ({
        name,
        isReversed: Math.random() > 0.7,
      }));
      
      setDrawnCards(selected);
      await handleSaveReading(selected, spreadName, spreadId);
    } catch (error) {
      setError(error instanceof Error ? error.message : '抽牌时出错，请稍后重试');
    } finally {
      setIsDrawing(false);
      setShowLoadingAnimation(false);
    }
  };

  const renderCelticCross = () => {
    if (drawnCards.length < 10) return null;

    return (
      <div className="space-y-12">
        <div className="grid grid-cols-4 gap-x-8 gap-y-16 max-w-4xl mx-auto">
          {/* Center Cross */}
          <div className="col-start-2 row-start-1">
            <div className="relative">
              <TarotCard name={drawnCards[0].name} isReversed={drawnCards[0].isReversed} />
              <div className="absolute -bottom-20 left-0 right-0 text-center">
                <p className="text-sm font-medium text-white mb-2">{celticPositions[0].name}</p>
                <p className="text-xs text-indigo-200/70 leading-relaxed">{celticPositions[0].desc}</p>
              </div>
            </div>
          </div>

          <div className="col-start-2 row-start-2">
            <div className="relative">
              <TarotCard name={drawnCards[1].name} isReversed={drawnCards[1].isReversed} />
              <div className="absolute -bottom-20 left-0 right-0 text-center">
                <p className="text-sm font-medium text-white mb-2">{celticPositions[1].name}</p>
                <p className="text-xs text-indigo-200/70 leading-relaxed">{celticPositions[1].desc}</p>
              </div>
            </div>
          </div>

          <div className="col-start-1 row-start-2">
            <div className="relative">
              <TarotCard name={drawnCards[2].name} isReversed={drawnCards[2].isReversed} />
              <div className="absolute -bottom-20 left-0 right-0 text-center">
                <p className="text-sm font-medium text-white mb-2">{celticPositions[2].name}</p>
                <p className="text-xs text-indigo-200/70 leading-relaxed">{celticPositions[2].desc}</p>
              </div>
            </div>
          </div>

          <div className="col-start-3 row-start-2">
            <div className="relative">
              <TarotCard name={drawnCards[3].name} isReversed={drawnCards[3].isReversed} />
              <div className="absolute -bottom-20 left-0 right-0 text-center">
                <p className="text-sm font-medium text-white mb-2">{celticPositions[3].name}</p>
                <p className="text-xs text-indigo-200/70 leading-relaxed">{celticPositions[3].desc}</p>
              </div>
            </div>
          </div>

          {/* Staff */}
          <div className="col-start-4 row-start-1">
            <div className="relative">
              <TarotCard name={drawnCards[4].name} isReversed={drawnCards[4].isReversed} />
              <div className="absolute -bottom-20 left-0 right-0 text-center">
                <p className="text-sm font-medium text-white mb-2">{celticPositions[4].name}</p>
                <p className="text-xs text-indigo-200/70 leading-relaxed">{celticPositions[4].desc}</p>
              </div>
            </div>
          </div>

          <div className="col-start-4 row-start-2">
            <div className="relative">
              <TarotCard name={drawnCards[5].name} isReversed={drawnCards[5].isReversed} />
              <div className="absolute -bottom-20 left-0 right-0 text-center">
                <p className="text-sm font-medium text-white mb-2">{celticPositions[5].name}</p>
                <p className="text-xs text-indigo-200/70 leading-relaxed">{celticPositions[5].desc}</p>
              </div>
            </div>
          </div>

          <div className="col-start-4 row-start-3">
            <div className="relative">
              <TarotCard name={drawnCards[6].name} isReversed={drawnCards[6].isReversed} />
              <div className="absolute -bottom-20 left-0 right-0 text-center">
                <p className="text-sm font-medium text-white mb-2">{celticPositions[6].name}</p>
                <p className="text-xs text-indigo-200/70 leading-relaxed">{celticPositions[6].desc}</p>
              </div>
            </div>
          </div>

          <div className="col-start-4 row-start-4">
            <div className="relative">
              <TarotCard name={drawnCards[7].name} isReversed={drawnCards[7].isReversed} />
              <div className="absolute -bottom-20 left-0 right-0 text-center">
                <p className="text-sm font-medium text-white mb-2">{celticPositions[7].name}</p>
                <p className="text-xs text-indigo-200/70 leading-relaxed">{celticPositions[7].desc}</p>
              </div>
            </div>
          </div>

          <div className="col-start-4 row-start-5">
            <div className="relative">
              <TarotCard name={drawnCards[8].name} isReversed={drawnCards[8].isReversed} />
              <div className="absolute -bottom-20 left-0 right-0 text-center">
                <p className="text-sm font-medium text-white mb-2">{celticPositions[8].name}</p>
                <p className="text-xs text-indigo-200/70 leading-relaxed">{celticPositions[8].desc}</p>
              </div>
            </div>
          </div>

          <div className="col-start-4 row-start-6">
            <div className="relative">
              <TarotCard name={drawnCards[9].name} isReversed={drawnCards[9].isReversed} />
              <div className="absolute -bottom-20 left-0 right-0 text-center">
                <p className="text-sm font-medium text-white mb-2">{celticPositions[9].name}</p>
                <p className="text-xs text-indigo-200/70 leading-relaxed">{celticPositions[9].desc}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 space-y-8">
          <h4 className="text-lg font-semibold text-white">详细解读</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drawnCards.map((card, index) => (
              <div key={index} className="bg-blue-900/20 rounded-lg p-6">
                <h5 className="text-indigo-300 font-medium mb-3">
                  {celticPositions[index].name}
                </h5>
                <p className="text-sm text-indigo-200/90 mb-4 leading-relaxed">
                  {celticPositions[index].desc}
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-white leading-relaxed">
                    {generateCardMeaning(card)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCardLayout = () => {
    if (!selectedSpread || !drawnCards.length) return null;

    switch (selectedSpread) {
      case 'single':
        return (
          <div className="flex flex-col items-center space-y-6">
            <div className="w-64">
              <TarotCard 
                name={drawnCards[0].name} 
                isReversed={drawnCards[0].isReversed} 
              />
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-white mb-2">
                {getPositionName(selectedSpread, 0)}
              </h4>
              <p className="text-indigo-200/80">
                {generateCardMeaning(drawnCards[0])}
              </p>
            </div>
          </div>
        );

      case 'three':
        return (
          <div className="grid grid-cols-3 gap-8">
            {drawnCards.slice(0, 3).map((card, index) => (
              <div key={index} className="flex flex-col items-center space-y-4">
                <div className="w-full max-w-[200px]">
                  <TarotCard 
                    name={card.name} 
                    isReversed={card.isReversed} 
                  />
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {getPositionName(selectedSpread, index)}
                  </h4>
                  <p className="text-sm text-indigo-200/80">
                    {generateCardMeaning(card)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'celtic':
        return renderCelticCross();

      default:
        return null;
    }
  };

  const getSpreadName = () => {
    const spread = spreads.find(s => s.id === selectedSpread);
    return spread ? spread.name : '抽取塔罗牌';
  };

  const handleBack = () => {
    setSelectedSpread(null);
    setDrawnCards([]);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <WifiOff className="w-16 h-16 text-indigo-300/50 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">{error}</h3>
        <button
          onClick={() => {
            setError(null);
            setSelectedSpread(null);
            setDrawnCards([]);
          }}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (showLoadingAnimation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <img 
          src="/素材库/加载动画 copy.gif" 
          alt="抽牌中"
          className="w-32 h-32 mb-4"
        />
        <p className="text-lg text-indigo-200">抽牌中...</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {(selectedSpread || drawnCards.length > 0) && (
            <button 
              onClick={handleBack}
              className="mr-4 p-2 hover:bg-blue-800/30 rounded-full transition-colors"
              aria-label="返回"
            >
              <ArrowLeft className="w-6 h-6 text-indigo-200" />
            </button>
          )}
          <h2 className="text-2xl font-bold text-white">{getSpreadName()}</h2>
        </div>
      </div>
      
      {!selectedSpread && !drawnCards.length && (
        <div className="space-y-4">
          <p className="text-indigo-200/80 mb-6">选择一个牌阵开始解读：</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {spreads.map((spread) => (
              <button
                key={spread.id}
                onClick={() => {
                  setSelectedSpread(spread.id);
                  drawCards(spread.count, spread.name, spread.id);
                }}
                className="bg-blue-800/30 backdrop-blur-sm hover:bg-blue-800/50 transition-all border border-blue-700/40 rounded-xl p-4 text-center hover:scale-105 duration-300"
              >
                <h3 className="text-lg font-semibold text-white">{spread.name}</h3>
                <p className="text-xs text-indigo-200/70 mt-1">{spread.description}</p>
                <p className="text-xs text-indigo-200/70 mt-2">{spread.count} 张牌</p>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {!isDrawing && drawnCards.length > 0 && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">塔罗解读</h3>
            <div className="flex space-x-3">
              <button className="p-2 rounded-full bg-blue-800/50 text-indigo-200">
                <Info className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-blue-800/50 text-indigo-200">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-blue-800/50 text-indigo-200">
                <Save className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-6 border border-blue-700/30">
            {renderCardLayout()}
          </div>
          
          <button 
            onClick={handleBack}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors mx-auto block mt-6"
          >
            重新抽牌
          </button>
        </div>
      )}
    </div>
  );
};