import { EmbedBuilder } from "discord.js";
import dbManager from "../../database/dbCrud.js";
const customRepliesDb = new dbManager("server-conf");
export default {
    name: "custom-replies",
    description: "Get the list of custom replies in your server",
    alias: [],
    options: [],
    /**
     *
     * @param {Interaction} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(invokeParams) {
        console.log(invokeParams.msg.member.permissions.toString());
        // if (!invokeParams.msg.member!.permissions.has(PermissionsBitField.Flags.ManageMessages))
        //   return { content: "You are lacking permission of: `Manage Messages` =/" };
        const guildInfo = await customRepliesDb.singleFind({
            guildId: invokeParams.msg.guild.id,
        });
        if (guildInfo) {
            const customRepliesEmbed = new EmbedBuilder()
                .setTitle(`Custom Replies of ${invokeParams.msg.guild.name}`)
                .setDescription("This is the list of custom replies that was added to the server!");
            if (guildInfo.custom_replies_list &&
                guildInfo.custom_replies_list.length > 0) {
                const listOfCustomReplies = guildInfo.custom_replies_list.join("\n");
                customRepliesEmbed.setFields([
                    { name: "\u200b", value: listOfCustomReplies },
                ]);
            }
            else {
                customRepliesEmbed.setFields([{ name: "\u200b", value: "None" }]);
            }
            return { embeds: [customRepliesEmbed] };
        }
    },
};
