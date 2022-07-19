import dbManager from '../../helpers/dbCrud.js';
export default {
    name: 'taskdone',
    description: 'Marks a task of the author as done',
    alias: [],
    isStaff: true,
    options: [
        { name: "Index", desc: "The position of task (Can be seen in g!task command) to be marked as done", required: true, type: "string" },
    ],
    /**
     *
     * @param {Message} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(msg, args, author = msg.author, isInteraction = false) {
        const authorID = author.id;
        let taskIndex;
        if (isInteraction) {
            taskIndex = args.get("index").value;
        }
        else {
            taskIndex = args[0];
        }
        if (!isNaN(taskIndex)) {
            const taskNumber = taskIndex - 1;
            const collection = new dbManager('tasks');
            const res = await collection.singleFind({ id: authorID });
            if (res.tasks.length >= taskIndex && res.tasks.length > 0) {
                res.tasks[taskNumber].status = 2;
                collection.singleUpdate({ id: authorID }, { $set: { tasks: res.tasks } });
                return (`${res.tasks[taskNumber].name} Has been marked as done`);
            }
            else
                return (`There are no tasks at position **${taskIndex}**`);
        }
        else {
            return ('Please provide the `Positional Number` of the task');
        }
    }
};
