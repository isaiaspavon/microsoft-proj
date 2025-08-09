import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  // const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      // setIsConnected(true);
      reconnectAttemptsRef.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      // setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      // setIsConnected(false);
      
      // Implement exponential backoff for reconnection
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          newSocket.connect();
        }, delay);
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      // setIsConnected(true);
      reconnectAttemptsRef.current = 0;
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Socket reconnection attempt:', attemptNumber);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed after', maxReconnectAttempts, 'attempts');
    });

    setSocket(newSocket);

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      newSocket.close();
    };
  }, []);

  return socket;
}; 