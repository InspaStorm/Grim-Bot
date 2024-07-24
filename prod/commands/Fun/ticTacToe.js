import { ActionRowBuilder, ButtonBuilder, ButtonStyle, } from "discord.js";
import { makeEmbed } from "../../helpers/embedManager.js";
import { ToWords } from "to-words";
import GameManager from "../../commandHelpers/games/gameManager.js";
import ButtonGame from "../../commandHelpers/games/buttonGameManager.js";
import { editReply, replier } from "../../helpers/apiResolver.js";
import TicTacToeAI from "../../commandHelpers/games/tic-tac-toe/ttt-ai.js";
function emojifyBoard(boardWithNumbers) {
    let resultantBoard = [];
    for (let row of boardWithNumbers) {
        let newRow = [];
        for (let cellValue of row) {
            newRow.push(NUM_EMOJI_TEMPLATE(cellValue));
        }
        resultantBoard.push(newRow);
    }
    return resultantBoard;
}
class TicTacToe extends ButtonGame {
    constructor(gameInfo) {
        super(gameInfo);
        this.board = [];
        this.playedAreas = [];
    }
    addAi(newAiInstance) {
        this.aiInstance = newAiInstance;
    }
    setBoard(board) {
        this.board = board;
        let rowIndex = 0;
        for (let row of board) {
            this.playedAreas.push([]);
            for (let _item of row) {
                this.playedAreas[rowIndex].push(0);
            }
            rowIndex++;
        }
    }
    checkwinner() {
        let horizontalPlayed = 0;
        let cellIndex = 0;
        // Horizontal check
        for (let row of this.playedAreas) {
            for (let cell of row) {
                if (cellIndex != 0) {
                    if (cell !== horizontalPlayed) {
                    }
                }
                else {
                    horizontalPlayed = cell;
                }
            }
        }
    }
    // Disables the specified tile from the board
    updateBoard(buttonPressed, boardCellData, isAi = false) {
        let playerMark = ":regional_indicator_";
        let playerNumber = 0;
        if (isAi) {
            buttonPressed = this.fetchButtonComponentData(null, boardCellData.number.toString())?.button;
            playerNumber = 2;
        }
        else {
            this.aiInstance?.markCellPlayed(parseInt(buttonPressed?.data.label));
            playerNumber = 1;
        }
        if (playerNumber === 1) {
            playerMark += "x:";
        }
        else {
            playerMark += "o:";
        }
        if (buttonPressed) {
            this.disableButton(buttonPressed);
            const buttonInfo = this.fetchButtonComponentData(buttonPressed);
            if (buttonInfo) {
                this.playedAreas[buttonInfo.rowIndex][buttonInfo.rowIndex] = 0;
                // this.playableAreas = maintainBoard(this.playableAreas);
                this.board[buttonInfo.rowIndex][buttonInfo.buttonIndex] = playerMark;
                const boardAsEmbed = makeEmbed(stringifyGame(this.board));
                return { embed: boardAsEmbed, components: this.components };
            }
            else {
                const boardAsEmbed = makeEmbed(stringifyGame(this.board));
                return { embed: boardAsEmbed, components: this.components };
            }
        }
    }
}
const tttLobby = new GameManager(TicTacToe);
function stringifyGame(gameBoard) {
    let stringifiedBoard = "";
    for (let i = 0; i < gameBoard.length; i++) {
        const rowAsStr = gameBoard[i].join(" ");
        stringifiedBoard += rowAsStr + "\n";
    }
    return stringifiedBoard;
}
function prepareInitialBoard(NUM_OF_COLS, NUM_OF_ROWS) {
    // Contains the item as simple number like 1, 2 ,3
    let bareBoard = [];
    // Contains items as emoji names :one:, :two:, etc.
    let usableBoard = [];
    let lastRowNum = 1;
    // Makes specified no. of columns
    for (let col_index = 0; col_index <= NUM_OF_COLS - 1; col_index++) {
        let newBareCol = [];
        // Assigns number to each cell, if its the last number of the row, remebers the value
        for (let row_index = 0; row_index <= NUM_OF_ROWS - 1; row_index++) {
            let valueOfCell = lastRowNum + row_index;
            newBareCol.push(valueOfCell);
            if (row_index === NUM_OF_ROWS - 1) {
                lastRowNum += row_index + 1;
            }
        }
        bareBoard.push(newBareCol);
    }
    usableBoard = emojifyBoard(bareBoard);
    return { bareBoard: bareBoard, usableBoard: usableBoard };
}
function makeButtonComponents(gameBoardItems) {
    let preparedComponents = [];
    for (let row of gameBoardItems) {
        let newRow = new ActionRowBuilder();
        for (let valueOfCell of row) {
            newRow.addComponents(new ButtonBuilder()
                .setCustomId(`tic-tac-toe ${valueOfCell}`)
                .setStyle(ButtonStyle.Primary)
                .setLabel(valueOfCell.toString()));
        }
        preparedComponents.push(newRow);
    }
    return preparedComponents;
}
const converter = new ToWords();
// Stringifies a number as, 2 => :two:
const NUM_EMOJI_TEMPLATE = (number) => `:${converter.convert(number).toLowerCase()}:`;
export default {
    name: "tic-tac-toe",
    description: "A simple tic tac toe game",
    alias: [],
    // notReady: true,
    options: [],
    async run(invokInfo) {
        const NUM_OF_COLS = 3;
        const NUM_OF_ROWS = 3;
        let initialBoard = prepareInitialBoard(NUM_OF_COLS, NUM_OF_ROWS);
        const gameEmbed = makeEmbed(stringifyGame(initialBoard.usableBoard));
        const gameButtons = makeButtonComponents(initialBoard.bareBoard);
        const gameMessage = await replier(invokInfo.msg, { content: "Starting the game.." }, true);
        const newGame = tttLobby.addGame({
            msgId: gameMessage.id,
            playerId: invokInfo.author.id,
            playerName: invokInfo.author.username,
            answer: null,
            components: gameButtons,
            endCallback: (msgID) => {
                tttLobby.removeGame(msgID);
            },
        });
        const newAiInstance = new TicTacToeAI(initialBoard.bareBoard);
        newGame.setBoard(initialBoard.usableBoard);
        newGame.addAi(newAiInstance);
        editReply(gameMessage, { content: " ", embeds: [gameEmbed], components: gameButtons }, true);
        return { selfRun: true };
    },
    async handle(inter) {
        const argsAsArray = inter.customId.split(" ");
        argsAsArray.shift();
        const gameId = inter.message.id;
        const player = inter.user;
        const interactedGame = tttLobby.hasGame(gameId);
        if (interactedGame) {
            const interactedButton = inter.component;
            if (player.id != interactedGame.playerId) {
                inter.reply({
                    content: "This is an ongoing game started by someone else, Why not start a new session by yourself ;p",
                    ephemeral: true,
                });
            }
            interactedGame.updateBoard(ButtonBuilder.from(interactedButton));
            let updatedGame = interactedGame.updateBoard(null, interactedGame.aiInstance.play(), true);
            inter.update({
                embeds: [updatedGame.embed],
                components: updatedGame.components,
            });
            return;
        }
        else {
            inter.update({
                content: `This game is no longer playable, consider starting a new session =)`,
                files: [],
                components: [],
            });
            return;
        }
    },
};
