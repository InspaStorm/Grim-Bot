const tasks = require('../tasks.json');
const discord = require('discord.js');

module.exports = {
	
	name: 'ping',
	description:'pong',

	run(msg, args) {
		msg.channel.send('pong')
	}

}