import type { Profile, ProfileRole } from '../types/profile.types';

export const profileDisplayService = {
  getInitials: (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return '?';
    }
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  },

  formatRole: (role: ProfileRole): string => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Admin';
      case 'USER':
      default:
        return 'Seafarer';
    }
  },

  formatActiveStatus: (isActive: boolean): string =>
    isActive ? 'Active' : 'Inactive',

  formatRank: (rank: string): string =>
    rank.trim() || 'Not specified',

  getEmptyProfileMessage: (): string =>
    'No profile information is available for this session.',

  getEmptySettingsMessage: (): string =>
    'There are no configurable preferences available from the backend for your account.',

  getSessionSummary: (profile: Profile): string =>
    profile.isActive
      ? 'Your account session is active.'
      : 'Your account is marked inactive.',
};

export default profileDisplayService;
