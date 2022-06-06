import { MessageActionRow } from "discord.js";

export default class buttonGame {
    /**
     * 
     * @param {number} msgId ID of the game message
     * @param {string} playerId ID of the player
     * @param {number} answer Answer for the current question
     * @param {MessageActionRow[]} components Array of action rows containing btton components
     * @param {CallableFunction} endCallback Function to be called when the game ends
     */
    constructor(msgId, playerId, playerName, answer, components, endCallback) {
        
        this.gameId = msgId;
        this.playerId = playerId;
        this.playerName = playerName;
        this.ans = answer;
        this.components = components;
        
        this.numOfAttempts = 0;
        this.startTime = Date.now()
        this.endGame = endCallback
        this.timer = setTimeout(() => this.endGame(this.gameId), 15_000);


    }

    get stats() {
        const timeTaken = this.timeTakenInGame

        const stats = `**${this.playerName}'s** Speed Math summary:

> ⏱️ Time taken: **${timeTaken} seconds**
> 📝 Number of attempts: **${this.numOfAttempts}**`

        return stats
    }

    get timeTakenInGame() {
        const currentTime = Date.now()

        const timeTaken = currentTime - this.startTime

        return timeTaken/1000
    }

    checkResponse(answerGiven) {
        this.numOfAttempts ++;
        if (answerGiven == this.ans) return this.stats;
        return false;
    }

    disableButton(buttonToBeDisabled) {
        let indexOfOption;
        let indexOfRow = 0;
        let updatingOption;

        for (let row of this.components) {
            updatingOption = row.components.find((currentValue, indexOfValue) => {
                indexOfOption = indexOfValue
                return currentValue.label == buttonToBeDisabled.label;
            });

            if (updatingOption) break;
            indexOfRow ++
        }


        updatingOption.setDisabled()

        this.components[indexOfRow].components[indexOfOption] = updatingOption;

        this.updateButtons(this.components)

        return this.components;
    }

    updateTimer() {
        clearTimeout(this.timer)

        this.timer = setTimeout(() => this.endGame(this.gameId), 15_000)
    }

    updateButtons(buttonComponents) {
        this.updateTimer()

        this.components = buttonComponents
    }
}