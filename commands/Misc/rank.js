const {db} = require('../../misc/chatPoints.js');
const level = require('../../misc/levelScore.json')

module.exports = {
	name: 'rank',
	description: 'Shows the chatting xp of the author',

	run(msg, args) {
		const collection = db.collection('Level')

		collection.findOne({id: msg.author.id})
		.then(data => {
			const arrayOfScores = Object.keys(level)
			const CurrentLevelScore = arrayOfScores.find(x => x > data.score)
			const CurrentLevel = level[CurrentLevelScore] - 1

			msg.channel.send(`Your Level: **Level ${CurrentLevel}**\nScore: **${data.score}**`)
			
		})
	}
}