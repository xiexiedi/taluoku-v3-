import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';

interface TarotCardProps {
  name: string;
  isReversed?: boolean;
}

const cardNameMap: Record<string, string> = {
  'The Fool': '0 愚人',
  'The Magician': '1 魔术师',
  'The High Priestess': '2 女祭司',
  'The Empress': '3 皇后',
  'The Emperor': '4 皇帝',
  'The Hierophant': '5 教皇',
  'The Lovers': '6 恋人',
  'The Chariot': '7 战车',
  'Strength': '8 力量',
  'The Hermit': '9 隐士',
  'Wheel of Fortune': '10 命运之轮',
  'Justice': '11 正义',
  'The Hanged Man': '12 倒吊人',
  'Death': '13 死神',
  'Temperance': '14 节制',
  'The Devil': '15 恶魔',
  'The Tower': '16 高塔',
  'The Star': '17 星星',
  'The Moon': '18 月亮',
  'The Sun': '19 太阳',
  'Judgement': '20 审判',
  'The World': '21 世界',
  // Minor Arcana
  'Ace of Wands': '权杖 1',
  'Two of Wands': '权杖 2',
  'Three of Wands': '权杖 3',
  'Four of Wands': '权杖 4',
  'Five of Wands': '权杖 5',
  'Six of Wands': '权杖 6',
  'Seven of Wands': '权杖 7',
  'Eight of Wands': '权杖 8',
  'Nine of Wands': '权杖 9',
  'Ten of Wands': '权杖 10',
  'Page of Wands': '权杖侍从',
  'Knight of Wands': '权杖骑士',
  'Queen of Wands': '权杖女王',
  'King of Wands': '权杖国王',
  // Cups
  'Ace of Cups': '圣杯 1',
  'Two of Cups': '圣杯 2',
  'Three of Cups': '圣杯 3',
  'Four of Cups': '圣杯 4',
  'Five of Cups': '圣杯 5',
  'Six of Cups': '圣杯 6',
  'Seven of Cups': '圣杯 7',
  'Eight of Cups': '圣杯 8',
  'Nine of Cups': '圣杯 9',
  'Ten of Cups': '圣杯 10',
  'Page of Cups': '圣杯侍从',
  'Knight of Cups': '圣杯骑士',
  'Queen of Cups': '圣杯女王',
  'King of Cups': '圣杯国王',
  // Swords
  'Ace of Swords': '宝剑 1',
  'Two of Swords': '宝剑 2',
  'Three of Swords': '宝剑 3',
  'Four of Swords': '宝剑 4',
  'Five of Swords': '宝剑 5',
  'Six of Swords': '宝剑 6',
  'Seven of Swords': '宝剑 7',
  'Eight of Swords': '宝剑 8',
  'Nine of Swords': '宝剑 9',
  'Ten of Swords': '宝剑 10',
  'Page of Swords': '宝剑侍从',
  'Knight of Swords': '宝剑骑士',
  'Queen of Swords': '宝剑女王',
  'King of Swords': '宝剑国王',
  // Pentacles
  'Ace of Pentacles': '金币 1',
  'Two of Pentacles': '金币 2',
  'Three of Pentacles': '金币 3',
  'Four of Pentacles': '金币 4',
  'Five of Pentacles': '金币 5',
  'Six of Pentacles': '金币 6',
  'Seven of Pentacles': '金币 7',
  'Eight of Pentacles': '金币 8',
  'Nine of Pentacles': '金币 9',
  'Ten of Pentacles': '金币 10',
  'Page of Pentacles': '金币侍从',
  'Knight of Pentacles': '金币骑士',
  'Queen of Pentacles': '金币女王',
  'King of Pentacles': '金币国王',
};

export const TarotCard: React.FC<TarotCardProps> = ({ 
  name, 
  isReversed = false 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getCardImageUrl = (cardName: string): string => {
    const chineseName = cardNameMap[cardName];
    if (!chineseName) {
      console.error(`No Chinese name mapping found for card: ${cardName}`);
      return '';
    }
    return `/塔罗牌库/${chineseName}.png`;
  };

  const handleImageError = () => {
    console.error(`Failed to load image for card: ${name}`);
    setImageError(true);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFullscreen(!showFullscreen);
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <>
      <div className="perspective aspect-[1/1.6] relative group max-w-[200px] mx-auto">
        <div 
          className={`preserve-3d relative w-full h-full transition-transform duration-600 cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          {/* Card Back */}
          <div className="backface-hidden absolute w-full h-full">
            <div className="w-full h-full rounded-lg shadow-lg overflow-hidden">
              <img 
                src="/素材库/卡牌背景.png"
                alt="Card Back"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card Front */}
          <div className={`backface-hidden absolute w-full h-full rotate-y-180 ${isReversed ? 'rotate-180' : ''}`}>
            {!imageError ? (
              <div className="relative w-full h-full">
                <img 
                  src={getCardImageUrl(name)}
                  alt={name}
                  className="w-full h-full object-contain bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg"
                  onError={handleImageError}
                />
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Maximize2 className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 border border-blue-700/30 rounded-lg flex items-center justify-center p-4">
                <div className="text-indigo-300 text-center">
                  <div className="font-semibold mb-2">{cardNameMap[name] || name}</div>
                  <div className="text-sm opacity-80">图片加载失败</div>
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-white text-xs font-semibold">{cardNameMap[name] || name}</p>
              {isReversed && (
                <span className="text-red-300 text-[10px]">逆位</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen modal */}
      {showFullscreen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setShowFullscreen(false)}
        >
          <div className="relative max-w-2xl w-full mx-4">
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div className={`relative ${isReversed ? 'rotate-180' : ''}`}>
              <img 
                src={getCardImageUrl(name)}
                alt={name}
                className="w-full rounded-lg shadow-2xl"
                onError={handleImageError}
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <h3 className="text-white text-lg font-semibold">
                {cardNameMap[name] || name}
                {isReversed && <span className="text-red-300 text-sm ml-2">逆位</span>}
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};