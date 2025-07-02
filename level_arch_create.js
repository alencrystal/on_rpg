function lv_up(character) {
  const newStats = {};
  const baseStats = character.lv_1_stat;   // stat iniziali a lv1
  const archBonus = character.archetypeBonus;
  const currentStats = character.stats;    // stat attuali
  character.level += 1

  for (let stat in baseStats) {
    const growth_per_lv = Math.ceil((baseStats[stat] / 15) + (archBonus[stat] / 3));
    newStats[stat] = currentStats[stat] + growth_per_lv;
  }

  newStats.hp += 1;

  return {
    ...character,
    stats: newStats
  };
}

const Archetypes = {
  tank:      { hp: 3, atk: 1, def: 2, matk: 0, mdef: 3, spd: 0 },
  assassin:  { hp: 0, atk: 3, def: 0, matk: 1, mdef: 0, spd: 5 },
  bruiser:   { hp: 2, atk: 3, def: 2, matk: 0, mdef: 1, spd: 1 },
  mage:      { hp: 0, atk: 0, def: 1, matk: 4, mdef: 3, spd: 1 },
  battlemage:{ hp: 1, atk: 2, def: 1, matk: 3, mdef: 1, spd: 1 },
  expert:    { hp: 1, atk: 2, def: 1, matk: 2, mdef: 1, spd: 2 },
  swiftblade:{ hp: 0, atk: 4, def: 1, matk: 1, mdef: 0, spd: 3 },
  guardian:  { hp: 4, atk: 0, def: 3, matk: 0, mdef: 1, spd: 1 },
  trickster: { hp: 1, atk: 2, def: 0, matk: 2, mdef: 0, spd: 4 }
};

const Characters = [
  {
    id: 1,
    name: "Kael",
    type: ["pyro"],
    stats: { hp: 10, atk: 10, def: 6, matk: 12, mdef: 10, spd: 12 }
  },
  {
    id: 3,
    name: "Sera",
    type: ["ice", "pyro"],
    stats: { hp: 10, atk: 12, def: 5, matk: 6, mdef: 7, spd: 20 }
  }
];

function assignArchetype(character) {
  const archetypeNames = Object.keys(Archetypes);
  const randomName = archetypeNames[Math.floor(Math.random() * archetypeNames.length)];
  const bonus = Archetypes[randomName];

  return {
    ...character,
    archetype: randomName,
    archetypeBonus: { ...bonus }
  };
}

function create_character() {
  const randomIndex = Math.floor(Math.random() * Characters.length);
  const randomCharacter = Characters[randomIndex];
    
  const character = assignArchetype(randomCharacter);
  return {...character, level: 1 , exp: 0 , lv_1_stat: { ...character.stats }};
}

let player = create_character();
console.log(player);

player = lv_up(player);

console.log("lv2: ", player.stats)

for(let i = 0; i < 48; i++){
    player = lv_up(player);
}

console.log("lv50: ", player.stats)