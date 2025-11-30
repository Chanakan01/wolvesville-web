import Game from "../models/Game.js";
import Room from "../models/Room.js";
import { PHASES } from "../game/phases.js";
import { assignRoles, checkWinCondition, resolveNightActions } from "../game/engine.js";

const roomsMemory = new Map(); // cache เฉพาะ runtime

export default function registerGameSocket(io, socket) {
  socket.on("create_room", async (cb) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    await Room.create({ code, hostSocketId: socket.id });
    roomsMemory.set(code, {
      host: socket.id,
      players: [],
      gameId: null
    });
    socket.join(code);
    cb({ roomCode: code });
  });

  socket.on("join_room", ({ roomCode, name }, cb) => {
    const room = roomsMemory.get(roomCode);
    if (!room) return cb({ error: "Room not found" });

    const player = {
      socketId: socket.id,
      name,
      alive: true
    };
    room.players.push(player);
    socket.join(roomCode);

    io.to(roomCode).emit("room_players", room.players);
    cb({ success: true, roomCode });
  });

  socket.on("start_game", async ({ roomCode }) => {
    const room = roomsMemory.get(roomCode);
    if (!room) return;

    const playersWithRoles = assignRoles(room.players);

    const game = await Game.create({
      roomCode,
      phase: PHASES.NIGHT,
      dayCount: 1,
      players: playersWithRoles
    });

    room.gameId = game._id;

    io.to(roomCode).emit("game_started", {
      phase: PHASES.NIGHT,
      dayCount: 1,
      players: playersWithRoles.map((p) => ({
        name: p.name,
        alive: p.alive
      }))
    });

    // ส่ง role ให้แต่ละคนแบบส่วนตัว
    playersWithRoles.forEach((p) => {
      io.to(p.socketId).emit("role_assigned", {
        role: p.role,
        team: p.team
      });
    });
  });

  socket.on("night_action", async ({ roomCode, action }, cb) => {
    const room = roomsMemory.get(roomCode);
    if (!room || !room.gameId) return;

    const game = await Game.findById(room.gameId);
    if (!game) return;

    // เก็บ action ใน game.actions
    game.actions = game.actions || {};
    // ตัวอย่าง: actions[ socket.id ] = action
    game.actions[socket.id] = action;
    await game.save();

    cb({ success: true });

    // TODO: ใส่เงื่อนไขว่า action ครบทุกคนแล้วค่อย resolve
  });

  socket.on("end_night", async ({ roomCode }) => {
    const room = roomsMemory.get(roomCode);
    if (!room || !room.gameId) return;

    let game = await Game.findById(room.gameId);
    game = resolveNightActions(game);
    const win = checkWinCondition(game);

    if (win) {
      game.phase = PHASES.END;
      await game.save();
      io.to(roomCode).emit("game_ended", win);
    } else {
      game.phase = PHASES.DAY;
      await game.save();
      io.to(roomCode).emit("phase_changed", {
        phase: PHASES.DAY,
        dayCount: game.dayCount
      });
    }
  });

    // โหวตกลางวัน/แขวนคอ – คุณจะต้องเก็บ vote แล้วสรุป
  socket.on("vote", async ({ roomCode, targetSocketId }, cb) => {
    // TODO: implement fully
    cb({ success: true });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    // คุณสามารถทำระบบหลุด/รีคอนเนกต์ทีหลังได้
  });
}
