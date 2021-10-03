const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config.js');
const fs = require('fs');
const path = require('path');
const {cmdLoader} = require('./commands/Misc/help.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = [];

function builder (name, desc, options) {
	const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription(desc)
	console.log(options)
	if (options != undefined) {
		
		for (let entry of options)
		{
			console.log(entry.name, data)
			data.addStringOption(option => 
				option.setName(entry.name)
					.setDescription(entry.desc)
					.setRequired(entry.required)
			)
		}
	}
	
	console.log(data)
	return data
}

const commandFiles = fs.readdirSync('./commands');

for (const folder of commandFiles) {

	const commandFolders = fs.readdirSync(`./commands/${folder}`)

	for (const file of commandFolders) {

		if (path.extname(`./commands/${folder}/${file}`) == '.js') {

			const command = require(`./commands/${folder}/${file}`)

			commands.push(builder(command.name,command.description, command.options).toJSON())
		}
	}
}


// Place your client and guild ids here
const clientId = '796625057391837185';
const guildId = '868781907666677810';

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
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
})();