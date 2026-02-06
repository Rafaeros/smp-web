"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowDownUp,
  Loader2,
  CheckSquare,
  Square,
} from "lucide-react";
import { ColumnDef } from "./types";

export interface SortState {
  field: string;
  direction: "asc" | "desc";
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  getRowId: (item: T) => number | string;
  onSort?: (field: string) => void;
  currentSort?: SortState;
  selectedIds?: Set<number | string>;
  onSelectAll?: (checked: boolean) => void;
  onSelectRow?: (id: number | string) => void;
}

export function DataTable<T>({
  data,
  columns,
  loading,
  getRowId,
  onSort,
  currentSort,
  selectedIds,    
  onSelectAll,  
  onSelectRow,    
}: DataTableProps<T>) {
  
  const isSelectionEnabled = selectedIds && onSelectAll && onSelectRow;

  const allSelected = isSelectionEnabled && data.length > 0 && data.every((item) => selectedIds.has(getRowId(item)));

  const getSortIcon = (columnKey?: string) => {
    if (!columnKey || !currentSort || currentSort.field !== columnKey) {
      return <ArrowDownUp size={14} className="opacity-30" />;
    }
    if (currentSort.direction === "asc") {
      return <ArrowUp size={14} className="text-brand-purple" />;
    }
    return <ArrowDown size={14} className="text-brand-purple" />;
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
            <tr>
              {isSelectionEnabled && (
                <th className="p-4 w-12 text-center">
                  <button
                    onClick={() => onSelectAll(!allSelected)}
                    className="text-muted-foreground hover:text-brand-purple transition-colors"
                  >
                    {allSelected ? <CheckSquare size={18} className="text-brand-purple" /> : <Square size={18} />}
                  </button>
                </th>
              )}

              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 font-bold tracking-wider ${col.className || ""}`}
                >
                  {col.accessorKey ? (
                    <div
                      className="flex items-center gap-2 cursor-pointer hover:text-foreground select-none group"
                      onClick={() => onSort && onSort(col.accessorKey as string)}
                    >
                      {col.header}
                      {getSortIcon(col.accessorKey as string)}
                    </div>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (isSelectionEnabled ? 1 : 0)} className="p-12 text-center">
                  <Loader2 className="animate-spin w-8 h-8 text-brand-purple mx-auto" />
                  <p className="mt-2 text-muted-foreground text-xs font-medium uppercase tracking-widest">
                    Carregando dados...
                  </p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (isSelectionEnabled ? 1 : 0)} className="p-16 text-center text-muted-foreground">
                  <p>Nenhum registro encontrado.</p>
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const id = getRowId(item);
                const isSelected = isSelectionEnabled ? selectedIds.has(id) : false;

                return (
                  <tr
                    key={id}
                    onClick={() => isSelectionEnabled && onSelectRow && onSelectRow(id)}
                    className={`
                      group transition-all duration-200
                      ${isSelectionEnabled && "cursor-pointer"} 
                      ${isSelected ? "bg-brand-purple/5" : "hover:bg-muted/30"}
                    `}
                  >
                    {isSelectionEnabled && (
                      <td className="p-4 text-center relative">
                        {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-purple" />}
                        <button className={`transition-colors ${isSelected ? "text-brand-purple" : "text-muted-foreground"}`}>
                          {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                      </td>
                    )}

                    {columns.map((col, idx) => (
                      <td key={idx} className="px-4 py-3">
                        {col.cell ? col.cell(item) : (item as any)[col.accessorKey as string]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}