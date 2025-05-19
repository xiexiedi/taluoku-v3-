import React, { useState, useEffect } from 'react';
import { Moon, Settings, History } from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`sticky top-0 z-10 px-4 py-3 backdrop-blur-md transition-all duration-300 ${
        isScrolled 
          ? 'bg-blue-900/80 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Moon className="w-6 h-6 text-indigo-300" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
            塔罗占卜
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 rounded-full hover:bg-blue-800/50 transition-colors"
            aria-label="历史记录"
          >
            <History className="w-5 h-5 text-indigo-200" />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-blue-800/50 transition-colors"
            aria-label="设置"
          >
            <Settings className="w-5 h-5 text-indigo-200" />
          </button>
        </div>
      </div>
    </header>
  );
};