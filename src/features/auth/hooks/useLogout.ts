import { useAuth } from '../../../shared/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';

export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await apiClient.post('/user/logout');
    } catch (e) {
      console.warn('Backend logout failed:', e);
    } finally {
      logout();
      queryClient.clear();
    }
  };

  return handleLogout;
};
export default useLogout;
