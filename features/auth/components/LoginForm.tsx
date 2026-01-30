'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import { authService } from '../service/auth-service';


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
    <div className="w-full max-w-md bg-[#161b22] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-linear-to-r from-[#7609e8] to-[#316ef3] p-8 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">SMP System</h1>
        <p className="text-white/80 mt-2 text-sm">Industrial IoT Management</p>
      </div>

      <form onSubmit={handleLogin} className="p-8 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Usuário</label>
          <input 
            type="text"
            required
            placeholder="Operador ou Admin"
            className="w-full p-3 bg-[#0f111a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#316ef3] focus:border-transparent outline-none transition-all text-white placeholder-gray-600"
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Senha</label>
          <input 
            type="password"
            required
            placeholder="••••••••"
            className="w-full p-3 bg-[#0f111a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#316ef3] focus:border-transparent outline-none transition-all text-white placeholder-gray-600"
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-r from-[#7609e8] to-[#316ef3] text-white py-3 rounded-lg font-bold hover:brightness-110 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Conectando...' : 'ACESSAR PLATAFORMA'}
        </button>

        <div className="text-center pt-2">
          <span className="text-xs text-gray-600">v4.0.2 - Secure Connection</span>
        </div>
      </form>
    </div>
  );
}