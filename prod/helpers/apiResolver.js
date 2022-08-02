export async function replier(destination, content, isInteraction = false) {
    console.log(content, isInteraction);
    if (isInteraction) {
        content.fetchReply = true;
        const interReply = await destination.reply(content);
        return interReply;
    }
    else {
        const msgReply = await destination.reply(content);
        return msgReply;
    }
}
/**
 *
 * @param {Message} destination The message/interaction to reply to
 * @param {Object} content The message/thing to be sent
 * @returns {Message}
 */
export async function sender(destination, content) {
    const messageInfo = await destination.channel.send(content);
    return messageInfo;
}
/**
 *
 * @param {Message} destination
 * @param {*} content
 * @param {boolean} isInteraction
 * @returns
 */
export async function editReply(destination, content, isInteraction) {
    const msg = await destination.edit(content);
    return msg;
}
