import { executeCommand } from './commandRunner.js';
import { updateLevel } from '../commandHelpers/level/updateLevelScore.js'
import { replyHm } from '../commandHelpers/THC/thcReplier.js';
import {prefix} from '../../config.js';

import { lookForAchievement } from'../commandHelpers/achievements/achievementCheck.js';
import achievementList from '../commandHelpers/achievements/achievementList.js';

// Checks if user has completed all achievements if not looks for if he completed any achievements
function lookingAchievements(msg, author) {
	try {
		const userData = global.locks.get('achievement').find(user => {return user.id == author.id})
		if (userData == undefined || userData.achievements.length != achievementList.length) {
			lookForAchievement(msg, author, userData)
		}
	} catch (err) {
		 console.log('error: ', err)
	}
}

export async function handleMessage(msg) {
    const lowerCasedMsg = msg.content.toLowerCase()

	if(msg.author.bot) return;
	if (global.locks.get('level').includes(msg.guild.id)) await updateLevel(msg);
	lookingAchievements(msg, msg.author)


	if (lowerCasedMsg.startsWith(prefix)) {
		const commandName = lowerCasedMsg.split(" ")[0].substr(2);

		if (commandName == 'ping') {
			const args = lowerCasedMsg.split(" ");
			args.shift();
	
			executeCommand(commandName, msg, args, msg.author);

			return;
		}

		msg.reply("Type `/` and then select the command!\n**Got stuck? Read:**\nhttps://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ")
	}


	if (lowerCasedMsg.startsWith('hm')) {
		const res = replyHm(lowerCasedMsg, msg.author)
		msg.channel.send(res)
	}

	if (msg.mentions.has(msg.client.user) && !msg.mentions.everyone && !msg.mentions.repliedUser) msg.reply({content: `My prefix is **${prefix}**\nRefer **${prefix}help** for additional help =)`})
}