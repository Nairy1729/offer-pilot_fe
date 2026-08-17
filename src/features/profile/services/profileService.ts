import { apiClient } from "../../../services/apiClients";
import type { ApiResponse } from "../../../types/api.types";
import type {
  UpdateUserProfileRequest,
  UserProfile,
} from "../types/profile.types";

export async function getCurrentUserProfile(): Promise<UserProfile> {
  const response = await apiClient.get<ApiResponse<UserProfile>>(
    "/api/v1/users/me"
  );

  return response.data.data;
}

export async function updateCurrentUserProfile(
  payload: UpdateUserProfileRequest
): Promise<UserProfile> {
  const response = await apiClient.put<ApiResponse<UserProfile>>(
    "/api/v1/users/me",
    payload
  );

  return response.data.data;
}