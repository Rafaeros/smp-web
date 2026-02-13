"use client";

import { Building2, Copy, Edit, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

import {
  DataTable,
  SortState,
} from "@/src/core/components/data-display/datatable/DataTable";
import { ColumnDef } from "@/src/core/components/data-display/datatable/types";
import { Pagination } from "@/src/core/components/data-display/Pagination";
import { ConfirmActionModal } from "@/src/core/components/feedback/ConfirmActionModal";
import { PageHeader } from "@/src/core/components/layouts/PageHeader";

import { useToast } from "@/src/core/contexts/ToastContext";
import { copyToClipboard } from "@/src/core/lib/utils";
import { ClientFilters, clientService } from "../services/client.service";
import { Client } from "../types/client";
import { ClientFormModal } from "./ClientFormModal";
import { ClientListFilters } from "./ClientListFilterProps";

export default function ClientList() {
  const { showToast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ClientFilters>({});
  const [sort, setSort] = useState<SortState | undefined>(undefined);
  const [totalItems, setTotalItems] = useState(0);
  const [formModal, setFormModal] = useState<{ isOpen: boolean; client: Client | null }>({
    isOpen: false,
    client: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; clientId: number | null }>({
    isOpen: false,
    clientId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

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
        return prev.direction === "asc" ? { field, direction: "desc" } : undefined;
      }
      return { field, direction: "asc" };
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.clientId) return;

    setIsDeleting(true);
    try {
      await clientService.delete(deleteModal.clientId);
      fetchClients();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, clientId: null });
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
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300
            bg-brand-purple/5 text-brand-purple border-brand-purple/10
            group-hover:bg-brand-purple group-hover:text-white group-hover:border-transparent group-hover:shadow-md"
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
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setFormModal({ isOpen: true, client: item })}
            className="p-1.5 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
            title="Editar Cliente"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, clientId: item.id })}
            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Excluir Cliente"
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
          subtitle="Base de clientes e parceiros Lanx"
          icon={Users}
          onNew={() => setFormModal({ isOpen: true, client: null })}
          filterComponent={
            <ClientListFilters
              onFilter={setActiveFilters}
              activeFiltersCount={activeFilters.name ? 1 : 0}
            />
          }
        />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 bg-muted/30 flex justify-between items-center border-b border-border">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider font-mono">
            Empresas Cadastradas
          </span>
          <span className="text-[10px] font-bold bg-white border border-border px-2 py-0.5 rounded text-muted-foreground shadow-sm">
            {totalItems} Registros
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
      <ClientFormModal
        isOpen={formModal.isOpen}
        client={formModal.client}
        onClose={() => setFormModal({ isOpen: false, client: null })}
        onSuccess={fetchClients}
      />
      <ConfirmActionModal
        isOpen={deleteModal.isOpen}
        isLoading={isDeleting}
        onClose={() => setDeleteModal({ isOpen: false, clientId: null })}
        onConfirm={handleDeleteConfirm}
        title="Excluir Cliente"
        description="Esta ação removerá o cliente da base. Se ele possuir ordens de produção vinculadas, a exclusão será impedida por segurança."
        confirmText="Confirmar Exclusão"
        variant="danger"
      />
    </div>
  );
}