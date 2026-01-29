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
        maxAge: 60 * 60 * 2,
        path: '/',
      });

      router.push('/home');
    } catch (err: any) {
      setError('Credenciais inválidas ou erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
      {/* Header com o Gradiente solicitado */}
      <div className="bg-linear-to-r from-[#5d25be] to-[#2596be] p-8 text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">SMP System</h1>
        <p className="text-blue-100 mt-2">Acesse sua conta para continuar</p>
      </div>

      <form onSubmit={handleLogin} className="p-8 space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Usuário</label>
          <input 
            type="text"
            required
            placeholder="Seu username"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2596be] focus:border-transparent outline-none transition-all text-black"
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Senha</label>
          <input 
            type="password"
            required
            placeholder="••••••••"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2596be] focus:border-transparent outline-none transition-all text-black"
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-r from-[#5d25be] to-[#2596be] text-white py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-lg disabled:grayscale"
        >
          {isLoading ? 'Autenticando...' : 'ENTRAR'}
        </button>

        <div className="text-center">
          <a href="#" className="text-sm text-gray-500 hover:text-[#2596be] transition-colors">Esqueceu a senha?</a>
        </div>
      </form>
    </div>
  );
}