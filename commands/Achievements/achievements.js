const {db} = require('../../misc/chatPoints.js')
const achievementList = require('./achievementList.json')

module.exports = {
	name: 'achievements',
	description: 'Showcases the achievements earned by the author',

	run(msg, args) {
		db.findOne({id: msg.author.id})
		.then(res => {

			const achievementIndexes = res.achievements

			const achievements = []

			for (let index of achievementIndexes) {
				achievements.push(achievementList[index])
			}

			const achievementEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Achivements Unlocked')
			    .setFields(achievements)

		    msg.channel.send(achievementEmbed)

		})
	}
}