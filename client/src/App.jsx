import React, { useState } from "react";
import socket from "./api/socket";
import Home from "./pages/Home.jsx";
import Lobby from "./pages/Lobby.jsx";
import Room from "./pages/Room.jsx";

export default function App() {
  const [view, setView] = useState("home");
  const [roomCode, setRoomCode] = useState(null);
  const [playerName, setPlayerName] = useState("");

  const handleCreateRoom = () => {
    socket.emit("create_room", (res) => {
      if (res.roomCode) {
        setRoomCode(res.roomCode);
        setView("lobby");
      }
    });
  };

  const handleJoinRoom = (code, name) => {
    socket.emit("join_room", { roomCode: code, name }, (res) => {
      if (res.success) {
        setRoomCode(code);
        setPlayerName(name);
        setView("room");
      } else {
        alert(res.error || "Join failed");
      }
    });
  };

  if (view === "home")
    return (
      <Home
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
      />
    );

  if (view === "lobby")
    return <Lobby roomCode={roomCode} />;

  if (view === "room")
    return <Room roomCode={roomCode} playerName={playerName} />;

  return null;
}
