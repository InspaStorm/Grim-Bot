import discord from 'discord.js';
import {db} from '../../misc/initializer.js';

const collection = db.collection('Tasks')

export default {

	name: 'task',
	description:'Shows the tasks assigned to some specific people',
	private: true,

	async run(msg, args, author = msg.author, isInteraction = false) {

		const status = {
			1: 'Pending<a:notify:871230575342649354>',
			2: 'Done<a:yes:871230600974045254>',
			3: 'Aborted<a:no:871230606342762526>'
		}
		const authorID = author.id

		let tasksList = '';

		try {


			const res = await collection.find({id : '599489300672806913'}).toArray()

			let data = res[0]
			let i = 1;
			let tasksEmbed;

			if (data instanceof Object && data.tasks.length > 0) {
				for (let task of data.tasks) {
					tasksList = tasksList + `\n${i}. ${task.name} - ${status[task.status]}`
					i ++;
				}

				tasksEmbed = new discord.MessageEmbed()
				.setTitle(`Tasks for ${data.name}`)
				.setDescription('Tasks assigned to YOU!')
				.addField('Tasks', tasksList)
				.setThumbnail(author.avatarURL())

			} else {
				tasksList = 'No Tasks Found'
				tasksEmbed = new discord.MessageEmbed()
				.setTitle(`Tasks for ${author.username}`)
				.setDescription('Tasks assigned to YOU!')
				.addField('Tasks', tasksList)
				.setThumbnail(author.avatarURL())
			}

			return ({embeds: [tasksEmbed]})

		} catch (err) {

			console.error(err)
			return ('Something went wrong on my side =/')

		}


	}

}
