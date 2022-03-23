import {db} from '../../startup/database.js';

const collection = db.collection('Tasks')
const devs = ['599489300672806913', '681766482803163147', '520625717885534228', '660785366110044210', '760954344421195867']

export default {
  name: 'addtask',
  description: 'Add tasks to some specific people ;)',
  alias: [],
  isStaff: true,
  options: [
    {name: "Task", desc: "Task to be added to the list", required: true, type: "string"},
  ],

  /**
     * 
     * @param {Message} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(msg, args, author = msg.author, isInteraction = false)  {
    const authorId = author.id
    let specifiedTask;
    if (isInteraction) {
      specifiedTask = args.get("task").value
    } else {
      specifiedTask = args.join(" ")
    }

    if (devs.includes(authorId)) {
      const dbEntry = await collection.updateOne({id: authorId}, {$push: {tasks: {name: specifiedTask, status: 1}}});

      return {content: `**${specifiedTask}** has been added to the task list!`}

    } else {
      return {content: 'You are not authorized to do this task.'}
    }
  }
}
