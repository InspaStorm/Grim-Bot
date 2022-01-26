import {db} from '../../misc/initializer.js';

export default {

	name: 'removetask',
	description:'Removes a task to the existing user',
	private: true,

	async run(msg, args, author = msg.author, isInteraction = false) {
		const authorID = author.id

		if (!isNaN(args[0])) {

			const taskNumber = args[0] - 1
			const collection = db.collection('Tasks')

			const res = await collection.findOne({id : `${authorID}`})

			if (res.tasks.length >= args[0] && res.tasks.length > 0) {

				res.tasks[taskNumber].status = 3

				await collection.updateOne({id: authorID}, {$set :{tasks: res.tasks}})

				return (`${res.tasks[taskNumber]} Has been marked as cancelled`)

			} else return (`There are no tasks at position **${args[0]}**`)

		} else {
			return ('Please provide the `Positional Number` of the task')
		}
	}
}
