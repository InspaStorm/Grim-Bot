import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

export default {
  name: "invite",
  description: "Invite links for the bot and support server",
  alias: [],

  /**
   *
   * @param {Message} msg message
   * @param {String[]} args array of args
   * @param {GuildMember} author author of the message
   * @param {Boolean} isInteraction whether the message is from interaction or not
   */
  async run(invokeParams) {
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL("https://discord.gg/27qtUTyHhs")
        .setLabel("Join InspaStorm (support Server)")
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL(
          "https://discord.com/api/oauth2/authorize?client_id=796625057391837185&permissions=137442479168&scope=bot%20applications.commands"
        )
        .setLabel("Invite Grim Bot")
        .setStyle(ButtonStyle.Link)
    );
    const serverLink = new EmbedBuilder()
      .setColor("#00ffff")
      .setTitle("Thanks for supporting us")
      .setDescription(
        "Links for inviting the bot as well as for support server"
      )
      .addFields(
        {
          name: "Support Server",
          value:
            "This bot is devoloped as a part of a game studio - `InspaStorm`\nWe are mostly working on 2D games (it might change)",
        },
        {
          name: "Invite Grim Bot",
          value:
            "Grim bot is a unique entertainment bot, Which gets regular updates\nFor any suggestions join the support server and lets us know",
        }
      );

    return { embeds: [serverLink], components: [button] };
  },
};
