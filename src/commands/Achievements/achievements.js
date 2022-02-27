import {singleFind} from '../../helpers/dbCrud.js';
import achievementList from '../../achievements/achievementList.js';
import discord from 'discord.js';
import {inputMemberCheck} from '../../helpers/member.js';

async function makeAwardEmbed(user){
	const res = await singleFind('Level', {id: user.id})

	const achievementIndexes = res?.achievements || []
	const achievements = []

	if (achievementIndexes.length == 0) {
		achievements.push({name: 'No achievement Earned', value: 'Why not hunt down some sweet achievement ¯\\_(ツ)_/¯'})
	} else {
		for (let index of achievementIndexes) {
			achievements.push(achievementList[index])
		}
	}
	const achievementEmbed = new discord.MessageEmbed()
	.setTitle('<:achievement:939468591395377213> Unlocked achievement(s)')
	.setDescription(user.username)
	.addFields(achievements)
	.setColor('#00ffff')
	.setFooter({text: `Found ${achievementIndexes.length} out of ${Object.keys(achievementList).length} achievements`})

	return achievementEmbed
}

export default {
	name: 'achievements',
	description: 'Showcases the achievements earned by the author',
	alias: ['achievement', 'award', 'awards'],
	options: [],

	async run(msg, args, author = msg.author, isInteraction = false) {
		let user = await inputMemberCheck(msg, author, args, isInteraction)

		if (typeof user == 'string') return {content: user};

		const achievementEmbed = await makeAwardEmbed(user);
		return ({embeds: [achievementEmbed]})

	}
}
