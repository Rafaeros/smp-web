
export interface CreateProduct {
    code: string,
    description: string
}

export interface UpdateProduct {
    code?: string,
    description?: string
}


export interface Product {
    id: number,
    code: string,
    description: string
}

export interface ProductStats {
  code: string;
  description: string;
  totalLogs: number;
  avgCycleTime: number;
  minCycleTime: number;
  maxCycleTime: number;
  avgPausedTime?: number;
  avgTotalTime?: number;
}