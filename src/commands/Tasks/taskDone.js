import {db} from '../../misc/initializer.js';

export default {

	name: 'taskdone',
	description:'Marks a task of the author as done',
	private: true,

	async run(msg, args, author = msg.author, isInteraction = false) {
		const authorID = author.id

		if (!isNaN(args[0])) {

			const taskNumber = args[0] - 1
	    const collection = db.collection('Tasks')

			const res = await collection.findOne({id : authorID})

			if (res.tasks.length >= args[0] && res.tasks.length > 0) {

				res.tasks[taskNumber].status = 2

				collection.updateOne({id: authorID}, {$set :{tasks: res.tasks}})

				return (`${res.tasks[taskNumber].name} Has been marked as done`)

			} else return (`There are no tasks at position **${args[0]}**`)

		} else {
			return ('Please provide the `Positional Number` of the task')
		}
	}

}
