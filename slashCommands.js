const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config.json');
const fs = require('fs');
const {cmdLoader} = require('./commands/Misc/help.js');

const commands = [];

const commandFiles = fs.readdirSync('./commands');

for (const folder of commandFiles) {

	const commandFolders = fs.readdirSync(`./commands/${folder}`)

	for (const file of commandFolders) {

		if (path.extname(`./commands/${folder}/${file}`) == '.js') {

			const command = require(`../../commands/${folder}/${file}`)

			commands.push(JSON.stringify({new }))
		}
	}
}


// Place your client and guild ids here
const clientId = '770317955245277225';
const guildId = '868781907666677810';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
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
})();