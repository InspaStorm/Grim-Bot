const discord = require('discord.js')
const {db} = require('./chatPoints.js');
const achievementList = require('../commands/achievements/achievementList.json')

const collection = db.collection('Level')

let lockAchievements = new Map();

function initAchievementCheck() {
	lockAchievements.clear()

	collection.find({}).toArray()
	.then( data => {
		for (user of data) {

			if (user.achievements.length > 0) {
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

function lookForAchievement(msg, user, lockAchievements) {

	const achievements = lockAchievements.get(user.id)

	if (achievements == undefined || !achievements.achievements.includes(0)){
		if (msg.guild.id == 802904126312808498) {
  			const officalServerMsgEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Achivement Unlocked')
          		.addFields(achievementList[0])

      		msg.channel.send(officalServerMsgEmbed)
			collection.updateOne({id: user.id}, {$push: {achievements: 0}})
			initAchievementCheck()
		}
	}

	if (achievements == undefined || !achievements.achievements.includes(1)){
		if (msg.content.toLowerCase().startsWith('hm')) {
  			const officalServerMsgEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Achivement Unlocked')
          		.addFields(achievementList[1])

      		msg.channel.send(officalServerMsgEmbed)
			collection.updateOne({id: user.id}, {$push: {achievements: 1}})
			initAchievementCheck()

		}
	}

}

module.exports = {
	initAchievement: initAchievementCheck,
	lookForAchievement: lookForAchievement
}

