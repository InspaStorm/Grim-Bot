const {db} = require('../../misc/initializer.js')
const achievementList = require('./achievementList.json')
const discord = require('discord.js')

const collection = db.collection('Level')
module.exports = {
	name: 'achievements',
	description: 'Showcases the achievements earned by the author',

	async run(msg, args, author = msg.author, isInteraction = false) {
		const res = collection.findOne({id: author.id})

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
			.setTitle('Achivements Unlocked')
			.addFields(achievements)
			.setColor('#00ffff')

		return ({embeds: [achievementEmbed]})

	}
}