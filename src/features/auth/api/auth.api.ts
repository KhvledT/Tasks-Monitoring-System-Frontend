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
};
