import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type { ResendOtpRequest, ResendOtpResponse } from '../types/auth.types';

export const useResendConfirmationOtp = () => {
  return useMutation<ResendOtpResponse, any, ResendOtpRequest>({
    mutationFn: (data) => authApi.resendConfirmationOtp(data),
  });
};
export default useResendConfirmationOtp;
