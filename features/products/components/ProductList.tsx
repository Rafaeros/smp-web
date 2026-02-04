"use client";

import {
  Barcode,
  CheckSquare,
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  Plus,
  Square,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { InfiniteScrollContainer } from "@/core/components/shared/InfiniteScrollContainer";
import { SearchInput } from "@/core/components/shared/SearchInput";
import { productService } from "@/features/products/services/product.service";
import { Product } from "@/features/products/types/product";

export default function ProductsList() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const fetchProducts = async (isNewSearch = false) => {
    setLoading(true);
    try {
      const currentPage = isNewSearch ? 0 : page;
      const data = await productService.getAll(currentPage, 10, searchTerm);

      setProducts((prev) => {
        if (currentPage === 0) return data.content;
        return [...prev, ...data.content];
      });

      setHasMore(!data.last);
      if (isNewSearch) setPage(0);
    } catch (error) {
      console.error("Erro ao carregar produtos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(true);
    setSelectedIds(new Set());
  }, [searchTerm]);

  useEffect(() => {
    if (page > 0) fetchProducts(false);
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
      confirm(`Tem certeza que deseja remover ${selectedIds.size} produtos?`)
    ) {
      // productService.deleteBatch(Array.from(selectedIds))
      setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
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
                  <Package size={24} />
                </div>
                Produtos
              </h1>
              <p className="text-sm text-muted-foreground mt-1 ml-1">
                Catálogo de Produtos
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
                  placeholder="Buscar por código, descrição..."
                />

                <button
                  onClick={() => router.push("/products/new")}
                  className="bg-linear-to-r from-brand-purple to-brand-blue text-white font-semibold px-5 rounded-xl hover:shadow-lg hover:shadow-brand-purple/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                >
                  <Plus size={18} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Novo Produto</span>
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
              ? "Nenhum produto encontrado para essa busca."
              : "Nenhum produto cadastrado."
          }
        >
          {products.map((product) => {
            const isSelected = selectedIds.has(product.id);

            return (
              <div
                key={product.id}
                onClick={() => toggleSelect(product.id)}
                className={`
                                    group relative flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none
                                    ${
                                      isSelected
                                        ? "bg-brand-purple/5 border-brand-purple/50 shadow-[0_0_0_1px_rgba(118,9,232,0.2)]"
                                        : "bg-card border-border hover:border-brand-purple/30 hover:shadow-md hover:-translate-y-0.5"
                                    }
                                `}
              >
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

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-bold truncate text-base ${
                        isSelected ? "text-brand-purple" : "text-foreground"
                      }`}
                    >
                      {product.description || "Produto sem descrição"}
                    </h3>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono flex items-center gap-4">
                    <span className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded border border-border">
                      <Barcode size={12} />
                      {product.code}
                    </span>
                    <span className="opacity-50">|</span>
                    <span>ID: {product.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-4 border-l border-border/50 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/products/${product.id}`);
                    }}
                    className="p-2 text-muted-foreground hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors flex flex-col items-center gap-1"
                    title="Visualizar"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/products/${product.id}/edit`);
                    }}
                    className="p-2 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors hidden sm:block">
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
