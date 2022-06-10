import dbManager from '../../helpers/dbCrud.js';
import levels from './levelScore.js';
import {replier} from '../../helpers/apiResolver.js'

const collection = new dbManager('level');
const recentMsg = new Set();


function levelCheck(totalScore, msg, score) {

	const rounded = Math.floor(totalScore / 10) * 10

	const newLevel = levels[rounded]

	if (newLevel != undefined) {

		const scoreRounded = Math.floor(score / 10) * 10
		return ({score:scoreRounded+10,message:`You reached **Level ${newLevel}**<a:party:944627751971860550>`})

	} else return score
}

export async function updateLevel( user, guildId, msg = null) {
	if (recentMsg.has(user.id)) return;

	else {

		// Making so that xp can only be given per 30 seconds
		recentMsg.add(user.id)
		setTimeout(() => {recentMsg.delete(user.id)}, 30000)


		const data = await collection.singleFind({id: user.id})
		if (data != undefined) {
			let score = Math.floor(Math.random() * 7)

			try {
				const TotalScore = data.scores.find(x => x.guild == guildId).score


				if (TotalScore != undefined) {
					const points = levelCheck(TotalScore + score, msg, score)
					if (typeof points == 'number') {
						// The score wasnt enough for next level i.e it is in the same level

						collection.singleUpdate({id: user.id, "scores.guild": guildId}, {$inc: {"scores.$.score": points}})
					} else {
						// Reached new level!
						collection.singleUpdate({id: user.id, "scores.guild": guildId}, {$inc: {"scores.$.score": points.score}})
						replier(msg, {content: points.message})
					}
				} else {
					const newGuild = {
						guild: guildId,
						score: 2
					}

					collection.singleUpdate({id: user.id}, {$push: {scores: newGuild}})
				}
			} catch {
				const newGuild = {
					guild: guildId,
					score: 2
				}

				collection.singleUpdate({id: user.id}, {$push: {scores: newGuild}})
			}

		} else {
			const newUserObject = {
				id: user.id,
				name: user.username,
				scores: [
					{
						guild: guildId,
						score: 2
					}
				],
				achievements: []
			}

			collection.singleInsert(newUserObject)
		}
	}
}
