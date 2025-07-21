import  Characters  from '../data/characters.js';
import  Archetypes  from '../data/archetypes.js';

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

  // Assegna archetype casuale
  const characterWithArchetype = assignArchetype({
    ...randomCharacter,
    // stats_instance non serve, usa solo stats
  });

  return {
    ...characterWithArchetype,
    level: 1,
    exp: 0,
    stats: { ...randomCharacter.stats }
  };
}

export { create_character, assignArchetype };
