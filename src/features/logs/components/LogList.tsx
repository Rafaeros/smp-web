"use client";

import {
  DataTable,
  SortState,
} from "@/src/core/components/data-display/datatable/DataTable";
import { ColumnDef } from "@/src/core/components/data-display/datatable/types";
import { Pagination } from "@/src/core/components/data-display/Pagination";
import { PageHeader } from "@/src/core/components/layouts/PageHeader";
import { useToast } from "@/src/core/contexts/ToastContext";
import { formatSecondsToHHMMSS } from "@/src/core/lib/formatters";
import {
  Clock,
  Factory,
  History,
  RefreshCw,
  Smartphone,
  Timer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogFilters, logService } from "../services/log.service";
import { Log } from "../types/logs";

export default function LogList() {
  const router = useRouter();
  const { showToast } = useToast();

  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<LogFilters>({});
  const [sort, setSort] = useState<SortState | undefined>({
    field: "createdAt",
    direction: "desc",
  });
  const [totalItems, setTotalItems] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await logService.getAll(page, 20, activeFilters, sort);
      setLogs(data.content);
      setTotalItems(data.page.totalElements);
    } catch (error) {
      console.error(error);
      showToast("Erro ao carregar logs", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, activeFilters, sort]);

  const handleSort = (field: string) => {
    setSort((prev) => {
      if (prev && prev.field === field) {
        return prev.direction === "asc"
          ? { field, direction: "desc" }
          : undefined;
      }
      return { field, direction: "asc" };
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString(
      "pt-BR",
      { hour: "2-digit", minute: "2-digit", second: "2-digit" },
    )}`;
  };

  const columns: ColumnDef<Log>[] = [
    {
      header: "ID",
      accessorKey: "id",
      className: "w-16 text-center font-mono text-xs text-muted-foreground",
    },
    {
      header: "Data / Hora",
      accessorKey: "createdAt",
      cell: (item) => (
        <div className="flex items-center gap-2 text-xs font-medium text-foreground whitespace-nowrap">
          <Clock size={14} className="text-muted-foreground" />
          {formatDateTime(item.createdAt)}
        </div>
      ),
      className: "w-48",
    },
    {
      header: "Dispositivo",
      accessorKey: "device",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-blue-50 text-brand-blue border border-blue-100">
            <Smartphone size={14} />
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {item.device?.macAddress || "Desconhecido"}
          </span>
        </div>
      ),
    },
    {
      header: "Ordem (OP)",
      accessorKey: "order",
      cell: (item) => (
        <div
          className="flex items-center gap-2 cursor-pointer group w-fit active:scale-95 transition-all"
          onClick={() =>
            item.order?.id && router.push(`/orders/${item.order.id}`)
          }
          title="Ver detalhes da Ordem"
        >
          <div
            className="flex items-center gap-2 font-mono text-xs px-2 py-1 rounded border font-bold transition-all duration-300
            bg-brand-purple/5 text-brand-purple border-brand-purple/20
            group-hover:bg-linear-to-r group-hover:from-brand-purple group-hover:to-brand-blue group-hover:text-white group-hover:border-transparent group-hover:shadow-md"
          >
            <Factory size={12} />
            {item.order?.code || "N/A"}
          </div>
        </div>
      ),
    },
    {
      header: "Qtd. Prod.",
      accessorKey: "quantityProduced",
      cell: (item) => (
        <div className="font-mono font-bold text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">
          +{item.quantityProduced}
        </div>
      ),
    },
    {
      header: "Qtd. Pausas",
      accessorKey: "quantityPaused",
      cell: (item) => (
        <div
          className={`font-mono font-bold text-xs px-2 py-0.5 rounded border w-fit ${
            item.quantityPaused && item.quantityPaused > 0
              ? "text-amber-600 bg-amber-50 border-amber-100"
              : "text-muted-foreground bg-muted border-border"
          }`}
        >
          {item.quantityPaused || 0}
        </div>
      ),
    },
    {
      header: "Produção",
      accessorKey: "cycleTime",
      cell: (item) => (
        <div className="flex items-center gap-1 text-sm font-medium">
          <RefreshCw size={12} className="text-muted-foreground" />
          <span>{formatSecondsToHHMMSS(item.cycleTime)}</span>
        </div>
      ),
    },
    {
      header: "Pausa",
      accessorKey: "pausedTime",
      cell: (item) => (
        <div
          className={`flex items-center gap-1 text-sm ${
            item.pausedTime && item.pausedTime > 0
              ? "text-amber-600 font-medium"
              : "text-muted-foreground"
          }`}
        >
          <Timer size={12} />
          <span>{formatSecondsToHHMMSS(item.pausedTime)}</span>
        </div>
      ),
    },
    {
      header: "Total",
      accessorKey: "totalTime",
      cell: (item) => (
        <div className="flex items-center gap-1 text-sm font-bold text-foreground">
          <Timer size={12} className="text-muted-foreground" />
          <span>{formatSecondsToHHMMSS(item.totalTime)}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="shrink-0">
        <PageHeader
          title="Histórico de Logs"
          subtitle="Registros detalhados de produção"
          icon={History}
          onExport={() => showToast("Exportando CSV...", "INFO")}
          // Adicione LogFilters aqui se tiver criado o componente de filtro
          // filterComponent={<LogListFilters ... />}
        />
      </div>
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
            Listagem
          </span>
          <span className="text-[10px] font-bold bg-white border border-border px-2 py-0.5 rounded text-muted-foreground shadow-sm">
            {totalItems} Logs Encontrados
          </span>
        </div>
        <div className="overflow-x-auto">
          <DataTable
            data={logs}
            columns={columns}
            getRowId={(l) => l.id}
            loading={loading}
            currentSort={sort}
            onSort={handleSort}
          />
        </div>
        <div className="border-t border-border p-2 bg-muted/30">
          <Pagination
            currentPage={page}
            totalItems={totalItems}
            pageSize={20}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
