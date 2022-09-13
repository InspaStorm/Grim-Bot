import { ApplicationCommandOptionType } from "discord.js";
import dbManager from "../../database/dbCrud.js";
import { lockLevel, lockCustomReplies } from "../../startup/featureLocks.js";
const collection = new dbManager("server-conf");
const currentFeatures = [
    { name: "level", value: "level" },
    { name: "custom_replies", value: "custom_replies" },
];
const validDecisions = [
    { name: "on", value: "on" },
    { name: "off", value: "off" },
];
export default {
    name: "change-serverconf",
    description: "Edit server config of this bot",
    alias: ["sc"],
    options: [
        {
            name: "feature",
            desc: "Name of the feature to be changed",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: currentFeatures,
        },
        {
            name: "decision",
            desc: "Your decision on how to change it",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: validDecisions,
        },
    ],
    /**
     *
     * @param {Message} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(invokeParams) {
        // if (!invokeParams.msg.member.permissions.has('MANAGE_GUILD')) return {content: 'You are lacking permission of: `Manage Server` =/'}
        let featureName;
        let decision;
        if (invokeParams.isInteraction) {
            featureName = invokeParams.msg.options.get("feature")?.value;
            decision = invokeParams.msg.options.get("decision")?.value;
        }
        else {
            featureName = args[0];
            decision = args[1];
            const cmdFormat = "Command format: `g!server-conf <feature name> <decision>`\nEg: **g!server-conf level on**";
            if (!currentFeatures.includes(featureName))
                return {
                    content: `**${featureName}** is not an available feature\nfeatures include: \`${currentFeatures.join(", ")}\`\n\n${cmdFormat}`,
                };
            if (!validDecisions.includes(decision))
                return {
                    content: `**${decision}** is not a valid option\nValid options: \`${validDecisions.join(", ")}\`\n\n${cmdFormat}`,
                };
        }
        const entry = await collection.singleFind({
            guildId: invokeParams.msg.guild.id,
        });
        if (entry != null) {
            await collection.singleUpdate({ guildId: invokeParams.msg.guild.id }, { $set: { [featureName]: decision } });
            switch (featureName) {
                case "level":
                    await lockLevel(invokeParams.msg.client);
                    break;
                case "custom_replies":
                    await lockCustomReplies(invokeParams.msg.client);
                    break;
            }
            return {
                content: `**${featureName} system** has been turned **${decision}** for this server!`,
            };
        }
        else {
            const newGuildEntry = {
                guildId: invokeParams.msg.guild.id,
                level: "on",
                custom_replies: "on",
            };
            newGuildEntry[featureName] = decision;
            await collection.singleInsert(newGuildEntry);
            return {
                content: `🎉 **${featureName}** has been turned **${decision}** on this server for the 1st time!`,
            };
        }
    },
};
