import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId as string;
  if (userId) userSocketMap.set(userId, socket.id);

  io.emit("getOnlineUsers", [...userSocketMap.keys()]);

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    userSocketMap.delete(userId);
    io.emit("getOnlineUsers", [...userSocketMap.keys()]);
  });
});

export { io, app, server };
