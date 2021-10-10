// This file is made to make testing the whole code easier
const discord = require('discord.js');

function replyMsg(destination, content) {
    destination.reply(content)
}

function sendMsg(destination, content) {
    destination.channel.send(content)
}

module.exports = {replier: replyMsg, sender: sendMsg}