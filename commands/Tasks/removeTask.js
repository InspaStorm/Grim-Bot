const {db} = require('../../misc/initializer.js');

module.exports = {
	
	name: 'removetask',
	description:'Removes a task to the existing user',
	private: true,

	run(msg, args) {
		const authorID = msg.author.id

		if (!isNaN(args[0])) {

			const taskNumber = args[0] - 1
		    const collection = db.collection('Tasks')

			collection.findOne({id : `${authorID}`})
			.then(res => {

				if (res.tasks.length >= args[0] && res.tasks.length > 0) {

					res.tasks[taskNumber].status = 3

					collection.updateOne({id: authorID}, {$set :{tasks: res.tasks}})

					msg.channel.send(`${res.tasks[taskNumber]} Has been marked as cancelled`)

				} else msg.channel.send(`There are no tasks at position **${args[0]}**`)
			})

		} else {
			msg.channel.send('Please provide the `Positional Number` of the task')
		}
	}
}