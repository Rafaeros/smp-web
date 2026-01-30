import { api } from "@/core/api/client";
import { DashboardSummary } from "../types";

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          kpis: [
            { label: "OEE Global", value: "82.4%", trend: "+1.2%", trendDirection: 'up', type: 'production' },
            { label: "Dispositivos", value: "2/2", trend: "2 Offline", trendDirection: 'down', type: 'devices' },
            { label: "Ciclo Médio", value: "4m 30s", trend: "-12s", trendDirection: 'up', type: 'energy' },
            { label: "Alertas", value: "3", trend: "Baixo", trendDirection: 'neutral', type: 'alerts' },
          ],
          recentLogs: [
            { id: 1, device: "Solda 01", action: "Iniciou Ciclo OP-204", timestamp: "2 min atrás", type: "info" },
            { id: 2, device: "Montagem B", action: "Pausa (Material)", timestamp: "15 min atrás", type: "warning" },
            { id: 3, device: "Pintura", action: "Falha de Sensor", timestamp: "1h atrás", type: "error" },
          ]
        });
      }, 800);
    });
  }
};