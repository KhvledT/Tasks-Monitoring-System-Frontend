import { useAuth } from '../../../shared/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    queryClient.clear();
  };

  return handleLogout;
};
export default useLogout;
