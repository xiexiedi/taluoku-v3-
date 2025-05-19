import React, { useState } from 'react';
import { useAuth } from '../lib/auth';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(username, password);
      } else {
        await signUp(username, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '认证失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-blue-900/30 backdrop-blur-sm p-8 rounded-xl border border-blue-700/40">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? '欢迎回来' : '创建账号'}
          </h2>
          <p className="mt-2 text-indigo-200/80">
            {isLogin ? '登录以继续使用塔罗牌' : '注册新账号开始塔罗之旅'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="text-sm font-medium text-indigo-200">
                用户名
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full bg-blue-950/50 border border-blue-700/50 rounded-lg px-4 py-2 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="输入用户名"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-indigo-200">
                密码
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full bg-blue-950/50 border border-blue-700/50 rounded-lg px-4 py-2 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="输入密码"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700/50 text-red-200 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '处理中...' : isLogin ? '登录' : '注册'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-300 hover:text-indigo-200 text-sm"
            >
              {isLogin ? '没有账号？点击注册' : '已有账号？点击登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};