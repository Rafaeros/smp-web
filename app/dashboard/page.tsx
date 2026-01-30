'use client'

import { useEffect, useState } from "react";
import { dashboardService } from "@/features/dashboard/service/dashboard.service";
import { DashboardSummary } from "@/features/dashboard/types";
import { KpiCard } from "@/features/dashboard/components/KpiCard";
import { RecentLogs } from "@/features/dashboard/components/RecentLogs";
import { Activity } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const result = await dashboardService.getSummary();
        setData(result);
      } catch (error) {
        console.error("Falha ao carregar dashboard", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Operacional</h1>
          <p className="text-muted-foreground mt-1">Visão em tempo real da linha de montagem.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-medium text-green-600 dark:text-green-400">Sistema Online</span>
        </div>
      </header>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.kpis.map((kpi, index) => (
            <KpiCard key={index} data={kpi} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 min-h-87.5 flex flex-col items-center justify-center text-muted-foreground relative overflow-hidden group shadow-sm">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <Activity size={48} className="mb-4 text-brand-purple opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <p className="font-medium">Analytics de Produção</p>
          <span className="text-xs text-muted-foreground mt-2 bg-muted px-3 py-1 rounded-full border border-border">
            Aguardando dados históricos...
          </span>
        </div>

        <div className="h-full">
          {data && <RecentLogs logs={data.recentLogs} />}
        </div>
      </div>
    </div>
  );
}