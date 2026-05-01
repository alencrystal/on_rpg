import { add_to_field, create_character } from './utils/create_pg.js';
import lv_up from './utils/level_up.js';
let field1 = [];

let num_char = 0;
let character_istance = [];

//creazione 2 team
for (let i = 0; i < 2; i++){

    //creazione di 3 personaggi per team
    for (let j = 0; j < 3; j++){
        let character = "character" + num_char;
        character = create_character();

        character_istance.push(character);
        [field1, character] = add_to_field(field1, character, i);
        num_char++;
    }  
}



console.log(character_istance);
