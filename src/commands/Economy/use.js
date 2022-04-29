import dbManager from '../../helpers/dbCrud.js'

const db = new dbManager('inventory'); 

export default {
    name: 'use',
    description:'Use the things in your inventory',
    alias: [],
    options: [],
    /**
    *
    * @param {Message} msg message
    * @param {String[]} args array of args
    * @param {GuildMember} author author of the message
    * @param {Boolean} isInteraction whether the message is from interaction or not
    */
    async run(msg, args, author = msg.author, isInteraction = false) {
        return {content: 'Command is Work In Progress!'}
        const userDetails = await db.singleFind({id: author.id})

        if (userDetails) {
            // const inventory =
        }
    }
}