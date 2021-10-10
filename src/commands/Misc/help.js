const path = require('path');
const fs = require('fs');
const discord = require('discord.js');

const commandFiles = fs.readdirSync('./commands');

// Loading all the commands and Setting up all things for help command

let allCommands;

function loadCmds(collection) {
	let i = -1;
	let commandsInfo = [];
	for (const folder of commandFiles) {

		const commandFolders = fs.readdirSync(`./commands/${folder}`)
		i ++

		for (const file of commandFolders) {

			if (path.extname(`./commands/${folder}/${file}`) == '.js') {

				const command = require(`../../commands/${folder}/${file}`)

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
	commandsInfo.push({
		name: `Music`,
		value: `\n\`Play:\`\nPlays The specified music\n\n\`Playlist:\`\nPlays The specified playlist's musics\n\n\`skip:\`\nSkips The currently playing music\n\n\`Leave:\`\nLeaves The author's VC\n`
	})
	allCommands = commandsInfo;
	return collection
}

module.exports = {
	name: 'help',
	description: 'The complete guide for all commands available on beloved Grim Bot :p',

	async run(msg,args) {
		const file = new discord.MessageAttachment('./pics/embed/help.png')
		const helpEmbed = new discord.MessageEmbed()
		    .setColor('#00ffff')
		    .setTitle('Commands')
		    .setDescription('You can see the commands of GRIM BOT here')
		    .addFields(allCommands)
		    .setImage('attachment://help.png')
		    .setFooter('Developed by the InspaStorm Team @DeadlineBoss & @Ranger');
		
		return ({embeds: [helpEmbed], files: [file]});
	},
	cmdLoader: loadCmds
}