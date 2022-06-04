import { Message, GuildMember, MessageAttachment, MessageActionRow, MessageButton } from "discord.js";
import { followUp , replier} from '../../helpers/apiResolver.js';
import sharp from 'sharp';
import { joinImages } from 'join-images';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import GameManager from "../../commandHelpers/games/gameManager.js";
import buttonGame from "../../commandHelpers/games/buttonGame.js";

const lobby = new GameManager(buttonGame);

const __filename = fileURLToPath(import.meta.url);
const pathToDiceImgs = `${dirname(__filename)}/../../pics/dice`;

class DiceGame {

    constructor(msgID, playerInfo) {
        const questionInfo = this.createQuestion();

        this.qImage = questionInfo.q;
        this.answer = questionInfo.a;
        this.optionButtons = questionInfo.components;

        lobby.addGame({msgId: msgID, playerId: playerInfo.id, playerName:playerInfo.username,
            answer: this.answer, components: this.optionButtons,
            endCallback: msgID => {
                lobby.removeGame(msgID);
            }
        })
    }

    get getGameQuestion() {
        return {
            content: "What will be the product of these?",
            files: [this.qImage],
            components: this.optionButtons
        }
    }

    async createQuestion() {
    
        const questionNumbers = await this.rollDice(3)
    
        const question = await this.prepareImgs(questionNumbers.buffers)
        
        const answer = questionNumbers.numbers.reduce((total, value) => total * value)
        
        const options = this.makeButtons(answer)
    
        return {q: question, a: answer, components: options}
        
    }

    /**
     * @param {number} quantity Number of dices to be rolled
     * @returns {{buffers: Buffer, numbers: number[]}}
     */

    async rollDice(quantity) {
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
            const imagePath = pathToDiceImgs + `/dice-${num}.png`

            let image = await sharp(imagePath).toBuffer();
            
            imgBuffers.push(image)
        }

        return {buffers: imgBuffers, numbers: numbers}
    }
    
    /**
     * 
     * @param {Buffer[]} imgBuffers Array of buffer of the images
     * @returns {MessageAttachment} The message attachment that can be sent 
     */
     async prepareImgs(imgBuffers) {
        
        
        const resultImg = await joinImages(imgBuffers, {direction: 'horizontal', color: "#FFF", margin: {top:7, right:7, bottom:7}})
        resultImg.toFormat('png')
        const buffer = await resultImg.toBuffer()
        
        const result = new MessageAttachment(buffer, 'dice-image.png')
        return result
    }
    
    makeButtons(ansNumber) {
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

        const gameInstance = new DiceGame(msg.id, author);

        // End this function if the message was deleted
        try {
            const gameMsg = await followUp(loading, gameInstance.getGameQuestion, isInteraction)
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