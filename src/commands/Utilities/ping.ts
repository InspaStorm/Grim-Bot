import { Message } from "discord.js";

export default {
  name: "ping",
  description: "pong",
  alias: [""],

  /**
   *
   * @param {Message} msg message
   * @param {String[]} args array of args
   * @param {GuildMember} author author of the message
   * @param {Boolean} isInteraction whether the message is from interaction or not
   */
  async run(invokeParams) {
    if (invokeParams.isInteraction)
      return { content: "Oopsie, send `g!ping` in chat to check my ping.." };
    const newMsg = await invokeParams.msg.reply({
      content: "🧮 Calculating ping...",
    });
    const botLatency =
      newMsg.createdTimestamp - invokeParams.msg.createdTimestamp;
    await newMsg.delete();
    return { content: `The ping was found to be ${botLatency} ms` };
  },
};
