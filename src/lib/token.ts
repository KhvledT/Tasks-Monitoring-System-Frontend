import { STORAGE } from '../constants/storage';

export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE.ACCESS_TOKEN);
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem(STORAGE.ACCESS_TOKEN, token);
};

export const clearAccessToken = (): void => {
  localStorage.removeItem(STORAGE.ACCESS_TOKEN);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE.REFRESH_TOKEN);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(STORAGE.REFRESH_TOKEN, token);
};

export const clearRefreshToken = (): void => {
  localStorage.removeItem(STORAGE.REFRESH_TOKEN);
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp) {
      return payload.exp * 1000 < Date.now();
    }
    return false;
  } catch (e) {
    return true;
  }
};
