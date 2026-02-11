"use client";

import ProductView from "@/src/features/products/components/ProductView";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductViewPage() {
  const params = useParams();
  const [productId, setProductId] = useState<number | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (!isNaN(id)) {
      setProductId(id);
    }
  }, [params.id]);
  if (!productId) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Carregando produto...
      </div>
    );
  }
  return <ProductView productId={productId} />;
}