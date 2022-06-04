// This file is made to make testing the whole code easier
import { Message } from "discord.js";

/**
 * 
 * @param {Message} destination The message/interaction to reply to
 * @param {Object} content The message/thing to be sent
 * @param {Boolean} isInteraction 
 * @returns {Message} Message object that was sent
 */
export async function replier(destination, content, isInteraction = false) {
    if (isInteraction) content.fetchReply = true
    const reply = await destination.reply(content)
    return reply
}

/**
 * 
 * @param {Message} destination The message/interaction to reply to
 * @param {Object} content The message/thing to be sent
 * @returns {Message}
 */
export async function sender(destination, content) {
    const messageInfo = await destination.channel.send(content)
    return messageInfo
}

/**
 * 
 * @param {Message} destination 
 * @param {*} content 
 * @param {boolean} isInteraction 
 * @returns 
 */
export async function followUp(destination, content, isInteraction) {
    const msg = await destination.edit(content)
    return msg
}
