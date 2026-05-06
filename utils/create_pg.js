import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Characters = require('../data/characters.json');
const Archetypes = require('../data/archetypes.json');

let num_id_instance = 0;

function assignArchetype(character) {
  const archetypeNames = Object.keys(Archetypes);
  const randomName = archetypeNames[Math.floor(Math.random() * archetypeNames.length)];

  return {
    ...character,
    archetype: randomName
  };
}

// Se id è -1, crea un personaggio casuale
function create_character(id = -1) {

  let new_character;
  if (id === -1) {
    const randomIndex = Math.floor(Math.random() * Characters.length);
    new_character = Characters[randomIndex];
  }
  else {
    new_character = Characters.find(c => c.id === id);
  }

  // Assegna archetype casuale
  const char_arch = assignArchetype({ ...new_character });

  return {
    ...char_arch,
    id_instance: ++num_id_instance - 1,
    level: 1,
    exp: 0,
    stats: { ...new_character.stats },
    stats_instance: { ...new_character.stats, max_hp: new_character.stats.hp },
    position: 0,
    team: 0
  };
}

function add_to_field(field, character, team){

  let team_key = "team_" + team;

  if(!field[team_key]) field[team_key] = [];

  field[team_key].push(character.id_instance);

  character.position = field[team_key].length - 1;
  character.team = team;

  return [field, character];
}

export { create_character, assignArchetype, add_to_field };
