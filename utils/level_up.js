

function lv_up(character) {
  const newStats = {};
  const baseStats = Characters.find(c => c.id === character.id).stats; // Stat iniziali dall'ID
  const archBonus = Archetypes[character.archetype];
  const currentStats = character.stats;
  character.level += 1;

  for (let stat in baseStats) {
  const growth_per_lv = baseStats[stat] * 0.1 + archBonus[stat] * 0.2;
  newStats[stat] = Number((currentStats[stat] + growth_per_lv).toFixed(2));
  }


  newStats.hp += 1;

  return {
    ...character,
    stats: newStats,
    stats_instance: newStats
  };
}

const Archetypes = {
 // 5 S 4 A 3 B 2 C 1 D 0 E
  //front-line
  tank:      { hp: 4, atk: 0, def: 3, matk: 0, mdef: 1, spd: 1 },
  guardian:  { hp: 3, atk: 0, def: 2, matk: 0, mdef: 4, spd: 0 },
  bruiser:   { hp: 2, atk: 3, def: 2, matk: 0, mdef: 1, spd: 1 },
  
  //speed
  swiftblade:{ hp: 1, atk: 2, def: 0, matk: 1, mdef: 0, spd: 5 },
  assassin:  { hp: 0, atk: 4, def: 0, matk: 2, mdef: 0, spd: 3 },
  trickster: { hp: 0, atk: 2, def: 1, matk: 3, mdef: 0, spd: 3 },

  //mage
  mage:      { hp: 0, atk: 0, def: 1, matk: 4, mdef: 3, spd: 1 },
  battlemage:{ hp: 1, atk: 2, def: 2, matk: 3, mdef: 1, spd: 0 },

  //bilanciati
  expert:    { hp: 1, atk: 2, def: 1, matk: 2, mdef: 1, spd: 2 },
};

const Characters = [
  {
  "id": 11,
  "name": "Brundak",
  "type": ["pyro", "steel"],
  "stats": { "hp": 11, "atk": 15, "def": 10, "matk": 8, "mdef": 7, "spd": 9 }
}
];

function assignArchetype(character) {
  const archetypeNames = Object.keys(Archetypes);
  const randomName = archetypeNames[Math.floor(Math.random() * archetypeNames.length)];

  return {
    ...character,
    archetype: randomName
  };
}

function create_character() {
  const randomIndex = Math.floor(Math.random() * Characters.length);
  const randomCharacter = Characters[randomIndex];
  
  // Creiamo una copia delle statistiche base per stats_instance
  const character = assignArchetype({
    ...randomCharacter,
    instance: {...randomCharacter.stats} // Duplica le stat base
  });
  
  return {
    ...character,
    level: 1,
    exp: 0,
    stats: {...randomCharacter.stats} // Inizializza le stat attuali
  };
}

let player = create_character();
console.log("Personaggio creato:", player);

player = lv_up(player);
console.log("lv2:", player.stats, "\n");

for(let i = 0; i < 48; i++) {
  player = lv_up(player);
}

console.log("lv50:", player.stats, "\n");
