import { createRequire } from 'module';
import { char_ist, battle_order } from '../script.js';
import { battle_order_update } from './position_turn.js';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const require = createRequire(import.meta.url);
const types = require('../data/types.json');
const moves = require('../data/moves.json');

const rl = createInterface({ input, output });

function damage_calc(attacker, defender, attack_slot) {
    let multiplier = 1;
    let move = moves.find(m => m.id === attacker.moves[attack_slot]);
    const typeData = types[move.type];
    let atk_use, def_use;
    let levelFactor = attacker.level;
    let stab = 1;

    console.log(move.name);

    //effectiveness
        defender.type.forEach(defType => {        
            if (typeData[defType] !== undefined) {
                multiplier *= typeData[defType];
            }
        });
    
    //stab
    if(attacker.type.includes(move.type)){
        stab = 1.3;
    }

    if (move.category === "physical") {
        atk_use = attacker.stats_instance.atk;
        def_use = defender.stats_instance.def;
    } else if (move.category === "special") {
        atk_use = attacker.stats_instance.matk;
        def_use = defender.stats_instance.mdef;
    }

    //damage formula
    let damage = Math.floor(((move.power * (atk_use / def_use) * levelFactor) / 4) * multiplier * stab) + 1;

    //gestione immunità
    if (multiplier === 0) damage = 0;

    return damage;
}

function attack(attacker, defender, attack_slot) {
    const damage = damage_calc(attacker, defender, attack_slot);
    defender.stats_instance.hp -= damage;

    console.log(defender.name + " has taken " + damage + " damage");

    char_ist[defender.id_instance] = defender;

    battle_order[attacker.id_instance].has_turn = false;

    battle_order_update();
    check_defeat();
}

function check_defeat() {
    char_ist.forEach((character) => {
        if (character.stats_instance.hp <= 0) {

            const team = character.team;
            console.log(character.name + " is defeated!");

            for (let i = 0; i < char_ist.length; i++) {
                if (char_ist[i].team != team) {

                    // ottiene più esperienza se il nemico è livello più alto
                    let multiplier = Math.max(1, Math.sqrt(character.level / char_ist[i].level));
                    let gain_exp = Math.floor(20 * character.level * multiplier);

                    // se sconfitti prendono metà dell'esperienza
                    if (char_ist[i].stats_instance.hp <= 0) {
                        gain_exp = Math.floor(gain_exp / 2);
                    }
                    char_ist[i].exp += gain_exp;

                    check_level_up(char_ist[i]);
                }
            }
        }
    });
}

async function choose_move(id){
    console.log("Choose a move for " + char_ist[id].name + " ( " + char_ist[id].id_instance + " )");
    
    char_ist[id].moves.forEach((moveId, i) => {
        let move = moves.find(m => m.id === moveId);
        console.log(i + ": " + move.name + " ( "+ move.power + " " + move.type + " )");
    });

    let selectedMove = await askNumber("select move: ");

    for (let i = 0; i < char_ist.length; i++) {
        console.log(i + ": " + char_ist[i].name + " ( " + char_ist[i].stats_instance.hp + "/" + char_ist[i].stats_instance.max_hp + " HP) " + char_ist[i].team);
    }
    let target = await askNumber("target: ");

    attack(char_ist[id], char_ist[target], selectedMove);

}

export async function askNumber(prompt) {
  const risposta = await rl.question(prompt);
  return Number(risposta);
}

export default choose_move;