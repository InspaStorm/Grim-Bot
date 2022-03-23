import discord from 'discord.js';
import {db} from '../../startup/database.js';

const collection = db.collection('Tasks')

export default {

	name: 'task',
	description:'Shows the tasks assigned to some specific people',
	alias: [],
	isStaff: true,
	options: [],

	/**
     * 
     * @param {Message} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(msg, args, author = msg.author, isInteraction = false) {

		const status = {
			1: '<a:notify:871230575342649354>',
			2: '<a:yes:871230600974045254>',
			3: '<a:no:871230606342762526>'
		}
		const authorID = author.id

		let pendingList = "";
		let doneList = "";
		let removedList = "";

		try {


			const res = await collection.find({id : authorID}).toArray()

			let data = res[0]

			// placeholder number for each lists:
			let p = 1;
			let d = 1;
			let r = 1;

			let tasksEmbed;

			if (data instanceof Object && data.tasks.length > 0) {
				for (let task of data.tasks) {
					if (task.status == 1) {
						pendingList = pendingList + `\n**${p}.** ${task.name}`
						p ++;
					} else if (task.status == 2) {
						doneList = doneList + `\n**${d}.** ${task.name}`
						d ++;
					} else {
						removedList = removedList + `\n**${r}.** ${task.name}`
						r ++;
					}
				}

				if (pendingList === "") {pendingList = 'You have no pending tasks!'}
				if (doneList === "") {doneList = 'You have no done tasks!'}
				if (removedList === "") {removedList = 'You have no aborted tasks!'}

				tasksEmbed = new discord.MessageEmbed()
				.setTitle(`Tasks for ${data.name}`)
				.setDescription('Tasks assigned to YOU!')
				.addField(`Pending Tasks ${status[1]}`, pendingList)
				.addField(`Done Tasks ${status[2]}`,doneList)
				.addField(`Aborted Tasks ${status[3]}`, removedList)
				.setThumbnail(author.avatarURL())

			} else {
				const tasksList = 'No Tasks Found'
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
