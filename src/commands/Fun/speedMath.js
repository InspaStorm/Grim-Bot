import { Message, GuildMember, Collector, MessageAttachment } from "discord.js";
import { followUp , sender } from '../../helpers/apiResolver.js';
import axios from 'axios';
import { joinImages } from 'join-images';

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
 * 
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

async function createQuestion() {

    const questionNumbers = await rollDice(3)

    const question = await prepareImgs(questionNumbers.buffers)

    const answer = questionNumbers.numbers.reduce((total, value) => total * value)
    return {q: question, a: answer}

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
        const loading = await msg.channel.send({content: '<a:dice_rolling:956854476143218728>'})

        const quiz = await createQuestion()

        // End this function if the message was deleted
        try {
            await followUp(loading, {content: 'What would be the product of these?',files: [quiz.q], isInteraction})
        } catch {
            return {selfRun: true}
        }
        const filter = m => m.content == quiz.a
    

        /**
         * @type {Collector}
         */
        const replyChecker= await msg.channel.createMessageCollector({filter: filter, time: 10000})

        replyChecker.on('end',async (_ans, reason)=> {

            if (reason == 'found') return;
            sender(msg, {content: 'Looks like nobody answered me correctly =('})
        })
        
        replyChecker.on('collect', async (ans)=> {
            if (ans.author.bot) return;

            replyChecker.stop('found')
            sender(msg, {content: `🥳 **${ans.author}** got the right answer!`})
        })

        // Indicating the command will run on its own.
        return {selfRun: true}

    }
}