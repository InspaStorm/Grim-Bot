import { ButtonBuilder, ButtonComponent, ActionRowBuilder } from "discord.js";
import EventEmitter from "events";
import type { BasicGameInfoType } from "../../types/game";

export default class ButtonGame extends EventEmitter {
  // ID of the message that is being used as game
  gameId: String;
  playerId: string;
  playerName: string;
  components: ActionRowBuilder<ButtonBuilder>[];
  numOfAttempts: number;
  startTime: number;
  endGame: CallableFunction;
  timer: any;
  ans: any;

  constructor(gameInfo: BasicGameInfoType) {
    super();
    this.gameId = gameInfo.msgId;
    this.playerId = gameInfo.playerId;
    this.playerName = gameInfo.playerName;
    this.components = gameInfo.components!;

    this.numOfAttempts = 0;
    this.startTime = Date.now();
    this.endGame = gameInfo.endCallback;
    this.timer = setTimeout(() => this.endGame(this.gameId), 15_000);

    if (gameInfo.answer) this.initWithAns(gameInfo.answer);
  }

  initWithAns(ans: number) {
    this.ans = ans;
  }

  get stats() {
    const timeTaken = this.timeTakenInGame;

    const stats = `**${this.playerName}'s** Speed Math summary:

> ⏱️ Time taken: **${timeTaken} seconds**
> 📝 Number of attempts: **${this.numOfAttempts}**`;

    return stats;
  }

  get timeTakenInGame() {
    const currentTime = Date.now();

    const timeTaken = currentTime - this.startTime;

    return timeTaken / 1000;
  }

  checkResponse(answerGiven: number) {
    this.numOfAttempts++;
    if (answerGiven == this.ans) return this.stats;
    return false;
  }

  fetchButtonComponentData(buttonInfo: ButtonBuilder) {
    let indexOfButton: number = 0;
    let indexOfActionRow = 0;
    let requestedButton: any | undefined;

    for (let row of this.components) {
      requestedButton = row.components.find(
        (currentValue: ButtonBuilder, indexOfValue: number) => {
          indexOfButton = indexOfValue;
          return currentValue.data.label == buttonInfo.data.label;
        }
      );

      if (requestedButton) {
        return {
          rowIndex: indexOfActionRow,
          buttonIndex: indexOfButton,
          button: requestedButton,
        };
      }
      indexOfActionRow++;
    }

    return null;
  }

  disableButton(buttonToBeDisabled: ButtonBuilder) {
    const fetchedButtonData = this.fetchButtonComponentData(buttonToBeDisabled);
    if (fetchedButtonData) {
      const disabledButton = fetchedButtonData.button.setDisabled();

      this.components[fetchedButtonData.rowIndex].components[
        fetchedButtonData.buttonIndex
      ] = disabledButton;
      this.updateButtons(this.components);

      return this.components;
    }
  }

  updateTimer() {
    clearTimeout(this.timer);

    this.timer = setTimeout(() => this.endGame(this.gameId), 15_000);
  }

  updateButtons(buttonComponents: ActionRowBuilder<ButtonBuilder>[]) {
    this.updateTimer();

    this.components = buttonComponents;
  }
}
