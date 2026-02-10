import { OrderList } from "@/src/features/orders/components/OrderList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ordens de Produção | SMP",
  description: "Gerenciamento de ordens de produção",
};

export default function OrdersPage() {
  return <OrderList />;
} 