import dbManager from "../../database/dbCrud.js";
import discord from "discord.js";
import { inputMemberCheck } from "../../helpers/member.js";
import { GRIMS_EMOJI } from "../../helpers/emojis.js";
import { CommandParamType } from "../../types/commands.js";

const db = new dbManager("thc");

export default {
  name: "balance",
  description: "View your hard earned Grims!",
  alias: ["point", "points"],
  options: [
    {
      name: "user",
      desc: "Mention the user/give the user's name",
      required: false,
      type: "user",
    },
  ],

  async run(invokeParams: CommandParamType) {
    const userInfo = await inputMemberCheck(
      invokeParams.msg.guild!,
      invokeParams.author,
      invokeParams.args,
      invokeParams.isInteraction
    );

    if (typeof userInfo == "string") return { content: userInfo };
    const res = await db.singleFind({ id: userInfo.id });

    const score = res != null ? res.count.toString() : "0";

    const thpEmbed = new discord.MessageEmbed()
      .setTitle(`The balance of ${userInfo.username}`)
      .setDescription(`${GRIMS_EMOJI} ${score}`)
      .setThumbnail(userInfo.displayAvatarURL())
      .setColor("#FFFF00")
      .setFooter({ text: `Redeem the currency using /shop` });

    return { embeds: [thpEmbed] };
  },
};
