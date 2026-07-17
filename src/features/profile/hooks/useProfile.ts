import { useCurrentUser } from '../../auth/hooks/useCurrentUser';
import { profileMapperService } from '../services/profile-mapper.service';
import type { Profile } from '../types/profile.types';

export interface UseProfileResult {
  profile: Profile | null;
  isEmpty: boolean;
}

export const useProfile = (): UseProfileResult => {
  const user = useCurrentUser();
  const profile = profileMapperService.mapToProfile(user);
  const isEmpty = profile === null;

  return {
    profile,
    isEmpty,
  };
};

export default useProfile;
