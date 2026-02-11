import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function SectionHeader({ title, icon: Icon, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
      <div className="flex items-center gap-2 text-foreground font-semibold">
        {Icon && <Icon size={18} className="text-brand-purple" />}
        <h3>{title}</h3>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}