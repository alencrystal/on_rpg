import { add_to_field, create_character,add_attack } from './utils/create_pg.js';
import lv_up from './utils/level_up.js';
import attack from './utils/attack.js';
import switch_position from './utils/position.js';
import alter_stat from './utils/edit_stat.js';
let field1 = [];

let num_char = 0;
export let char_ist = [];

//creazione 2 team
for (let i = 0; i < 2; i++){

    //creazione di 3 personaggi per team
    for (let j = 0; j < 3; j++){
        let character = "character" + num_char;
        character = create_character();

        char_ist.push(character);
        [field1, character] = add_to_field(field1, character, i);

        add_attack(char_ist[num_char]);
        add_attack(char_ist[num_char]);

        num_char++;
    }  
}


//lv_up(char_ist[0]);





console.log(char_ist[0]);
//console.log(char_ist);


//personaggio, statistica, valore%, operazione
//alter_stat(char_ist[0], "atk", 50, "sub");

//attacker, defender, slot
//attack(char_ist[0], char_ist[1], 0);

//personaggio, posizione
//switch_position(char_ist[2], 0);

// console.log(char_ist);
