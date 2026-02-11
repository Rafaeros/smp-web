"use client";

import { Building2, Copy, Edit, Eye, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DataTable,
  SortState,
} from "@/src/core/components/data-display/datatable/DataTable";
import { ColumnDef } from "@/src/core/components/data-display/datatable/types";
import { Pagination } from "@/src/core/components/data-display/Pagination";
import { PageHeader } from "@/src/core/components/layouts/PageHeader";

import { useToast } from "@/src/core/contexts/ToastContext";
import { ClientFilters, clientService } from "../services/client.service";
import { Client } from "../types/client";
import { ClientListFilters } from "./ClientListFilterProps";
import { copyToClipboard } from "@/src/core/lib/utils";

export default function ClientList() {
  const router = useRouter();
  const { showToast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ClientFilters>({});
  const [sort, setSort] = useState<SortState | undefined>(undefined);
  const [totalItems, setTotalItems] = useState(0);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await clientService.getAll(page, 10, activeFilters, sort);
      setClients(data.content);
      setTotalItems(data.page.totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
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
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await clientService.delete(id);
        fetchClients();
        showToast("Cliente excluído com sucesso", "SUCCESS");
      } catch (err) {
        console.error(err);
        showToast("Erro ao excluir cliente", "ERROR");
      }
    }
  };

  const columns: ColumnDef<Client>[] = [
    {
      header: "ID",
      accessorKey: "id",
      className: "w-16 text-center font-mono text-xs text-muted-foreground",
    },
    {
      header: "Cliente / Empresa",
      accessorKey: "name",
      cell: (item) => (
        <div
          className="flex items-center gap-3 group cursor-pointer w-fit active:scale-95 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(item.name);
            showToast("Nome do cliente copiado!", "SUCCESS");
          }}
          title="Clique para copiar"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300
            bg-brand-purple/10 text-brand-purple border-brand-purple/10
            group-hover:bg-linear-to-r group-hover:from-brand-purple group-hover:to-brand-blue group-hover:text-white group-hover:border-transparent group-hover:shadow-md"
          >
            <Building2 size={16} className="group-hover:hidden" />
            <Copy size={16} className="hidden group-hover:block" />
          </div>
          <span className="font-bold text-foreground text-sm group-hover:text-brand-purple transition-colors">
            {item.name}
          </span>
        </div>
      ),
      className: "w-full",
    },
    {
      header: "Ações",
      className: "w-32 text-right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => router.push(`/clients/${item.id}`)}
            className="p-1.5 text-muted-foreground hover:text-brand-blue hover:bg-blue-50 rounded-md transition-colors"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => router.push(`/clients/${item.id}/edit`)}
            className="p-1.5 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="shrink-0">
        <PageHeader
          title="Gestão de Clientes"
          subtitle="Base de clientes cadastrados"
          icon={Users}
          onNew={() => router.push("/clients/new")}
          onExport={() => showToast("Exportando CSV...", "INFO")}
          filterComponent={
            <ClientListFilters
              onFilter={setActiveFilters}
              activeFiltersCount={activeFilters.name ? 1 : 0}
            />
          }
        />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 bg-muted/30 flex justify-between items-center">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
            Listagem
          </span>
          <span className="text-[10px] font-bold bg-white border border-border px-2 py-0.5 rounded text-muted-foreground shadow-sm">
            {totalItems} Clientes Encontrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <DataTable
            data={clients}
            columns={columns}
            getRowId={(c) => c.id}
            loading={loading}
            currentSort={sort}
            onSort={handleSort}
          />
        </div>

        <div className="border-t border-border p-2 bg-muted/30">
          <Pagination
            currentPage={page}
            totalItems={totalItems}
            pageSize={10}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
