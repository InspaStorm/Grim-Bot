import { Collection } from "discord.js";
import type { BasicGameInfoType } from "../../types/game.js";

export default class GameManager {
  gameType: any;
  runningGames: Collection<string, any>;

  constructor(gameType: any) {
    this.gameType = gameType;
    this.runningGames = new Collection();
  }

  addGame(gameInfo: BasicGameInfoType) {
    const newGame = new this.gameType(gameInfo);

    this.runningGames.set(gameInfo.msgId, newGame);

    return newGame;
  }

  hasGame(msgId: string) {
    const isPresent = this.runningGames.has(msgId);

    if (isPresent) {
      return this.runningGames.get(msgId);
    }

    return false;
  }

  removeGame(msgId: string) {
    if (this.runningGames.has(msgId)) {
      this.runningGames.delete(msgId);
      return true;
    }

    return false;
  }
}
