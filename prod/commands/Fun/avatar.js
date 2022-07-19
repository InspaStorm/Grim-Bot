import discord from 'discord.js';
import { inputMemberCheck } from '../../helpers/member.js';
export default {
    name: 'avatar',
    description: 'Shows off your avatar',
    alias: [],
    options: [
        { name: "user", desc: "Mention the user/give the user's name", required: false, type: "user" },
    ],
    /**
     *
     * @param {Message} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(msg, args, author = msg.author, isInteraction = false) {
        const userInfo = await inputMemberCheck(msg, author, args, isInteraction);
        if (typeof userInfo == 'string')
            return { content: userInfo };
        const name = userInfo.username;
        const img = userInfo.displayAvatarURL({ format: 'png', size: 256 });
        const avatarEmbed = new discord.MessageEmbed()
            .setDescription(name)
            .setImage(img);
        return ({ embeds: [avatarEmbed] });
    }
};
