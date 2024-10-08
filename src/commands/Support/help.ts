import {
  ActionRowBuilder,
  AttachmentBuilder,
  StringSelectMenuInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { getCmdDetails } from "../../startup/command-loading/prepareCmdInfo.js";

const devs = [
  "599489300672806913",
  "681766482803163147",
  "520625717885534228",
  "660785366110044210",
  "760954344421195867",
];

let userCommands;
let staffCommands;
let categoryDetails;

function prepareMainEmbed(msg, isStaff = false) {
  let commandsList;
  let embedPic;
  let file;

  if (isStaff) {
    commandsList = staffCommands;
    file = new AttachmentBuilder("./src/images/embed/staff_help.png");
    embedPic = "attachment://staff_help.png";
  } else {
    commandsList = userCommands;
    file = new AttachmentBuilder("./src/images/embed/help.png");
    embedPic = "attachment://help.png";
  }

  const helpEmbed = new EmbedBuilder()
    .setColor("#00ffff")
    .setTitle("Command Support")
    .setDescription(
      `command format: \`/<command> <options>\`
					Eg: \`/help\``
    )
    .addFields(commandsList)
    .setImage(embedPic)
    .setFooter({
      text: "Developed by the InspaStorm Team @DeadlineBoss & @Ranger",
    });

  return { embeds: [helpEmbed], files: [file] };
}

function prepareCategoryEmbed(categoryName: string) {
  const category = categoryDetails.get(categoryName);
  const helpEmbed = new EmbedBuilder()
    .setColor("#00ffff")
    .setTitle(category.label)
    .setDescription(category.detail)
    .addFields([{name: "\u200b", value: category.cmdInfo}]);
  return helpEmbed;
}

export default {
  name: "help",
  description: "The complete guide for all commands made available by Mr. Grim",
  alias: ["h"],

  /**
   *
   * @param {Message} msg message
   * @param {String[]} args array of args
   * @param {GuildMember} author author of the message
   * @param {Boolean} isInteraction whether the message is from interaction or not
   */
  async run(invokeParams) {
    if (typeof userCommands == "undefined") {
      const cmdDetails = getCmdDetails();

      userCommands = cmdDetails.userCommands;
      staffCommands = cmdDetails.staffCommands;
      categoryDetails = cmdDetails.categoryDetails;
    }
    const menuEntries: {label: string, description: string, value: string}[]  = [];

    categoryDetails.forEach((value) => {
      const format = {
        label: value.label,
        description: value.description,
        value: value.value,
      };
      menuEntries.push(format);
    });

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("help")
        .setPlaceholder("No category selected")
        .addOptions(menuEntries)
    );

    const helpEmbed: {embeds: EmbedBuilder[], files: AttachmentBuilder[], components?: ActionRowBuilder[]} = devs.includes(invokeParams.author.id)
      ? await prepareMainEmbed(invokeParams.msg, true)
      : await prepareMainEmbed(invokeParams.msg, false);
    helpEmbed.components! = [row];
    return helpEmbed;
  },

  async handle(msg: StringSelectMenuInteraction) {
    if (typeof userCommands == "undefined") {
      const cmdDetails = getCmdDetails();

      userCommands = cmdDetails.userCommands;
      staffCommands = cmdDetails.staffCommands;
      categoryDetails = cmdDetails.categoryDetails;
    }
    
    const embed = prepareCategoryEmbed(msg.values[0]);
    msg.update({ embeds: [embed], files: [] });
    setTimeout(async () => {
      const toBeUpdated = await msg.fetchReply();
      toBeUpdated.edit({ components: [] });
    }, 15000);
  },
};
