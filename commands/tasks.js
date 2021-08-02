const tasks = require('../tasks.json');
const discord = require('discord.js');
const fs = require('fs');

module.exports = {
	
	name: 'task',
	description:'Shows the tasks assigned to some specific people',

	run(msg, args) {
		const status = {
			1: 'Pending<a:notify:871230575342649354>',
			2: 'Done<a:yes:871230600974045254>',
			3: 'Aborted<a:no:871230606342762526>'
		}
		const authorID = msg.author.id

		if (tasks.userIds.includes(msg.author.id)) {

			let tasksList = ''

			try {
				let i = 1
				fs.readFile('./tasks.json', (err, rawData) => {
					if (err) {
						msg.channel.send('Something went wrong when reading the file')
					}

					let fileData = JSON.parse(rawData)

					for (let task of fileData[authorID].tasks) {
						tasksList = tasksList + `\n${i}. ${task.name} - ${status[task.status]}`
						i += 1
					}

					const name = fileData[authorID].name;

					const tasksEmbed = new discord.MessageEmbed()
						.setTitle(`Tasks for ${name}`)
						.setDescription('Tasks assigned to YOU!')
						.addField('Tasks', tasksList)
						.setThumbnail(msg.author.avatarURL())

					msg.channel.send(tasksEmbed)
				})
			} catch (err) {

				console.error(err)
				msg.channel.send('Something went wrong on my side =/')

			}

		}
	}

}