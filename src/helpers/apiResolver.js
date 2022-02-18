// This file is made to make testing the whole code easier
import discord from 'discord.js';

export async function replier(destination, content, isInteraction) {
    try{
        if (isInteraction) content.fetchReply = true
        const reply = await destination.reply(content)
        return reply
    } catch {
        console.log('Error with content:\n\t', content)
    }
}

export function sender(destination, content) {
    destination.channel.send(content)
}

export async function followUp(destination, content, isInteraction) {
    await destination.edit(content)
}
