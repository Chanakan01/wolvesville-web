import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  roomCode: { type: String, required: true },
  phase: { type: String, default: "lobby" }, // lobby | night | day | vote | end
  dayCount: { type: Number, default: 0 },
  players: [
    {
      socketId: String,
      name: String,
      role: String,
      team: String,
      alive: { type: Boolean, default: true },
      muted: { type: Boolean, default: false }, // ถูก silence
      data: { type: Object, default: {} }
    }
  ],
  actions: { type: Object, default: {} }, // เก็บ action ชั่วคราว เช่น target กลางคืน
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Game", gameSchema);
