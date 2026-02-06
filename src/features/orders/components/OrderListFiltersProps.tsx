"use client";

import { Box, Calendar, Factory, Filter, Search, User, X } from "lucide-react";
import { useState } from "react";
import { OrderFilters } from "../services/order.service";
import { OrderStatus } from "../types/orders";

interface OrderListFiltersProps {
  onFilter: (filters: OrderFilters) => void;
  activeFiltersCount: number;
}

const statusOptions = [
  { label: "Liberada", value: OrderStatus.RELEASED },
  { label: "Iniciada", value: OrderStatus.STARTED },
  { label: "Finalizada", value: OrderStatus.FINISHED },
];

export function OrderListFilters({
  onFilter,
  activeFiltersCount,
}: OrderListFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [localFilters, setLocalFilters] = useState<OrderFilters>({
    code: "",
    productCode: "",
    clientId: "",
    status: "",
    startDeliveryDate: "",
    endDeliveryDate: "",
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleanState = {
      code: "",
      productCode: "",
      clientId: "",
      status: "",
      startDeliveryDate: "",
      endDeliveryDate: "",
    };
    setLocalFilters(cleanState);
    onFilter(cleanState);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all
            ${
              isOpen || activeFiltersCount > 0
                ? "bg-brand-purple/10 border-brand-purple text-brand-purple"
                : "bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground"
            }
        `}
      >
        <Filter size={16} />
        <span>Filtros</span>
        {activeFiltersCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-purple text-white text-[10px] font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="bg-card border border-border rounded-xl shadow-2xl p-5 z-20 animate-in fade-in zoom-in-95 slide-in-from-top-2 fixed left-4 right-4 top-24 w-auto md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-80 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Search size={14} className="text-brand-purple" />
                Filtrar Ordens
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              {/* Código OP */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                  <Factory size={12} /> Código OP
                </label>
                <input
                  type="text"
                  placeholder="Ex: 240101"
                  className="w-full p-2.5 rounded-lg border border-border bg-muted/30 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all"
                  value={localFilters.code}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, code: e.target.value })
                  }
                  autoFocus
                />
              </div>

              {/* Produto */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                  <Box size={12} /> Cód. Produto
                </label>
                <input
                  type="text"
                  placeholder="Ex: MWM..."
                  className="w-full p-2.5 rounded-lg border border-border bg-muted/30 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all"
                  value={localFilters.productCode}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      productCode: e.target.value,
                    })
                  }
                />
              </div>

              {/* ID Cliente (Texto Simples por enquanto) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                  <User size={12} /> ID Cliente
                </label>
                <input
                  type="number"
                  placeholder="Ex: 55"
                  className="w-full p-2.5 rounded-lg border border-border bg-muted/30 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all"
                  value={localFilters.clientId}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      clientId: e.target.value,
                    })
                  }
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Status
                </label>
                <select
                  className="w-full p-2.5 rounded-lg border border-border bg-muted/30 text-sm focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all"
                  value={localFilters.status}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, status: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Datas de Entrega */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    <Calendar size={12} /> De
                  </label>
                  <input
                    type="date"
                    className="w-full p-2.5 rounded-lg border border-border bg-muted/30 text-xs focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all"
                    value={localFilters.startDeliveryDate}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        startDeliveryDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    <Calendar size={12} /> Até
                  </label>
                  <input
                    type="date"
                    className="w-full p-2.5 rounded-lg border border-border bg-muted/30 text-xs focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple outline-none transition-all"
                    value={localFilters.endDeliveryDate}
                    onChange={(e) =>
                      setLocalFilters({
                        ...localFilters,
                        endDeliveryDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border"
                >
                  LIMPAR
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-linear-to-r from-brand-purple to-brand-blue hover:shadow-lg hover:shadow-brand-purple/20 rounded-lg transition-all active:scale-95"
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
