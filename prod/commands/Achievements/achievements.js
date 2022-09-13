import dbManager from "../../database/dbCrud.js";
import achievementList from "../../commandHelpers/achievements/achievementList.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { inputMemberCheck } from "../../helpers/member.js";
const db = new dbManager("level");
async function makeAwardEmbed(user) {
    const res = await db.singleFind({ id: user.id });
    const achievementIndexes = res?.achievements || [];
    const achievements = [];
    if (achievementIndexes.length == 0) {
        achievements.push({
            name: "No achievement Earned",
            value: "Why not hunt down some sweet achievement ¯\\_(ツ)_/¯",
        });
    }
    else {
        for (let index of achievementIndexes) {
            achievements.push(achievementList[index]);
        }
    }
    const achievementEmbed = new EmbedBuilder()
        .setTitle("<:achievement:939468591395377213> Unlocked achievement(s)")
        .setDescription(user.username)
        .addFields(achievements)
        .setColor("#00ffff")
        .setFooter({
        text: `Found ${achievementIndexes.length} out of ${Object.keys(achievementList).length} achievements`,
    });
    return achievementEmbed;
}
export default {
    name: "achievements",
    description: "Showcases the achievements earned by the author",
    alias: ["achievement", "award", "awards"],
    options: [
        {
            name: "user",
            desc: "Mention the user/give the user's name",
            required: false,
            type: ApplicationCommandOptionType.User,
        },
    ],
    async run(invokOptions) {
        let user = await inputMemberCheck(invokOptions.msg.guild, invokOptions.author, invokOptions.args, invokOptions.isInteraction);
        if (typeof user == "string")
            return { content: user };
        const achievementEmbed = await makeAwardEmbed(user);
        return { embeds: [achievementEmbed] };
    },
};
