// This file is made to make testing the whole code easier
import { CommandInteraction, Interaction, InteractionReplyOptions, Message, MessageEditOptions, MessageOptions } from "discord.js";

export async function replier(destination: CommandInteraction | Message, content: InteractionReplyOptions | MessageOptions, isInteraction = false) {
    console.log(content, isInteraction);
    if (isInteraction) {
        (content as InteractionReplyOptions).fetchReply = true
        const interReply = await (destination as CommandInteraction).reply((content as InteractionReplyOptions))
        return interReply
    } else {
        const msgReply = await (destination as Message).reply((content as MessageOptions))
        return msgReply
    }
}

/**
 * 
 * @param {Message} destination The message/interaction to reply to
 * @param {Object} content The message/thing to be sent
 * @returns {Message}
 */
export async function sender(destination: CommandInteraction, content: MessageOptions) {
    const messageInfo = await destination.channel!.send(content)
    return messageInfo
}

/**
 * 
 * @param {Message} destination 
 * @param {*} content 
 * @param {boolean} isInteraction 
 * @returns 
 */
export async function editReply(destination: Message, content: MessageEditOptions, isInteraction: boolean) {
    const msg = await destination.edit(content)
    return msg
}
