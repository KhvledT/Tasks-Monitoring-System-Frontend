import type { User } from '../../../providers/AuthProvider';

export interface SignupRequest {
  email: string;
  password?: string;
  confirmPassword?: string;
  fullName: string;
  rank: string;
  signOnDate: string;
}

export interface SignupResponse {
  statusCode: number;
  message: string;
  result: {
    id: string;
    email: string;
    fullName: string;
    isVerified: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  result: {
    access_Token: string;
    refresh_Token: string;
    user: User;
  };
}

export interface ConfirmEmailRequest {
  email: string;
  otp: string;
}

export interface ConfirmEmailResponse {
  statusCode: number;
  message: string;
  result: {
    isVerified: boolean;
  };
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  statusCode: number;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  statusCode: number;
  message: string;
  result: {
    access_Token: string;
  };
}

export interface MeResponse {
  statusCode: number;
  result: User;
}
