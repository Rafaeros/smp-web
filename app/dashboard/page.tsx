"use client";

import { StatCard } from "@/src/core/components/data-display/StatCard";
import { PageHeader } from "@/src/core/components/layouts/PageHeader";
import { useToast } from "@/src/core/contexts/ToastContext";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Factory,
  LayoutDashboard,
  Timer,
} from "lucide-react";
import { useState } from "react";

type LogMock = {
  id: number;
  message: string;
  time: string;
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
};

export default function DashboardPage() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const kpis = [
    {
      label: "Eficiência Global (OEE)",
      value: "84.5",
      suffix: "%",
      icon: Activity,
      color: "text-brand-purple",
      bg: "bg-brand-purple/10",
      trend: "+2.4% vs ontem",
    },
    {
      label: "Produção Hoje",
      value: "1,248",
      suffix: " un",
      icon: Factory,
      color: "text-brand-blue",
      bg: "bg-blue-50",
      trend: "Meta: 1,500",
    },
    {
      label: "Tempo de Ciclo Médio",
      value: "42",
      suffix: "s",
      icon: Timer,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: "-3s (Melhoria)",
    },
    {
      label: "Alertas Ativos",
      value: "3",
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "Requer atenção",
    },
  ];

  const recentLogs: LogMock[] = [
    {
      id: 1,
      message: "Ordem OP-2024-001 Finalizada",
      time: "10:42",
      type: "SUCCESS",
    },
    {
      id: 2,
      message: "Parada detectada: Device #04",
      time: "10:30",
      type: "WARNING",
    },
    {
      id: 3,
      message: "Início de produção: OP-2024-002",
      time: "10:15",
      type: "INFO",
    },
    {
      id: 4,
      message: "Falha de conexão: Device #02",
      time: "09:55",
      type: "ERROR",
    },
    {
      id: 5,
      message: "Operador logado: Rafael Costa",
      time: "08:00",
      type: "INFO",
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="shrink-0">
        <PageHeader
          title="Dashboard Operacional"
          subtitle="Visão geral da linha de produção em tempo real"
          icon={LayoutDashboard}
          onExport={() => showToast("Atualizando dados...", "INFO")}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="relative group">
            <StatCard
              label={kpi.label}
              value={kpi.value}
              suffix={kpi.suffix}
              icon={kpi.icon}
              colorClass={kpi.color}
              bgClass={kpi.bg}
            />
            <div className="absolute top-4 right-4 text-[10px] font-bold text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full border border-border">
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-100">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 flex flex-col shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <BarChart3 size={18} className="text-brand-purple" />
              Performance Horária
            </h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              Últimas 12h
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center relative border-2 border-dashed border-border/50 rounded-lg bg-muted/10">
            <div className="text-center z-10">
              <Activity
                size={48}
                className="mx-auto mb-3 text-muted-foreground/30 group-hover:text-brand-purple/50 group-hover:scale-110 transition-all duration-500"
              />
              <p className="text-sm font-medium text-muted-foreground">
                Gráfico de Produção
              </p>
              <p className="text-xs text-muted-foreground/60">
                Aguardando dados reais...
              </p>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Clock size={16} className="text-brand-blue" />
              Atividade Recente
            </h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar max-h-100">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
              >
                <div
                  className={`mt-0.5 shrink-0 w-2 h-2 rounded-full ${
                    log.type === "SUCCESS"
                      ? "bg-green-500"
                      : log.type === "WARNING"
                      ? "bg-amber-500"
                      : log.type === "ERROR"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {log.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    {log.time} • {log.type}
                  </p>
                </div>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs p-8">
                <CheckCircle2 size={24} className="mb-2 opacity-20" />
                Nenhuma atividade recente
              </div>
            )}
          </div>

          <div className="p-2 border-t border-border bg-muted/10 text-center">
            <button className="text-[10px] font-bold text-brand-purple hover:underline uppercase tracking-wider">
              Ver todos os logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
