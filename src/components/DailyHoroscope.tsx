import React from 'react';
import { Star } from 'lucide-react';

export const DailyHoroscope: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-purple-900/60 to-blue-900/60 backdrop-blur-sm rounded-xl p-5 border border-purple-700/30 shadow-lg relative overflow-hidden">
      <div className="absolute top-3 right-3 text-yellow-300/70">
        <Star className="w-4 h-4 fill-current" />
      </div>
      <div className="absolute top-5 right-7 text-yellow-300/50">
        <Star className="w-3 h-3 fill-current" />
      </div>
      <div className="absolute bottom-4 right-5 text-yellow-300/60">
        <Star className="w-2 h-2 fill-current" />
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
        今日运势
        <span className="ml-2 text-xs bg-purple-700/50 text-purple-200 py-1 px-2 rounded-full">
          4月12日
        </span>
      </h3>
      
      <p className="text-indigo-200/90 text-sm mb-3">
        今天是适合内省的一天。星象显示你将获得对困扰你的事情的清晰认识。
      </p>
      
      <div className="flex items-center space-x-1 text-yellow-300 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className="w-4 h-4" 
            fill={star <= 4 ? "currentColor" : "none"} 
          />
        ))}
        <span className="text-xs text-indigo-200 ml-2">能量指数 4/5</span>
      </div>
      
      <button className="text-indigo-300 text-sm mt-2 flex items-center hover:text-indigo-200 transition-colors">
        查看完整解读
      </button>
    </section>
  );
};