import { Collection,Message, GuildMember, MessageAttachment, MessageActionRow, MessageButton } from "discord.js";
import { followUp , replier} from '../../helpers/apiResolver.js';
import axios from 'axios';
import { joinImages } from 'join-images';

const ansHandler = new Collection()

class Games {
    constructor() {
        this.currentGames = new Collection();
    }

    addGame(playerId, answer, options, timer) {
        this.currentGames.set(playerId, {ans: answer, options: options, timer: timer})
    }
    
    hasGame(playerId) {
        const isPresent = this.currentGames.has(playerId)

        if (isPresent) {
            return this.currentGames.get(playerId)
        }

        return false;
    }

    updateGameInfo(playerId, answer, options) {
        this.removeOldTimer(playerId)
        
        const timer = setTimeout(() => this.removeGame(playerId), 15_000)
        this.removeGame(playerId)
        this.addGame(playerId, answer, options, timer)
    }

    disableOptions(playerId, optionToBeDisabled) {
        const game = this.hasGame(playerId)

        if (game) {
            let indexOfOption;
            let indexOfRow = 0;
            let updatingOption;

            for (let row of game.options) {
                updatingOption = row.components.find((currentValue, indexOfValue) => {
                    indexOfOption = indexOfValue
                    return currentValue.label == optionToBeDisabled.label;
                });

                if (updatingOption) break;
                indexOfRow ++
            }


            updatingOption.setDisabled()

            game.options[indexOfRow].components[indexOfOption] = updatingOption;

            this.updateGameInfo(playerId, game.ans, game.options)

            return game.options;
        }
    }

    isCorrectAns(playerId, answerGiven) {
        const game = this.hasGame(playerId)

        if (game.ans == answerGiven) return true;

        return false;
    }

    removeOldTimer(playerId) {
        const game = this.hasGame(playerId)

        clearTimeout(game.timer)
    }

    removeGame(playerId) {
        if (this.currentGames.has(playerId)) {
            this.currentGames.delete(playerId)
            return true
        }

        return false;
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

const lobby = new Games()

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
            await followUp(loading, {content: 'What would be the product of these?',files: [quiz.q],components: quiz.components}, isInteraction)
            lobby.addGame(author.id, quiz.a, quiz.components, setTimeout(() => lobby.removeGame(author.id), 15_000))
        } catch(err) {
            console.log(err);
            return {selfRun: true}
        }
        // Indicating the command will run on its own.
        return {selfRun: true}

    },

    async handle(msg) {
        const args = msg.customId.split(" ")
		args.shift()

        const player = msg.user

        const interactedGame = lobby.hasGame(player.id)

        if (interactedGame) {
            if (lobby.isCorrectAns(player.id, args[0])) {
                msg.update({content: `🥳 **${msg.user.username}** got the right answer!`, files: [], components: []})

                lobby.removeGame(msg.user.id)
                return;
            }
            
            const updatedButtons = lobby.disableOptions(player.id, msg.component)
            msg.update({components: updatedButtons})
            return;
        }

        msg.update({content: `This game is no longer playable, consider starting a new session =)`, files: [], components: []})
        return;
    }
}