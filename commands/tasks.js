const tasks = require('../tasks.json');
const discord = require('discord.js');

module.exports = {
	
	name: 'task',
	description:'Shows the tasks assigned to some specific people',

	run(msg) {
		const authorID = msg.author.id

		if (tasks.userIds.includes(msg.author.id)) {

			try {

				const tasksList = tasks[authorID].tasks.join('\n');
				const name = tasks[authorID].name;

				const tasksEmbed = new discord.MessageEmbed()
					.setTitle(`Tasks for ${name}`)
					.setDescription('Tasks assigned to YOU!')
					.addField('Tasks', tasksList)
					.setThumbnail(msg.author.avatarURL())

				msg.channel.send(tasksEmbed)
			} catch (err) {

				console.error(err)
				msg.channel.send('Something went wrong on my side =/')

			}

		}
	}

}