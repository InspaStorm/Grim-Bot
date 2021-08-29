const {db} = require('./initializer.js');
const levels = require('./levelScore.json');

const recentMsg = new Set();


function levelCheck(totalScore, msg, score) {

	const rounded = Math.floor(totalScore / 10) * 10

	const newLevel = levels[rounded]

	if (newLevel != undefined) {

		const scoreRounded = Math.floor(score / 10) * 10
		msg.reply(`You reached Level ${newLevel}<a:party:873867784608681994>`)
		return scoreRounded + 10

	} else return score
}

function updateScore(msg) {
	if (recentMsg.has(msg.author.id)) return;

	else {

		recentMsg.add(msg.author.id)
		setTimeout(() => {recentMsg.delete(msg.author.id)}, 30000)
		
		collection = db.collection('Level');

		collection.findOne({id: msg.author.id})
		.then(data => {
			if (data != undefined) {
				let score = Math.floor(Math.random() * 7)

				try {
					const TotalScore = data.scores.find(x => x.guild == msg.guild.id).score


					if (TotalScore != undefined) {
						const points = levelCheck(TotalScore + score, msg, score)
						collection.updateOne({id: msg.author.id, "scores.guild": msg.guild.id}, {$inc: {"scores.$.score": points}})

					} else {
						const newGuild = {
							guild: msg.guild.id,
							score: 2
						}
											
						collection.updateOne({id: msg.author.id}, {$push: {scores: newGuild}})
					}
				} catch {
					const newGuild = {
						guild: msg.guild.id,
						score: 2
					}
											
					collection.updateOne({id: msg.author.id}, {$push: {scores: newGuild}})
				}
				
			} else {
				newUserObject = {
					id: msg.author.id,
					name: msg.author.username,
					scores: [],
					achievements: []
				}

				collection.insertOne(newUserObject)
			}
		})
	}
}

module.exports = {
	updateLevel: updateScore
}