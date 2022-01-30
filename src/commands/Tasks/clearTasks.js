import {db} from '../../misc/initializer.js';

const collection = db.collection('Tasks')
const owners = ['599489300672806913']

export default {
  name: 'cleartask',
  description: 'Add tasks to some specific people ;)',
  private: true,

  async run(msg, args, author = msg.author, isInteraction = false)  {
    const authorId = author.id
    if (owners.includes(authorId)) {
      const dbEntry = await collection.updateOne({id: authorId}, {$pop: {tasks: 1}});

      return {content: `Task list has been cleared!`}

    } else {
      return {content: 'You are not authorized to do this task.'}
    }
  }
}
