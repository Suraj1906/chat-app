import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const port = process.env.PORT || 5000;

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chat-app-9snv.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Base route for Vercel test
app.get("/", (req, res) => {
  res.send("✅ Chat App Backend is running on Vercel!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

// ✅ Start server
server.listen(port, () => {
  connectDb();
  console.log(`🚀 Server started on port ${port}`);
});
