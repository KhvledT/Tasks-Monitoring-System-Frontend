import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuth } from '../../../shared/hooks/useAuth';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

export const useLogin = () => {
  const { login: setAuthSession } = useAuth();

  return useMutation<LoginResponse, any, LoginRequest>({
    mutationFn: (data) => authApi.login(data),
    onSuccess: (data) => {
      const { access_Token, refresh_Token, user } = data.result;
      setAuthSession(access_Token, refresh_Token, user);
    },
  });
};
export default useLogin;
