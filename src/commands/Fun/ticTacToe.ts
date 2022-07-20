import { CommandInteraction, CommandInteractionOptionResolver, User } from "discord.js";
import { makeEmbed } from "../../helpers/embedManager.js";
import { ToWords } from "to-words";

function stringifyGame(gameBoard: Array<any>): string {

    let stringifiedBoard: string = "";

    for (let i = 0; i < gameBoard.length; i ++) {
        const rowAsStr = gameBoard[i].join(" ")
        stringifiedBoard += rowAsStr + "\n"
    }

    return stringifiedBoard
}


const converter = new ToWords();

const NUM_EMOJI_TEMPLATE = (number: number) => `:${converter.convert(number).toLowerCase()}:`

export default {
    name: 'tic-tac-toe',
    description:'A simple tic tac toe game',
    alias: [],
    options: [],

    async run(msg: CommandInteraction, args: CommandInteractionOptionResolver, author: User = msg.user, isInteraction: boolean = false) {
        
        const NUM_OF_COLS: number = 3
        const NUM_OF_ROWS: number = 3
        
        let gameBoard = []
        let lastRowNum: number = 1;
        
        // Makes specified no. of columns
        for (let col_index = 0; col_index <= NUM_OF_COLS - 1; col_index++) {
            
            let new_col = [];
            
            // Assigns number to each cell, if its the last number of the row, remebers the value
            for (let row_index = 0; row_index <= NUM_OF_ROWS - 1; row_index++) {
                new_col.push(NUM_EMOJI_TEMPLATE(lastRowNum + row_index))

                if (row_index === NUM_OF_ROWS - 1) {
                    lastRowNum += (row_index + 1)
                }
            }

            gameBoard.push(new_col)
        }

        const gameEmbed = makeEmbed(stringifyGame(gameBoard))
        
        return({embeds: [gameEmbed]})
    }
}