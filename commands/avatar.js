const tasks = require('../tasks.json');
const discord = require('discord.js');

module.exports = {
	
	name: 'myavatar',
	description:'Shows off your avatar',

	run(msg) {
		const avatarEmbed = new discord.MessageEmbed()
		.setImage(msg.author.avatarURL());

		msg.channel.send(avatarEmbed)
	}

}