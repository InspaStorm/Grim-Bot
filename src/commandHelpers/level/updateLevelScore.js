import {db} from '../../startup/database.js';
import levels from './levelScore.js';
import {replier} from '../../helpers/apiResolver.js'

const recentMsg = new Set();


function levelCheck(totalScore, msg, score) {

	const rounded = Math.floor(totalScore / 10) * 10

	const newLevel = levels[rounded]

	if (newLevel != undefined) {

		const scoreRounded = Math.floor(score / 10) * 10
		return ({score:scoreRounded+10,message:`You reached **Level ${newLevel}**<a:party:944627751971860550>`})

	} else return score
}

export async function updateLevel(msg) {
	if (recentMsg.has(msg.author.id)) return;

	else {

		// Making so that xp can only be given per 30 seconds
		recentMsg.add(msg.author.id)
		setTimeout(() => {recentMsg.delete(msg.author.id)}, 30000)

		const collection = db.collection('level');

		const data = await collection.findOne({id: msg.author.id})
		if (data != undefined) {
			let score = Math.floor(Math.random() * 7)

			try {
				const TotalScore = data.scores.find(x => x.guild == msg.guild.id).score


				if (TotalScore != undefined) {
					const points = levelCheck(TotalScore + score, msg, score)
					if (typeof points == 'number') {

						collection.updateOne({id: msg.author.id, "scores.guild": msg.guild.id}, {$inc: {"scores.$.score": points}})
					} else {
						collection.updateOne({id: msg.author.id, "scores.guild": msg.guild.id}, {$inc: {"scores.$.score": points.score}})
						replier(msg, {content: points.message})
					}
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
			const newUserObject = {
				id: msg.author.id,
				name: msg.author.username,
				scores: [],
				achievements: []
			}

			collection.insertOne(newUserObject)
		}
	}
}
