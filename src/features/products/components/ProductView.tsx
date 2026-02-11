"use client";

import {
  ArrowLeft,
  BarChart3,
  Barcode,
  Clock,
  History,
  Maximize,
  Minimize,
  Timer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DataTable,
  SortState,
} from "@/src/core/components/data-display/datatable/DataTable";
import { ColumnDef } from "@/src/core/components/data-display/datatable/types";
import { Pagination } from "@/src/core/components/data-display/Pagination";
import { StatCard } from "@/src/core/components/data-display/StatCard";

import { TableWrapper } from "@/src/core/components/layouts/TableWrapper";
import { useToast } from "@/src/core/contexts/ToastContext";

import { PageContainer } from "@/src/core/components/layouts/PageContainer";
import { PageContent } from "@/src/core/components/layouts/PageContent";
import { formatSecondsToHHMMSS } from "@/src/core/lib/formatters";
import { logService } from "@/src/features/logs/services/log.service";
import { Log } from "@/src/features/logs/types/logs";
import { productService } from "@/src/features/products/services/product.service";
import { Product, ProductStats } from "@/src/features/products/types/product";
import { format } from "path";

interface ProductViewProps {
  productId: number;
}

export default function ProductView({ productId }: ProductViewProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortState | undefined>({
    field: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, statsData] = await Promise.all([
          productService.getById(productId),
          logService.getProductStats(productId),
        ]);
        setProduct(productData);
        setStats(statsData);
      } catch (error) {
        console.error(error);
        showToast("Erro ao carregar dados", "ERROR");
      }
    };
    loadData();
  }, [productId]);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await logService.getByProduct(productId, page, 20, sort);
        setLogs(data.content);
        setTotalItems(data.page.totalElements);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [productId, page, sort]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const columns: ColumnDef<Log>[] = [
    {
      header: "Data",
      accessorKey: "createdAt",
      cell: (item) => (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={12} /> {formatDate(item.createdAt)}
        </div>
      ),
    },
    {
      header: "OP",
      accessorKey: "order",
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-foreground">
          {item.order?.code || "N/A"}
        </span>
      ),
    },
    {
      header: "Dispositivo",
      accessorKey: "device",
      cell: (item) => (
        <span className="text-xs text-muted-foreground">
          {item.device?.macAddress || "N/A"}
        </span>
      ),
    },
    {
      header: "Produção",
      accessorKey: "cycleTime",
      cell: (item) => (
        <span className="font-medium text-foreground">
          {formatSecondsToHHMMSS(item.cycleTime)}s
        </span>
      ),
    },
    {
      header: "Pausa",
      accessorKey: "pausedTime",
      cell: (item) => (
        <span className="text-amber-600 text-xs">
          {item.pausedTime > 0 ? formatSecondsToHHMMSS(item.pausedTime) : "-"}
        </span>
      ),
    },
    {
      header: "Total",
      accessorKey: "totalTime",
      cell: (item) => (
        <span className="font-bold text-brand-purple">
          {formatSecondsToHHMMSS(item.totalTime)}
        </span>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="shrink-0 flex flex-col gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-purple transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
              <Barcode className="text-brand-purple" />
              {product?.code || "Carregando..."}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              {product?.description}
            </p>
          </div>

          <div className="bg-card border border-border px-4 py-2 rounded-lg flex flex-col items-end shadow-sm self-start">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Total Produzido
            </span>
            <span className="text-2xl font-bold text-foreground">
              {stats?.totalLogs || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Tempo Médio"
          value={formatSecondsToHHMMSS(stats?.avgCycleTime)}
          icon={Timer}
          colorClass="text-brand-purple"
          bgClass="bg-brand-purple/10"
        />
        <StatCard
          label="Melhor Tempo"
          value={formatSecondsToHHMMSS(stats?.minCycleTime)}
          icon={Minimize}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />
        <StatCard
          label="Pior Tempo"
          value={formatSecondsToHHMMSS(stats?.maxCycleTime)}
          icon={Maximize}
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
        />
        <StatCard
          label="Disponibilidade"
          value={"--"}
          suffix="%"
          icon={BarChart3}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />
      </div>

      <PageContent>
        <div className="p-3 border-b border-border flex justify-between items-center bg-muted/20">
          <h3 className="font-bold text-sm flex items-center gap-2 text-foreground">
            <History size={16} className="text-muted-foreground" />
            Histórico de Produção
          </h3>
        </div>

        <TableWrapper>
          <DataTable
            data={logs}
            columns={columns}
            getRowId={(l) => l.id}
            loading={loading}
            currentSort={sort}
            onSort={handleSort}
          />
        </TableWrapper>

        <div className="shrink-0 border-t border-border p-2 bg-muted/20">
          <Pagination
            currentPage={page}
            totalItems={totalItems}
            pageSize={20}
            onPageChange={setPage}
          />
        </div>
      </PageContent>
    </PageContainer>
  );
}
