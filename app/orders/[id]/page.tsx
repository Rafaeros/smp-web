"use client";

import OrderView from "@/src/features/orders/components/OrderView";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderViewPage() {
  const params = useParams();
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    const id = Number(params.id);
    if (!isNaN(id)) {
      setOrderId(id);
    }
  }, [params.id]);

  if (!orderId) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-purple" />
           <span className="text-sm">Carregando ordem...</span>
        </div>
      </div>
    );
  }

  return <OrderView orderId={orderId} />;
}