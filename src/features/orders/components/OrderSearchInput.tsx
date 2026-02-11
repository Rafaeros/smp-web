import { AsyncSearchSelect } from "@/src/core/components/forms/SearchSelect";
import { orderService } from "../services/order.service";
import { OrderSummary } from "../types/orders";

interface OrderSearchInputProps {
  onOrderSelect: (order: OrderSummary) => void;
  initialDisplayValue?: string;
}

export function OrderSearchInput({
  onOrderSelect,
  initialDisplayValue,
}: OrderSearchInputProps) {
  const fetchOrders = async (query: string) => {
    const response = await orderService.getSummary(query);
    return response.content;
  };
const syncOrder = async (query: string) => {
    await orderService.syncFromErp({ code: query });
  };

  return (
    <AsyncSearchSelect<OrderSummary>
      fetcher={fetchOrders}
      onSelect={onOrderSelect}
      placeholder="DIGITE O CÓDIGO DA OP..."
      initialDisplayValue={initialDisplayValue}
      getItemLabel={(order) => order.code}
      getItemKey={(order) => order.id}
      renderItem={(order) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 text-sm font-mono">
            {order.code}
          </span>
          <span className="text-[10px] text-gray-400">ID: {order.id}</span>
        </div>
      )}
      onFallback={syncOrder}
      fallbackLabel="BUSCAR NO CG (ERP)"
      fallbackMessage="Não encontrada localmente"
    />
  );
}
