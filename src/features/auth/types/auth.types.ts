export type LoginFormValues = {
  email: string;
  password: string;
};

export type SignupFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export type UserRole = "USER" | "ADMIN";

export type User = {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
};

export type AuthApiPayload = {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  message: string;
};

export type AuthSession = {
  user: User;
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type LogoutRequest = {
  refreshToken: string;
};