const discord = require('discord.js');
const {db} = require('../../misc/initializer');

module.exports = {
	
	name: 'task',
	description:'Shows the tasks assigned to some specific people',
	private: true,

	run(msg, args, author=author) {

		const status = {
			1: 'Pending<a:notify:871230575342649354>',
			2: 'Done<a:yes:871230600974045254>',
			3: 'Aborted<a:no:871230606342762526>'
		}
		const authorID = author.id

		let tasksList = '';

		try {
			
			const collection = db.collection('Tasks')

			collection.find({id : '599489300672806913'}).toArray()
			.then(res => {

				let data = res[0]
				let i = 1
				if (data.tasks.length > 0) {
					for (let task of data.tasks) {
						tasksList = tasksList + `\n${i}. ${task.name} - ${status[task.status]}`
						i ++
					}
				} else tasksList = 'No Tasks Found'

				const tasksEmbed = new discord.MessageEmbed()
				.setTitle(`Tasks for ${data.name}`)
				.setDescription('Tasks assigned to YOU!')
				.addField('Tasks', tasksList)
				.setThumbnail(author.avatarURL())

				msg.reply({embeds: [tasksEmbed]})
			})
			.catch(err => console.log('An error occured:',err))

		} catch (err) {

			console.error(err)
			msg.reply('Something went wrong on my side =/')

		}

		
	}

}