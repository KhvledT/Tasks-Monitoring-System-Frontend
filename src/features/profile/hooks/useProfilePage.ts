import { useLogout } from '../../auth/hooks/useLogout';
import { useProfile } from './useProfile';
import { useUserSettings } from './useUserSettings';
import type { Profile, UserSetting } from '../types/profile.types';

export interface UseProfilePageResult {
  profile: Profile | null;
  isEmpty: boolean;
  settings: UserSetting[];
  isSettingsEmpty: boolean;
  logout: () => void;
}

export const useProfilePage = (): UseProfilePageResult => {
  const { profile, isEmpty } = useProfile();
  const { settings } = useUserSettings();
  const logout = useLogout();

  return {
    profile,
    isEmpty,
    settings,
    isSettingsEmpty: settings.length === 0,
    logout,
  };
};

export default useProfilePage;
