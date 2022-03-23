import { Message, GuildMember, Collector } from "discord.js";
import { replier , sender } from '../../helpers/apiResolver.js'

function rollDice(quantity) {
    const randNums = [];
    let i = 0;
    while (i <= quantity) {
        const randNum = Math.floor(Math.random() * 6)
        if (randNum != 0) {
            randNums.push(randNum)
        } else i -= 1

        i++
    }

    return randNums
}

function createQuestion() {

    // const specialChars = {
    //     '*' : 'x',
    // }

    const questionNumbers = rollDice(2)

    const question = questionNumbers.join(" " + '*' + " ")

    const answer = questionNumbers.reduce((total, value) => total * value)
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
        const quiz = createQuestion()

        const filter = m => m.content.includes(quiz.a)
    
        replier(msg, {content: `What is ${quiz.q}?`}, isInteraction)

        /**
         * @type {Collector}
         */
        const replyChecker= await msg.channel.createMessageCollector({filter: filter, time: 10000, max: 1})

        replyChecker.on('end',async (_ans, reason)=> {

            if (reason == 'found') return;
            sender(msg, {content: 'Looks like nobody answered me correctly =('})
        })
        
        replyChecker.on('collect', async (ans)=> {

            replyChecker.stop('found')
            sender(msg, {content: `🥳 **${ans.author}** got the right answer!`})
        })

        return {selfRun: true}

    }
}