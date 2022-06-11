import { Interaction } from "discord.js"

export default {
    name: 'about',
    description:'Get some details about Mr. Grim',
    alias: [],
    options: [],
    /**
    *
    * @param {Interaction} msg message
    * @param {String[]} args array of args
    * @param {GuildMember} author author of the message
    * @param {Boolean} isInteraction whether the message is from interaction or not
    */
    async run(msg, args, author = msg.author, isInteraction = false) {
        return {content: `Guilds:\n${msg.client.guilds.cache.size}`}
    }
}