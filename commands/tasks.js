const discord = require('discord.js');
const { MongoClient } = require('mongodb');
const {dbUrl} = require('../config.js');

module.exports = {
	
	name: 'task',
	description:'Shows the tasks assigned to some specific people',

	run(msg, args) {

		const client = new MongoClient(dbUrl);

		const status = {
			1: 'Pending<a:notify:871230575342649354>',
			2: 'Done<a:yes:871230600974045254>',
			3: 'Aborted<a:no:871230606342762526>'
		}
		const authorID = msg.author.id

		let tasksList = '';

		try {
			client.connect(err => {

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

		} catch (err) {

			console.error(err)
			msg.channel.send('Something went wrong on my side =/')

		}

		
	}

}