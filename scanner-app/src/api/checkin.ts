import { fetchClient } from './client';

export const checkInAPI = {
  scanPass: (token: string, eventId: number) =>
    fetchClient('/scanner/checkin', {
      method: 'POST',
      body: JSON.stringify({ token, eventId }),
    }),
};
