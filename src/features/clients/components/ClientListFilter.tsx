"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

interface ClientListFiltersProps {
  onFilter: (filters: any) => void;
}

export function ClientListFilters({ onFilter }: ClientListFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: ""
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleanState = { name: "" };
    setFilters(cleanState);
    onFilter(cleanState);
  };

  return (
    <div className="relative z-20">
      <div className="flex gap-2">
         <div className="relative hidden sm:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-card text-sm focus:ring-2 focus:ring-brand-purple outline-none"
              placeholder="Pesquisa rápida..."
            />
         </div>

         <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all
                ${isOpen || filters.name
                    ? "bg-brand-purple/10 border-brand-purple text-brand-purple" 
                    : "bg-card border-border hover:bg-muted"
                }
            `}
         >
            <Filter size={16} />
            <span>Filtros</span>
            {/* Badge se tiver filtros ativos */}
            {(filters.name ) && (
                <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
            )}
         </button>
      </div>

      {/* O POPOVER (O menu flutuante da imagem) */}
      {isOpen && (
        <>
          {/* Backdrop invisível para fechar ao clicar fora */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl p-5 z-20 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-foreground">Pesquisa Avançada</h3>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X size={16} />
                </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Nome / Razão Social</label>
                    <input 
                        type="text" 
                        className="w-full p-2 rounded-lg border bg-muted/50 text-sm focus:border-brand-purple outline-none"
                        value={filters.name}
                        onChange={e => setFilters({...filters, name: e.target.value})}
                    />
                </div>

                <div className="pt-2 flex gap-2">
                    <button 
                        type="button"
                        onClick={handleClear}
                        className="flex-1 py-2 text-xs font-bold text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                        LIMPAR
                    </button>
                    <button 
                        type="submit"
                        className="flex-1 py-2 text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple/90 rounded-lg shadow-lg shadow-brand-purple/20 transition-all"
                    >
                        APLICAR
                    </button>
                </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}