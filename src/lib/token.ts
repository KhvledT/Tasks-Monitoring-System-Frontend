import { STORAGE } from '../constants/storage';

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE.REFRESH_TOKEN);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(STORAGE.REFRESH_TOKEN, token);
};

export const clearRefreshToken = (): void => {
  localStorage.removeItem(STORAGE.REFRESH_TOKEN);
};
