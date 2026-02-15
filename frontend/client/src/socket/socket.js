import { io } from 'socket.io-client';

export const createSocket = (token) => {
  return io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
    auth: { token }
  });
};
