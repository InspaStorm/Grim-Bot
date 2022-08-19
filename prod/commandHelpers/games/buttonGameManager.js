import EventEmitter from "events";
export default class ButtonGame extends EventEmitter {
    constructor(gameInfo) {
        super();
        this.gameId = gameInfo.msgId;
        this.playerId = gameInfo.playerId;
        this.playerName = gameInfo.playerName;
        this.components = gameInfo.components;
        this.numOfAttempts = 0;
        this.startTime = Date.now();
        this.endGame = gameInfo.endCallback;
        this.timer = setTimeout(() => this.endGame(this.gameId), 15000);
        if (gameInfo.answer)
            this.initWithAns(gameInfo.answer);
    }
    initWithAns(ans) {
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
    checkResponse(answerGiven) {
        this.numOfAttempts++;
        if (answerGiven == this.ans)
            return this.stats;
        return false;
    }
    fetchButtonComponentData(buttonInfo) {
        let indexOfButton = 0;
        let indexOfActionRow = 0;
        let requestedButton;
        for (let row of this.components) {
            requestedButton = row.components.find((currentValue, indexOfValue) => {
                indexOfButton = indexOfValue;
                return currentValue.label == buttonInfo.label;
            });
            if (requestedButton) {
                return { rowIndex: indexOfActionRow, buttonIndex: indexOfButton, button: requestedButton };
            }
            indexOfActionRow++;
        }
        return null;
    }
    disableButton(buttonToBeDisabled) {
        const fetchedButtonData = this.fetchButtonComponentData(buttonToBeDisabled);
        if (fetchedButtonData) {
            const disabledButton = fetchedButtonData.button.setDisabled();
            this.components[fetchedButtonData.rowIndex].components[fetchedButtonData.buttonIndex] = disabledButton;
            this.updateButtons(this.components);
            return this.components;
        }
    }
    updateTimer() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.endGame(this.gameId), 15000);
    }
    updateButtons(buttonComponents) {
        this.updateTimer();
        this.components = buttonComponents;
    }
}
