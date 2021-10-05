const {db} = require('../../misc/initializer')

module.exports = {
	
	name: 'taskdone',
	description:'Marks a task of the author as done',
	private: true,

	run(msg, args, author=author) {
		const authorID = author.id

		if (!isNaN(args[0])) {

			const taskNumber = args[0] - 1
		    const collection = db.collection('Tasks')

			collection.findOne({id : `${authorID}`})
			.then(res => {

				if (res.tasks.length >= args[0] && res.tasks.length > 0) {

					res.tasks[taskNumber].status = 2

					collection.updateOne({id: authorID}, {$set :{tasks: res.tasks}})

					msg.reply(`${res.tasks[taskNumber]} Has been marked as done`)

				} else msg.reply(`There are no tasks at position **${args[0]}**`)
			})

		} else {
			msg.reply('Please provide the `Positional Number` of the task')
		}
	}

}