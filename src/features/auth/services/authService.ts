import { publicApiClient } from "../../../services/apiClients";
import type { ApiResponse } from "../../../types/api.types";
import type {
  AuthApiPayload,
  AuthSession,
  LoginFormValues,
  LogoutRequest,
  SignupFormValues,
} from "../types/auth.types";

function mapAuthPayloadToSession(payload: AuthApiPayload): AuthSession {
  return {
    user: {
      id: payload.userId,
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
    },
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    tokenType: payload.tokenType,
    expiresIn: payload.expiresIn,
  };
}

export async function registerUser(
  values: SignupFormValues
): Promise<AuthSession> {
  const response = await publicApiClient.post<ApiResponse<AuthApiPayload>>(
    "/api/v1/auth/register",
    {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    }
  );

  return mapAuthPayloadToSession(response.data.data);
}

export async function loginUser(
  values: LoginFormValues
): Promise<AuthSession> {
  const response = await publicApiClient.post<ApiResponse<AuthApiPayload>>(
    "/api/v1/auth/login",
    {
      email: values.email,
      password: values.password,
    }
  );

  return mapAuthPayloadToSession(response.data.data);
}

export async function logoutUser(refreshToken: string): Promise<void> {
  const requestBody: LogoutRequest = {
    refreshToken,
  };

  await publicApiClient.post<ApiResponse<null>>(
    "/api/v1/auth/logout",
    requestBody
  );
}