import { add_to_field, create_character,add_attack } from './utils/create_pg.js';
import lv_up from './utils/level_up.js';
import choose_move from './utils/attack.js';
import { switch_position, battle_order_update, next_turn } from './utils/position_turn.js';
import alter_stat from './utils/edit_stat.js';
import check_level_up from './utils/level_up.js';
let field1 = [];

let num_char = 0;
export let char_ist = [];

export let battle_order = [];


// Check whether the battle is over: only one team remains alive.
function battleOver() {
    const aliveTeams = new Set(char_ist.filter(c => c.stats_instance.hp > 0).map(c => c.team));
    return aliveTeams.size <= 1;
}

// Create two teams
for (let i = 0; i < 2; i++){

    // Create three characters per team
    for (let j = 0; j < 3; j++){
        let character = "character" + num_char;
        character = create_character();

        char_ist.push(character);
        [field1, character] = add_to_field(field1, character, i);

        for (let k = 0; k < 2; k++){
            add_attack(char_ist[num_char]);
        }
        add_attack(char_ist[num_char], 30);
        num_char++;
    }  
}

battle_order_update();

// Battle loop
while (!battleOver()) {
    await next_turn();
}

console.log('Battle ended');


//lv_up(char_ist[0]);




//character, statistic, percentage value, operation
//alter_stat(char_ist[0], "atk", 50, "sub");

//attacker, defender, slot
//attack(char_ist[0], char_ist[1], 0);


//character, position
//switch_position(char_ist[2], 0);

// console.log(char_ist);
