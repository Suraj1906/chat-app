import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();

// create server
const server = http.createServer(app);

// ✅ setup socket.io with flexible CORS for local + deployed frontend
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chat-app-9snv.vercel.app" // your deployed frontend
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // ✅ fallback support
});

const userSocketMap = {};

export const getReceiverSocketId = (receiver) => userSocketMap[receiver];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`🟢 User connected: ${userId}`);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log(`🔴 User disconnected: ${userId}`);
  });
});

export { app, server, io };
