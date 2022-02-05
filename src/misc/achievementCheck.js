import discord from 'discord.js'
import {db} from '../startup/database.js';
import achievementList from '../helpers/achievementList.js';

const collection = db.collection('Level')

let lockAchievements = new Map();
let resolvingFoundAchievement = new Map();

export function initAchievement() {
	lockAchievements.clear()

	collection.find({}).toArray()
	.then( data => {
		let user;
		for (user of data) {

			if (user.achievements.length > 0) {
				let achievement;
				for (achievement of user.achievements) {
					var userAchievement = {achievements: []}

					userAchievement.achievements.push(achievement)
					lockAchievements.set(user.id, userAchievement)

				}
			}
		}
	})
	return lockAchievements
}

export async function lookForAchievement(msg, user, lockAchievements) {

	const achievements = lockAchievements.get(user.id)

	async function makeEmbed(index, userID) {
		resolvingFoundAchievement.set(userID, index)
		const unlockedEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Achivement Unlocked')
          		.addFields(achievementList[index])

		await collection.updateOne({id: userID}, {$addToSet: {achievements: index}})
  		return (unlockedEmbed)
	}

	if (achievements == undefined || !achievements.achievements.includes(0)){
		if (msg.guild.id == 802904126312808498) {
			await makeEmbed(0, user.id)
			return 'Achievement Found'
		}
	} else return 'Non Found'

	if (achievements == undefined || !achievements.achievements.includes(1)){
		if (msg.content.toLowerCase().startsWith('hm')) {
  			await makeEmbed(1, user.id)
  			return 'Achievement Found'
		}
	} else return 'Non Found'

}
