const {db} = require('./chatPoints.js');
const levels = require('./levelScore.json');

function levelCheck(totalScore, msg, score) {

	const rounded = Math.floor(totalScore / 10) * 10

	const newLevel = levels[rounded]

	if (newLevel != undefined) {

		msg.reply(`You reached Level ${newLevel}<a:party:873867784608681994>`)
		const scoreRounded = Math.floor(score / 10) * 10
		return scoreRounded + 10

	} else return score
}

function updateScore(msg) {
	collection = db.collection('Level');

	collection.findOne({id: msg.author.id})
	.then(data => {
		if (data != undefined) {
			let score = Math.floor(Math.random() * 7)
			const points = levelCheck(data.score + score, msg, score)
			collection.updateOne({id: msg.author.id}, {$inc: {score: points}})
		} else {
			newUserObject = {
				id: msg.author.id,
				name: msg.author.username,
				score: 2
			}

			collection.insertOne(newUserObject)
		}
	})
}

module.exports = {
	updateLevel: updateScore
}