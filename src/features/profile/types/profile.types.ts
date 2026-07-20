export type ProfileRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: ProfileRole;
  rank: string;
  isActive: boolean;
  signOnDate?: string;
  avatarUrl?: string;
  phone?: string;
  company?: string;
}

export interface UserSetting {
  key: string;
  label: string;
  value: string;
}

export type ProfileUserSource = {
  id?: string;
  _id?: string;
  email?: string;
  fullName?: string;
  role?: string;
  rank?: string;
  isActive?: boolean;
  signOnDate?: string;
  avatarUrl?: string;
  phone?: string;
  company?: string;
};
