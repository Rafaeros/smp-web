import { api } from "@/src/core/api/client";
import { DashboardSummary } from "../types";

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    // Se o seu interceptor for o padrão do projeto, 
    // 'response' aqui já trará o conteúdo de 'data' do Java.
    const response = await api.get("/analytics/dashboard");
    
    // Log para você confirmar no F12:
    console.log("Dashboard Data:", response); 

    return response as unknown as DashboardSummary;
  }
};