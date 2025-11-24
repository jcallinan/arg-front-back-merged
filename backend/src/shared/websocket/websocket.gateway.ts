import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { cacheConfig } from "@src/shared/cache/cache.config";
import { AuthUseCase } from "@src/auth/application/usecases/auth.usecase";

@WebSocketGateway({
  cors: { origin: "*", credentials: true }, //allow cookies to be sent
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(WebsocketGateway.name);

  // Track userInitials → Set of socket IDs
  private userSockets = new Map<string, Set<string>>();

  constructor(private readonly authUseCase: AuthUseCase) {}

  async afterInit() {
    this.logger.log("WebSocket Gateway initialized");

    try {
      const redisUrl = cacheConfig.password
        ? `redis://:${cacheConfig.password}@${cacheConfig.host}:${cacheConfig.port}/${cacheConfig.db}`
        : `redis://${cacheConfig.host}:${cacheConfig.port}/${cacheConfig.db}`;

      const pubClient = createClient({ url: redisUrl });
      const subClient = pubClient.duplicate();

      await Promise.all([pubClient.connect(), subClient.connect()]);

      this.server.adapter(createAdapter(pubClient, subClient));
      this.logger.log("✅ Redis adapter configured for Socket.IO clustering");
    } catch (error) {
      this.logger.error("❌ Failed to configure Redis adapter:", error);
    }
  }

  // Centralized room key helper
  private getUserRoom(userInitials: string): string {
    return `user:${userInitials}`;
  }

  // 🔹 Extract token consistently with REST AuthGuard
  private extractToken(client: Socket): string | null {
    // from cookies
    const cookies = client.handshake.headers.cookie;
    if (cookies) {
      const match = cookies.match(/access-token=([^;]+)/);
      if (match) return match[1] || null;
    }

    // from auth header
    const authHeader = client.handshake.headers["authorization"] as
      | string
      | undefined;
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.split(" ")[1] || null;
    }

    // from socket auth (fallback)
    return (client.handshake.auth?.token as string) || null;
  }


  // 🔹 On connect: authenticate and join user room
  async handleConnection(client: Socket) {
    this.logger.log(`🔌 Incoming socket ${client.id}`);

    const token = this.extractToken(client);

    if (!token) {
      this.logger.warn(
        `❌ No token found for socket ${client.id}, disconnecting`
      );
      client.disconnect();
      return;
    }

    this.logger.log(`🔌 Token found for socket ${client.id}: ${token}`);

    try {
      // Pass token, use generic path/method for socket context
      const restApi = false;
      const user = await this.authUseCase.callAuthService(token, "", "", restApi);


      if (!user?.isValid()) {
        this.logger.warn(`❌ Invalid user for socket ${client.id}`);
        client.disconnect();
        return;
      }
      this.logger.log("user:", user);
      // const user = {
      //   email: "kusingh@amref.com",
      //   userId: "4",
      //   userName: "SINGH",
      //   userDisplayName: "Kuldeep U. Singh",
      //   userInitials: "KU",
      // };

      client.data.userId = user.userId;
      client.data.userInitials = user.userInitials;

      const room = this.getUserRoom(user.userInitials);
      client.join(room);

      // Register the connection
      this.registerConnection(user.userInitials, client.id);

      this.displayConnectionTable(client, user);

      this.displayGlobalSummary();
    } catch (err: any) {
      this.logger.error(
        `❌ Auth error for socket ${client.id}: ${err.message}`
      );
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    this.unregisterConnection(client.data.userInitials, client.id);
    this.displayDisconnectionTable(client);
    this.displayGlobalSummary();
  }

  // ---------------- Connection Tracking ----------------

  private registerConnection(userInitials: string, socketId: string) {
    if (!userInitials) return;
    if (!this.userSockets.has(userInitials)) {
      this.userSockets.set(userInitials, new Set());
    }
    this.userSockets.get(userInitials)!.add(socketId);

    const count = this.userSockets.get(userInitials)!.size;
    this.logger.log(
      `👥 User ${userInitials} now has ${count} active socket(s).`
    );
  }

  private unregisterConnection(userInitials: string, socketId: string) {
    if (!userInitials) return;
    const sockets = this.userSockets.get(userInitials);
    if (!sockets) return;

    sockets.delete(socketId);

    if (sockets.size === 0) {
      this.userSockets.delete(userInitials);
      this.logger.log(`👋 User ${userInitials} has no active sockets now.`);
    } else {
      this.logger.log(
        `👥 User ${userInitials} now has ${sockets.size} active socket(s).`
      );
    }
  }

  // 🔹 broadcast (keep your old method)
  emitEvent(event: string, data: any) {
    try {
      if (!this.server) {
        this.logger.error(`❌ Socket.IO server is not initialized`);
        return;
      }
      this.logger.log(`📢 Broadcasting '${event}'`);
      this.server.emit(event, data);
    } catch (error: unknown) {
      this.logger.error(`❌ Failed to emit event '${event}': ${error}`);
    }
  }

  // 🔹 new: user-specific emit (via room)
  emitToUser(userInitials: string, event: string, data: any) {
    try {
      const room = this.getUserRoom(userInitials);
      this.logger.log(
        `📤 Emitting '${event}' to user ${userInitials} (room=${room})`
      );
      this.server.to(room).emit(event, data);
    } catch (error: unknown) {
      this.logger.error(
        `❌ Failed to emit '${event}' to user ${userInitials}: ${error}`
      );
    }
  }

  // --- Helpers to display table logs ---

  private displayConnectionTable(client: Socket, user: any) {
    const info = {
      "Socket ID": client.id,
      "User ID": user.userId,
      "User Initials": user.userInitials,
      "User Name": user.userName,
      "Display Name": user.userDisplayName,
      Email: user.email,
      "Connection Time": this.formatLogTime(),
      Status: "🟢 Connected",
    };

    this.logger.log("🔌 WebSocket Connection:");
    this.printTable(info);
  }

  private displayDisconnectionTable(client: Socket) {
    const info = {
      "Socket ID": client.id,
      "User ID": client.data.userId || "N/A",
      "User Initials": client.data.userInitials || "N/A",
      "User Name": client.data.userName || "N/A",
      "Display Name": client.data.userDisplayName || "N/A",
      "Disconnection Time": this.formatLogTime(),
      Status: "🔴 Disconnected",
    };

    this.logger.log("🔌 WebSocket Disconnection:");
    this.printTable(info);
  }

  private displayGlobalSummary() {
    const allSockets: { socketId: string; initials: string; status: string }[] = [];
  
    this.userSockets.forEach((sockets, initials) => {
      sockets.forEach((socketId) => {
        allSockets.push({
          socketId,
          initials,
          status: "🟢 Connected",
        });
      });
    });
  
    const totalSockets = allSockets.length;
  
    this.logger.log("🌐 Global Socket Summary:");
    this.logger.log("┌───────────────────────────────────────────────────────┐");
    this.logger.log(`│ ${"Socket ID".padEnd(20)} │ ${"User Initials".padEnd(15)} │ ${"Status".padEnd(12)} │`);
    this.logger.log("├───────────────────────────────────────────────────────┤");
  
    allSockets.forEach(({ socketId, initials, status }) => {
      this.logger.log(
        `│ ${socketId.padEnd(20)} │ ${initials.padEnd(15)} │ ${status.padEnd(12)} │`
      );
    });
  
    this.logger.log("├───────────────────────────────────────────────────────┤");
    this.logger.log(
      `│ ${"Total Active Sockets".padEnd(20)} │ ${String(totalSockets).padEnd(15)} │ ${"".padEnd(12)} │`
    );
    this.logger.log("└───────────────────────────────────────────────────────┘");
  }
  

  private printTable(info: Record<string, string>) {
    this.logger.log(
      "┌────────────────────────────────────────────────────────────┐"
    );
    Object.entries(info).forEach(([key, value]) => {
      const paddedKey = key.padEnd(20);
      const paddedValue = String(value).padEnd(35);
      this.logger.log(`│ ${paddedKey} │ ${paddedValue} │`);
    });
    this.logger.log(
      "└────────────────────────────────────────────────────────────┘"
    );
  }

  private formatLogTime(date: Date = new Date()): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${month}-${day}-${year} ${hours}:${minutes}`;
  }
}
