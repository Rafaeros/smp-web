interface InfoCardProps {
  label: string;
  value: string | number | undefined | null;
  className?: string;
}

export function InfoCard({ label, value, className }: InfoCardProps) {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground truncate block" title={String(value)}>
        {value || "--"}
      </span>
    </div>
  );
}