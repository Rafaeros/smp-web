export enum OrderStatus {
  RELEASED = "RELEASED",
  STARTED = "STARTED",
  FINISHED = "FINISHED",
  STOPPED = "STOPPED",
  CANCELED = "CANCELED"
}

export interface OrderSummary {
  id: number;
  code: string;
}

export interface Order {
  id: number;
  code: string;
  productCode: string;
  clientName: string;
  totalQuantity: number;
  producedQuantity: number;
  deliveryDate: string;
  status: OrderStatus;
}