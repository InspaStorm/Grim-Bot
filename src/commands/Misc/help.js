import path from 'path';
import fs from 'fs';
import discord from 'discord.js';
import { fileURLToPath } from 'url';

// Specify the paths Commands folder from this file
const __filename = fileURLToPath(import.meta.url);
const pathToCmds = `${path.dirname(__filename)}/..`
const commandFiles = fs.readdirSync(pathToCmds);

// Loading all the commands and Setting up all things for help command

let allCommands;

export async function cmdLoader(collection) {
	let i = -1;
	let commandsInfo = [];
	for (const folder of commandFiles) {

		const commandFolders = fs.readdirSync(`${pathToCmds}/${folder}`)
		i ++

		for (const file of commandFolders) {

			if (path.extname(file) == '.js') {

				let obj = await import(`${pathToCmds}/${folder}/${file}`)
				let command = obj.default
				collection.set(command.name,command)
				// Setting up help commmand dynamically
				if (Object.values(commandsInfo).some(r => r.name == folder)) {
					commandsInfo[i].value += `\n\`${command.name}:\`\n${command.description}\n`
				} else {
					const newCmdObjects = {
						name: `${folder}`,
						value: `\n\`${command.name}:\`\n${command.description}\n`
					}
					commandsInfo.push(newCmdObjects)
				}
			}
		}
	}
	allCommands = commandsInfo;
	return collection
}

export default {
	name: 'help',
	description: 'The complete guide for all commands made available by Mr. Grim',

	async run(msg,args) {
		const file = new discord.MessageAttachment('./src/pics/embed/help.png')
		const helpEmbed = new discord.MessageEmbed()
		    .setColor('#00ffff')
		    .setTitle('Commands')
		    .setDescription('You can see the commands of Mr. Grim here')
		    .addFields(allCommands)
		    .setImage('attachment://help.png')
		    .setFooter({text: 'Developed by the InspaStorm Team @DeadlineBoss & @Ranger'});

		return ({embeds: [helpEmbed], files: [file]});
	}
}
