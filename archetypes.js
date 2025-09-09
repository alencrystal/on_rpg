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