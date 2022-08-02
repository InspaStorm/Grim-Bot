import { Collection } from "discord.js";
export default class GameManager {
    constructor(gameType) {
        this.gameType = gameType;
        this.runningGames = new Collection();
    }
    addGame(gameInfo) {
        const newGame = new this.gameType(gameInfo);
        this.runningGames.set(gameInfo.msgId, newGame);
        return newGame;
    }
    hasGame(msgId) {
        const isPresent = this.runningGames.has(msgId);
        if (isPresent) {
            return this.runningGames.get(msgId);
        }
        return false;
    }
    removeGame(msgId) {
        console.log(`Game with ID: ${msgId} just ended!`);
        if (this.runningGames.has(msgId)) {
            this.runningGames.delete(msgId);
            return true;
        }
        return false;
    }
}
