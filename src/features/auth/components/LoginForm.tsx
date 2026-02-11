"use client";

import { FormButton } from "@/src/core/components/forms/FormButton";
import { FormContainer } from "@/src/core/components/forms/FormContainer";
import { FormInput } from "@/src/core/components/forms/FormInput";
import { APP_ROUTES } from "@/src/core/config/routes";
import { Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "../service/auth-service";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authService.login({ username, password });
      router.push(APP_ROUTES.dashboard);
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      const directMessage = err.message;
      if (backendMessage) {
        setError(backendMessage);
      } else if (directMessage && !directMessage.includes("status code")) {
        setError(directMessage);
      } else {
        setError("Usuário ou senha inválidos.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer className="max-w-md mx-auto" onSubmit={handleLogin}>
      <div className="-mx-8 -mt-8 mb-8 p-10 bg-linear-to-r from-brand-purple to-brand-blue relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 skew-y-12 transform -translate-y-1/2" />
        <h1 className="text-3xl font-extrabold text-white tracking-tight relative z-10">
          SMP
        </h1>
        <p className="text-blue-100 mt-2 text-sm relative z-10 font-medium">
          IOT INDUSTRIAL
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center animate-in fade-in slide-in-from-top-2 mb-4">
          <p className="text-red-600 dark:text-red-400 text-sm font-bold">
            {error}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <FormInput
          label="Usuário"
          placeholder="Seu username"
          startIcon={User}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <FormInput
          label="Senha"
          type="password"
          placeholder="••••••••"
          startIcon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="pt-6">
        <FormButton
          type="submit"
          fullWidth
          isLoading={isLoading}
          variant="primary"
        >
          ACESSAR PLATAFORMA
        </FormButton>

        <div className="text-center mt-6 border-t border-border pt-6">
          <span className="text-xs text-muted-foreground font-medium">
            v1.0.0 • Conexão Segura
          </span>
        </div>
      </div>
    </FormContainer>
  );
}
