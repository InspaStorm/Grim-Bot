import { MessageAttachment, MessageActionRow, MessageButton } from "discord.js";
import { editReply, replier } from '../../helpers/apiResolver.js';
import sharp from 'sharp';
import { joinImages } from 'join-images';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import GameManager from "../../commandHelpers/games/gameManager.js";
import ButtonGame from "../../commandHelpers/games/buttonGameManager.js";
const __filename = fileURLToPath(import.meta.url);
const pathToDiceImgs = `${dirname(__filename)}/../../images/dice`;
class DiceGame extends ButtonGame {
    constructor(gameInfo) {
        super(gameInfo);
        this.init(gameInfo.msgId, gameInfo.playerId, gameInfo.playerName);
        this.ans = gameInfo.answer;
    }
    init(msgID, playerId, playerName) {
        this.createQuestion()
            .then(info => {
            this.qImage = info.q;
            this.ans = info.a;
            this.components = info.components;
            this.emit('ready');
        });
    }
    get getGameQuestion() {
        return {
            content: "What will be the product of these?",
            files: [this.qImage],
            components: this.components
        };
    }
    async createQuestion() {
        const questionNumbers = await this.rollDice(3);
        const question = await this.prepareImgs(questionNumbers.buffers);
        const answer = questionNumbers.numbers.reduce((total, value) => total * value);
        const options = this.makeButtons(answer);
        return { q: question, a: answer, components: options };
    }
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
            const imagePath = pathToDiceImgs + `/dice-${num}.png`;
            let image = await sharp(imagePath).toBuffer();
            imgBuffers.push(image);
        }
        return { buffers: imgBuffers, numbers: numbers };
    }
    async prepareImgs(imgBuffers) {
        const resultImg = await joinImages(imgBuffers, { direction: 'horizontal', color: "#FFF", margin: { top: 7, right: 7, bottom: 7 } });
        resultImg.toFormat('png');
        const buffer = await resultImg.toBuffer();
        const result = new MessageAttachment(buffer, 'dice-image.png');
        return result;
    }
    makeButtons(ansNumber) {
        let randNums = [];
        let buttons = [];
        while (randNums.length <= 8) {
            const randInt = Math.floor(Math.random() * 99);
            if (randInt > 0 && !randNums.includes(randInt) && randInt != ansNumber)
                randNums.push(randInt);
        }
        const randPos = Math.floor(Math.random() * 9);
        randNums[randPos] = ansNumber;
        for (let num of randNums) {
            let button = new MessageButton()
                .setCustomId(`speedmath ${num.toString()}`)
                .setLabel(num.toString())
                .setStyle('PRIMARY');
            buttons.push(button);
        }
        const row = new MessageActionRow()
            .addComponents(buttons.slice(0, 5));
        const secondRow = new MessageActionRow()
            .addComponents(buttons.slice(5));
        const components = [row, secondRow];
        return components;
    }
}
const lobby = new GameManager(DiceGame);
export default {
    name: 'speedmath',
    description: 'Calculate as fast as you can!',
    alias: ['math'],
    options: [],
    async run(invokInfo) {
        const loading = await replier(invokInfo.msg, { content: '<a:dice_rolling:956854476143218728>' }, invokInfo.isInteraction);
        const gameInstance = lobby.addGame({ msgId: loading.id, playerId: invokInfo.author.id, playerName: invokInfo.author.username, answer: null, components: null, endCallback: (msgID) => {
                lobby.removeGame(msgID);
            } });
        console.log('Ok');
        // End this function if the message was deleted
        gameInstance.on('ready', async () => {
            try {
                await editReply(loading, gameInstance.getGameQuestion, invokInfo.isInteraction);
            }
            catch (err) {
                console.log("Not ready " + err);
            }
            // Indicating the command will run on its own.
        });
        return { selfRun: true };
    },
    async handle(inter) {
        const argsAsArray = inter.customId.split(" ");
        argsAsArray.shift();
        const gameId = inter.message.id;
        const player = inter.user;
        const interactedGame = lobby.hasGame(gameId);
        if (interactedGame) {
            if (player.id != interactedGame.playerId) {
                inter.reply({ content: 'This is an ongoing game started by someone else, Why not start a new session by yourself ;p', ephemeral: true });
            }
            const gameStats = interactedGame.checkResponse(parseInt(argsAsArray[0]));
            if (gameStats) {
                inter.update({ content: `${gameStats}`, files: [], components: [] });
                lobby.removeGame(gameId);
                return;
            }
            const updatedButtons = interactedGame.disableButton(inter.component);
            inter.update({ components: updatedButtons });
            return;
        }
        inter.update({ content: `This game is no longer playable, consider starting a new session =)`, files: [], components: [] });
        return;
    }
};
