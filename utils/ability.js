import { char_ist } from "../script.js";
import chalk from "chalk";
import alter_stat from "./edit_stat.js";

const moves = require("../data/moves.json");

//id character, type ability, id istance of the defender, id of the attack used
function check_ability(char_id = -1, ability_type, defender = null, attack = null){
    //all the value could be used thanks to ability
    let item;
    switch (ability_type) {
        case "start_battle":
                for (let i = 0; i < char_ist.length; i++) {
                    switch (char_ist[i].ability) {

                        // helpfull
                        case 0:
                            for (let j = 0; j < char_ist.length; j++) {
                                if (char_ist[j].team === char_ist[i].team) {
                                    alter_stat(char_ist[j], "atk", 2, "add");
                                    alter_stat(char_ist[j], "def", 2, "add");
                                    alter_stat(char_ist[j], "matk", 2, "add");
                                    alter_stat(char_ist[j], "mdef", 2, "add");
                                    alter_stat(char_ist[j], "spd", 2, "add");
                                }
                            }
                            break;
                        
                        // sharp mind
                        case 5:
                            alter_stat(char_ist[i], "mdef", 15, "add");
                            break;
                        
                        // knight's honor
                        case 6:
                            alter_stat(char_ist[i], "def", 15, "add");
                            break;
                        
                        // overgrowth
                        case 7:
                            alter_stat(char_ist[i], "max_hp", 15, "add");
                            alter_stat(char_ist[i], "hp", 15, "add");
                            break;
                        
                        // wind's favor
                        case 10:
                            alter_stat(char_ist[i], "spd", 15, "add");
                            break;
                        
                        // omen of the forest
                        case 12:
                            for (let j = 0; j < char_ist.length; j++) {
                                if (char_ist[j].team !== char_ist[i].team) {
                                    alter_stat(char_ist[j], "spd", 5, "sub");
                                }
                            }
                            break;
                        
                        // lost forest's breath
                        case 17:
                            alter_stat(char_ist[i], "atk", 10, "add");
                            break;

                    }

                }
            break;

        case "start_turn":
            for (let i = 0; i < char_ist.length; i++) {
                    switch (char_ist[i].ability) {

                        // no ability
                        case 100:
                            break;
                    }
                }
            break;
        
        case "end_turn":
            for (let i = 0; i < char_ist.length; i++) {
                    switch (char_ist[i].ability) {

                        // positivity
                        case 2:
                            for (let j = 0; j < char_ist.length; j++) {
                                if (char_ist[j].team === char_ist[i].team) {
                                    alter_stat(char_ist[j], "hp", 2, "add");
                                }
                            }
                            break;

                        // lost forest's breath
                        case 17:
                            if (char_ist[i].crisis === true) {
                                alter_stat(char_ist[i], "hp", 5, "add");
                            }
                            break;

                        // divine blessing
                        case 19:
                            alter_stat(char_ist[i], "hp", 8, "add");
                            break;
                        
                    }
                }
                break;
            
        case "crisis":
            switch (char_ist[char_id].ability) {

                // besat knight
                case 8:
                    alter_stat(char_ist[char_id], "atk", 10, "add");
                    alter_stat(char_ist[char_id], "matk", 10, "add");
                    break;
                
                // never give up
                case 9:
                    alter_stat(char_ist[char_id], "atk", 5, "add");
                    alter_stat(char_ist[char_id], "matk", 5, "add");
                    alter_stat(char_ist[char_id], "def", 5, "add");
                    alter_stat(char_ist[char_id], "mdef", 5, "add");
                    alter_stat(char_ist[char_id], "spd", 5, "add");
                    break;
                
                // tenacity
                case 13:
                    alter_stat(char_ist[char_id], "def", 10, "add");
                    alter_stat(char_ist[char_id], "mdef", 10, "add");
                    break;

                // lost forest's breath
                case 17:
                    alter_stat(char_ist[char_id], "def", 5, "add");
                    alter_stat(char_ist[char_id], "atk", 10, "sub");
                    break;
            }
            break;

        case "exit_crisis":
            switch (char_ist[char_id].ability) {

                // besat knight
                case 8:
                    alter_stat(char_ist[char_id], "atk", 10, "sub");
                    alter_stat(char_ist[char_id], "matk", 10, "sub");
                    break;
                
                // never give up
                case 9:
                    alter_stat(char_ist[char_id], "atk", 5, "sub");
                    alter_stat(char_ist[char_id], "matk", 5, "sub");
                    alter_stat(char_ist[char_id], "def", 5, "sub");
                    alter_stat(char_ist[char_id], "mdef", 5, "sub");
                    alter_stat(char_ist[char_id], "spd", 5, "sub");
                    break;
                
                // tenacity
                case 13:
                    alter_stat(char_ist[char_id], "def", 10, "sub");
                    alter_stat(char_ist[char_id], "mdef", 10, "sub");
                    break;

                // lost forest's breath
                case 17:
                    alter_stat(char_ist[char_id], "def", 5, "sub");
                    alter_stat(char_ist[char_id], "atk", 10, "add");
                    break;
            }
            break;

        case "attack":
            switch (char_ist[char_id].ability) {

                //silent steps
                case 1:
                    if (char_ist[defender].crisis === true) {
                        item = 15;
                    }
                    break;
                
                // bug lord
                case 11:
                    if (moves.id[attack].type === "wind" || moves.id[attack].type === "grass") {
                        item = 15;
                    }
                    break;

                // fire!!
                case 14:
                    if (moves.id[attack].type === "fire") {
                        item = 20;
                    }
                    break;
                
                // basic of magic
                case 16:
                    if (moves.id[attack].type === "fire" || moves.id[attack].type === "grass" || moves.id[attack].type === "water") {
                        item = 5;
                    }
                    break;

                // dark aura
                case 18:
                    if (moves.id[attack].name.toLowerCase().includes("dark")) {
                        item = 20;
                    }
                    break;
            }
            break;
        case "defense":
            switch (char_ist[char_id].ability) {

                // iron will
                case 4:
                    const random_stat = Math.floor(Math.random() * 7) + 1;
                    const stat = ["max_hp", "hp", "atk", "def", "matk", "mdef", "spd"]
                    alter_stat(char_ist[char_id], stat[random_stat], 7, "add");
                    break;
                
                // basic of magic
                case 16:
                    if (moves.id[attack].type === "fire" || moves.id[attack].type === "grass" || moves.id[attack].type === "water") {
                        item = 10;
                    }
                    break;
            }
            break;

        case "death":
            // rank SSS
            break;
    }
        
    return item;
}
    


export default check_ability();