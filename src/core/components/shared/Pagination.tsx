"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ 
  currentPage, 
  totalItems, 
  pageSize = 10, 
  onPageChange 
}: PaginationProps) {
  const safeTotalItems = Number(totalItems) || 0;
  const safePageSize = Number(pageSize) || 10;
  const safeCurrentPage = Number(currentPage) || 0;

  // CORREÇÃO: Se for 0, simplesmente não renderiza nada. 
  // Deixa a DataTable lidar com o visual de "Vazio" ou "Loading".
  if (safeTotalItems === 0) return null;

  const totalPages = Math.ceil(safeTotalItems / safePageSize);
  const startItem = safeCurrentPage * safePageSize + 1;
  const endItem = Math.min((safeCurrentPage + 1) * safePageSize, safeTotalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-b border-border mb-4">
      <div className="text-xs text-muted-foreground font-medium">
        Mostrando <span className="text-foreground font-bold">{startItem}</span> -{" "}
        <span className="text-foreground font-bold">{endItem}</span> de{" "}
        <span className="text-foreground font-bold">{safeTotalItems}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(0)}
          disabled={safeCurrentPage === 0}
          className="p-1.5 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-40 transition-colors"
          title="Primeira"
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 0}
          className="p-1.5 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-40 transition-colors"
          title="Anterior"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-xs font-bold px-3 min-w-12 text-center">
          Pág {safeCurrentPage + 1} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= totalPages - 1}
          className="p-1.5 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-40 transition-colors"
          title="Próxima"
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={safeCurrentPage >= totalPages - 1}
          className="p-1.5 rounded-md border border-border bg-card hover:bg-muted disabled:opacity-40 transition-colors"
          title="Última"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}