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

    // 1 solo decimale (bugfix calcolo)
    character.stats_instance[item] = Number(character.stats_instance[item].toFixed(1));

    char_ist[character.id_instance] = character;
    
}

export default alter_stat;