"use client";

import { Box, Calendar, Edit, Eye, Factory, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DataTable,
  SortState,
} from "@/src/core/components/shared/datatable/DataTable";
import { ColumnDef } from "@/src/core/components/shared/datatable/types";
import { PageHeader } from "@/src/core/components/shared/PageHeader";
import { Pagination } from "@/src/core/components/shared/Pagination";

import { useToast } from "@/src/core/contexts/ToastContext";
import {
  OrderFilters,
  orderService,
} from "@/src/features/orders/services/order.service";
import { Order, OrderStatus } from "../types/orders";
import { OrderListFilters } from "./OrderListFiltersProps";

const getStatusBadge = (status: OrderStatus) => {
  const styles: Record<string, string> = {
    [OrderStatus.RELEASED]: "bg-gray-100 text-yellow-600 border-yellow-200",
    [OrderStatus.STARTED]: "bg-blue-50 text-brand-blue border-blue-200",
    [OrderStatus.FINISHED]: "bg-green-50 text-green-600 border-green-200",
    [OrderStatus.STOPPED]: "bg-red-50 text-red-600 border-red-200",
    [OrderStatus.CANCELED]:
      "bg-gray-50 text-gray-400 border-gray-200 line-through",
  };

  const labels: Record<string, string> = {
    [OrderStatus.RELEASED]: "LIBERADA",
    [OrderStatus.STARTED]: "INICIADA",
    [OrderStatus.FINISHED]: "FINALIZADA",
    [OrderStatus.STOPPED]: "PARADA",
    [OrderStatus.CANCELED]: "CANCELADA",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
        styles[status] || "bg-gray-50 border-gray-200 text-gray-500"
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

export function OrderList() {
  const router = useRouter();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<OrderFilters>({});
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState<SortState | undefined>({
    field: "id",
    direction: "desc",
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll(page, 10, activeFilters, sort);
      setOrders(data.content);
      setTotalItems(data.page.totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta ordem?")) return;
    
    try {
      await orderService.delete(id);
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      header: "OP",
      accessorKey: "code",
      cell: (item) => (
        <div
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => router.push(`/orders/${item.id}`)}
        >
          <div className="flex items-center gap-2 font-mono text-xs bg-brand-purple/5 text-brand-purple px-2 py-1 rounded border border-brand-purple/20 font-bold group-hover:bg-brand-purple group-hover:text-white transition-colors">
            <Factory size={12} />
            {item.code}
          </div>
        </div>
      ),
      className: "w-32",
    },
    {
      header: "Produto",
      accessorKey: "productCode",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <Box size={12} className="text-muted-foreground" />
            {item.productCode}
          </span>
        </div>
      ),
      className: "min-w-[150px]",
    },
    {
      header: "Cliente",
      accessorKey: "clientName",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User size={12} />
          {item.clientName || "N/A"}
        </div>
      ),
    },
    {
      header: "Progresso",
      accessorKey: "producedQuantity",
      cell: (item) => {
        const progress =
          item.totalQuantity > 0
            ? Math.min((item.producedQuantity / item.totalQuantity) * 100, 100)
            : 0;

        return (
          <div className="w-full max-w-30">
            <div className="flex justify-between text-[10px] mb-1 font-medium">
              <span>
                {item.producedQuantity} / {item.totalQuantity}
              </span>
              <span className="text-brand-purple">{progress.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-brand-purple to-brand-blue transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => getStatusBadge(item.status),
      className: "w-28 text-center",
    },
    {
      header: "Entrega",
      accessorKey: "deliveryDate",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-md border border-border w-fit">
          <Calendar size={12} />
          {item.deliveryDate
            ? new Date(item.deliveryDate).toLocaleDateString("pt-BR")
            : "--"}
        </div>
      ),
      className: "w-32",
    },
    {
      header: "Ações",
      className: "w-24 text-right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => router.push(`/orders/${item.id}`)}
            className="p-1.5 text-muted-foreground hover:text-brand-blue hover:bg-blue-50 rounded-md transition-colors"
            title="Detalhes"
          >
            <Eye size={16} />
          </button>
          
          <button
            onClick={() => router.push(`/orders/${item.id}/edit`)}
            className="p-1.5 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>

          <button
            onClick={() => handleDelete(item.id)}
            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const activeFiltersCount =
    Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Ordens de Produção"
        subtitle="Controle de OPs e acompanhamento de fábrica"
        icon={Factory}
        onNew={() => router.push("/orders/new")}
        onExport={() => showToast("Exportando dados...", "INFO")}
        filterComponent={
          <OrderListFilters
            onFilter={setActiveFilters}
            activeFiltersCount={activeFiltersCount}
          />
        }
      />

      <div className="pb-10">
        <Pagination
          currentPage={page}
          totalItems={totalItems}
          pageSize={10}
          onPageChange={setPage}
        />

        <DataTable
          data={orders}
          columns={columns}
          getRowId={(o) => o.id}
          loading={loading}
          currentSort={sort}
          onSort={handleSort}
        />
      </div>
    </div>
  );
}