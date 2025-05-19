import React from 'react';
import { Home, BookHeart, Compass, Book, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: React.ReactNode;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  currentPage, 
  onNavigate 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { 
      id: 'home', 
      path: '/',
      label: '首页', 
      icon: <Home className="w-6 h-6" /> 
    },
    { 
      id: 'favorites', 
      path: '/favorites',
      label: '历史', 
      icon: <BookHeart className="w-6 h-6" /> 
    },
    { 
      id: 'draw', 
      path: '/draw',
      label: '抽牌', 
      icon: <Compass className="w-6 h-6" /> 
    },
    { 
      id: 'journal', 
      path: '/journal',
      label: '日志', 
      icon: <Book className="w-6 h-6" /> 
    },
    { 
      id: 'profile', 
      path: '/profile',
      label: '我的', 
      icon: <User className="w-6 h-6" /> 
    },
  ];

  const handleNavigation = (item: NavItem) => {
    onNavigate(item.id);
    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10">
      <div className="backdrop-blur-md bg-blue-900/60 shadow-[0_-4px_16px_rgba(0,0,0,0.2)] border-t border-blue-700/30">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/' && location.pathname === '') ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                  isActive
                    ? 'text-indigo-300 scale-110'
                    : 'text-indigo-300/70 hover:text-indigo-200'
                }`}
                aria-label={item.label}
              >
                <div className="relative">
                  {React.cloneElement(item.icon as React.ReactElement, {
                    fill: isActive ? 'currentColor' : 'none',
                    strokeWidth: isActive ? 1.5 : 2,
                  })}
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};