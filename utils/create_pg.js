function create_character() {
  const randomIndex = Math.floor(Math.random() * Characters.length);
  const randomCharacter = Characters[randomIndex];
  
  // Creiamo una copia delle statistiche base per stats_instance
  let character = assignArchetype({
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

function assignArchetype(character) {
  const archetypeNames = Object.keys(Archetypes);
  const randomName = archetypeNames[Math.floor(Math.random() * archetypeNames.length)];

  return {
    ...character,
    archetype: randomName
  };
}
