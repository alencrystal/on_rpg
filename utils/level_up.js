import  Characters  from '../data/characters.js';
import  Archetypes  from '../data/archetypes.js';

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

export default lv_up;
