// This file is made to make testing the whole code easier
import discord from 'discord.js';

export function replier(destination, content) {
    try{
        destination.reply(content)
    } catch {
        console.log('Error with content:\n\t', content)
    }
}

export function sender(destination, content) {
    destination.channel.send(content)
}
