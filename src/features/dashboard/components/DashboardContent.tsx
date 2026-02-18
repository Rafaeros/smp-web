"use client";

import { BarChart3, LayoutDashboard } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/src/core/components/layouts/PageHeader";
import { useToast } from "@/src/core/contexts/ToastContext";
import { formatSmartDuration } from "@/src/core/lib/formatters";
import { dashboardService } from "../service/dashboard.service";
import { DashboardSummary } from "../types";
import { KpiCard } from "./KpiCard";
import { RecentLogs } from "./RecentLogs";

const chartDataMock = [
  { hora: "08:00", qtd: 120 },
  { hora: "09:00", qtd: 150 },
  { hora: "10:00", qtd: 180 },
  { hora: "11:00", qtd: 140 },
  { hora: "12:00", qtd: 90 },
  { hora: "13:00", qtd: 160 },
  { hora: "14:00", qtd: 210 },
];

export default function DashboardPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const summary = await dashboardService.getSummary();
      if (summary && summary.kpis) {
        setData(summary);
      } else {
        console.error("Estrutura de dados recebida é inválida:", summary);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      showToast("Não foi possível carregar os dados do servidor.", "ERROR");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  if (isLoading && !data) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple" />
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="shrink-0">
        <PageHeader
          title="Dashboard Operacional"
          subtitle="Acompanhamento em tempo real da linha de produção"
          icon={LayoutDashboard}
          onSync={fetchDashboard}
          isSyncing={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.kpis?.map((kpi, idx) => {
          const isCycleTime =
            kpi.type === "energy" || kpi.label.toLowerCase().includes("ciclo");
          const displayValue = isCycleTime
            ? formatSmartDuration(Number(kpi.value))
            : kpi.value;

          return (
            <KpiCard
              key={idx}
              data={{
                ...kpi,
                value: displayValue,
              }}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <BarChart3 size={18} className="text-brand-purple" />
              Performance Horária (Peças/Hora)
            </h3>
          </div>

          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.performanceData || []}>
                <defs>
                  <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(128,128,128,0.1)"
                />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="qty"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorQty)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="h-full">
          <RecentLogs logs={data?.recentLogs || []} />
        </div>
      </div>
    </div>
  );
}
