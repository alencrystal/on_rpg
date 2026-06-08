import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Characters = require('../data/characters.json');
const Archetypes = require('../data/archetypes.json');
const moves = require('../data/moves.json');

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
    team: 0,
    moves: []
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



function add_attack(character, move_id = -1){

  let new_move;

  if (character.moves.length >= 3) {
    console.log("Il personaggio ha già 3 mosse. Non è possibile aggiungerne altre.");
    return;
  }

  //attacco random
  if (move_id === -1) {
    while (new_move === undefined){
      const randomIndex = Math.floor(Math.random() * moves.length);

      //verifica che non ci siano duplicati
      if (!character.moves.includes(moves[randomIndex].id)) {
        new_move = moves[randomIndex].id;
      }
    }

  }
  else {
    new_move = moves.find(m => m.id === move_id).id;

    if (character.moves.includes(new_move)) {
    console.log("Il personaggio ha già questa mossa. Non è possibile aggiungerla di nuovo.");
    return;
  }
  }

  character.moves.push(new_move);
}


export { create_character, assignArchetype, add_to_field, add_attack };
