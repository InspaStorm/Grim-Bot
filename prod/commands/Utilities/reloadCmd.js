import { cmdLoader } from '../../startup/commandLoader.js';
export default {
    name: 'reloadcmd',
    description: 'reloads Command',
    alias: ['r', 'reload'],
    isStaff: true,
    /**
     *
     * @param {Message} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(msg, args, author, isInteraction) {
        if (author.id != "599489300672806913")
            return { content: 'Currently only Ranger can use this command =)' };
        global.cmdManager = await cmdLoader();
        return { content: 'Commands got reloaded' };
    }
};
