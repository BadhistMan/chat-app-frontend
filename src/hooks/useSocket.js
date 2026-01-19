import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token && user && !socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
        socketRef.current.emit('user_online', user.id);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token, user]);

  return socketRef.current;
};
