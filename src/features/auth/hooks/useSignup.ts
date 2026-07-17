import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type { SignupRequest, SignupResponse } from '../types/auth.types';

export const useSignup = () => {
  return useMutation<SignupResponse, any, SignupRequest>({
    mutationFn: (data) => authApi.signup(data),
  });
};
export default useSignup;
