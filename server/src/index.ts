import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  Client,
  UserSocketMap,
  RoomDataMap,
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  JoinRoomData,
  CodeChangeData,
  CursorChangeData,
  LanguageChangeData
} from "./types";

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.get("/", (req, res) => {
  res.send("Server is running");
});

const server = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: ["http://localhost:5173", "https://codespace-7esk.onrender.com/"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap: UserSocketMap = {};
const roomData: RoomDataMap = {};

const getRoomClients = (roomId: string): Client[] => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId: string): Client => {
      return {
        socketId,
        username: userSocketMap[socketId] || "Unknown",
      };
    }
  );
};

io.on("connection", (socket) => {
  socket.on("join", ({ roomId, username }: JoinRoomData) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getRoomClients(roomId);

    if (roomData[roomId]) {
      socket.emit("sync", roomData[roomId]);
    }

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id] || "Unknown",
      });
    });
    delete userSocketMap[socket.id];
  });

  socket.on("code-change", ({ roomId, code }: CodeChangeData) => {
    roomData[roomId] = {
      ...(roomData[roomId] || {}),
      code,
    };
    socket.in(roomId).emit("code-change", { code });
  });

  socket.on("cursor-change", ({ roomId, position, username }: CursorChangeData) => {
    socket.to(roomId).emit("cursor-change", {
      socketId: socket.id,
      position,
      username,
    });
  });

  socket.on("language-change", ({ roomId, language }: LanguageChangeData) => {
    roomData[roomId] = {
      ...(roomData[roomId] || {}),
      language,
    };
    socket.in(roomId).emit("language-change", { language });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at ${HOST}:${PORT}`);
});