import discord from 'discord.js';
import { getCmdDetails } from '../../startup/commandLoader.js'

const devs = ['599489300672806913', '681766482803163147', '520625717885534228', '660785366110044210', '760954344421195867']

let userCommands;
let staffCommands;

export default {
	name: 'help',
	description: 'The complete guide for all commands made available by Mr. Grim',

	async run(msg,args, author, isInteraction) {

		if (typeof userCommands == 'undefined') {
			const cmdDetails = getCmdDetails()

			userCommands = cmdDetails.userCommands
			staffCommands = cmdDetails.staffCommands
		}

		if (devs.includes(author.id)) {
			const file = new discord.MessageAttachment('./src/pics/embed/staff_help.png')
			const helpEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Commands')
			    .setDescription('You can see the all commands of Mr. Grim here (Including staff commands)')
			    .addFields(staffCommands)
			    .setImage('attachment://staff_help.png')
			    .setFooter({text: 'Developed by the InspaStorm Team @DeadlineBoss & @Ranger'});

			return ({embeds: [helpEmbed], files: [file]});
		} else {
			const file = new discord.MessageAttachment('./src/pics/embed/help.png')
			const helpEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Commands')
			    .setDescription('You can see the commands of Mr. Grim here')
			    .addFields(userCommands)
			    .setImage('attachment://help.png')
			    .setFooter({text: 'Developed by the InspaStorm Team @DeadlineBoss & @Ranger'});

			return ({embeds: [helpEmbed], files: [file]});
		}
	}
}
