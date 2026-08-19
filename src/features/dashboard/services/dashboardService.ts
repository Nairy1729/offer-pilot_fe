import { apiClient } from "../../../services/apiClients";
import type { ApiResponse } from "../../../types/api.types";
import type { DashboardData } from "../types/dashboard.types";

export async function getDashboard(): Promise<DashboardData> {
  const response = await apiClient.get<ApiResponse<DashboardData>>(
    "/api/v1/dashboard"
  );

  return response.data.data;
}