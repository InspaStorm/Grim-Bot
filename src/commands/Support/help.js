import discord, { MessageActionRow, MessageSelectMenu } from 'discord.js';
import { getCmdDetails } from '../../helpers/prepareCmdInfo.js'
import config from '../../../config.js'

const prefix = config.prefix
const devs = ['599489300672806913', '681766482803163147', '520625717885534228', '660785366110044210', '760954344421195867']

let userCommands;
let staffCommands;
let categoryDetails;

function prepareMainEmbed(msg, isStaff = false) {
	let commandsList;
	let embedPic;
	let file;

	if (isStaff) {
		commandsList = staffCommands
		file = new discord.MessageAttachment('./src/pics/embed/staff_help.png')
		embedPic = 'attachment://staff_help.png'
	} else {
		commandsList = userCommands
		file = new discord.MessageAttachment('./src/pics/embed/help.png')
		embedPic = 'attachment://help.png'
	}

	const helpEmbed = new discord.MessageEmbed()
		.setColor('#00ffff')
		.setTitle('Command Support')
		.setDescription(`My prefix is **${prefix}**
				Command format: \`${prefix}<command> <options>\`
					Eg: \`${prefix}help\``)
		.addFields(commandsList)
		.setImage(embedPic)
		.setFooter({text: 'Developed by the InspaStorm Team @DeadlineBoss & @Ranger'});

	return {embeds: [helpEmbed], files: [file]};
}

function prepareCategoryEmbed(categoryName) {
	const category = categoryDetails.get(categoryName)
	const helpEmbed = new discord.MessageEmbed()
		.setColor('#00ffff')
		.setTitle(category.label)
		.setDescription(category.detail)
		.addField('\u200b',category.cmdInfo)
	return helpEmbed
}

export default {
	name: 'help',
	description: 'The complete guide for all commands made available by Mr. Grim',
	alias: ['h'],

	async run(msg,args, author, isInteraction) {
		if (typeof userCommands == 'undefined') {
			const cmdDetails = getCmdDetails()

			userCommands = cmdDetails.userCommands
			staffCommands = cmdDetails.staffCommands
			categoryDetails = cmdDetails.categoryDetails
		}
		const menuEntries = [];

		categoryDetails.forEach(value => {
			const format = {
				label: value.label, description: value.description, value: value.value
			}
			menuEntries.push(format)
		});

		const row = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
			.setCustomId('help')
			.setPlaceholder('No category selected')
			.addOptions(menuEntries)
		);

		const helpEmbed = (devs.includes(author.id)) ? await prepareMainEmbed(msg, true): await prepareMainEmbed(msg, false)
		helpEmbed.components = [row]
		return helpEmbed
	},

	async handle(msg) {
		if (typeof userCommands == 'undefined') {
			const cmdDetails = getCmdDetails()

			userCommands = cmdDetails.userCommands
			staffCommands = cmdDetails.staffCommands
			categoryDetails = cmdDetails.categoryDetails
		}
		const embed = prepareCategoryEmbed(msg.values[0])
		msg.update({embeds: [embed], files: []})
		setTimeout(async () => {
			const toBeUpdated = await msg.fetchReply()
			toBeUpdated.edit({components: []})
		}, 15000);
	}
}
