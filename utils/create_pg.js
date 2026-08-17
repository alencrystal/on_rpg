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
    const random_int = Math.floor(Math.random() * Characters.length);
    new_character = Characters[random_int];
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
    stats_instance: {max_hp: new_character.stats.hp, ...new_character.stats },
    position: 0,
    team: 0,
    moves: [],
    alive: true,
    crisis: false,
    actived_ability: false
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

  //attacco random con priorità di tipo (70%) e fallback casuale (30%)
  if (move_id === -1) {
    const available_moves = moves.filter(move => !character.moves.includes(move.id));

    const prio_moves = [];
    character.type.forEach(type => {
      available_moves.forEach(move => {
        if (move.type === type) {
          prio_moves.push(move);
        }
      });
    });
    //rimuove le mosse prioritarie da avaiblesMoves
    const unique_prio_moves = [...new Set(prio_moves.map(move => move.id))]
      .map(id => available_moves.find(move => move.id === id));

    // seleziona una mossa con priorità del 70% e casuale al 30%
    const shouldUsePriorityMove = Math.random() < 0.7;
    const candidate_moves = shouldUsePriorityMove ? unique_prio_moves : available_moves;
    const random_int = Math.floor(Math.random() * candidate_moves.length);

    new_move = candidate_moves[random_int].id;
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
