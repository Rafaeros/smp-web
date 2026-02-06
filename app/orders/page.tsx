import { Metadata } from "next";
import { OrderList } from "@/src/features/orders/components/OrderList";

export const metadata: Metadata = {
  title: "Ordens de Produção | SMP",
  description: "Gerenciamento de ordens de produção",
};

export default function OrdersPage() {
  return (
    <div className="p-6">
      <OrderList />
    </div>
  );
}