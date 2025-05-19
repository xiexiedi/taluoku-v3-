import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <img 
        src="/素材库/加载动画 copy.gif" 
        alt="加载中"
        className="w-16 h-16"
      />
      <p className="text-indigo-200/80 mt-4">加载中...</p>
    </div>
  );
};