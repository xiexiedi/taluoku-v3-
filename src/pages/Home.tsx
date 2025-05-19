import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { SpreadOption } from '../components/SpreadOption';
import { TarotCard } from '../components/TarotCard';
import { DailyFortune } from '../components/DailyFortune';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [majorFilter, setMajorFilter] = useState<string>('all');
  const [minorFilters, setMinorFilters] = useState<Set<string>>(new Set());

  // 导航到抽牌页面
  const navigateToDrawCards = (spreadId?: string) => {
    navigate('/draw', { state: { spreadId } });
  };

  // Major Arcana cards
  const majorArcana = [
    'The Fool', 'The Magician', 'The High Priestess', 'The Empress',
    'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot',
    'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice',
    'The Hanged Man', 'Death', 'Temperance', 'The Devil',
    'The Tower', 'The Star', 'The Moon', 'The Sun',
    'Judgement', 'The World'
  ];

  // Minor Arcana cards by suit
  const minorArcana = {
    wands: ['Ace of Wands', 'Two of Wands', 'Three of Wands', 'Four of Wands',
            'Five of Wands', 'Six of Wands', 'Seven of Wands', 'Eight of Wands',
            'Nine of Wands', 'Ten of Wands', 'Page of Wands', 'Knight of Wands',
            'Queen of Wands', 'King of Wands'],
    cups: ['Ace of Cups', 'Two of Cups', 'Three of Cups', 'Four of Cups',
           'Five of Cups', 'Six of Cups', 'Seven of Cups', 'Eight of Cups',
           'Nine of Cups', 'Ten of Cups', 'Page of Cups', 'Knight of Cups',
           'Queen of Cups', 'King of Cups'],
    swords: ['Ace of Swords', 'Two of Swords', 'Three of Swords', 'Four of Swords',
             'Five of Swords', 'Six of Swords', 'Seven of Swords', 'Eight of Swords',
             'Nine of Swords', 'Ten of Swords', 'Page of Swords', 'Knight of Swords',
             'Queen of Swords', 'King of Swords'],
    pentacles: ['Ace of Pentacles', 'Two of Pentacles', 'Three of Pentacles', 'Four of Pentacles',
                'Five of Pentacles', 'Six of Pentacles', 'Seven of Pentacles', 'Eight of Pentacles',
                'Nine of Pentacles', 'Ten of Pentacles', 'Page of Pentacles', 'Knight of Pentacles',
                'Queen of Pentacles', 'King of Pentacles']
  };

  // Filter functions
  const getFilteredMajorArcana = () => {
    if (majorFilter === 'all') return majorArcana;
    const start = majorFilter === '0-10' ? 0 : 11;
    const end = majorFilter === '0-10' ? 11 : 22;
    return majorArcana.slice(start, end);
  };

  const getFilteredMinorArcana = () => {
    if (minorFilters.size === 0) {
      return Object.values(minorArcana).flat();
    }
    return Object.entries(minorArcana)
      .filter(([suit]) => minorFilters.has(suit))
      .map(([, cards]) => cards)
      .flat();
  };

  const toggleMinorFilter = (suit: string) => {
    const newFilters = new Set(minorFilters);
    if (newFilters.has(suit)) {
      newFilters.delete(suit);
    } else {
      newFilters.add(suit);
    }
    setMinorFilters(newFilters);
  };

  return (
    <div className="py-4 space-y-8 container mx-auto max-w-6xl">
      {/* Welcome Message */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">欢迎回来</h2>
        <p className="text-indigo-200/80">今天的塔罗牌会为你揭示什么呢？</p>
      </div>
      
      {/* Daily Fortune */}
      <DailyFortune />
      
      {/* Spread Selection Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">选择牌阵</h3>
          <button 
            onClick={() => navigateToDrawCards()}
            className="flex items-center text-indigo-300 text-sm hover:text-indigo-200 transition-colors"
          >
            查看全部 <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
          <div onClick={() => navigateToDrawCards('single')}>
            <SpreadOption 
              title="单张牌阵" 
              description="获取每日指引" 
              cardCount={1} 
            />
          </div>
          <div onClick={() => navigateToDrawCards('three')}>
            <SpreadOption 
              title="三张牌阵" 
              description="过去、现在、未来" 
              cardCount={3} 
            />
          </div>
          <div onClick={() => navigateToDrawCards('celtic')}>
            <SpreadOption 
              title="凯尔特十字" 
              description="详细人生解读" 
              cardCount={10} 
            />
          </div>
        </div>
      </section>
      
      {/* Card Collections */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">卡牌查看</h3>
          <button 
            onClick={() => navigateToDrawCards()}
            className="flex items-center text-indigo-300 text-sm hover:text-indigo-200 transition-colors"
          >
            查看牌组 <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Major Arcana */}
          <div className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-6 border border-blue-700/40">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">大阿卡纳</h4>
              <div className="flex space-x-3">
                {['all', '0-10', '11-21'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setMajorFilter(filter)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      majorFilter === filter
                        ? 'bg-indigo-600 text-white'
                        : 'bg-blue-900/50 text-indigo-200 hover:bg-blue-900/70'
                    }`}
                  >
                    {filter === 'all' ? '全部' : `${filter}号牌`}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto mt-4">
              <div className="flex space-x-4 pb-4 scrollbar-hide" style={{ width: 'max-content' }}>
                {getFilteredMajorArcana().map((card, index) => (
                  <div key={index} className="w-32 flex-shrink-0">
                    <TarotCard name={card} isReversed={false} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Minor Arcana */}
          <div className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-6 border border-blue-700/40">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">小阿卡纳</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'wands', label: '权杖' },
                  { id: 'cups', label: '圣杯' },
                  { id: 'swords', label: '宝剑' },
                  { id: 'pentacles', label: '金币' }
                ].map((suit) => (
                  <button
                    key={suit.id}
                    onClick={() => toggleMinorFilter(suit.id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      minorFilters.has(suit.id)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-blue-900/50 text-indigo-200 hover:bg-blue-900/70'
                    }`}
                  >
                    {suit.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto mt-4">
              <div className="flex space-x-4 pb-4 scrollbar-hide" style={{ width: 'max-content' }}>
                {getFilteredMinorArcana().map((card, index) => (
                  <div key={index} className="w-32 flex-shrink-0">
                    <TarotCard name={card} isReversed={false} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Beginner's Guide */}
      <section 
        className="bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40 shadow-lg cursor-pointer hover:border-blue-600/50 transition-colors"
        onClick={() => navigateToDrawCards()}
      >
        <h3 className="text-lg font-semibold text-white mb-2">塔罗新手？</h3>
        <p className="text-indigo-200/80 mb-3">跟随我们的新手指南，探索古老的塔罗奥秘。</p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
          开始学习
        </button>
      </section>
    </div>
  );
};