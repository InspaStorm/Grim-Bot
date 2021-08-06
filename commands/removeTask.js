const discord = require('discord.js');
const { MongoClient } = require('mongodb');
const {dbUrl} = require('../config.js');

module.exports = {
	
	name: 'removetask',
	description:'Removes a task to the existing user',

	run(msg, args) {
		const authorID = msg.author.id

		if (tasks.userIds.includes(msg.author.id)) {

			if (!isNaN(args[0])) {
				const taskNumber = args[0]

			client.connect(() => {

			    const db = client.db('Grim-Town')
			    const collection = db.collection('Tasks')

				collection.find({id : '599489300672806913'}).toArray()
				.then(res => {

					let data = res[0]
					let i = 1
					for (let task of data.tasks) {
						tasksList = tasksList + `\n${i}. ${task.name} - ${status[task.status]}`
						i ++
					}

					const tasksEmbed = new discord.MessageEmbed()
					.setTitle(`Tasks for ${data.name}`)
					.setDescription('Tasks assigned to YOU!')
					.addField('Tasks', tasksList)
					.setThumbnail(msg.author.avatarURL())

					msg.channel.send(tasksEmbed)
				})
				.catch(err => console.log('An error occured:',err))
			})
				
				
			} else {
				msg.channel.send('Please provide the `Number` of the task to be removed')
			}
		}
	}

}