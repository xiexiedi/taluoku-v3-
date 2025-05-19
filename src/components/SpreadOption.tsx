import React from 'react';

interface SpreadOptionProps {
  title: string;
  description: string;
  cardCount: number;
}

export const SpreadOption: React.FC<SpreadOptionProps> = ({ 
  title, 
  description, 
  cardCount 
}) => {
  // Generate a simple visual representation of the spread
  const renderSpreadPreview = () => {
    const cards = [];
    for (let i = 0; i < cardCount; i++) {
      cards.push(
        <div 
          key={i}
          className={`absolute bg-indigo-600 rounded-md border border-indigo-400/30 shadow-[0_0_10px_rgba(79,70,229,0.2)]`}
          style={{
            width: '20px',
            height: '30px',
            transform: `rotate(${(i * 15) - (cardCount * 5)}deg) translateX(${i * 4}px)`,
            transformOrigin: 'center bottom',
            left: `calc(50% - ${cardCount * 2}px)`,
            bottom: '10px'
          }}
        />
      );
    }
    return cards;
  };

  return (
    <div 
      className="flex-shrink-0 w-44 h-40 bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40 shadow-lg flex flex-col justify-between cursor-pointer hover:bg-blue-800/50 transition-all duration-300 hover:scale-105"
    >
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-xs text-indigo-200/80 mt-1">{description}</p>
      </div>
      
      <div className="relative h-16 mt-2 flex items-end justify-center">
        {renderSpreadPreview()}
      </div>
    </div>
  );
};