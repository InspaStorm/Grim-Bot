import { Collection,Message, GuildMember, MessageAttachment, MessageActionRow, MessageButton } from "discord.js";
import { followUp , replier} from '../../helpers/apiResolver.js';
import axios from 'axios';
import { joinImages } from 'join-images';

class GameManager {
    constructor() {
        this.runningGames = new Collection();
    }

    addGame(msgId, playerId, playerName, answer, components) {
        this.runningGames.set(msgId, new Game(msgId, playerId, playerName, answer, components))
    }
    
    hasGame(msgId) {
        const isPresent = this.runningGames.has(msgId)

        if (isPresent) {
            return this.runningGames.get(msgId)
        }

        return false;
    }

    removeGame(msgId) {
        if (this.runningGames.has(msgId)) {
            this.runningGames.delete(msgId)
            return true
        }
        
        return false;
    }
}

const lobby = new GameManager()

function endGame(msgId) {
    lobby.removeGame(msgId)
}

class Game {
    /**
     * 
     * @param {number} msgId ID of the game message
     * @param {string} playerId ID of the player
     * @param {number} answer Answer for the current question
     * @param {MessageActionRow[]} components Array of action rows containing btton components
     */
    constructor(msgId, playerId, playerName, answer, components) {
        this.gameId = msgId;
        this.playerId = playerId;
        this.playerName = playerName;
        this.ans = answer;
        this.components = components;
            
        this.numOfAttempts = 0;
        this.startTime = Date.now()
        this.timer = setTimeout(() => endGame(this.msgId), 15_000);
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

        this.timer = setTimeout(() => endGame(), 15_000)
    }

    updateButtons(buttonComponents) {
        this.updateTimer()

        this.components = buttonComponents
    }
}


/**
 * 
 * @param {Buffer[]} imgBuffers Array of buffer of the images
 * @returns {MessageAttachment} The message attachment that can be sent 
 */
async function prepareImgs(imgBuffers) {
    
    
    const resultImg = await joinImages(imgBuffers, {direction: 'horizontal', color: '#000000'})
    resultImg.toFormat('png')
    const buffer = await resultImg.toBuffer()
    
    const result = new MessageAttachment(buffer, 'dice-image.png')

    return result
}

/**
 * @param {number} quantity Number of dices to be rolled
 * @returns {{buffers: Buffer, numbers: number[]}}
 */
async function rollDice(quantity) {
    const imgBuffers = [];
    const numbers = [];
    
    let i = 0;

    while (i < quantity) {
        const randInt = Math.floor(Math.random() * 6);
        if (randInt > 0) {
            numbers.push(randInt);
            i++;
        }
    }

    for (let num of numbers) {
        let url = `http://roll.diceapi.com/images/poorly-drawn/d6/${num}.png`
        const response = await axios.get(url,  { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data, "utf-8")
        
        imgBuffers.push(buffer)
    }

    return {buffers: imgBuffers, numbers: numbers}
}

function makeButtons(ansNumber) {
    let randNums = [];
    let buttons = [];
    
    while (randNums.length <= 8) {
        const randInt = Math.floor(Math.random() * 99);
        if (randInt > 0 && !randNums.includes(randInt) && randInt != ansNumber) randNums.push(randInt)
    }

    const randPos = Math.floor(Math.random() * 9);

    randNums[randPos] = ansNumber

    for (let num of randNums) {
        let button = new MessageButton()
            .setCustomId(`speedmath ${num.toString()}`)
            .setLabel(num.toString())
            .setStyle('PRIMARY')

        buttons.push(button)
    }
    
    
    const row = new MessageActionRow()
    .addComponents(buttons.slice(0, 5))
    
    const secondRow =new MessageActionRow()
    .addComponents(buttons.slice(5))
    
    const components = [row, secondRow];
    return components
}

async function createQuestion() {

    const questionNumbers = await rollDice(3)

    const question = await prepareImgs(questionNumbers.buffers)

    const answer = questionNumbers.numbers.reduce((total, value) => total * value)

    const options = makeButtons(answer)

    return {q: question, a: answer, components: options}

}


export default {
    name: 'speedmath',
    description:'Calculate as fast as you can!',
    alias: ['math'],
    options: [],
    /**
     * 
     * @param {Message} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(msg, args, author = msg.author, isInteraction = false) {
        const loading = await replier(msg, {content: '<a:dice_rolling:956854476143218728>'}, isInteraction)

        const quiz = await createQuestion()

        // End this function if the message was deleted
        try {
            const gameMsg = await followUp(loading, {content: 'What would be the product of these?',files: [quiz.q],components: quiz.components}, isInteraction)
            lobby.addGame(gameMsg.id, author.id, author.username, quiz.a, quiz.components)
        } catch(err) {
            console.log(err);
            return {selfRun: true}
        }
        // Indicating the command will run on its own.
        return {selfRun: true}

    },

    async handle(interaction) {
        const argsAsArray = interaction.customId.split(" ")
		argsAsArray.shift()

        const gameId = interaction.message.id
        const player = interaction.user

        const interactedGame = lobby.hasGame(gameId)

        if (interactedGame) {

            if (player != interactedGame.playerId) {
                interaction.reply({content: 'This is an ongoing game started by someone else, Why not start a new session by yourself ;p',ephemeral: true})
            }

            const gameStats = interactedGame.checkResponse(argsAsArray[0])
            if (gameStats) {
                interaction.update({content: `${gameStats}`, files: [], components: []})

                lobby.removeGame(gameId)
                return;
            }
            
            const updatedButtons = interactedGame.disableButton(interaction.component)
            interaction.update({components: updatedButtons})
            return;
        }

        interaction.update({content: `This game is no longer playable, consider starting a new session =)`, files: [], components: []})
        return;
    }
}