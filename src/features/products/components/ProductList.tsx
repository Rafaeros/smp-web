"use client";

import {
  DataTable,
  SortState,
} from "@/src/core/components/data-display/datatable/DataTable";
import { ColumnDef } from "@/src/core/components/data-display/datatable/types";
import { Pagination } from "@/src/core/components/data-display/Pagination";
import { PageHeader } from "@/src/core/components/layouts/PageHeader";
import { useToast } from "@/src/core/contexts/ToastContext";
import {
  ProductFilters,
  productService,
} from "@/src/features/products/services/product.service";
import { Product } from "@/src/features/products/types/product";
import { Barcode, Copy, Edit, Eye, Package, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductListFilters } from "./ProductsFilterProps";
import { copyToClipboard } from "@/src/core/lib/utils";

export default function ProductList() {
  const router = useRouter();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({});
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState<SortState | undefined>(undefined);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll(page, 10, activeFilters, sort);
      setProducts(data.content);
      setTotalItems(data.page.totalElements);
    } catch (error) {
      console.error(error);
      showToast("Erro ao carregar produtos", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
    if (confirm("Deseja realmente excluir este produto?")) {
      try {
        await productService.delete(id);
        fetchProducts();
        showToast("Produto excluído com sucesso", "SUCCESS");
      } catch (error) {
        console.error(error);
        showToast("Erro ao excluir produto", "ERROR");
      }
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      header: "ID",
      accessorKey: "id",
      className: "text-muted-foreground w-20 text-center font-mono text-xs",
    },
    {
      header: "Código",
      accessorKey: "code",
      cell: (item) => (
        <div
          className="flex items-center gap-2 group cursor-pointer w-fit active:scale-95 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(item.code);
            showToast("Código do produto copiado!", "SUCCESS");
          }}
          title="Clique para copiar"
        >
          <div
            className="flex items-center gap-2 font-mono text-xs px-2 py-1 rounded border font-bold transition-all duration-300
            bg-brand-purple/5 text-brand-purple border-brand-purple/20
            group-hover:bg-linear-to-r group-hover:from-brand-purple group-hover:to-brand-blue group-hover:text-white group-hover:border-transparent group-hover:shadow-md"
          >
            <Barcode size={12} className="opacity-50 group-hover:hidden" />
            <Copy size={12} className="hidden group-hover:block" />

            {item.code}
          </div>
        </div>
      ),
      className: "w-48",
    },
    {
      header: "Descrição do Produto",
      accessorKey: "description",
      className: "font-medium text-foreground min-w-[300px]",
    },
    {
      header: "Ações",
      className: "w-32 text-right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => router.push(`/products/${item.id}`)}
            className="p-1.5 text-muted-foreground hover:text-brand-blue hover:bg-blue-50 rounded-md transition-colors"
            title="Visualizar"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => router.push(`/products/${item.id}/edit`)}
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
    (activeFilters.code ? 1 : 0) + (activeFilters.description ? 1 : 0);

  return (
    <div className="w-full p-4 md:p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="shrink-0">
        <PageHeader
          title="Catálogo de Produtos"
          subtitle="Gerenciamento de produtos e SKUs"
          icon={Package}
          onNew={() => router.push("/products/new")}
          onExport={() => showToast("Exportando CSV...", "INFO")}
          filterComponent={
            <ProductListFilters
              onFilter={setActiveFilters}
              activeFiltersCount={activeFiltersCount}
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
            {totalItems} Produtos Encontrados
          </span>
        </div>
        <div className="overflow-x-auto">
          <DataTable
            data={products}
            columns={columns}
            getRowId={(p) => p.id}
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
