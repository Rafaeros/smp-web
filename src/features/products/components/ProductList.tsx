"use client";

import { Barcode, Edit, Eye, Package, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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

import {
  ProductFilters,
  productService,
} from "@/src/features/products/services/product.service";
import { Product } from "@/src/features/products/types/product";
import { ProductFormModal } from "./ProductFormModal";
import { ProductListFilters } from "./ProductsFilterProps";

export default function ProductList() {
  const router = useRouter();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [activeFilters, setActiveFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState<SortState | undefined>(undefined);
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({
    isOpen: false,
    product: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId: number | null;
  }>({
    isOpen: false,
    productId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll(page, 10, activeFilters, sort);
      setProducts(data.content);
      setTotalItems(data.page.totalElements);
    } catch (error) {
      showToast("Erro ao carregar produtos", "ERROR");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchProducts();
  }, [page, activeFilters, sort]);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.productId) return;

    setIsDeleting(true);
    try {
      const response = await productService.delete(deleteModal.productId);
      showToast(response?.message || "Produto excluído com sucesso", "SUCCESS");
      fetchProducts();
      setDeleteModal({ isOpen: false, productId: null });
    } catch (error: any) {
      console.error(error);
      showToast(
        error?.response?.data?.message || "Erro ao excluir produto",
        "ERROR",
      );
    } finally {
      setIsDeleting(false);
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
            showToast("Código copiado!", "SUCCESS");
          }}
        >
          <div className="flex items-center gap-2 font-mono text-xs px-2 py-1 rounded border font-bold bg-brand-purple/5 text-brand-purple border-brand-purple/20 group-hover:bg-brand-purple group-hover:text-white transition-all">
            <Barcode size={12} />
            {item.code}
          </div>
        </div>
      ),
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
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => setFormModal({ isOpen: true, product: item })}
            className="p-1.5 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, productId: item.id })}
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
      <PageHeader
        title="Catálogo de Produtos"
        subtitle="Gerenciamento de produtos e SKUs"
        icon={Package}
        onNew={() => setFormModal({ isOpen: true, product: null })}
        filterComponent={
          <ProductListFilters
            onFilter={setActiveFilters}
            activeFiltersCount={
              Object.values(activeFilters).filter(Boolean).length
            }
          />
        }
      />
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 bg-muted/30 flex justify-between items-center border-b border-border">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
            Listagem
          </span>
          <span className="text-[10px] font-bold bg-white border border-border px-2 py-0.5 rounded text-muted-foreground shadow-sm">
            {totalItems} Itens
          </span>
        </div>
        <DataTable
          data={products}
          columns={columns}
          getRowId={(p) => p.id}
          loading={loading}
          onSort={handleSort}
          currentSort={sort}
        />
        <div className="border-t border-border p-2 bg-muted/30">
          <Pagination
            currentPage={page}
            totalItems={totalItems}
            pageSize={10}
            onPageChange={setPage}
          />
        </div>
      </div>
      <ProductFormModal
        isOpen={formModal.isOpen}
        product={formModal.product}
        onClose={() => setFormModal({ isOpen: false, product: null })}
        onSuccess={fetchProducts}
      />

      <ConfirmActionModal
        isOpen={deleteModal.isOpen}
        isLoading={isDeleting}
        title="Excluir Produto"
        description="Tem certeza? Isso pode afetar ordens de produção vinculadas a este SKU."
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModal({ isOpen: false, productId: null })}
      />
    </div>
  );
}
