import { createRequire } from 'module';
import { char_ist } from '../script.js';

function alter_stat(character, item, value, operation = "add"){

    let alteration = Number((character.stats[item] * value / 100).toFixed(1));

    if (operation === "add") {
        character.stats_instance[item] += alteration;

        if (character.stats_instance[item] > character.stats[item] * 4) {
            character.stats_instance[item] = character.stats[item] * 4;
        }
        console.log(character.name + ' ha ottenuto ' + alteration + ' ' + item);

    } else if (operation === "sub") {
        character.stats_instance[item] -= alteration;
        if (character.stats_instance[item] < character.stats[item] / 4) {
            character.stats_instance[item] = character.stats[item] / 4;
        }
        console.log(character.name + ' ha perso ' + alteration + ' ' + item);

    } else if (operation === "reset") {
        character.stats_instance[item] = character.stats[item];
        console.log(character.name + ' ha resettato ' + item);
    }

    // Keep only one decimal place (calculation bug fix)
    character.stats_instance[item] = Number(character.stats_instance[item].toFixed(1));

    // Check if the stat is HP and if it exceeds max HP
    if (item === "hp" && character.stats_instance.hp > character.stats_instance.max_hp) {
        character.stats_instance.hp = character.stats_instance.max_hp;
    }

    char_ist[character.id_instance] = character;
    
}

export default alter_stat;