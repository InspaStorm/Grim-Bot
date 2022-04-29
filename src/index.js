import 'dotenv/config';
import { Client, Intents, Collection } from 'discord.js';
import {startAsDevolopment, startAsProduction} from './startup/botLauncher.js';
import { createSpinner } from 'nanospinner';


export const client = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS]});
global.locks = new Collection();

const isDevolopment = process.env.isDevolopment
const startingBot = createSpinner('Starting the bot...');
(isDevolopment) ? startAsDevolopment(client, process.env.botToken, startingBot) : startAsProduction(client, process.env.botToken);

import {logger} from'./helpers/logger.js';
import chalk from 'chalk';
import { handleInteraction } from './handlers/onInteraction.js';
import { handleMessage } from './handlers/onMessage.js'

client.once('ready', () => {
	client.user.setPresence({
    	activities: [{
			name: 'InspArmy | g!help',
			type: 'WATCHING'
		}],
    	status: 'idle'
	});
	if (isDevolopment) {
		startingBot.success({text: chalk.yellow.bold(`${client.user.tag} logged on!`), mark: '🎉'})
	} else {
		console.log(chalk.yellow.bold(`🎉  ${client.user.tag} logged on!`))
	}
});

client.on('error', e => logger(e))
process.on('uncaughtException', e => logger(e));


// Slash commands handler
client.on('interactionCreate', interaction => {
	handleInteraction(interaction);
})

// Event triggered on getting a message from any channel of guild
client.on('messageCreate', async msg => {
	handleMessage(msg);
});
