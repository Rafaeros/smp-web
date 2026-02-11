import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number | undefined | null;
  suffix?: string;
  icon: LucideIcon;
  colorClass?: string;
  bgClass?: string;
}

export function StatCard({
  label,
  value,
  suffix = "",
  icon: Icon,
  colorClass = "text-brand-purple",
  bgClass = "bg-brand-purple/10",
}: StatCardProps) {
  return (
    <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center gap-3 transition-all hover:shadow-md">
      <div className={`p-2 rounded-lg ${bgClass} ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
          {label}
        </p>
        <p className={`text-xl font-bold ${colorClass}`}>
          {value !== undefined && value !== null ? `${value}${suffix}` : "--"}
        </p>
      </div>
    </div>
  );
}
