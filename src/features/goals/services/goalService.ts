import { apiClient } from "../../../services/apiClients";
import type { ApiResponse } from "../../../types/api.types";
import type {
  CreateGoalRequest,
  Goal,
  UpdateGoalRequest,
  UpdateGoalStatusRequest,
} from "../types/goal.types";

export async function createGoal(payload: CreateGoalRequest): Promise<Goal> {
  const response = await apiClient.post<ApiResponse<Goal>>(
    "/api/v1/goals",
    payload
  );

  return response.data.data;
}

export async function getActiveGoal(): Promise<Goal> {
  const response = await apiClient.get<ApiResponse<Goal>>(
    "/api/v1/goals/active"
  );

  return response.data.data;
}

export async function getGoals(): Promise<Goal[]> {
  const response = await apiClient.get<ApiResponse<Goal[]>>("/api/v1/goals");

  return response.data.data;
}

export async function updateGoal(
  goalId: number,
  payload: UpdateGoalRequest
): Promise<Goal> {
  const response = await apiClient.put<ApiResponse<Goal>>(
    `/api/v1/goals/${goalId}`,
    payload
  );

  return response.data.data;
}

export async function updateGoalStatus(
  goalId: number,
  payload: UpdateGoalStatusRequest
): Promise<Goal> {
  const response = await apiClient.patch<ApiResponse<Goal>>(
    `/api/v1/goals/${goalId}/status`,
    payload
  );

  return response.data.data;
}