import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_HOST = import.meta.env.VITE_SOCKET_HOST;

export const useSocket = () => {
   const [socket, setSocket] = useState<Socket | null>(null);
   const [isAlive, setIsAlive] = useState(false);
   const [uploadStatusData, setUploadStatusData] = useState<any>(null);
   const [uploadPaperStatusData, setUploadPaperStatusData] =
      useState<any>(null);
   const [uploadLmsStatusData, setUploadLmsStatusData] = useState<any>(null);
   const [clearChecksStatusData, setClearChecksStatusData] =
      useState<any>(null);
   useEffect(() => {
      if (!SOCKET_HOST) {
         console.error("❌ VITE_SOCKET_HOST is not defined");
         return;
      }

      const s = io(SOCKET_HOST, {
         transports: ["websocket"],
         reconnectionAttempts: 3,
         timeout: 10000,
         withCredentials: true,
      });

      s.on("connect", () => {
         console.log("✅ WebSocket connected:", s.id);
         setIsAlive(true);
      });

      s.on("upload-status", (payload) => {
         console.log("📨 upload-status received in useSocket:", payload);
         setUploadStatusData(payload);
      });

      // Add specific listener for clear checks
      s.on("clear-checks-upload-status", (payload) => {
         console.log("📨 clear-checks-upload-status received:", payload);
         setUploadStatusData(payload);
      });
      s.on("paper-batch-status", (payload) => {
         console.log("📨 paper-batch-status", payload);
         setUploadPaperStatusData(payload);
      });
      s.on("lms-batch-status", (payload) => {
         console.log("📨 lms-batch-status", payload);
         setUploadLmsStatusData(payload);
      });

      s.on("clear-checks-status", (payload) => {
         console.log("📨 clear-checks-status", payload);
         setClearChecksStatusData(payload);
      });
      s.on("disconnect", (reason) => {
         console.warn("🚫 WebSocket disconnected:", reason);
         setIsAlive(false);
      });

      s.on("connect_error", (err) => {
         console.error("❌ WebSocket connection error:", err.message);
      });

      setSocket(s);

      return () => {
         s.disconnect();
         console.log("🔌 WebSocket disconnected on unmount");
      };
   }, []);

   const emitSocketEvent = (event: string, data: any) => {
      if (socket?.connected) {
         socket.emit(event, data);
         console.log(`📤 Emitted "${event}"`, data);
      } else {
         console.warn(`⚠️ Socket not connected. Event "${event}" not emitted.`);
      }
   };

   return {
      socket,
      isAlive,
      uploadStatusData,
      uploadPaperStatusData,
      uploadLmsStatusData,
      clearChecksStatusData,
      emitSocketEvent,
   };
};
