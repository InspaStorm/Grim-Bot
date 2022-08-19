import { ButtonInteraction, MessageActionRow, MessageButton } from "discord.js";
import { makeEmbed } from "../../helpers/embedManager.js";
import { ToWords } from "to-words";
import GameManager from "../../commandHelpers/games/gameManager.js";
import ButtonGame from "../../commandHelpers/games/buttonGameManager.js";
import { editReply, replier } from "../../helpers/apiResolver.js";
import type { BasicGameInfoType } from "../../types/game";
import { CommandParamType } from "../../types/commands.js";

class TicTacToe extends ButtonGame {
  board: Array<any>;

  constructor(gameInfo: BasicGameInfoType) {
    super(gameInfo);
    this.board = [];
  }

  setBoard(board: Array<any>) {
    this.board = board;
  }

  updateBoard(buttonPressed: MessageButton) {
    this.disableButton(buttonPressed);
    const buttonInfo = this.fetchButtonComponentData(buttonPressed);

    if (buttonInfo) {
      this.board[buttonInfo.rowIndex][buttonInfo.buttonIndex] = ":smile:";

      const boardAsEmbed = makeEmbed(stringifyGame(this.board));

      return { embed: boardAsEmbed, components: this.components };
    } else {
      const boardAsEmbed = makeEmbed(stringifyGame(this.board));
      return { embed: boardAsEmbed, components: this.components };
    }
  }
}

const tttLobby = new GameManager(TicTacToe);

function stringifyGame(gameBoard: Array<any>): string {
  let stringifiedBoard: string = "";

  for (let i = 0; i < gameBoard.length; i++) {
    const rowAsStr = gameBoard[i].join(" ");
    stringifiedBoard += rowAsStr + "\n";
  }

  return stringifiedBoard;
}

function prepareBoard(NUM_OF_COLS: number, NUM_OF_ROWS: number) {
  // Contains items as emoji names :one:, :two:, etc.
  let usableBoard = [];

  // Contains the item as simple number like 1, 2 ,3
  let bareBoard = [];

  let lastRowNum: number = 1;
  // Makes specified no. of columns
  for (let col_index = 0; col_index <= NUM_OF_COLS - 1; col_index++) {
    let newUsableCol = [];
    let newBareCol = [];

    // Assigns number to each cell, if its the last number of the row, remebers the value
    for (let row_index = 0; row_index <= NUM_OF_ROWS - 1; row_index++) {
      let valueOfCell: number = lastRowNum + row_index;

      newUsableCol.push(NUM_EMOJI_TEMPLATE(valueOfCell));
      newBareCol.push(valueOfCell);

      if (row_index === NUM_OF_ROWS - 1) {
        lastRowNum += row_index + 1;
      }
    }

    usableBoard.push(newUsableCol);
    bareBoard.push(newBareCol);
  }

  return { bareBoard: bareBoard, usableBoard: usableBoard };
}

function makeButtonComponents(gameBoardItems: number[][]): MessageActionRow[] {
  let preparedComponents: MessageActionRow[] = [];

  for (let row of gameBoardItems) {
    let newRow = new MessageActionRow();

    for (let valueOfCell of row) {
      newRow.addComponents(
        new MessageButton()
          .setCustomId(`tic-tac-toe ${valueOfCell}`)
          .setStyle("PRIMARY")
          .setLabel(valueOfCell.toString())
      );
    }

    preparedComponents.push(newRow);
  }

  return preparedComponents;
}

const converter = new ToWords();

const NUM_EMOJI_TEMPLATE = (number: number) =>
  `:${converter.convert(number).toLowerCase()}:`;

export default {
  name: "tic-tac-toe",
  description: "A simple tic tac toe game",
  alias: [],
  options: [],

  async run(invokInfo: CommandParamType) {
    const NUM_OF_COLS: number = 3;
    const NUM_OF_ROWS: number = 3;

    let initialBoard = prepareBoard(NUM_OF_COLS, NUM_OF_ROWS);

    const gameEmbed = makeEmbed(stringifyGame(initialBoard.usableBoard));
    const gameButtons = makeButtonComponents(initialBoard.bareBoard);

    const gameMessage = await replier(
      invokInfo.msg,
      { content: "Starting the game.." },
      true
    );

    const newGame: TicTacToe = tttLobby.addGame({
      msgId: gameMessage!.id,
      playerId: invokInfo.author.id,
      playerName: invokInfo.author.username,
      answer: null,
      components: gameButtons,
      endCallback: (msgID: string) => {
        tttLobby.removeGame(msgID);
      },
    });

    newGame.setBoard(initialBoard.usableBoard);

    editReply(
      gameMessage!,
      { content: " ", embeds: [gameEmbed], components: gameButtons },
      true
    );

    return { selfRun: true };
  },

  async handle(inter: ButtonInteraction) {
    const argsAsArray: string[] = inter.customId.split(" ");
    argsAsArray.shift();

    const gameId = inter.message.id;
    const player = inter.user;
    const interactedGame: TicTacToe = tttLobby.hasGame(gameId);
    console.table([{ gameId }, interactedGame.playerName]);

    if (interactedGame) {
      const interactedButton = inter.component;
      console.table([player.id, interactedGame.playerId]);
      if (player.id != interactedGame.playerId) {
        inter.reply({
          content:
            "This is an ongoing game started by someone else, Why not start a new session by yourself ;p",
          ephemeral: true,
        });
      }

      const updatedButtons = interactedGame.updateBoard(
        interactedButton as MessageButton
      );
      inter.update({
        embeds: [updatedButtons.embed],
        components: updatedButtons.components,
      });
      return;
    } else {
      inter.update({
        content: `This game is no longer playable, consider starting a new session =)`,
        files: [],
        components: [],
      });
      return;
    }
  },
};
