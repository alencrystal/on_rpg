const Moves = [
  // ⚡ Electro - Physical
  { name: "Volt Jab", type: "Electro", category: "physical", power: 35, effect: { type: "speed-buff", chance: 1, value: 5, duration: 0} },
  { name: "Shock Bite", type: "Electro", category: "physical", power: 50 },
  { name: "Thunder Lunge", type: "Electro", category: "physical", power: 55 },

  // ⚡ Electro - Special
  { name: "Spark Orb", type: "Electro", category: "special", power: 40 },
  { name: "Plasma Pulse", type: "Electro", category: "special", power: 50 },
  { name: "Thunderburst", type: "Electro", category: "special", power: 55 },

  // 🔥 Pyro - Physical
  { name: "Blazing Fist", type: "Pyro", category: "physical", power: 40 },
  { name: "Flame Gift", type: "Pyro", category: "physical", power: 35, effect: { type: "heal-steal", chance: 1, value: 25, duration: 0} },
  { name: "Inferno Kick", type: "Pyro", category: "physical", power: 55 },

  // 🔥 Pyro - Special
  { name: "Ember Shot", type: "Pyro", category: "special", power: 40 },
  { name: "Firestream", type: "Pyro", category: "special", power: 50 },
  { name: "Crimson Burst", type: "Pyro", category: "special", power: 55 },

  // 💧 Water - Physical
  { name: "Aqua Jab", type: "Water", category: "physical", power: 40 },
  { name: "Tide Smash", type: "Water", category: "physical", power: 50 },
  { name: "Wave Crash", type: "Water", category: "physical", power: 55 },

  // 💧 Water - Special
  { name: "Bubble Ray", type: "Water", category: "special", power: 35, effect: { type: "heal", chance: 1, value: 10, duration: 0}  },
  { name: "Hydro Pulse", type: "Water", category: "special", power: 50 },
  { name: "Tsunami Blast", type: "Water", category: "special", power: 55 },

  // 🌿 Grass - Physical
  { name: "Leaf Jab", type: "Grass", category: "physical", power: 40, effect: { type: "slow", chance: 0.8, value: 15, duration: 0}  },
  { name: "Vine Strike", type: "Grass", category: "physical", power: 50 },
  { name: "Thorn Smash", type: "Grass", category: "physical", power: 55 },

  // 🌿 Grass - Special
  { name: "Spore Shot", type: "Grass", category: "special", power: 0, effect: { type: "heal", chance: 1, value: 50, duration: 0} },
  { name: "Seed Beam", type: "Grass", category: "special", power: 50 },
  { name: "Bloom Burst", type: "Grass", category: "special", power: 55 },

  // 🌍 Ground - Physical
  { name: "Dust Punch", type: "Ground", category: "physical", power: 40 },
  { name: "Quake Kick", type: "Ground", category: "physical", power: 50 },
  { name: "Rumble Slam", type: "Ground", category: "physical", power: 55 },

  // 🌍 Ground - Special
  { name: "Mud Shot", type: "Ground", category: "special", power: 40, effect: { type: "slow", chance: 1, value: 10, duration: 0} },
  { name: "Sand Pulse", type: "Ground", category: "special", power: 50 },
  { name: "Earthburst", type: "Ground", category: "special", power: 55 },

  // 🕊️ Flying - Physical
  { name: "Gust Jab", type: "Flying", category: "physical", power: 40 },
  { name: "Wind Blade", type: "Flying", category: "physical", power: 50 },
  { name: "Sky Dive", type: "Flying", category: "physical", power: 45, effect: { type: "speed-buff", chance: 1, value: 5, duration: 0} },

  // 🕊️ Flying - Special
  { name: "Feather Shot", type: "Flying", category: "special", power: 40 },
  { name: "Air Cutter", type: "Flying", category: "special", power: 50 },
  { name: "Hurricane Burst", type: "Flying", category: "special", power: 55 },

  // ❄️ Ice - Physical
  { name: "Frost Punch", type: "Ice", category: "physical", power: 40, effect: { type: "slow", chance: 0.5, value: 25, duration: 0}  },
  { name: "Icicle Kick", type: "Ice", category: "physical", power: 50 },
  { name: "Glacier Slam", type: "Ice", category: "physical", power: 55 },

  // ❄️ Ice - Special
  { name: "Snow Shot", type: "Ice", category: "special", power: 40, effect: { type: "atk-debuff", chance: 0.5, value: 10, duration: 0} },
  { name: "Ice Beam", type: "Ice", category: "special", power: 50 },
  { name: "Blizzard Burst", type: "Ice", category: "special", power: 55 },

  // ⚙️ Steel - Physical
  { name: "Iron Jab", type: "Steel", category: "physical", power: 40 },
  { name: "Metal Bash", type: "Steel", category: "physical", power: 50 },
  { name: "Steel Crusher", type: "Steel", category: "physical", power: 55 },

  // ⚙️ Steel - Special
  { name: "Shard Burst", type: "Steel", category: "special", power: 35, effect: { type: "matk-buff", chance: 0.5, value: 5, duration: 0}  },
  { name: "Magnetic Ray", type: "Steel", category: "special", power: 50 },
  { name: "Core Meltdown", type: "Steel", category: "special", power: 55 },

  // 👻 Spirit - Physical
  { name: "Wraith Jab", type: "Spirit", category: "physical", power: 35, effect: { type: "matk-debuff", chance: 0.5, value: 10, duration: 0} },
  { name: "Phantom Strike", type: "Spirit", category: "physical", power: 50 },
  { name: "Haunt Smash", type: "Spirit", category: "physical", power: 55 },

  // 👻 Spirit - Special
  { name: "Ghost Flare", type: "Spirit", category: "special", power: 35, effect: { type: "slow", chance: 0.3, value: 35, duration: 0}  },
  { name: "Soul Beam", type: "Spirit", category: "special", power: 50 },
  { name: "Netherburst", type: "Spirit", category: "special", power: 55 }

];
