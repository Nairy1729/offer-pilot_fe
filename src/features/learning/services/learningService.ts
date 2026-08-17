import { apiClient } from "../../../services/apiClients";
import type { ApiResponse } from "../../../types/api.types";
import type {
  CreateLearningTopicRequest,
  LearningSummary,
  LearningTopic,
  LearningTopicFilters,
  UpdateLearningTopicRequest,
  UpdateLearningTopicStatusRequest,
} from "../types/learning.types";

export async function createLearningTopic(
  payload: CreateLearningTopicRequest
): Promise<LearningTopic> {
  const response = await apiClient.post<ApiResponse<LearningTopic>>(
    "/api/v1/learning/topics",
    payload
  );

  return response.data.data;
}

export async function getLearningTopics(
  filters?: LearningTopicFilters
): Promise<LearningTopic[]> {
  const response = await apiClient.get<ApiResponse<LearningTopic[]>>(
    "/api/v1/learning/topics",
    {
      params: {
        category: filters?.category,
        status: filters?.status,
      },
    }
  );

  return response.data.data;
}

export async function getLearningSummary(): Promise<LearningSummary> {
  const response = await apiClient.get<ApiResponse<LearningSummary>>(
    "/api/v1/learning/summary"
  );

  return response.data.data;
}

export async function updateLearningTopic(
  topicId: number,
  payload: UpdateLearningTopicRequest
): Promise<LearningTopic> {
  const response = await apiClient.put<ApiResponse<LearningTopic>>(
    `/api/v1/learning/topics/${topicId}`,
    payload
  );

  return response.data.data;
}

export async function updateLearningTopicStatus(
  topicId: number,
  payload: UpdateLearningTopicStatusRequest
): Promise<LearningTopic> {
  const response = await apiClient.patch<ApiResponse<LearningTopic>>(
    `/api/v1/learning/topics/${topicId}/status`,
    payload
  );

  return response.data.data;
}

export async function deleteLearningTopic(topicId: number): Promise<void> {
  await apiClient.delete<ApiResponse<null>>(
    `/api/v1/learning/topics/${topicId}`
  );
}