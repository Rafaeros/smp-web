"use client";

import { PageHeader } from "@/src/core/components/shared/PageHeader";
import { Pagination } from "@/src/core/components/shared/Pagination";
import {
  DataTable,
  SortState,
} from "@/src/core/components/shared/datatable/DataTable";
import { ColumnDef } from "@/src/core/components/shared/datatable/types";
import { useToast } from "@/src/core/contexts/ToastContext";
import {
  Clock,
  Factory,
  History,
  RefreshCw,
  Smartphone,
  Timer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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
        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
          <Clock size={14} className="text-muted-foreground" />
          {formatDate(item.createdAt)}
        </div>
      ),
      className: "w-40",
    },
    {
      header: "Dispositivo",
      accessorKey: "device",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-blue-50 text-brand-blue">
            <Smartphone size={14} />
          </div>
          <span className="text-sm text-muted-foreground">
            {item.device?.macAdress || "Desconhecido"}
          </span>
        </div>
      ),
    },
    {
      header: "Ordem (OP)",
      accessorKey: "order",
      cell: (item) => (
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() =>
            item.order?.id && router.push(`/orders/${item.order.id}`)
          }
        >
          <div className="p-1 rounded bg-purple-50 text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors">
            <Factory size={14} />
          </div>
          <span className="text-sm font-bold text-foreground group-hover:text-brand-purple transition-colors">
            {item.order?.code || "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Qtd. Prod.",
      accessorKey: "quantityProduced",
      cell: (item) => (
        <div className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">
          +{item.quantityProduced}
        </div>
      ),
    },
    {
      header: "Ciclo (s)",
      accessorKey: "cycleTime",
      cell: (item) => (
        <div className="flex items-center gap-1 text-sm">
          <RefreshCw size={12} className="text-muted-foreground" />
          <span>{item.cycleTime?.toFixed(2) || "0.00"}s</span>
        </div>
      ),
    },
    {
      header: "Pausa (s)",
      accessorKey: "pausedTime",
      cell: (item) => (
        <div
          className={`flex items-center gap-1 text-sm ${
            item.pausedTime && item.pausedTime > 0
              ? "text-amber-600"
              : "text-muted-foreground"
          }`}
        >
          <Timer size={12} />
          <span>{item.pausedTime?.toFixed(2) || "0.00"}s</span>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full bg-background font-sans text-foreground">
      <div className="shrink-0 p-6 pb-0">
        <PageHeader
          title="Histórico de Logs"
          subtitle="Registros detalhados de produção"
          icon={History}
          onExport={() => showToast("Exportando CSV...", "INFO")}
          // Você pode adicionar um LogListFilters aqui similar ao OrderListFilters
          // filterComponent={<LogListFilters onFilter={setActiveFilters} ... />}
        />
      </div>

      <main className="flex-1 flex flex-col min-h-0 p-6 pt-4 space-y-4">
        <div className="shrink-0">
          <Pagination
            currentPage={page}
            totalItems={totalItems}
            pageSize={20}
            onPageChange={setPage}
          />
        </div>

        <div className="flex-1 min-h-0">
          <DataTable
            data={logs}
            columns={columns}
            getRowId={(l) => l.id}
            loading={loading}
            currentSort={sort}
            onSort={handleSort}
          />
        </div>
      </main>
    </div>
  );
}
