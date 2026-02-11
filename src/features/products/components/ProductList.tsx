"use client";

import { Barcode, Edit, Eye, Package, Trash2 } from "lucide-react";
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
import {
  ProductFilters,
  productService,
} from "@/src/features/products/services/product.service";
import { Product } from "@/src/features/products/types/product";
import { ProductListFilters } from "./ProductsFilterProps";

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
      } catch (error) {
        console.error(error);
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
        <div className="flex items-center gap-2 font-mono text-xs bg-muted/50 px-2 py-1 rounded border border-border w-fit group-hover:bg-white transition-colors">
          <Barcode size={12} className="opacity-50" />
          {item.code}
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
        <div className="flex items-center justify-end gap-2">
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
    <div className="flex flex-col h-full w-full p-4 md:p-6 gap-4">
      <div className="shrink-0">
        <PageHeader
          title="Catálogo de Produtos"
          subtitle="Gerenciamento de produtos"
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
            data={products}
            columns={columns}
            getRowId={(p) => p.id}
            loading={loading}
            currentSort={sort}
            onSort={handleSort}
          />
        </div>
        
      </div>
    </div>
  );
}