"use client";

import { Barcode, Edit, Eye, Package, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ActionBar } from "@/src/core/components/shared/datatable/ActionBar";
import { DataTable, SortState } from "@/src/core/components/shared/datatable/DataTable";
import { ActionDef, ColumnDef } from "@/src/core/components/shared/datatable/types";
import { ProductListFilters } from "@/src/features/products/components/ProductsFilterProps";

import { ProductFilters, productService } from "@/src/features/products/services/product.service";
import { Product } from "@/src/features/products/types/product";

export default function ProductsList() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({});
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [totalItems, setTotalItems] = useState(0);
  const [sort, setSort] = useState<SortState | undefined>(undefined);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll(page, 10, activeFilters, sort);
      setProducts(data.content);
      setTotalItems(data.totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    setSelectedIds(new Set());
  }, [page, activeFilters, sort]);


  const handleSort = (field: string) => {
    setSort((prev) => {
      if (prev && prev.field === field) {
        if (prev.direction === "asc") {
          return { field, direction: "desc" };
        }
        return undefined;
      }
      return { field, direction: "asc" };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(new Set(products.map((p) => p.id)));
    else setSelectedIds(new Set());
  };

  const handleSelectRow = (id: number | string) => {
    const numId = Number(id);
    const newSet = new Set(selectedIds);
    if (newSet.has(numId)) newSet.delete(numId);
    else newSet.add(numId);
    setSelectedIds(newSet);
  };

  const activeFiltersCount = (activeFilters.code ? 1 : 0) + (activeFilters.description ? 1 : 0);

  const columns: ColumnDef<Product>[] = [
    {
      header: "Código",
      accessorKey: "code", 
      cell: (item) => (
        <div className="flex items-center gap-2 font-mono text-xs bg-muted/50 px-2 py-1 rounded border border-border w-fit">
          <Barcode size={12} className="opacity-50" />
          {item.code}
        </div>
      ),
      className: "w-40",
    },
    {
      header: "Descrição do Produto",
      accessorKey: "description",
      className: "font-medium text-foreground min-w-[300px]",
    },
    {
      header: "ID",
      accessorKey: "id",
      className: "text-muted-foreground w-20 text-center font-mono text-xs",
    }
  ];

  const actions: ActionDef[] = [
    {
      label: "Incluir",
      icon: Plus,
      variant: "primary",
      onClick: () => router.push("/products/new"),
      tooltip: "Criar novo produto",
    },
    {
      label: "Editar",
      icon: Edit,
      variant: "secondary",
      requiresSelection: true,
      disabled: selectedIds.size !== 1,
      onClick: () => {
        const id = Array.from(selectedIds)[0];
        router.push(`/products/${id}/edit`);
      },
      tooltip: "Editar item selecionado",
    },
    {
      label: "Visualizar",
      icon: Eye,
      variant: "secondary",
      requiresSelection: true,
      disabled: selectedIds.size !== 1,
      onClick: () => {
        const id = Array.from(selectedIds)[0];
        router.push(`/products/${id}`);
      },
    },
    {
      label: "Excluir",
      icon: Trash2,
      variant: "danger",
      requiresSelection: true,
      onClick: async () => {
        if (confirm(`Remover ${selectedIds.size} itens?`)) {
          setSelectedIds(new Set());
          fetchProducts();
        }
      },
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-foreground">
      <ActionBar
        title="Cadastro de Produtos"
        subtitle="Gerenciamento de produtos"
        icon={Package}
        actions={actions}
        selectedCount={selectedIds.size}
        totalItems={totalItems}
        currentPage={page}
        onPageChange={setPage}
        onSearch={() => {}}
        hideSearch={true}
        customFilterComponent={
          <ProductListFilters 
            onFilter={setActiveFilters} 
            activeFiltersCount={activeFiltersCount} 
          />
        }
        onRefresh={fetchProducts}
      />

      <main className="flex-1 bg-muted/5 p-6">
        <div className="max-w-400 mx-auto">
          <DataTable
            data={products}
            columns={columns}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            getRowId={(p) => p.id}
            loading={loading}
            currentSort={sort}
            onSort={handleSort}
          />
        </div>
      </main>
    </div>
  );
}