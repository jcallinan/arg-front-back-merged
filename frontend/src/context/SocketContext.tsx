// // context/SocketContext.tsx

// import { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// const SOCKET_HOST = import.meta.env.VITE_SOCKET_HOST;

// interface SocketContextType {
//    socket: Socket | null;
//    isAlive: boolean;
//    uploadStatusData: any;
// }

// const SocketContext = createContext<SocketContextType>({
//    socket: null,
//    isAlive: false,
//    uploadStatusData: null,
// });

// export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
//    const [socket, setSocket] = useState<Socket | null>(null);
//    const [isAlive, setIsAlive] = useState(false);
//    const [uploadStatusData, setUploadStatusData] = useState<any>(null);

//    useEffect(() => {
//       if (!SOCKET_HOST) {
//          console.error("❌ VITE_SOCKET_HOST is not defined");
//          return;
//       }

//       const s = io(SOCKET_HOST, {
//          transports: ["websocket"],
//          reconnectionAttempts: 3,
//          timeout: 10000,
//       });

//       setSocket(s);

//       s.on("connect", () => {
//          console.log("✅ WebSocket connected:", s.id);
//          setIsAlive(true);
//       });

//       s.on("complete", (payload) => {
//          console.log("📨 upload-status", payload);
//          setUploadStatusData(payload);
//       });

//       s.on("disconnect", (reason) => {
//          console.warn("🚫 WebSocket disconnected:", reason);
//          setIsAlive(false);
//       });

//       s.on("connect_error", (err) => {
//          console.error("❌ WebSocket connection error:", err.message);
//       });

//       return () => {
//          s.disconnect();
//          console.log("🔌 WebSocket disconnected on unmount");
//       };
//    }, []);

//    return (
//       <SocketContext.Provider value={{ socket, isAlive, uploadStatusData }}>
//          {children}
//       </SocketContext.Provider>
//    );
// };

// export const useSocket = () => useContext(SocketContext);
