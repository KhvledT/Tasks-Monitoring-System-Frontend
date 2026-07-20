import { apiClient } from '../../../lib/axios';
import type {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  ConfirmEmailRequest,
  ConfirmEmailResponse,
  ResendOtpRequest,
  ResendOtpResponse,
} from '../types/auth.types';

export const authApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>('/auth/signup', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  confirmEmail: async (data: ConfirmEmailRequest): Promise<ConfirmEmailResponse> => {
    const response = await apiClient.post<ConfirmEmailResponse>('/auth/confirm-email', data);
    return response.data;
  },

  resendConfirmationOtp: async (data: ResendOtpRequest): Promise<ResendOtpResponse> => {
    const response = await apiClient.post<ResendOtpResponse>('/auth/resend-confirmation-otp', data);
    return response.data;
  },

  sendForgotPasswordOtp: async (email: string) => {
    const response = await apiClient.post('/auth/send-forget-password-otp', { email });
    return response.data;
  },

  resendForgotPasswordOtp: async (email: string) => {
    const response = await apiClient.post('/auth/resend-forget-password-otp', { email });
    return response.data;
  },

  verifyForgotPasswordOtp: async (email: string, otp: string) => {
    const response = await apiClient.post('/auth/verify-forget-password-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (data: { email: string; otp: string; password: string; confirmPassword: string }) => {
    const response = await apiClient.patch('/auth/reset-password', data);
    return response.data;
  },
};
