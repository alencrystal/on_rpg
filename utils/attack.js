import { createRequire } from 'module';
import { char_ist } from '../script.js';

const require = createRequire(import.meta.url);
const types = require('../data/types.json');
const moves = require('../data/moves.json');

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

    char_ist[defender.id_instance] = defender;
}


export default attack ;