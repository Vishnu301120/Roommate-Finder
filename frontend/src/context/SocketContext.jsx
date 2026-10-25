import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (user?._id) {
      const newSocket = io('http://localhost:5000', {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        newSocket.emit('register_user', user._id);
      });

      newSocket.on('online_users', (usersList) => {
        setOnlineUsers(new Set(usersList));
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user?._id]);

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId?.toString());
  };

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isUserOnline }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
