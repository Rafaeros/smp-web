"use client";

import { Building2, Edit, Eye, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DataTable,
  SortState,
} from "@/src/core/components/data-display/datatable/DataTable";
import { ColumnDef } from "@/src/core/components/data-display/datatable/types";
import { PageHeader } from "@/src/core/components/layouts/PageHeader";
import { Pagination } from "@/src/core/components/data-display/Pagination";

import { useToast } from "@/src/core/contexts/ToastContext";
import { ClientFilters, clientService } from "../services/client.service";
import { Client } from "../types/client";
import { ClientListFilters } from "./ClientListFilterProps";

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
      } catch (err) {
        console.error(err);
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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple border border-brand-purple/10">
            <Building2 size={16} />
          </div>
          <span className="font-bold text-foreground text-sm">{item.name}</span>
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
    <div className="flex flex-col h-full w-full p-4 md:p-6 gap-4">
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
      <div className="flex-1 flex flex-col min-h-0 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="shrink-0 border-b border-border p-2 bg-muted/20">
          <Pagination
            currentPage={page}
            totalItems={totalItems}
            pageSize={10}
            onPageChange={setPage}
          />
        </div>
        <div className="flex-1 min-h-0 relative">
          <DataTable
            data={clients}
            columns={columns}
            getRowId={(c) => c.id}
            loading={loading}
            currentSort={sort}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  );
}