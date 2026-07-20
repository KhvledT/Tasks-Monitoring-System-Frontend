import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';
import { useAuth } from '../../../shared/hooks/useAuth';

export interface UpdateProfileRequest {
  fullName?: string;
  rank?: string;
  phone?: string;
  company?: string;
  avatarUrl?: string;
  signOnDate?: string;
}

export const useUpdateProfile = () => {
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await apiClient.patch('/user/profile', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.result) {
        updateUser(data.result);
      }
    },
  });
};

export default useUpdateProfile;
