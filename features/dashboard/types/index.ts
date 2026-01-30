export interface DashboardKPI {
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  type: 'production' | 'devices' | 'energy' | 'alerts';
}

export interface DashboardLog {
  id: number;
  device: string;
  action: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error';
}

export interface DashboardSummary {
  kpis: DashboardKPI[];
  recentLogs: DashboardLog[];
}