import { char_ist } from '../script.js';

function alter_stat(character, item, value, operation = "add"){

    // max_hp isn't in the standard stats
    const base_stat = item === "max_hp" ? character.stats.hp : character.stats[item];
    let alteration = Number((base_stat * value / 100).toFixed(1));

    if (operation === "add") {
        character.stats_instance[item] += alteration;

        if (character.stats_instance[item] > base_stat * 4) {
            character.stats_instance[item] = base_stat * 4;
        }
        console.log(character.name + ' ha ottenuto ' + alteration + ' ' + item + "\n");

    } else if (operation === "sub") {
        character.stats_instance[item] -= alteration;
        if (character.stats_instance[item] < base_stat / 4) {
            character.stats_instance[item] = base_stat / 4;
        }
        console.log(character.name + ' ha perso ' + alteration + ' ' + item+ "\n");

    } else if (operation === "reset") {
        character.stats_instance[item] = character.stats[item];
        console.log(character.name + ' ha resettato ' + item+ "\n");
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