"use client";

import { InfiniteScrollContainer } from "@/core/components/shared/InfiniteScrollContainer";
import { SearchInput } from "@/core/components/shared/SearchInput";
import {
  CheckSquare,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Square,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clientService } from "../services/clients.service";
import { Client } from "../types/client";

export default function ClientsList() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const fetchClients = async (isNewSearch = false) => {
    setLoading(true);
    try {
      const currentPage = isNewSearch ? 0 : page;
      const data = await clientService.getAll(currentPage, 10);

      setClients((prev) => {
        if (currentPage === 0) return data.content;
        return [...prev, ...data.content];
      });

      setHasMore(!data.last);
      if (isNewSearch) setPage(0);
    } catch (error) {
      console.error("Erro ao carregar clientes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(true);
    setSelectedIds(new Set());
  }, [searchTerm]);

  useEffect(() => {
    if (page > 0) fetchClients(false);
  }, [page]);

  const loadMore = () => setPage((prev) => prev + 1);

  const toggleSelect = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleBulkDelete = () => {
    if (
      confirm(`Tem certeza que deseja remover ${selectedIds.size} clientes?`)
    ) {
      // clientService.deleteBatch(Array.from(selectedIds))...
      setClients((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border pb-4 pt-6 px-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <div className="p-2 bg-brand-purple/10 rounded-lg text-brand-purple">
                  <Users size={24} />
                </div>
                Clientes
              </h1>
              <p className="text-sm text-muted-foreground mt-1 ml-1">
                Gerenciamento da base de contatos
              </p>
            </div>
          </div>

          <div className="flex gap-3 h-12">
            {selectedIds.size > 0 ? (
              <div className="flex-1 flex items-center justify-between bg-brand-purple/5 border border-brand-purple/20 rounded-xl px-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-brand-purple text-white text-xs font-bold rounded-full">
                    {selectedIds.size}
                  </span>
                  <span className="text-sm font-medium text-brand-purple">
                    selecionados
                  </span>
                </div>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg text-sm transition-colors font-medium"
                >
                  <Trash2 size={16} />{" "}
                  <span className="hidden sm:inline">Excluir</span>
                </button>
              </div>
            ) : (
              <>
                <SearchInput
                  onSearch={setSearchTerm}
                  placeholder="Buscar por nome..."
                />

                <button
                  onClick={() => router.push("/clients/new")}
                  className="bg-linear-to-r from-brand-purple to-brand-blue text-white font-semibold px-5 rounded-xl hover:shadow-lg hover:shadow-brand-purple/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Novo Cliente</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 bg-grid min-h-[calc(100vh-180px)]">
        <InfiniteScrollContainer
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          emptyMessage={
            searchTerm
              ? "Nenhum cliente encontrado para essa busca."
              : "Nenhum cliente cadastrado."
          }
        >
          {clients.map((client) => {
            const isSelected = selectedIds.has(client.id);

            return (
              <div
                key={client.id}
                className={`
                  group relative flex items-center p-4 rounded-xl border transition-all duration-200
                  ${
                    isSelected
                      ? "bg-brand-purple/5 border-brand-purple/30 shadow-[0_0_0_1px_rgba(118,9,232,0.1)]"
                      : "bg-card border-border hover:border-brand-purple/30 hover:shadow-md hover:-translate-y-0.5"
                  }
                `}
              >
                <div
                  className="pr-4 cursor-pointer text-muted-foreground hover:text-brand-purple transition-colors"
                  onClick={() => toggleSelect(client.id)}
                >
                  {isSelected ? (
                    <CheckSquare
                      size={22}
                      className="text-brand-purple fill-brand-purple/10"
                    />
                  ) : (
                    <Square size={22} />
                  )}
                </div>

                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => router.push(`/clients/${client.id}`)}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3
                      className={`font-bold truncate text-base ${
                        isSelected ? "text-brand-purple" : "text-foreground"
                      }`}
                    >
                      {client.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      ATIVO
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono flex gap-3">
                    <span>ID: {client.id}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pl-2">
                  <ActionButton
                    icon={Eye}
                    onClick={() => router.push(`/clients/${client.id}`)}
                    tooltip="Ver Detalhes"
                  />
                  <ActionButton
                    icon={Edit}
                    onClick={() => router.push(`/clients/${client.id}/edit`)}
                    color="text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    tooltip="Editar"
                  />

                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </InfiniteScrollContainer>
      </div>
    </div>
  );
}

// Pequeno Helper para botões de ação (Local ou em components/shared)
function ActionButton({ icon: Icon, onClick, color, tooltip }: any) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={tooltip}
      className={`p-2 rounded-full transition-colors ${
        color ||
        "text-muted-foreground hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-blue-900/20"
      }`}
    >
      <Icon size={18} />
    </button>
  );
}
