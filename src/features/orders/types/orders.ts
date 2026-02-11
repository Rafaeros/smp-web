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

export interface OrderStats {
  quantityProduced: number;
  totalLogs: number;
  avgCycleTime: number;
  minCycleTime: number;
  maxCycleTime: number;
}

export interface Order {
  id: number;
  code: string;
  productCode: string;
  productDescription: string;
  clientName: string;
  totalQuantity: number;
  producedQuantity: number;
  creationDate: string;
  deliveryDate: string;
  status: OrderStatus;
}