import { makeEmbed } from "../../helpers/embedManager.js";
import dbManager from "../../database/dbCrud.js";
import { CommandParamType } from "../../types/commands.js";

const thcDb = new dbManager("thc");

export default {
  name: "leaderboard",
  description: "Preview the chad chatters",
  alias: [],
  options: [],

  /**
   *
   * @param {Message} msg message
   * @param {String[]} args array of args
   * @param {GuildMember} author author of the message
   * @param {Boolean} isInteraction whether the message is from interaction or not
   */
  async run(invokeOptions: CommandParamType) {
    const res = await thcDb.executeCustom((collection: any) =>
      collection.find().sort({ count: -1 }).limit(10).toArray()
    );
    let i = 1;
    let crownHolder = "👑 Awaits to be taken";
    let placeHolders = "";
    for (let entry of res) {
      if (i == 1) {
        var userId = entry.id;
        crownHolder = `👑 ${entry.name} - ${entry.count}`;
        i++;
      } else {
        placeHolders = placeHolders + `${i}. ${entry.name} - ${entry.count}\n`;
        i++;
      }
    }

    if (i <= 2) placeHolders = "----";

    const user = await invokeOptions.msg.client.users.fetch(userId);
    const leaderboard = makeEmbed(
      "THC Leaderboard",
      "\u200b",
      [{ name: crownHolder, value: placeHolders, inline: false }],
      "#FFFF00",
      user.displayAvatarURL(),
      `Redeem the points in \`g!shop\``
    );

    return { embeds: [leaderboard] };
  },
};
