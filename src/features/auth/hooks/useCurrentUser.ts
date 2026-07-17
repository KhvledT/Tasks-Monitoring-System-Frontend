import { useAuth } from '../../../shared/hooks/useAuth';

export const useCurrentUser = () => {
  const { user } = useAuth();
  return user;
};
export default useCurrentUser;
