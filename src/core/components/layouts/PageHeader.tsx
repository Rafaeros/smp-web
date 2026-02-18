"use client";

import { LucideIcon, Plus, Download, RefreshCw } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  onNew?: () => void;
  onExport?: () => void;
  onSync?: () => void;
  isSyncing?: boolean;
  filterComponent?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  onNew, 
  onExport, 
  onSync,
  isSyncing = false,
  filterComponent 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-border mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2.5 bg-brand-purple/10 rounded-xl text-brand-purple">
            <Icon size={24} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {filterComponent}

        {onSync && (
          <button 
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
          </button>
        )}

        {onExport && (
          <button 
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        )}

        {onNew && (
          <button 
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-brand-purple to-brand-blue text-white text-sm font-bold shadow-lg shadow-brand-purple/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} strokeWidth={3} />
            <span>Novo</span>
          </button>
        )}
      </div>
    </div>
  );
}