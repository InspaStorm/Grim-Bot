import { Collection } from "discord.js";
export default class GameManager {
    /**
     *
     * @param {DiceGame} gameType
     */
    constructor(gameType) {
        this.gameType = gameType;
        this.runningGames = new Collection();
    }
    addGame({ msgId, playerId, playerName, answer, components, endCallback }) {
        this.runningGames.set(msgId, new this.gameType(msgId, playerId, playerName, answer, components, endCallback));
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
