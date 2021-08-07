const discord = require('discord.js');
const { MongoClient } = require('mongodb');
const {db} = require('../misc/chatPoints.js');

module.exports = {
	
	name: 'removetask',
	description:'Removes a task to the existing user',

	run(msg, args) {
		const authorID = msg.author.id

		if (!isNaN(args[0])) {

			const taskNumber = args[0] - 1
		    const collection = db.collection('Tasks')

			collection.findOne({id : `${authorID}`})
			.then(res => {

				if (res.tasks.length >= args[0]) {

					res.tasks.splice(taskNumber, 1)

					collection.updateOne({id: authorID}, {$set :{tasks: res.tasks}})

					msg.channel.send(`${res.tasks[taskNumber]} Has been removed from the list`)

				} else msg.channel.send(`There are no tasks at position ${args[0]}`)
			})

		} else {
			msg.channel.send('Please provide the `Number` of the task to be removed')
		}
	}
}