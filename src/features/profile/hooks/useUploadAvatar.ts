import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../lib/axios';
import { useAuth } from '../../../shared/hooks/useAuth';

export const useUploadAvatar = () => {
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.patch('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.result) {
        updateUser(data.result);
      }
    },
  });
};

export default useUploadAvatar;
