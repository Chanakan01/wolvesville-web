export const ROLES = {
  ORACLE: {
    name: "Oracle",
    team: "VILLAGE",
    description: "At night, learn the team of one player.",
    nightAction: true
  },
  GUARDIAN: {
    name: "Guardian",
    team: "VILLAGE",
    description: "Protect one player each night.",
    nightAction: true
  },
  SHERIFF: {
    name: "Sheriff",
    team: "VILLAGE",
    description: "Has 2x vote power during the day.",
    nightAction: false
  },
  WATCHER: {
    name: "Watcher",
    team: "VILLAGE",
    description: "See who visited a player at night.",
    nightAction: true
  },
  ALPHA_WOLF: {
    name: "Alpha Wolf",
    team: "WOLF",
    description: "Leads the wolves to choose a victim at night.",
    nightAction: true
  },
  SHADOW_WOLF: {
    name: "Shadow Wolf",
    team: "WOLF",
    description: "Survives the first lynch.",
    nightAction: false,
    passive: true
  },
  SILENCER: {
    name: "Silencer",
    team: "WOLF",
    description: "Silence one player for the next day.",
    nightAction: true
  },
  JESTER: {
    name: "Jester",
    team: "NEUTRAL",
    description: "Wins if lynched.",
    nightAction: false
  },
  ARSONIST: {
    name: "Arsonist",
    team: "NEUTRAL",
    description: "Douse players with fuel at night, ignite them all later.",
    nightAction: true
  },
  SURVIVOR: {
    name: "Survivor",
    team: "NEUTRAL",
    description: "Wins if alive at the end of the game.",
    nightAction: false
  }
};
