import axios from 'axios';
import { ENV } from '../env';

export const apiClient = axios.create({
  baseURL: ENV.apiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});
