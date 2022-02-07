import {db} from '../../startup/database.js';

const collection = db.collection('Tasks')
const devs = ['599489300672806913', '681766482803163147', '520625717885534228', '660785366110044210', '760954344421195867']

export default {
  name: 'addtask',
  description: 'Add tasks to some specific people ;)',
  alias: [],
  isStaff: true,

  async run(msg, args, author = msg.author, isInteraction = false)  {
    const authorId = author.id
    const specifiedTask = args.join(" ")

    if (devs.includes(authorId)) {
      const dbEntry = await collection.updateOne({id: authorId}, {$push: {tasks: {name: specifiedTask, status: 1}}});

      return {content: `**${specifiedTask}** has been added to the task list!`}

    } else {
      return {content: 'You are not authorized to do this task.'}
    }
  }
}
