"use client";

import {
  ArrowLeft,
  Calendar,
  Factory,
  History,
  Package,
  User,
  Clock,
  AlertCircle,
  Timer,
  BarChart3,
  Minimize,
  Maximize
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StatCard } from "@/src/core/components/data-display/StatCard";
import { DataTable, SortState } from "@/src/core/components/data-display/datatable/DataTable";
import { ColumnDef } from "@/src/core/components/data-display/datatable/types";
import { Pagination } from "@/src/core/components/data-display/Pagination";
import { useToast } from "@/src/core/contexts/ToastContext";
import { formatSecondsToHHMMSS } from "@/src/core/lib/formatters";
import { logService } from "@/src/features/logs/services/log.service";
import { Log } from "@/src/features/logs/types/logs";
import { orderService } from "@/src/features/orders/services/order.service";
import { Order, OrderStatus, OrderStats } from "@/src/features/orders/types/orders";

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const styles: Record<string, string> = {
    [OrderStatus.RELEASED]: "bg-gray-100 text-yellow-700 border-yellow-200",
    [OrderStatus.STARTED]: "bg-blue-50 text-brand-blue border-blue-200",
    [OrderStatus.FINISHED]: "bg-green-50 text-green-700 border-green-200",
    [OrderStatus.STOPPED]: "bg-red-50 text-red-700 border-red-200",
    [OrderStatus.CANCELED]: "bg-gray-50 text-gray-400 border-gray-200 line-through",
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
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
        styles[status] || "bg-gray-50 border-gray-200 text-gray-500"
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

const CircularProgress = ({ value }: { value: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const strokeColor = value === 100 ? "text-emerald-500" : "text-brand-purple";

  return (
    <div className="relative w-12 h-12 md:w-14 md:h-14">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
        <circle className="text-muted/30" strokeWidth="4" stroke="currentColor" fill="transparent" r={radius} cx="22" cy="22"/>
        <circle 
          className={`${strokeColor} transition-all duration-1000 ease-out`}
          strokeWidth="4" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
          stroke="currentColor" 
          fill="transparent" 
          r={radius} cx="22" cy="22" 
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-[10px] md:text-xs font-bold text-foreground">
        {value}%
      </div>
    </div>
  );
};

interface OrderViewProps {
  orderId: number;
}

export default function OrderView({ orderId }: OrderViewProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [stats, setStats] = useState<OrderStats | null>(null);
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
        const [orderData, statsData] = await Promise.all([
             orderService.getById(orderId),
             logService.getOrderStats(orderId)
        ]);
        setOrder(orderData);
        setStats(statsData);
      } catch (error) {
        showToast("Erro ao carregar dados da ordem", "ERROR");
        router.push("/orders");
      }
    };
    loadData();
  }, [orderId]);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await logService.getByOrder(orderId, page, 20, sort);
        setLogs(data.content);
        setTotalItems(data.page.totalElements);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [orderId, page, sort]);

  const handleSort = (field: string) => {
    setSort((prev) => (prev && prev.field === field && prev.direction === "asc" 
      ? { field, direction: "desc" } 
      : { field, direction: "asc" }));
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  const formatDateOnly = (dateString?: string) => {
     if (!dateString) return "--";
     return new Date(dateString).toLocaleDateString("pt-BR");
  }

  const columns: ColumnDef<Log>[] = [
    {
      header: "Data/Hora",
      accessorKey: "createdAt",
      cell: (item) => (
        <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
          <Clock size={12} /> {formatDateTime(item.createdAt)}
        </div>
      ),
    },
    {
      header: "Dispositivo",
      accessorKey: "device",
      cell: (item) => (
        <span className="text-xs font-mono bg-muted/50 px-1.5 py-0.5 rounded border border-border">
          {item.device?.macAddress || "N/A"}
        </span>
      )
    },
    {
      header: "Ciclo",
      accessorKey: "cycleTime",
      cell: (item) => <span className="font-medium text-foreground">{formatSecondsToHHMMSS(item.cycleTime)}</span>
    },
    {
      header: "Produzido",
      accessorKey: "quantityProduced",
      className: "text-right",
      cell: (item) => <span className="font-bold text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-full">+{item.quantityProduced}</span>
    }
  ];

  if (!order) {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple" />
        </div>
    );
  }

  const progress = order.totalQuantity > 0 
    ? Math.min(100, Math.round((order.producedQuantity / order.totalQuantity) * 100))
    : 0;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-purple transition-colors w-fit"
        >
          <div className="p-1.5 rounded-full bg-muted group-hover:bg-brand-purple/10 group-hover:text-brand-purple transition-all">
            <ArrowLeft size={14} />
          </div>
          <span className="font-medium">Voltar para lista</span>
        </button>

        <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex gap-4">
              <div className="shrink-0 p-3 bg-brand-purple/5 border border-brand-purple/10 rounded-xl text-brand-purple h-fit">
                <Factory size={28} />
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">{order.code}</h1>
                  <StatusBadge status={order.status} />
                </div>
                
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User size={14} className="text-gray-400"/>
                        <span className="truncate max-w-50 md:max-w-md font-medium" title={order.clientName}>{order.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package size={14} className="text-gray-400"/>
                        <span className="font-mono text-xs">{order.productCode} - {order.productDescription}</span>
                    </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-border md:border-l md:pl-6">
                <div className="text-right hidden md:block">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Produção</p>
                    <p className="text-2xl font-bold text-foreground tabular-nums">
                        {order.producedQuantity} <span className="text-sm text-muted-foreground font-medium">/ {order.totalQuantity}</span>
                    </p>
                </div>
                <div className="md:hidden flex-1">
                     <p className="text-xs uppercase font-bold text-muted-foreground">Progresso</p>
                     <p className="text-lg font-bold text-foreground">
                        {order.producedQuantity} / {order.totalQuantity}
                    </p>
                </div>
                <CircularProgress value={progress} />
            </div>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard 
            label="Data de Criação" 
            value={formatDateOnly(order.creationDate)} 
            icon={Calendar} 
            colorClass="text-foreground"
            bgClass="bg-muted"
        />
        <StatCard 
            label="Previsão de Entrega" 
            value={formatDateOnly(order.deliveryDate)} 
            icon={AlertCircle} 
            colorClass={new Date(order.deliveryDate) < new Date() && order.status !== "FINISHED" ? "text-red-600" : "text-brand-blue"}
            bgClass={new Date(order.deliveryDate) < new Date() && order.status !== "FINISHED" ? "bg-red-50" : "bg-blue-50"}
        />
        <StatCard 
            label="Itens Restantes" 
            value={order.totalQuantity - order.producedQuantity} 
            suffix=" un"
            icon={Package} 
            colorClass="text-amber-600"
            bgClass="bg-amber-50"
        />
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
         <StatCard 
            label="Tempo Médio" 
            value={formatSecondsToHHMMSS(stats?.avgCycleTime)} 
            icon={Timer} 
            colorClass="text-brand-purple"
            bgClass="bg-brand-purple/10"
        />
        <StatCard 
            label="Menor Tempo" 
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
            label="Total Produzido" 
            value={stats?.quantityProduced} 
            suffix=" un"
            icon={BarChart3} 
            colorClass="text-brand-blue"
            bgClass="bg-blue-50"
        />
      </div>
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
            <h3 className="font-bold text-sm flex items-center gap-2 text-foreground">
                <History size={16} className="text-muted-foreground"/> 
                Histórico de Produção
            </h3>
            <span className="text-[10px] font-bold bg-white border border-border px-2 py-0.5 rounded text-muted-foreground shadow-sm">
                {totalItems} Registros
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