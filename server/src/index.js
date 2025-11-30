import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ status: "ok", message: "wolvesville-web server running" });
});

// ====== simple in-memory rooms ======
const rooms = new Map(); // { roomCode: { hostId, players: [{socketId,name}]} }

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("create_room", (cb) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    rooms.set(code, {
      hostId: socket.id,
      players: []
    });

    socket.join(code);
    console.log("Room created:", code);
    cb({ roomCode: code });
  });

  socket.on("join_room", ({ roomCode, name }, cb) => {
    const room = rooms.get(roomCode);
    if (!room) return cb({ error: "Room not found" });

    const player = { socketId: socket.id, name };
    room.players.push(player);
    socket.join(roomCode);

    io.to(roomCode).emit("room_players", room.players);
    cb({ success: true, roomCode });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // (ยังไม่ต้องลบออกจากห้อง เดี๋ยวค่อยทำทีหลัง)
  });
});
// =======================

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
