import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [typingMap, setTypingMap] = useState({}); // { [conversationId]: [userNames] }
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    let socketUrl = 'http://localhost:5000';
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1') {
        socketUrl = 'http://localhost:5000';
      } else if (/^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(host)) {
        socketUrl = `${window.location.protocol}//${host}:5000`;
      } else if (host.includes('vaidimiconsulting.in')) {
        socketUrl = 'https://api.vaidimiconsulting.in';
      } else if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) {
        socketUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
      } else {
        socketUrl = `${window.location.protocol}//${window.location.host}`;
      }
    }

    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('[Socket.IO Client] Connected to real-time server with ID:', socket.id);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('[Socket.IO Client] Disconnected from real-time server.');
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket.IO Client Warn] Connection error:', err.message);
    });

    // Handle incoming typing indicators
    socket.on('user_typing', ({ conversationId, userName }) => {
      if (!conversationId) return;
      setTypingMap((prev) => {
        const existing = prev[conversationId] || [];
        if (!existing.includes(userName)) {
          return { ...prev, [conversationId]: [...existing, userName] };
        }
        return prev;
      });
    });

    socket.on('user_stop_typing', ({ conversationId, userId: stoppedUserId }) => {
      if (!conversationId) return;
      setTypingMap((prev) => {
        return {
          ...prev,
          [conversationId]: [],
        };
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [token]);

  const joinConversation = useCallback((conversationId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('join_conversation', { conversationId });
    }
  }, []);

  const leaveConversation = useCallback((conversationId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('leave_conversation', { conversationId });
    }
  }, []);

  const sendTyping = useCallback((conversationId, userName) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('typing', { conversationId, userName });
    }
  }, []);

  const sendStopTyping = useCallback((conversationId) => {
    if (socketRef.current && conversationId) {
      socketRef.current.emit('stop_typing', { conversationId });
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        typingMap,
        joinConversation,
        leaveConversation,
        sendTyping,
        sendStopTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;
