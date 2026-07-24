import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getAccessToken } from "../lib/token";
import { useAuth } from "../shared/hooks/useAuth";
import { ENV } from "../env";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // EXCLUDE Super Admin from Socket connection per specification
    if (!user || user.role === "SUPER_ADMIN") {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = getAccessToken();
    if (!token) return;

    const backendUrl = ENV.apiUrl || "http://localhost:3000";
    // Remove /api/v1 trailing path if present for socket connection
    const socketUrl = backendUrl.replace(/\/api\/v1\/?$/, "");

    const socketInstance = io(socketUrl, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketInstance.on("connect", () => {
      console.log("⚡ Socket.io connected to backend");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
