"use client";

import {
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { ActionDef } from "./types";

interface ActionBarProps {
  title: string;
  subtitle?: string;
  icon: any;
  actions: ActionDef[];
  selectedCount: number;
  totalItems?: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
  onSearch: (term: string) => void;
  onRefresh?: () => void;
  hideSearch?: boolean;
  customFilterComponent?: ReactNode;
}

export function ActionBar({
  title,
  subtitle,
  icon: Icon,
  actions,
  selectedCount,
  totalItems = 0,
  currentPage,
  onPageChange,
  onSearch,
  onRefresh,
  hideSearch = false,
  customFilterComponent,
}: ActionBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!hideSearch) {
      const timer = setTimeout(() => onSearch(searchTerm), 500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, onSearch, hideSearch]);

  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="w-full px-6 py-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-purple/10 rounded-lg text-brand-purple border border-brand-purple/20">
              <Icon size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                {title}
                {selectedCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs border border-brand-purple/20">
                    {selectedCount} selecionados
                  </span>
                )}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border">
            <button
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-md text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-mono px-2 min-w-12 text-center">
              Pág {currentPage + 1}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-md text-muted-foreground hover:text-foreground transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {actions.map((action, idx) => {
              const isDisabled =
                action.disabled ||
                (action.requiresSelection && selectedCount === 0);

              let variantClasses = "";
              switch (action.variant) {
                case "primary":
                  variantClasses =
                    "bg-linear-to-r from-brand-purple to-brand-blue text-white border-transparent hover:shadow-lg hover:shadow-brand-purple/20";
                  break;
                case "danger":
                  variantClasses =
                    "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/50";
                  break;
                case "secondary":
                  variantClasses =
                    "bg-white dark:bg-slate-900 text-foreground border-border hover:bg-muted hover:border-brand-purple/50";
                  break;
                default:
                  variantClasses =
                    "text-muted-foreground hover:text-foreground hover:bg-muted border-transparent";
              }

              if (isDisabled) {
                variantClasses =
                  "opacity-40 grayscale cursor-not-allowed bg-muted text-muted-foreground border-transparent shadow-none";
              }

              return (
                <button
                  key={idx}
                  onClick={action.onClick}
                  disabled={isDisabled}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 active:scale-95 ${variantClasses}`}
                  title={action.tooltip}
                >
                  <action.icon size={16} strokeWidth={2.5} />
                  <span className="hidden md:inline">{action.label}</span>
                </button>
              );
            })}

            <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 text-muted-foreground hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors"
                title="Atualizar"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-1 max-w-sm justify-end">
            {!hideSearch && (
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-brand-purple transition-colors" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-muted/30 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all"
                />
              </div>
            )}
            {!hideSearch && !customFilterComponent && (
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium transition-colors">
                <Filter size={16} className="text-muted-foreground" />
                <span className="hidden sm:inline">Filtros</span>
              </button>
            )}
            {customFilterComponent}
          </div>
        </div>
      </div>
    </div>
  );
}
