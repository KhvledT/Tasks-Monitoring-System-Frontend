import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type { ConfirmEmailRequest, ConfirmEmailResponse } from '../types/auth.types';

export const useVerifyEmail = () => {
  return useMutation<ConfirmEmailResponse, any, ConfirmEmailRequest>({
    mutationFn: (data) => authApi.confirmEmail(data),
  });
};
export default useVerifyEmail;
