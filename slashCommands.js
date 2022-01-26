const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { test_key } = require('./config.js');
const fs = require('fs');
const path = require('path');
const {cmdLoader} = require('./src/commands/Misc/help.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const input = require('readline')

const commands = [];

function builder (name, desc, options) {
	const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription(desc)
	console.log(options)
	if (options != undefined) {

		for (let entry of options)
		{
			if (entry.type == 'user') {
				data.addUserOption(option =>
					option.setName(entry.name)
						.setDescription(entry.desc)
						.setRequired(entry.required)
				)
			} else if (entry.type == 'string') {
				data.addStringOption(option =>
					option.setName(entry.name)
						.setDescription(entry.desc)
						.setRequired(entry.required)
				)
			}
		}
	}

	console.log(data)
	return data
}

const commandFiles = fs.readdirSync('./src/commands');

for (const folder of commandFiles) {

	const commandFolders = fs.readdirSync(`./src/commands/${folder}`)

	for (const file of commandFolders) {

		if (path.extname(`./src/commands/${folder}/${file}`) == '.js') {

			const command = require(`./src/commands/${folder}/${file}`)

		}
	}
}


// Place your client and guild ids here
const clientId = '796625057391837185';
const guildId = '868781907666677810';

async function regCmd(global) {
	if (global)	{
		try {
			console.log('Started refreshing application (/) commands.');

			await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);

			console.log('Successfully reloaded application (/) commands.');
		} catch (error) {
			console.error(error);
		}
	} else {
		{
			try {
				console.log('Started refreshing application (/) commands.');

				await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: commands },
				);

				console.log('Successfully reloaded application (/) commands.');
			} catch (error) {
				console.error(error);
			}
		}
	}
}
const rest = new REST({ version: '9' }).setToken(test_key);

input.question('Is it global (/) command?\n[ Y-Yes / N-No ]: ', ans => {
	if (ans == 'y' || ans == 'Y') {
		regCmd(true)
	} else if (ans == 'n' || ans == 'N') {
		regCmd(false)
	} else {
		console.log(`Process failed:\n\t${ans} is not a valid option\n\tValid option: y or Y for Yes and n or N for No`)
	}
})
