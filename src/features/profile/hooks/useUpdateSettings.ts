import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import type { UserSettings } from '../../../providers/AuthProvider';

export type UpdateSettingsRequest = Partial<UserSettings>;

export const useUpdateSettings = () => {
  const { updateUser, user } = useAuth();

  return useMutation({
    mutationFn: async (data: UpdateSettingsRequest) => {
      const response = await apiClient.patch('/user/settings', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (user && data?.result) {
        updateUser({
          ...user,
          settings: data.result.settings,
        });
      }
    },
  });
};

export default useUpdateSettings;
