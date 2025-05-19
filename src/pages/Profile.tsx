import React, { useEffect } from 'react';
import { User, Mail, Book, BookHeart, Compass, Moon, LogOut, ChevronRight, Settings } from 'lucide-react';
import { StatisticsDisplay } from '../components/StatisticsDisplay';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="py-6 space-y-8">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-indigo-600/30 rounded-full flex items-center justify-center border-2 border-indigo-400/30 mb-4">
          <User className="w-12 h-12 text-indigo-200" />
        </div>
        <h2 className="text-xl font-bold text-white">{user?.username || '神秘追寻者'}</h2>
        <p className="text-indigo-200/70 text-sm">2025年4月加入</p>
      </div>
      
      {/* 用户数据统计 */}
      <StatisticsDisplay />
      
      {/* 菜单选项 */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white mb-3">账号设置</h3>
        
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40 text-white">
            <div className="flex items-center">
              <Mail className="w-5 h-5 mr-3 text-indigo-300" />
              <span>邮件订阅</span>
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-300" />
          </button>
          
          <button className="w-full flex items-center justify-between bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40 text-white">
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-3 text-indigo-300" />
              <span>应用设置</span>
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-300" />
          </button>
          
          <button className="w-full flex items-center justify-between bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40 text-white">
            <div className="flex items-center">
              <Moon className="w-5 h-5 mr-3 text-indigo-300" />
              <span>外观设置</span>
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-300" />
          </button>
        </div>
      </div>
      
      {/* 活动记录 */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white mb-3">活动记录</h3>
        
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/draw')}
            className="w-full flex items-center justify-between bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40 text-white"
          >
            <div className="flex items-center">
              <Compass className="w-5 h-5 mr-3 text-indigo-300" />
              <span>解读历史</span>
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-300" />
          </button>
          
          <button 
            onClick={() => navigate('/favorites')}
            className="w-full flex items-center justify-between bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40 text-white"
          >
            <div className="flex items-center">
              <BookHeart className="w-5 h-5 mr-3 text-indigo-300" />
              <span>收藏解读</span>
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-300" />
          </button>
          
          <button 
            onClick={() => navigate('/journal')}
            className="w-full flex items-center justify-between bg-blue-900/20 backdrop-blur-sm rounded-xl p-4 border border-blue-700/40 text-white"
          >
            <div className="flex items-center">
              <Book className="w-5 h-5 mr-3 text-indigo-300" />
              <span>日志记录</span>
            </div>
            <ChevronRight className="w-5 h-5 text-indigo-300" />
          </button>
        </div>
      </div>
      
      {/* 退出按钮 */}
      <button 
        onClick={handleSignOut}
        className="w-full flex items-center justify-center bg-red-900/30 text-red-300 rounded-xl p-4 border border-red-700/40 mt-8 hover:bg-red-900/50 transition-colors"
      >
        <LogOut className="w-5 h-5 mr-2" />
        退出登录
      </button>
    </div>
  );
};