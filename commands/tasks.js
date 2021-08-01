const tasks = require('../tasks.json');
const discord = require('discord.js');

module.exports = {
	
	name: 'task',
	description:'Shows the tasks assigned to some specific people',

	run(msg) {
		const status = {
			1: 'Pending<a:notify:871230575342649354>',
			2: 'Done<a:yes:871230600974045254>',
			3: 'Aborted<a:no:871230606342762526>'
		}
		const authorID = msg.author.id

		if (tasks.userIds.includes(msg.author.id)) {

			let tasksList = ''

			try {
				for (let task of tasks[authorID].tasks) {
					tasksList = tasksList + `\n${task.name} - ${status[task.status]}`
				}

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