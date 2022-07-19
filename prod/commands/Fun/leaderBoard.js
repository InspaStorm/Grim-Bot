import { makeEmbed } from "../../helpers/embedManager.js";
import dbManager from '../../helpers/dbCrud.js';
const thcDb = new dbManager('thc');
export default {
    name: 'leaderboard',
    description: 'Preview the chad chatters',
    alias: [],
    options: [],
    /**
     *
     * @param {Message} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(msg, args, author = msg.author, isInteraction = false) {
        const res = await thcDb.executeCustom((collection) => collection.find().sort({ count: -1 }).limit(10).toArray());
        let i = 1;
        let placeHolders = '';
        for (let entry of res) {
            if (i == 1) {
                var userId = entry.id;
                var crownHolder = `👑 ${entry.name} - ${entry.count}`;
                i++;
            }
            else {
                placeHolders = placeHolders + `${i}. ${entry.name} - ${entry.count}\n`;
                i++;
            }
        }
        if (i <= 2)
            placeHolders = '----';
        /**
         * @type {discord.GuildMember}
         */
        const user = await msg.client.users.fetch(userId);
        const leaderboard = makeEmbed('THC Leaderboard', '\u200b', [{ name: crownHolder, value: placeHolders }], '#FFFF00', user.displayAvatarURL(), `Redeem the points in \`g!shop\``);
        return { embeds: [leaderboard] };
    }
};
