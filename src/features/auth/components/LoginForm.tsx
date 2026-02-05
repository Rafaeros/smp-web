'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import { authService } from '../service/auth-service';
import { Lock, User } from 'lucide-react';
import Image from 'next/image';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { token } = await authService.login({ username, password });

      setCookie(undefined, 'smp.token', token, {
        maxAge: 60 * 60 * 8,
        path: '/',
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError('Acesso negado. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
      
      <div className="bg-linear-to-r from-[#7609e8] to-[#316ef3] p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 skew-y-12 transform -translate-y-1/2"></div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight relative z-10">SMP</h1>
        <p className="text-blue-100 mt-2 text-sm relative z-10 font-medium">IOT INDUSTRIAL</p>
      </div>

      <form onSubmit={handleLogin} className="p-8 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-center justify-center">
             <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Usuário</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <User size={18} />
            </div>
            <input 
              type="text"
              required
              placeholder="Seu username"
              className="w-full pl-10 pr-4 py-3 bg-muted border border-transparent focus:bg-background focus:border-brand-blue rounded-xl focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all text-foreground placeholder-muted-foreground"
              onChange={e => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Senha</label>
          <div className="relative">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock size={18} />
            </div>
            <input 
              type="password"
              required
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-muted border border-transparent focus:bg-background focus:border-brand-blue rounded-xl focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all text-foreground placeholder-muted-foreground"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-r from-[#7609e8] to-[#316ef3] text-white py-3.5 rounded-xl font-bold hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> 
              Acessando...
            </span>
          ) : 'ACESSAR PLATAFORMA'}
        </button>

        <div className="text-center pt-2 border-t border-border mt-6">
          <span className="text-xs text-muted-foreground">v1.0.0 • Conexão Segura</span>
        </div>
      </form>
    </div>
  );
}