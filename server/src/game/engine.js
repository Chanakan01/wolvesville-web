import Game from "../models/Game.js";
import { PHASES } from "./phases.js";
import { ROLES } from "./roles.js";

/**
 * แจก role แบบง่ายๆ ตามจำนวนผู้เล่น
 */
export function assignRoles(players) {
  // ตัวอย่าง: ใส่ logic จริงทีหลัง
  const rolesPool = [
    ROLES.ORACLE,
    ROLES.GUARDIAN,
    ROLES.SHERIFF,
    ROLES.WATCHER,
    ROLES.ALPHA_WOLF,
    ROLES.SHADOW_WOLF,
    ROLES.SILENCER,
    ROLES.JESTER
  ];

  const shuffled = [...players].sort(() => Math.random() - 0.5);

  return shuffled.map((p, idx) => {
    const role = rolesPool[idx % rolesPool.length];
    return {
      ...p,
      role: role.name,
      team: role.team
    };
  });
}

/**
 * เช็คว่าจบเกมหรือยัง
 */
export function checkWinCondition(game) {
  const alive = game.players.filter((p) => p.alive);
  const wolves = alive.filter((p) => p.team === "WOLF");
  const village = alive.filter((p) => p.team === "VILLAGE");
  const jesterLynched = game.data?.jesterLynched;

  if (jesterLynched) {
    return { winner: "JESTER", reason: "Jester was lynched" };
  }

  if (wolves.length === 0 && village.length > 0) {
    return { winner: "VILLAGE", reason: "All wolves are dead" };
  }

  if (wolves.length >= village.length && wolves.length > 0) {
    return { winner: "WOLF", reason: "Wolves outnumber the village" };
  }

  return null;
}

/**
 * ประมวลผล action กลางคืน
 */
export function resolveNightActions(game) {
  // คุณจะต้องเก็บ actions เช่น:
  // game.actions = { kills: [...], protects: [...], silences: [...], doused: [...] }
  // แล้ว resolve ตามลำดับ Priority
  // ตัวอย่างโครง (ยังไม่ใส่ logic เต็ม):
  const actions = game.actions || {};
  const updatedPlayers = [...game.players];

  // TODO: ใส่ลำดับการป้องกัน/ฆ่า/บัฟ/ดีบัฟ เป็นต้น

  game.players = updatedPlayers;
  game.actions = {}; // เคลียร์ action
  return game;
}
