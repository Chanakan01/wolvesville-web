import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import registerGameSocket from "./sockets/gameSocket.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  }
});

connectDB();

app.use(cors());
app.use(express.json());

// simple health check
app.get("/", (req, res) => {
  res.send({ status: "ok", message: "Wolvesville web server running" });
});

io.on("connection", (socket) => {
  console.log("New socket connected:", socket.id);
  registerGameSocket(io, socket);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
