import type { Profile, ProfileRole, ProfileUserSource } from '../types/profile.types';

const VALID_ROLES: ProfileRole[] = ['USER', 'ADMIN', 'SUPER_ADMIN'];

const toRole = (role: string | undefined): ProfileRole => {
  if (role && VALID_ROLES.includes(role as ProfileRole)) {
    return role as ProfileRole;
  }
  return 'USER';
};

export const profileMapperService = {
  mapToProfile: (user: ProfileUserSource | null | undefined): Profile | null => {
    if (!user) {
      return null;
    }

    const id = user.id || user._id;
    if (!id) {
      return null;
    }

    return {
      id: String(id),
      email: user.email || '',
      fullName: user.fullName || '',
      role: toRole(user.role),
      rank: user.rank || '',
      isActive: Boolean(user.isActive),
    };
  },
};

export default profileMapperService;
