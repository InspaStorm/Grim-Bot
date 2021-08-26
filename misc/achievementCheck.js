const discord = require('discord.js')
const {db} = require('./initializer.js');
const achievementList = require('../commands/Achievements/achievementList.json')

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

	function makeEmbed(index, userID) {
		const unlockedEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Achivement Unlocked')
          		.addFields(achievementList[index])

  		msg.channel.send(unlockedEmbed)
		collection.updateOne({id: userID}, {$addToSet: {achievements: index}})		
	}

	if (achievements == undefined || !achievements.achievements.includes(0)){
		if (msg.guild.id == 802904126312808498) {
			makeEmbed(0, user.id)
			return 'Achievement Found'
		}
	} else return 'Non Found'

	if (achievements == undefined || !achievements.achievements.includes(1)){
		if (msg.content.toLowerCase().startsWith('hm')) {
  			makeEmbed(1, user.id)
  			return 'Achievement Found'
		}
	} else return 'Non Found'

}

module.exports = {
	initAchievement: initAchievementCheck,
	lookForAchievement: lookForAchievement
}

