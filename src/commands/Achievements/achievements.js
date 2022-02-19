import {singleFind} from '../../helpers/dbCrud.js';
import achievementList from '../../achievements/achievementList.js';
import discord from 'discord.js';

export default {
	name: 'achievements',
	description: 'Showcases the achievements earned by the author',
	alias: ['achievement', 'award', 'awards'],
	options: [],

	async run(msg, args, author = msg.author, isInteraction = false) {
		const res = await singleFind('Level', {id: author.id})

		const achievementIndexes = res.achievements
		const achievements = []

		if (achievementIndexes.length == 0) {
			achievements.push({name: 'No Achivements Earned', value: 'Why not hunt down some sweet achievements ¯\\_(ツ)_/¯'})
		} else {
			for (let index of achievementIndexes) {
				achievements.push(achievementList[index])
			}
		}
		const achievementEmbed = new discord.MessageEmbed()
			.setTitle('<:achievement:939468591395377213> Unlocked Achivements')
			.addFields(achievements)
			.setColor('#00ffff')
			.setFooter({text: `Found ${achievementIndexes.length} out of ${Object.keys(achievementList).length} achievements`})

		return ({embeds: [achievementEmbed]})

	}
}
