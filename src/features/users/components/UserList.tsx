"use client";

import {
  Copy,
  Edit,
  Eye,
  Shield,
  ShieldAlert,
  Trash,
  UserCog,
  User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DataTable,
  SortState,
} from "@/src/core/components/data-display/datatable/DataTable";
import { ColumnDef } from "@/src/core/components/data-display/datatable/types";
import { Pagination } from "@/src/core/components/data-display/Pagination";
import { PageHeader } from "@/src/core/components/layouts/PageHeader";

import { ConfirmActionModal } from "@/src/core/components/feedback/ConfirmActionModal";
import { useToast } from "@/src/core/contexts/ToastContext";
import { copyToClipboard } from "@/src/core/lib/utils";
import { authService } from "@/src/features/auth/service/auth-service";
import { UserFilters, userService } from "../services/user.service";
import { roleDisplayMap, User } from "../types/user";
import { UserListFilters } from "./UserFIlterProps";

export default function UserList() {
  const router = useRouter();
  const { showToast } = useToast();

  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<UserFilters>({});
  const [sort, setSort] = useState<SortState | undefined>(undefined);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: number | null;
  }>({
    isOpen: false,
    userId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const user = authService.getUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (
      isMounted &&
      (!currentUser ||
        (currentUser.role !== "ADMIN" && currentUser.role !== "MANAGER"))
    ) {
      const timer = setTimeout(() => {
        showToast("Você não tem permissão para acessar esta página.", "ERROR");
        router.push("/dashboard");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMounted, currentUser, router, showToast]);

  const fetchUsers = async () => {
    if (
      !currentUser ||
      (currentUser.role !== "ADMIN" && currentUser.role !== "MANAGER")
    )
      return;

    setLoading(true);
    try {
      const data = await userService.getAll(page, 10, activeFilters, sort);
      setUsers(data.content);
      setTotalItems(data.page.totalElements);
    } catch (error) {
      console.error(error);
      showToast("Erro ao carregar usuários", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted && currentUser) {
      fetchUsers();
    }
  }, [page, activeFilters, sort, isMounted, currentUser]);

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

  const handleDeleteConfirm = async () => {
    if (!deleteModal.userId) return;

    setIsDeleting(true);
    try {
      await userService.delete(deleteModal.userId);
      fetchUsers();
      showToast("Usuário excluído com sucesso", "SUCCESS");
    } catch (err) {
      console.error(err);
      // Toast de erro já deve ser tratado pelo interceptor
    } finally {
      setIsDeleting(false);
      // O fechamento do modal é feito pelo próprio widget se você usar o onClick do botão
    }
  };

  const getDisplayName = (user: User) => {
    if (user.firstName && user.lastName)
      return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    return user.username;
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
      case "MANAGER":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "SUPERVISOR":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
      case "OPERATOR":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      header: "ID",
      accessorKey: "id",
      className: "w-16 text-center font-mono text-xs text-muted-foreground",
    },
    {
      header: "Usuário",
      accessorKey: "username",
      cell: (item) => (
        <div
          className="flex items-center gap-3 group cursor-pointer w-fit active:scale-95 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(item.username);
            showToast("Username copiado!", "SUCCESS");
          }}
          title="Clique para copiar username"
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300
            ${
              item.role === "ADMIN"
                ? "bg-purple-50 text-purple-600 border-purple-100"
                : "bg-muted text-muted-foreground border-border"
            }
            group-hover:bg-linear-to-r group-hover:from-brand-purple group-hover:to-brand-blue group-hover:text-white group-hover:border-transparent group-hover:shadow-md`}
          >
            {item.role === "ADMIN" ? (
              <ShieldAlert size={16} className="group-hover:hidden" />
            ) : item.role === "MANAGER" ? (
              <Shield size={16} className="group-hover:hidden" />
            ) : (
              <UserIcon size={16} className="group-hover:hidden" />
            )}
            <Copy size={16} className="hidden group-hover:block" />
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-foreground text-sm group-hover:text-brand-purple transition-colors">
              {getDisplayName(item)}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              @{item.username}
            </span>
          </div>
        </div>
      ),
      className: "min-w-[200px]",
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (item) =>
        item.email ? (
          <span
            className="text-sm text-muted-foreground truncate max-w-50 block"
            title={item.email}
          >
            {item.email}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/50 italic">
            Não informado
          </span>
        ),
      className: "hidden md:table-cell",
    },
    {
      header: "Permissão",
      accessorKey: "role",
      cell: (item) => {
        const label = roleDisplayMap[item.role] || item.role;

        return (
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getRoleStyle(
              item.role,
            )}`}
          >
            {label}
          </span>
        );
      },
      className: "w-32",
    },
    {
      header: "Ações",
      className: "w-32 text-right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => router.push(`/users/${item.id}`)}
            className="p-1.5 text-muted-foreground hover:text-brand-blue hover:bg-blue-50 rounded-md transition-colors"
            title="Ver Detalhes e Dispositivos"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => router.push(`/users/${item.id}/edit`)}
            className="p-1.5 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
            title="Editar Usuário"
          >
            <Edit size={16} />
          </button>

          <button
            onClick={() => setDeleteModal({ isOpen: true, userId: item.id })}
            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Excluir Usuário"
          >
            <Trash size={16} />
          </button>

          <ConfirmActionModal
            isOpen={deleteModal.isOpen}
            isLoading={isDeleting}
            onClose={() => setDeleteModal({ isOpen: false, userId: null })}
            onConfirm={handleDeleteConfirm}
            title="Excluir Usuário"
            description="Esta ação não pode ser desfeita. O usuário perderá o acesso e seus vínculos serão removidos."
            confirmText="Sim, excluir"
            variant="danger"
          />
        </div>
      ),
    },
  ];

  if (!isMounted) {
    return null;
  }
  if (
    !currentUser ||
    (currentUser.role !== "ADMIN" && currentUser.role !== "MANAGER")
  ) {
    return null;
  }

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="shrink-0">
        <PageHeader
          title="Gestão de Usuários"
          subtitle="Controle de acesso e operadores"
          icon={UserCog}
          onNew={() => router.push("/users/new")}
          onExport={() => showToast("Exportando CSV...", "INFO")}
          filterComponent={
            <UserListFilters
              onFilter={setActiveFilters}
              activeFiltersCount={activeFilters.username ? 1 : 0}
            />
          }
        />
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 bg-muted/30 flex justify-between items-center">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
            Equipe Cadastrada
          </span>
          <span className="text-[10px] font-bold bg-white border border-border px-2 py-0.5 rounded text-muted-foreground shadow-sm">
            {totalItems} Usuários
          </span>
        </div>

        <div className="overflow-x-auto">
          <DataTable
            data={users}
            columns={columns}
            getRowId={(u) => u.id}
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
