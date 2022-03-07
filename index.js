import discord from 'discord.js';
import {startAsDevolopment, startAsProduction} from './src/startup/botLauncher.js';
import config from './config.js'
import fs from 'fs';
import { createSpinner } from 'nanospinner';

const client = new discord.Client({intents: [discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_VOICE_STATES, discord.Intents.FLAGS.GUILDS]});
client.commands = new discord.Collection();
client.locks = new discord.Collection();

let devolopment = false;
if (fs.existsSync('./.dev')) devolopment = true

const token = (devolopment) ? config.test_key:config.main_key

const startingBot = createSpinner('Starting the bot...');

global.cmdManager = (devolopment) ? await startAsDevolopment(client, token, startingBot) : await startAsProduction(client, token);

import {updateLevel} from'./src/level/updateLevelScore.js';
import { lookForAchievement} from'./src/achievements/achievementCheck.js';
import achievementList from './src/achievements/achievementList.js';
import {logger} from'./src/helpers/logger.js';
import {replier, sender, followUp} from'./src/helpers/apiResolver.js';
import { replyHm } from'./src/THC/thcReplier.js'
import chalk from 'chalk';


const prefix = config.prefix;

client.once('ready', () => {
	client.user.setPresence({
    	activities: [{
			name: 'InspArmy | g!help',
			type: 'WATCHING'
		}],
    	status: 'idle'
	});
	if (devolopment) {
		startingBot.success({text: chalk.yellow.bold(`${client.user.tag} logged on!`), mark: '🎉'})
	} else {
		console.log(chalk.yellow.bold(`🎉  ${client.user.tag} logged on!`))
	}
});

client.on('error', e => logger(e))
process.on('uncaughtException', e => logger(e));

// Checks if user has completed all achievements if not looks for if he completed any achievements
function lookingAchievements(msg, author) {
	try {
		const userData = client.locks.get('achievement').find(user => {return user.id == author.id})
		if (userData == undefined || userData.achievements.length != achievementList.length) {
			lookForAchievement(msg, author, userData)
		}
	} catch (err) {
		 console.log('error: ', err)
	}
}

// Executes the commands
async function executeCommand(commandName, msg, args, author, isInteraction = false) {
	if (cmdManager.availableCommands.includes(commandName)) {
		try {

			if(!isInteraction) msg.channel.sendTyping();
			
			const ans = await cmdManager.runCmd(commandName, msg, args, author, isInteraction)
			if (ans.hasOwnProperty('followUp')) {
				const reply = ans.followUp
				delete ans.followUp;
				await followUp(reply, ans, isInteraction);
			} else {
				await replier(msg, ans)
			}
		} catch (err) {
			console.log(`Something went wrong executing command: ${err}`)
		}
	}
}

async function handleFollowUp(interaction, name) {
	const ans = await cmdManager.handle(name, interaction)
}

// Slash commands handler
client.on('interactionCreate', interaction => {
	if (interaction.isCommand()) {
		const args = interaction.options
		executeCommand(interaction.commandName, interaction, args, interaction.user, true)
	} else if (interaction.isSelectMenu()) {
		handleFollowUp(interaction, interaction.customId)
	} else if (interaction.isButton()) {
		handleFollowUp(interaction, interaction.customId.split(" ")[0])
	} else return;
})

// Event triggered on getting a message from any channel of guild
client.on('messageCreate', async msg => {
	const lowerCasedMsg = msg.content.toLowerCase()

	if(msg.author.bot) return;
	if (client.locks.get('level').includes(msg.guild.id)) await updateLevel(msg);
	lookingAchievements(msg, msg.author)


	if (lowerCasedMsg.startsWith(prefix)) {
		const commandName = lowerCasedMsg.split(" ")[0].substr(2);
		const args = lowerCasedMsg.split(" ");
		args.shift();

		executeCommand(commandName, msg, args, msg.author);
	}


	if (lowerCasedMsg.startsWith('hm')) {
		const res = replyHm(lowerCasedMsg, msg.author)
		msg.channel.send(res)
	}

	if (msg.mentions.has(client.user) && !msg.mentions.everyone) executeCommand('help', msg, [], msg.author);
});
