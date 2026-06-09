'use client';

import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Mail, Lock, User, Sparkles, ShieldCheck } from 'lucide-react';

interface AuthProps {
  onLogin: (user: { name: string; email: string }) => void;
  onRegister: (user: { name: string; email: string }) => void;
}

export default function Auth({ onLogin, onRegister }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) {
      setError('请输入邮箱和密码。');
      return;
    }

    setIsLoading(true);
    const normalizedName = mode === 'register' ? name.trim() || email.split('@')[0] : email.split('@')[0];
    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const body = mode === 'register'
      ? { name: normalizedName, email, password }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || '登录或注册失败，请稍后重试。');
        return;
      }

      const user = { name: result.name, email: result.email };
      if (mode === 'register') {
        onRegister(user);
        return;
      }
      onLogin(user);
    } catch (err) {
      console.error(err);
      setError('网络异常，请检查后端服务是否已启动。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#DDFCD6_0%,#F7FFF4_49%,#ECF8E6_100%)] pb-10">
      <div className="px-5 pt-8">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-[26px] bg-[#DCF8D8] text-[#15803D] shadow-[0_18px_36px_rgba(76,203,99,0.16)]">
            <Sparkles className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#15803D]">欢迎回到知膳</p>
            <h1 className="text-3xl font-bold text-[#111827]">登录 / 注册</h1>
          </div>
        </div>

        <Card className="mt-6 rounded-[32px] border border-[#D0E9D0] bg-white/95 p-6 shadow-[0_18px_36px_rgba(76,203,99,0.12)]">
          <div className="mb-6 flex gap-3 rounded-full bg-[#EFFDF2] p-1">
            {(['register', 'login'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  mode === tab
                    ? 'bg-[#4CCB63] text-white shadow-[0_10px_24px_rgba(76,203,99,0.24)]'
                    : 'text-[#4B5563] hover:text-[#15803D]'
                }`}
              >
                {tab === 'register' ? '新用户注册' : '已有账号登录'}
              </button>
            ))}
          </div>

          {mode === 'register' && (
            <div className="mb-5 rounded-[24px] bg-[#F7FFF4] p-4 text-sm leading-6 text-[#4B5563]">
              小膳青会引导你完成初次设置，帮你更快开始健康饮食旅程。
            </div>
          )}

          <div className="space-y-4">
            {mode === 'register' && (
              <label className="block text-sm font-medium text-[#111827]">
                昵称
                <div className="mt-2">
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="比如：小食客"
                    className="w-full rounded-2xl border border-[#D1D5DB] bg-[#F9FFF3] px-4 py-3 text-sm text-[#111827] outline-none focus:border-[#4BAE5F] focus:ring-2 focus:ring-[#DCF8D8]"
                  />
                </div>
              </label>
            )}

            <label className="block text-sm font-medium text-[#111827]">
              邮箱
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#D1D5DB] bg-[#F9FFF3] px-4 py-3">
                <Mail className="h-4 w-4 text-[#4B5563]" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="请输入你的邮箱"
                  className="w-full bg-transparent text-sm text-[#111827] outline-none"
                />
              </div>
            </label>

            <label className="block text-sm font-medium text-[#111827]">
              密码
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-[#D1D5DB] bg-[#F9FFF3] px-4 py-3">
                <Lock className="h-4 w-4 text-[#4B5563]" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="设置你的登录密码"
                  className="w-full bg-transparent text-sm text-[#111827] outline-none"
                />
              </div>
            </label>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-6 w-full rounded-full bg-[#15803D] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(76,203,99,0.24)] transition hover:bg-[#12702E] disabled:cursor-not-allowed disabled:bg-[#A7D7AF]"
          >
            {isLoading ? (mode === 'register' ? '注册中...' : '登录中...') : mode === 'register' ? '注册并开始' : '登录并继续'}
          </button>

          {error && (
            <div className="mt-4 rounded-2xl bg-[#FEE2E2] px-4 py-3 text-sm text-[#991B1B]">
              {error}
            </div>
          )}

          <div className="mt-6 rounded-[24px] bg-[#EFF7FF] p-4 text-sm leading-6 text-[#2563EB]">
            注册后，将进入小膳青的新手引导环节。当前问题提供固定选项，方便快速完成设置。
          </div>
        </Card>
      </div>
    </div>
  );
}
