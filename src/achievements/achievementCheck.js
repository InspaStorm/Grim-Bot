import discord from 'discord.js'
import {db} from '../startup/database.js';
import achievementList from './achievementList.js';
import {replier} from '../helpers/apiResolver.js'
import {lockAchievements} from '../startup/featureLocks.js'

const collection = db.collection('level')

let resolvingFoundAchievement = new Map();

export async function lookForAchievement(msg, user, userData) {

	async function makeEmbed(index, userID, userAchievements) {
		resolvingFoundAchievement.set(userID, index);
		let amountOfUnlockedAwards
		if (typeof amountOfUnlockedAwards != 'undefined') {
			userAchievements.achievements.length + 1
		} else amountOfUnlockedAwards = 1
		const unlockedEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('<:achievement:939468591395377213> Achivement Unlocked')
          		.addFields(achievementList[index])
				.setFooter({text: `Found ${amountOfUnlockedAwards} out of ${Object.keys(achievementList).length} achievements`})

		await collection.updateOne({id: userID}, {$addToSet: {achievements: index}})
		replier(msg, {embeds:[unlockedEmbed]})
		await lockAchievements(msg.client)
	}

	if (userData == undefined || !userData.achievements.includes(0)){
		if (msg.guild.id == 802904126312808498) {
			await makeEmbed(0, user.id, userData)
			return 'Achievement Found'
		}
	} else return 'None Found'

	if (userData == undefined || !userData.achievements.includes(1)){
		if (msg.content.toLowerCase().startsWith('hm')) {
  			await makeEmbed(1, user.id, userData)
  			return 'Achievement Found'
		}
	} else return 'None Found'

}
