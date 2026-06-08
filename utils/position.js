import { createRequire } from 'module';
import { char_ist } from '../script.js';

function switch_position(character, new_position) {
    for (let i = 0; i < char_ist.length; i++) {
        if (char_ist[i].team === character.team && char_ist[i].position === new_position) {
            char_ist[i].position = character.position;
            
            console.log('switch di ' + char_ist[i].name + ' da ' + char_ist[i].position + ' a ' + new_position + ' con ' + character.name);
            break;
        }
    }
    char_ist[character.id_instance].position = new_position;
}

export default switch_position;