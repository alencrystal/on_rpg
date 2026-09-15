import { createRequire } from "module";
import { char_ist, battle_order } from "../script.js";
import { battle_order_update } from "./position_turn.js";
import { createInterface } from "node:readline/promises";
import alter_stat  from "./edit_stat.js";
import { stdin as input, stdout as output } from "node:process";
import check_level_up from "./level_up.js";
import chalk from "chalk";
import { check_ability, check_crisis } from "./ability.js";

const require = createRequire(import.meta.url);
const types = require("../data/types.json");
const moves = require("../data/moves.json");

const rl = createInterface({ input, output });

function damage_calc(attacker, defender, attack_slot) {
  let multiplier = 1;
  let move = moves.find((m) => m.id === attacker.moves[attack_slot]);
  const typeData = types[move.type];
  let atk_use, def_use;
  let levelFactor = attacker.level;
  let stab = 1;
  let ability_multiplier = 1;
  let ability_resistence = 1;

  //effectiveness
  defender.type.forEach((defType) => {
    if (typeData[defType] !== undefined) {
      multiplier *= typeData[defType];
    }
  });

  //stab (same type attack bonus) 30%
  if (attacker.type.includes(move.type)) {
    stab = 1.3;
  }

  // ablity of the attacker and defender
  ability_multiplier += (check_ability(attacker.id_instance, "attack", defender, move)) * 0.01;
  ability_resistence -= (check_ability(defender.id_instance, "defense", attacker, move)) * 0.01;

  if (move.category === "physical") {
    atk_use = attacker.stats_instance.atk;
    def_use = defender.stats_instance.def;
  } else if (move.category === "special") {
    atk_use = attacker.stats_instance.matk;
    def_use = defender.stats_instance.mdef;
  }

  //damage formula
  let damage =
    Math.floor(
      ((move.power * (atk_use / def_use) * levelFactor) / 4) *
        multiplier *
        stab *
        ability_multiplier *
        ability_resistence,
    ) + 1;

  // Handle immunities
  if (multiplier === 0) damage = 0;

  if (multiplier > 1) {
    console.log(chalk.bold.red("It's super effective!"));
  } else if (multiplier < 1 && multiplier > 0) {
    console.log(chalk.bold.blue("It's not very effective..."));
  } else if (multiplier === 0) {
    console.log(chalk.bold.black("the attack has no effect..."));
  }

  return damage;
}

function attack(attacker, defender, attack_slot) {

  //check if the attack is multi-target
  let move = moves.find((m) => m.id === attacker.moves[attack_slot])
  if (move.power > 0){
    if (move.target === "enemies") {
        for (let i = 0; i < char_ist.length; i++) {
        if (char_ist[i].team != attacker.team) {

            const damage = damage_calc(attacker, char_ist[i], attack_slot);
            char_ist[i].stats_instance.hp -= damage;
            normalize_hp(char_ist[i]);

            console.log(
                chalk.magenta(char_ist[i].name + " has taken " + damage + " damage" + "\n"),
            );

            //check ability of the defender
            check_ability(char_ist[i].id_instance, "hit", attacker, move);
        }
        }
    } 
    else if (move.target === "everyone") {
        for (let i = 0; i < char_ist.length; i++) {

            // Skip the attacker
            if (char_ist[i].id_instance === attacker.id_instance) continue; 

            const damage = damage_calc(attacker, char_ist[i], attack_slot);
            char_ist[i].stats_instance.hp -= damage;
            normalize_hp(char_ist[i]);

            console.log(
                chalk.magenta(char_ist[i].name + " has taken " + damage + " damage" + "\n"),
            );

            //check ability of the defender
            check_ability(char_ist[i].id_instance, "hit", attacker, move);
        }
    }
    else{

        const damage = damage_calc(attacker, defender, attack_slot);
        defender.stats_instance.hp -= damage;
        normalize_hp(defender);

        console.log(
        chalk.magenta(defender.name + " has taken " + damage + " damage" + "\n"),
        );

        //check ability of the defender
        check_ability(defender.id_instance, "hit", attacker, move);
    }
    check_crisis();
  }
  // Check if the move has an effect and apply it
  if (move.effect){
    move_effect(attacker, defender, move.effect);
  }
  char_ist[defender.id_instance] = defender;

  // Use the character's ID to find the correct entry in battle_order.
  const orderEntry = battle_order.find(
    (entry) => entry.id === attacker.id_instance,
  );
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
      console.log(chalk.bold.yellow(character.name + " is defeated!\n"));

      for (let i = 0; i < char_ist.length; i++) {
        if (char_ist[i].team != team) {
          // Gain more experience if the enemy is a higher level
          let multiplier = Math.max(
            1,
            Math.sqrt(character.level / char_ist[i].level),
          );
          let gain_exp = Math.floor(20 * character.level * multiplier);

          // Defeated characters receive half the experience
          if (char_ist[i].stats_instance.hp <= 0) {
            gain_exp = Math.floor(gain_exp / 2);
          }
          const random_gain = Math.floor(Math.random() * 10) + 1;
          gain_exp += random_gain;
          char_ist[i].exp += gain_exp;
          console.log(
            chalk.bold.green(
              char_ist[i].name + " has gained " + gain_exp + " exp!",
            ),
          );

          check_level_up(char_ist[i]);
        }
      }
      // Set the character's status to not alive
      character.alive = false;
    }
  });
}

async function choose_move(id) {
  console.log(
    chalk.bgCyan.black(
      "Choose a move for " +
        char_ist[id].name +
        " ( " +
        char_ist[id].id_instance +
        " )\n",
    ),
  );

  char_ist[id].moves.forEach((moveId, i) => {
    let move = moves.find((m) => m.id === moveId);
    console.log(
      chalk.italic(
        "    " +
          i +
          ": " +
          move.name +
          " ( " +
          move.power +
          " " +
          move.type +
          " )",
      ),
    );
  });

  let selectedMove = await askNumber("\nSelect move: ");

  console.log("\n".repeat(process.stdout.rows));
  console.log(chalk.bgCyan.black("Choose the target between\n"));
  for (let i = 0; i < char_ist.length; i++) {
    if (char_ist[i].alive === false) {
      console.log(chalk.dim(i + ": " + char_ist[i].name));
    } 
    else if (char_ist[i].id_instance === char_ist[id].id_instance) {
      // Highlight the attacker in a different color
      console.log(chalk.cyan(i + ": " + char_ist[i].name + " ( " + char_ist[i].stats_instance.hp + "/" + char_ist[i].stats_instance.max_hp + " HP) " + char_ist[i].team, ));
    } 
    else {
      console.log( i + ": " + char_ist[i].name + " ( " + char_ist[i].stats_instance.hp + "/" + char_ist[i].stats_instance.max_hp + " HP) " + char_ist[i].team, );
    }
  }
  let target = await askNumber("\nTarget: ");
  console.log("\n".repeat(process.stdout.rows));

  attack(char_ist[id], char_ist[target], selectedMove);
}

export async function askNumber(prompt) {
  const risposta = await rl.question(chalk.gray(prompt));
  return Number(risposta);
}

function move_effect(attacker, defender, effect) {
    switch (effect.type) {
        case "stat_change":
            if (effect.target === "self") {
                alter_stat(attacker, effect.stat, effect.value, effect.operation);
            }
            else if (effect.target === "enemy") {
                alter_stat(defender, effect.stat, effect.value, effect.operation);
            }
            else if (effect.target === "enemies") {
                char_ist.forEach((character) => {
                    if (character.team !== attacker.team) {
                        alter_stat(character, effect.stat, effect.value, effect.operation);
                    }
                });
            }
            else if (effect.target === "everyone") {
                char_ist.forEach((character) => {
                    if (character.id_instance !== attacker.id_instance) {
                        alter_stat(character, effect.stat, effect.value, effect.operation);
                    }
                });
            }
            // only allies not the user
            else if (effect.target === "allies") {
                char_ist.forEach((character) => {
                    if (character.team === attacker.team && character.id_instance !== attacker.id_instance) {
                        alter_stat(character, effect.stat, effect.value, effect.operation);
                    }
                });
            }
            //all allies including the user
            else if (effect.target === "team") {
                char_ist.forEach((character) => {
                    if (character.team === attacker.team) {
                        alter_stat(character, effect.stat, effect.value, effect.operation);
                    }
                });
            }
            else {
                console.log(chalk.red("Invalid effect target: " + effect.target));
            }
        break;

        case "heal":
            if (effect.target === "self") {
                alter_stat(attacker, "hp", effect.value, "add");
            }
            else if (effect.target === "ally") {
                alter_stat(defender, "hp", effect.value, "add");
            }
            // only allies not the user
            else if (effect.target === "allies") {
                char_ist.forEach((character) => {
                    if (character.team === attacker.team && character.id_instance !== attacker.id_instance) {
                        alter_stat(character, "hp", effect.value, "add");
                    }
                });
            }
            //all allies including the user
            else if (effect.target === "team") {
                char_ist.forEach((character) => {
                    if (character.team === attacker.team) {
                        alter_stat(character, "hp", effect.value, "add");
                    }
                });
            }
            break;
        case "move_target":
            console.log(chalk.yellow("Move target change effect is not implemented yet."));
            break;
        default:
            console.log(chalk.red("Invalid effect type: " + effect.type));
            break;
    }

}

//to fix some error in the damage calc
function normalize_hp(character) {
  character.stats_instance.hp = Number(character.stats_instance.hp.toFixed(1));
}


export default choose_move;
