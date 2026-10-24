import Characters from '../data/characters.json' with { type: 'json' };
import Archetypes from '../data/archetypes.json' with { type: 'json' };
import { char_ist } from '../script.js';

function lv_up(character) {
  const baseStats = Characters.find((c) => c.id === character.id).stats;
  const archBonus = Archetypes[character.archetype];
  const currentStats = character.stats;
  character.level += 1;

  const newStats = {};
  for (let stat in baseStats) {
    const growth_per_lv = baseStats[stat] * 0.1 + archBonus[stat] * 0.6;
    newStats[stat] = Number((currentStats[stat] + growth_per_lv).toFixed(1));
  }

  newStats.hp += 1;

  character.stats = newStats;
  character.stats_instance = {
    max_hp: newStats.hp,
    ...newStats,
  };

  char_ist[character.id_instance] = character;
}

function check_level_up(character) {
  while (character.exp >= character.level ** 2 * 75) {
    lv_up(character);
    console.log(character.name + " has leveled up to " + character.level);
  }
}

export default check_level_up;