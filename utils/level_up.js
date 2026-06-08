import { createRequire } from 'module';
import { char_ist } from '../script.js';

const require = createRequire(import.meta.url);
const Characters = require('../data/characters.json');
const Archetypes = require('../data/archetypes.json');

function lv_up(character) {
  const newStats = {};
  const baseStats = Characters.find(c => c.id === character.id).stats; // Stat iniziali dall'ID
  const archBonus = Archetypes[character.archetype];
  const currentStats = character.stats;
  character.level += 1;

  for (let stat in baseStats) {
  const growth_per_lv = baseStats[stat] * 0.1 + archBonus[stat] * 0.6;
  newStats[stat] = Number((currentStats[stat] + growth_per_lv).toFixed(1));
  }


  newStats.hp += 1;

  char_ist[character.id_instance] = {
    ...character,
    stats: newStats,
    stats_instance: { max_hp: newStats.hp , ...newStats }
  };
}

export default lv_up;
