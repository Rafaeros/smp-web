"use client";

import { InfiniteScrollContainer } from "@/src/core/components/shared/InfiniteScrollContainer";
import {
  CheckSquare,
  Edit,
  Eye,
  Plus,
  Square,
  Trash2,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clientService } from "../services/clients.service";
import { Client } from "../types/client";
import { ClientListFilters } from "./ClientListFilter";

export default function ClientsPage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Estado para armazenar os filtros complexos
  const [activeFilters, setActiveFilters] = useState<any>({});

  const fetchClients = async (isNewSearch = false) => {
    setLoading(true);
    try {
      const currentPage = isNewSearch ? 0 : page;
      const data = await clientService.getAll(
        currentPage,
        10,
        activeFilters.name || "",
      );

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
  }, [activeFilters]);

  // Infinite Scroll
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
    if (confirm(`Excluir ${selectedIds.size} clientes selecionados?`)) {
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
          <div className="flex gap-3 h-10 items-center justify-between">
            <ClientListFilters onFilter={setActiveFilters} />
            <div className="flex gap-3">
              {selectedIds.size > 0 ? (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {selectedIds.size} selecionado(s)
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Trash2 size={14} /> EXCLUIR
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => router.push("/clients/new")}
                  className="bg-brand-purple text-white font-semibold px-4 py-2 rounded-lg hover:shadow-lg hover:bg-brand-purple/90 active:scale-95 transition-all flex items-center gap-2 text-sm"
                >
                  <Plus size={16} strokeWidth={3} />
                  <span>Novo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 bg-grid min-h-[calc(100vh-180px)]">
        <InfiniteScrollContainer
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          emptyMessage="Nenhum cliente encontrado com estes filtros."
        >
          {clients.map((client) => {
            const isSelected = selectedIds.has(client.id);

            return (
              <div
                key={client.id}
                // LOGICA MUDADA: Clicar no card seleciona a linha inteira
                onClick={() => toggleSelect(client.id)}
                className={`
                  group relative flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none
                  ${
                    isSelected
                      ? "bg-brand-purple/5 border-brand-purple/50 shadow-[0_0_0_1px_rgba(118,9,232,0.2)]"
                      : "bg-card border-border hover:border-brand-purple/30 hover:shadow-md"
                  }
                `}
              >
                {/* Checkbox Visual */}
                <div className="pr-4 text-muted-foreground">
                  {isSelected ? (
                    <CheckSquare
                      size={20}
                      className="text-brand-purple fill-brand-purple/10"
                    />
                  ) : (
                    <Square
                      size={20}
                      className="group-hover:text-brand-purple/50"
                    />
                  )}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3
                      className={`font-bold truncate text-base ${
                        isSelected ? "text-brand-purple" : "text-foreground"
                      }`}
                    >
                      {client.name}
                    </h3>
                    {/* Exemplo de Badge de Status vindo do filtro */}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground border border-border">
                      {client.id % 2 === 0 ? "ATIVO" : "PENDENTE"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono flex gap-3">
                    <span>ID: {client.id}</span>
                  </p>
                </div>

                {/* Ações Explícitas de Navegação (Sem Delete) */}
                <div className="flex items-center gap-2 pl-4 border-l border-border/50 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/clients/${client.id}`);
                    }}
                    className="p-2 text-muted-foreground hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors flex flex-col items-center gap-1"
                    title="Visualizar Detalhes"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/clients/${client.id}/edit`);
                    }}
                    className="p-2 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Editar Cadastro"
                  >
                    <Edit size={18} />
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
