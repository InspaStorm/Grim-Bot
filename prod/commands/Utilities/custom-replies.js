import { MessageEmbed } from "discord.js";
import dbManager from "../../database/dbCrud.js";
const customRepliesDb = new dbManager('server-conf');
export default {
    name: 'custom-replies',
    description: 'Get the list of custom replies in your server',
    alias: [],
    options: [],
    /**
    *
    * @param {Interaction} msg message
    * @param {String[]} args array of args
    * @param {GuildMember} author author of the message
    * @param {Boolean} isInteraction whether the message is from interaction or not
    */
    async run(msg, args, author = msg.author, isInteraction = false) {
        if (!msg.member.permissions.has('MANAGE_MESSAGES'))
            return { content: 'You are lacking permission of: `Manage Messages` =/' };
        const guildInfo = await customRepliesDb.singleFind({ guildId: msg.guild.id });
        if (guildInfo) {
            const customRepliesEmbed = new MessageEmbed()
                .setTitle(`Custom Replies of ${msg.guild.name}`)
                .setDescription('This is the list of custom replies that was added to the server!');
            if (guildInfo.custom_replies_list && guildInfo.custom_replies_list.length > 0) {
                const listOfCustomReplies = guildInfo.custom_replies_list.join('\n');
                customRepliesEmbed.setFields([{ name: '\u200b', value: listOfCustomReplies }]);
            }
            else {
                customRepliesEmbed.setFields([{ name: '\u200b', value: 'None' }]);
            }
            return { embeds: [customRepliesEmbed] };
        }
    }
};
