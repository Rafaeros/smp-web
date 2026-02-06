import { Activity, Cpu, Zap, AlertTriangle } from 'lucide-react';
import { DashboardKPI } from '../types';

const icons = {
  production: { icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
  devices: { icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-50' },
  energy: { icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  alerts: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
};

export function KpiCard({ data }: { data: DashboardKPI }) {
  const style = icons[data.type];
  const Icon = style.icon;

  return (
    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">{data.label}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2">{data.value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${style.bg} ${style.color}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium text-muted-foreground">
        <span className={data.trendDirection === 'up' ? 'text-green-500 font-bold' : 'text-gray-400'}>
          {data.trend}
        </span>
        <span className="ml-1">vs. turno anterior</span>
      </div>
    </div>
  );
}