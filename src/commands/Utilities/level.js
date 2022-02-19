import {db} from '../../startup/database.js';
import level from '../../level/levelScore.js';
import jimp from 'jimp';
import discord from 'discord.js';
import {replier} from '../../helpers/apiResolver.js'


async function makeCard(score, user) {
	const arrayOfScores = Object.keys(level)
	const CurrentLevelScore = arrayOfScores.find(x => x > score)
	const CurrentLevel = level[CurrentLevelScore] - 1

	const percentage = Math.floor((score/CurrentLevelScore) * 100)

	const card = await jimp.read('./src/pics/rank_card.png')
	let avatar = await jimp.read(user.avatarURL({format:'png', size: 128}))

	const leftEmpty = await jimp.read('./src/pics/rank_bar/left_empty.png')
	const leftFull = await jimp.read('./src/pics/rank_bar/left_full.png')
	const middleEmpty = await jimp.read('./src/pics/rank_bar/middle_empty.png')
	const middleFull = await jimp.read('./src/pics/rank_bar/middle_full.png')
	const rightEmpty = await jimp.read('./src/pics/rank_bar/right_empty.png')
	const rightFull = await jimp.read('./src/pics/rank_bar/right_full.png')

	avatar.resize(100, 100)
	avatar.circle();

	const nameFont = await jimp.loadFont('./src/Fonts/lobster_nameText.fnt');
	const mainText = await jimp.loadFont('./src/Fonts/lobster_subText.fnt');

	card.blit(avatar , 250, 10)

	card.print(nameFont	, 20, 15, {
		text: user.username,
		alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
		alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
	}, 200, 40)

	card.print(mainText	, 22, 60, {
		text: `Level ${CurrentLevel}\n\t\t\t\t${score}/${CurrentLevelScore}\t${percentage}%`,
		alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
		alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
	}, 172, 35)

	card.write('./src/pics/EditedPic.png')
}

const collection = db.collection('Level')

export default {
	name: 'level',
	description: 'Shows the chatting xp of the author',
	alias: [],

	async run(msg, args, author = msg.author, isInteraction = false) {
		if (!msg.client.locks.get('level').includes(msg.guild.id)) return {content: '**Level system is off** in this server =(\n\nAdmins can turn it on using: `g!serverconf level on`'}


		const data = await collection.findOne({id: author.id})
		try {
			const score = data.scores.find(x => x.guild == msg.guild.id).score

			if (score != undefined) {
				const reply = await replier(msg, {content: '**Processing your level card** <a:loading:944275536274935835>'}, isInteraction)
				await makeCard(score, author)
				return ({
					content: '\u200b',
					followUp: reply,
					files: [{
					attachment: './src/pics/EditedPic.png',
					name: 'rank-card.png'
				}],
				})
			} else {
				const reply = await replier(msg, {content: '**Making a new level card** <a:loading:944275536274935835>'}, isInteraction)
				await makeCard(0, author)
				return ({
					content: '\u200b',
					followUp: reply,
					files: [{
					attachment: './src/pics/EditedPic.png',
					name: 'rank-card.png'
				}],
				})
			}
		} catch (err){
			console.log(err)
			return ({content: 'Encountered An error =/'})
		}
	}
}
