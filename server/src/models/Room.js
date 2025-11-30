import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  hostSocketId: String,
  status: { type: String, default: "waiting" }, // waiting | in_game | finished
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Room", roomSchema);
