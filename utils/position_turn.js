import { createRequire } from 'module';
import { char_ist, battle_order } from '../script.js';
import choose_move from './attack.js';

export function switch_position(character, new_position) {
    for (let i = 0; i < char_ist.length; i++) {
        if (char_ist[i].team === character.team && char_ist[i].position === new_position) {
            char_ist[i].position = character.position;
            
            console.log('switch di ' + char_ist[i].name + ' da ' + char_ist[i].position + ' a ' + new_position + ' con ' + character.name);
            break;
        }
    }
    char_ist[character.id_instance].position = new_position;
}

export function battle_order_update(){

    // se non è ancora presente l'ordine lo crea
    if (battle_order.length === 0) {
        for (let i = 0; i < char_ist.length; i++) {
            battle_order.push({id: char_ist[i].id_instance, spd: char_ist[i].stats_instance.spd, has_turn: true});
        }
    }

    // aggiornamento dell'ordine dei personaggi
    battle_order.sort((a, b) => b.spd - a.spd);

}

export async function next_turn(){

    // aggiona l'ordine di battaglia in base alla velocità
    battle_order_update();

    for (let i = 0; i < battle_order.length; i++) {
        // Salta chi ha già usato il proprio turno in questo round.
        if (!battle_order[i].has_turn) continue;

        // Chiede la mossa per il personaggio e aspetta l'esecuzione.
        await choose_move(battle_order[i].id);
        return;
    }

    // Reset dei turni per iniziare un nuovo round di azioni.
    for (let j = 0; j < battle_order.length; j++) {
        battle_order[j].has_turn = true;
    }

    // Richiama per iniziare immediatamente il round successivo.
    return await next_turn();
}

