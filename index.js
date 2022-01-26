
console.log('Index file started running...')

import config from './config.js'
import fs from 'fs';

let devolopment = false;
let token;

if (fs.existsSync('./.dev')) {
	devolopment = true
}

if (devolopment) {
	token = config.test_key
} else {
	token = config.main_key
}

import discord from 'discord.js';
import {updatePoint} from'./src/misc/chatPoints.js';
import {startDb} from'./src/misc/initializer.js';
import {updateLevel} from'./src/misc/levels.js';
import {initAchievement, lookForAchievement} from'./src/misc/achievementCheck.js';
import achievementList from './src/helpers/achievementList.js';
import {cmdLoader} from'./src/commands/Misc/help.js';
import {updateLeader} from'./src/misc/leaderboard.js';
import {logger} from'./src/helpers/logger.js';
import { playRadio } from'./src/misc/radio.js';
import {replier, sender} from'./src/helpers/apiResolver.js';
import { replyHm } from'./src/helpers/hmmReplier.js'

const prefix = config.prefix;
const client = new discord.Client({intents: [discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_VOICE_STATES, discord.Intents.FLAGS.GUILDS]});

client.commands = new discord.Collection();
cmdLoader(client.commands);
var lockAchievements;

client.once('ready', () => {

	client.user.setPresence({
    	activities: [{
			name: 'Grim Town | g!help'
		}],
    	status: 'idle'
	});
	console.log(`${client.user.tag} logged on!`)

	if (!devolopment)	{ playRadio(client) }
});

client.on('error', e => logger(e))
process.on('uncaughtException', e => logger(e));

// Checks if user has completed all achievements if not looks for if he completed any achievements
function lookingAchievements(msg, author, lockAchievements) {
	try {
		const achievements = lockAchievements.get(author.id)
		if (achievements == undefined || achievements.achievements.length != achievementList.length) {
			lookForAchievement(msg, author, lockAchievements)
			.then(res => {
				if (res == 'Achievement Found') initAchievement()
			})
		}
	} catch (err) {
		 console.log('error: ', err)
	}
}


function executeCommand(commandName, msg, args, author, isInteraction = false) {
	if (client.commands.has(commandName)) {
		try {
			client.commands.get(commandName).run(msg, args, author, isInteraction)
			.then(content => {
				replier(msg, content)
			})
		} catch (err) {
			console.log(`Something went wrong executing command: ${err}`)
		}
	}
}

client.on('interactionCreate', interaction => {

	if (!interaction.isCommand()) return;

	const args = interaction.options
	executeCommand(interaction.commandName, interaction, args, interaction.user, true)

})

const levelEnabledGuild = ['802904126312808498', '869218454127923220',]

client.on('messageCreate', msg => {
	const lowerCasedMsg = msg.content.toLowerCase()

	if(msg.author.bot) return;

	lookingAchievements(msg, msg.author, lockAchievements)

	if (levelEnabledGuild.includes(msg.guild.id)){
		updateLevel(msg);
	}

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
});

startDb()
.then(() => {
	lockAchievements = initAchievement();
	client.login(token)
	.then(() => {
		if (client.user.id == '796625057391837185') updateLeader(client)
	})
})
