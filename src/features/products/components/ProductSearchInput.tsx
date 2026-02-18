"use client";

import { AsyncSearchSelect } from "@/src/core/components/forms/SearchSelect";
import { productService } from "../services/product.service";
import { Product } from "../types/product";
import { Barcode, Box } from "lucide-react";


interface ProductSearchInputProps {
    onProductSelect: (product: Product) => void
    initialDisplayValue?: string
}

export function ProductSearchInput({
    onProductSelect,
    initialDisplayValue
}: ProductSearchInputProps) {
    const fetchProducts = async (query: string) => {
        const data = await productService.getSummary(query);
        return data.content;
    };
    
return (
    <AsyncSearchSelect<Product>
      fetcher={fetchProducts}
      onSelect={onProductSelect}
      placeholder="BUSCAR SKU OU NOME..."
      initialDisplayValue={initialDisplayValue}
      
      getItemKey={(product) => product.id}
      getItemLabel={(product) => `${product.code} - ${product.description}`}
      renderItem={(product) => (
        <div className="flex flex-col py-1">
          <span className="font-bold text-foreground text-sm flex items-center gap-2">
            <Barcode size={14} className="text-brand-purple" />
            {product.code}
          </span>
          <span className="text-[11px] text-muted-foreground ml-6 flex items-center gap-1 truncate max-w-62.5">
             <Box size={10} /> {product.description}
          </span>
        </div>
      )}
      
      fallbackMessage="Nenhum produto encontrado."
    />
  );
}