import { fetchClient } from './client';

export const scannerAuthAPI = {
  login: (deviceCode: string, password: string) =>
    fetchClient('/scanner/login', {
      method: 'POST',
      body: JSON.stringify({ deviceCode, password }),
    }),
  getProfile: () =>
    fetchClient('/scanner/me', {
      method: 'GET',
    }),
};
