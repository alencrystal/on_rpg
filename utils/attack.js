import { char_ist, battle_order } from "../script.js";
import { battle_order_update } from "./position_turn.js";
import alter_stat from "./edit_stat.js";
import check_level_up from "./level_up.js";
import { check_ability, check_crisis } from "./ability.js";
import types from "../data/types.json" with { type: "json" };
import moves from "../data/moves.json" with { type: "json" };
import { waitForButtons, clearButtons, updateCards } from "./ui.js";

function damage_calc(attacker, defender, attack_slot) {
  let multiplier = 1;
  let move = moves.find((m) => m.id === attacker.moves[attack_slot]);
  const typeData = types[move.type];
  let atk_use, def_use;
  let levelFactor = attacker.level;
  let stab = 1;
  let ability_multiplier = 1;
  let ability_resistence = 1;

  defender.type.forEach((defType) => {
    if (typeData[defType] !== undefined) {
      multiplier *= typeData[defType];
    }
  });

  if (attacker.type.includes(move.type)) {
    stab = 1.3;
  }

  ability_multiplier += check_ability(attacker.id_instance, "attack", defender, move) * 0.01;
  ability_resistence -= check_ability(defender.id_instance, "defense", attacker, move) * 0.01;

  if (move.category === "physical") {
    atk_use = attacker.stats_instance.atk;
    def_use = defender.stats_instance.def;
  } else if (move.category === "special") {
    atk_use = attacker.stats_instance.matk;
    def_use = defender.stats_instance.mdef;
  }

  let damage =
    Math.floor(
      ((move.power * (atk_use / def_use) * levelFactor) / 4) *
        multiplier *
        stab *
        ability_multiplier *
        ability_resistence,
    ) + 1;

  if (multiplier === 0) damage = 0;

  if (multiplier > 1) {
    console.log("It's super effective!");
  } else if (multiplier < 1 && multiplier > 0) {
    console.log("It's not very effective...");
  } else if (multiplier === 0) {
    console.log("the attack has no effect...");
  }

  return damage;
}

function attack(attacker, defender, attack_slot) {
  let move = moves.find((m) => m.id === attacker.moves[attack_slot]);

  if (move.power > 0) {
    if (move.target === "enemies") {
      for (let i = 0; i < char_ist.length; i++) {
        if (char_ist[i].team != attacker.team) {
          const damage = damage_calc(attacker, char_ist[i], attack_slot);
          char_ist[i].stats_instance.hp -= damage;
          normalize_hp(char_ist[i]);
          console.log(char_ist[i].name + " has taken " + damage + " damage\n");
          check_ability(char_ist[i].id_instance, "hit", attacker, move);
        }
      }
    } else if (move.target === "everyone") {
      for (let i = 0; i < char_ist.length; i++) {
        if (char_ist[i].id_instance === attacker.id_instance) continue;
        const damage = damage_calc(attacker, char_ist[i], attack_slot);
        char_ist[i].stats_instance.hp -= damage;
        normalize_hp(char_ist[i]);
        console.log(char_ist[i].name + " has taken " + damage + " damage\n");
        check_ability(char_ist[i].id_instance, "hit", attacker, move);
      }
    } else {
      const damage = damage_calc(attacker, defender, attack_slot);
      defender.stats_instance.hp -= damage;
      normalize_hp(defender);
      console.log(defender.name + " has taken " + damage + " damage\n");
      check_ability(defender.id_instance, "hit", attacker, move);
    }
    check_crisis();
  }

  if (move.effect) {
    move_effect(attacker, defender, move.effect);
  }
  char_ist[defender.id_instance] = defender;

  const orderEntry = battle_order.find((entry) => entry.id === attacker.id_instance);
  if (orderEntry) {
    orderEntry.has_turn = false;
  }

  battle_order_update();
  check_defeat();
}

function check_defeat() {
  char_ist.forEach((character) => {
    if (character.stats_instance.hp <= 0 && character.alive) {
      const team = character.team;
      console.log(character.name + " is defeated!\n");

      for (let i = 0; i < char_ist.length; i++) {
        if (char_ist[i].team != team) {
          let multiplier = Math.max(1, Math.sqrt(character.level / char_ist[i].level));
          let gain_exp = Math.floor(20 * character.level * multiplier);

          if (char_ist[i].stats_instance.hp <= 0) {
            gain_exp = Math.floor(gain_exp / 2);
          }
          const random_gain = Math.floor(Math.random() * 10) + 1;
          gain_exp += random_gain;
          char_ist[i].exp += gain_exp;
          console.log(char_ist[i].name + " has gained " + gain_exp + " exp!");

          check_level_up(char_ist[i]);
        }
      }
      character.alive = false;
    }
  });
}

async function choose_move(id) {
  updateCards(char_ist, id);
  console.log(
    "Choose a move for " + char_ist[id].name + " ( " + char_ist[id].id_instance + " )\n", );

  // Costruisci i 3 pulsanti delle mosse + slot extra vuoto (4°)
  const moveButtons = [];

  char_ist[id].moves.forEach((moveId, i) => {
    let move = moves.find((m) => m.id === moveId);
    console.log("    " + move.name + " ( " + move.power + " " + move.type + " )", );
    // Aggiungi il pulsante per la mossa, value è fuori così da usare l'indice della mossa selezionata
    moveButtons.push({
      label: `${move.name} — ${move.power} ${move.type}`,
      value: i
    });
    });

  // Riempio fino a 4 con slot vuoti (il 4° è lo switch)
  moveButtons.push({ label: 'Switch (not working)', value: 'switch' });

  const selectedMove = await waitForButtons(moveButtons);

  console.log("\nChoose the target between\n");
  const targetButtons = [];
  for (let i = 0; i < char_ist.length; i++) {
    const c = char_ist[i];
    const label = i + ": " + c.name + " ( " + c.stats_instance.hp + "/" + c.stats_instance.max_hp + " HP) team " + c.team;

    console.log(label);
    targetButtons.push({
      label,
      value: i,
      disabled: c.alive === false,
    });
  }
  console.log("\n");

  const target = await waitForButtons(targetButtons);
  clearButtons();

  attack(char_ist[id], char_ist[target], selectedMove);
  updateCards(char_ist);
}

function move_effect(attacker, defender, effect) {
  switch (effect.type) {
    case "stat_change":
      if (effect.target === "self") {
        alter_stat(attacker, effect.stat, effect.value, effect.operation);
      } else if (effect.target === "enemy") {
        alter_stat(defender, effect.stat, effect.value, effect.operation);
      } else if (effect.target === "enemies") {
        char_ist.forEach((character) => {
          if (character.team !== attacker.team) {
            alter_stat(character, effect.stat, effect.value, effect.operation);
          }
        });
      } else if (effect.target === "everyone") {
        char_ist.forEach((character) => {
          if (character.id_instance !== attacker.id_instance) {
            alter_stat(character, effect.stat, effect.value, effect.operation);
          }
        });
      } else if (effect.target === "allies") {
        char_ist.forEach((character) => {
          if (character.team === attacker.team && character.id_instance !== attacker.id_instance) {
            alter_stat(character, effect.stat, effect.value, effect.operation);
          }
        });
      } else if (effect.target === "team") {
        char_ist.forEach((character) => {
          if (character.team === attacker.team) {
            alter_stat(character, effect.stat, effect.value, effect.operation);
          }
        });
      } else {
        console.log("Invalid effect target: " + effect.target);
      }
      break;

    case "heal":
      if (effect.target === "self") {
        alter_stat(attacker, "hp", effect.value, "add");
      } else if (effect.target === "ally") {
        alter_stat(defender, "hp", effect.value, "add");
      } else if (effect.target === "allies") {
        char_ist.forEach((character) => {
          if (character.team === attacker.team && character.id_instance !== attacker.id_instance) {
            alter_stat(character, "hp", effect.value, "add");
          }
        });
      } else if (effect.target === "team") {
        char_ist.forEach((character) => {
          if (character.team === attacker.team) {
            alter_stat(character, "hp", effect.value, "add");
          }
        });
      }
      break;

    case "move_target":
      console.log("Move target change effect is not implemented yet.");
      break;

    default:
      console.log("Invalid effect type: " + effect.type);
      break;
  }
}

function normalize_hp(character) {
  character.stats_instance.hp = Number(character.stats_instance.hp.toFixed(1));
}

export default choose_move;