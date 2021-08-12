const {db} = require('./chatPoints.js');
const achievementList = require('../commands/achievements/achievementList.json')

const collection = db.collection('Level')

async function initAchievementCheck(lockAchievements) {
	lockAchievements.clear()

	collection.find({}).toArray()
	.then( data => {
		for (user of data) {
			if (user.achievements.length > 0) {
				for (achievement of user.achievements) {
					var userAchievement = {id: user.id, achievements: []}

					userAchievement.achievements.push(achievement)
				}
			}
		}
	})
}

function lookForAchievement(msg, user, lockAchievements) {
	if (!lockAchievements.has(0)) {
		if (msg.guild.id == 802904126312808498) {
  			const officalServerMsgEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Achivement Unlocked')
          		.addFields(achievementList[0])

      		msg.channel.send(officalServerMsgEmbed)
			collection.updateOne({id: user.id}, {$push: {achievements: 0}})
			initAchievementCheck(user, lockAchievements)
		}

	} else if (!lockAchievements.has(1)) {

		if (msg.content.toLowerCase().startsWith('hm')) {
  			const officalServerMsgEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Achivement Unlocked')
          		.addFields(achievementList[1])

      		msg.channel.send(officalServerMsgEmbed)
			collection.updateOne({id: user.id}, {$push: {achievements: 1}})
			initAchievementCheck(user, lockAchievements)

		}
	}
}

module.exports = {
	initAchievement: initAchievementCheck,
	lookForAchievement: lookForAchievement
}

