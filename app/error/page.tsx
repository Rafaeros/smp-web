"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Copy,
  Terminal,
  ShieldAlert,
  CheckCircle,
  MessageCircle,
  Home,
} from "lucide-react";
import { useToast } from "@/src/core/contexts/ToastContext";
import { copyToClipboard } from "@/src/core/lib/utils";
import { motion } from "framer-motion";

const severityConfig = {
  ERROR: {
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    title: "Erro Crítico",
  },
  WARNING: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    title: "Atenção Necessária",
  },
  INFO: {
    icon: ShieldAlert,
    color: "text-brand-blue",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    title: "Acesso Restrito",
  },
  SUCCESS: {
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    title: "Sucesso",
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const message = searchParams.get("message") || "Ocorreu um erro inesperado.";
  const severityParam = searchParams.get("severity")?.toUpperCase() || "ERROR";
  const timestamp = searchParams.get("timestamp") || new Date().toISOString();
  const code = searchParams.get("code") || "500";
  const severity = (
    severityParam in severityConfig ? severityParam : "ERROR"
  ) as keyof typeof severityConfig;
  const config = severityConfig[severity];
  const Icon = config.icon;
  const errorData = {
    code,
    severity,
    timestamp,
    message,
    url: typeof window !== "undefined" ? window.location.href : "",
  };
  const handleContactSupport = () => {
    const phoneNumber = "5543999999999";

    const text =
      `*Suporte SMP - Relatório de Erro*\n\n` +
      `Olá, encontrei um problema no sistema:\n` +
      `*Mensagem:* ${message}\n` +
      `*Código:* ${code}\n` +
      `*Severidade:* ${severity}\n` +
      `*Horário:* ${new Date(timestamp).toLocaleTimeString()}`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleCopyLog = () => {
    copyToClipboard(JSON.stringify(errorData, null, 2));
    showToast("Log técnico copiado!", "INFO");
  };

  return (
    <div className="w-full max-w-lg relative z-10">
      <div className="text-center mb-8 animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl font-extrabold bg-linear-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent select-none tracking-tight">
          SMP
        </h1>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-1">
          Industrial IoT System
        </p>
      </div>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden relative"
      >
        <div
          className={`h-1.5 w-full bg-linear-to-r ${
            severity === "ERROR"
              ? "from-red-500 to-red-600"
              : severity === "WARNING"
              ? "from-amber-500 to-amber-600"
              : "from-brand-purple to-brand-blue"
          }`}
        />

        <div className="p-8 pb-6 text-center">
          <div
            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${config.bg} ${config.color} relative`}
          >
            <div
              className={`absolute inset-0 rounded-full opacity-20 animate-ping ${config.bg}`}
            />
            <Icon size={40} strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-3">
            {config.title}
          </h2>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {message}
          </p>
        </div>
        <div className="px-8 pb-6">
          <div className="bg-muted/50 rounded-xl border border-border/50 overflow-hidden">
            <div className="bg-muted px-3 py-2 flex items-center justify-between border-b border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Terminal size={12} />
                Debug Log
              </span>
              <button
                onClick={handleCopyLog}
                className="text-[10px] flex items-center gap-1 text-brand-purple hover:underline cursor-pointer transition-colors"
              >
                <Copy size={10} /> COPIAR
              </button>
            </div>
            <div className="p-3 bg-[#0d1117] overflow-x-auto custom-scrollbar">
              <pre className="text-[10px] font-mono text-emerald-400 leading-tight">
                {`{
  "code": "${code}",
  "severity": "${severity}",
  "time": "${new Date(timestamp).toLocaleTimeString()}"
}`}
              </pre>
            </div>
          </div>
        </div>
        <div className="p-6 bg-muted/30 border-t border-border grid gap-3">
          <button
            onClick={handleContactSupport}
            className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-500/20 active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            <MessageCircle size={18} className="group-hover:animate-bounce" />
            FALAR COM SUPORTE
          </button>
          <button
            onClick={() => router.back()}
            className="w-full py-3.5 px-4 bg-card border border-border hover:bg-muted text-foreground rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} className="text-muted-foreground" />
            VOLTAR
          </button>

          <button
            onClick={() => router.push("/")}
            className="text-[10px] font-bold text-muted-foreground hover:text-brand-purple transition-colors mt-2 flex items-center justify-center gap-1"
          >
            <Home size={10} />
            IR PARA DASHBOARD
          </button>
        </div>
      </motion.div>
      <p className="text-center text-[10px] font-mono text-muted-foreground/40 mt-6">
        TRACE ID: {btoa(timestamp).substring(0, 16)}
      </p>
    </div>
  );
}
export default function ErrorPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid z-0" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="animate-pulse w-full max-w-md h-96 bg-card rounded-3xl border border-border" />
        }
      >
        <ErrorContent />
      </Suspense>
    </div>
  );
}
