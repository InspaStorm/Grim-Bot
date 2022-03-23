import {db} from '../../startup/database.js';

const collection = db.collection('Tasks')
const owners = ['599489300672806913']

export default {
  name: 'cleartask',
  description: 'Completely removes the task from the list',
  alias: [],
  isStaff: true,

  /**
     * 
     * @param {Message} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(msg, args, author = msg.author, isInteraction = false)  {
    const authorId = author.id
    if (owners.includes(authorId)) {

      // let taskIndex;
      // if (isInteraction) {
      //   taskIndex = args.get("index").value
      // } else {
      //   taskIndex = args[0]
      // }

      const dbEntry = await collection.updateOne({id: authorId}, {$pop: {tasks: 1 }});

      return {content: `Task list has been cleared!`}

    } else {
      return {content: 'You are not authorized to do this task.'}
    }
  }
}
