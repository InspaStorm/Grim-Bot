const {db} = require('../../misc/initializer.js');
const level = require('../../misc/levelScore.json')
const jimp = require('jimp')
const discord = require('discord.js')

module.exports = {
	name: 'rank',
	description: 'Shows the chatting xp of the author',

	run(msg, args) {
		const collection = db.collection('Level')

		collection.findOne({id: msg.author.id})
		.then(data => {
			try {
				const score = data.scores.find(x => x.guild == msg.guild.id).score

				async function makeCard(score) {
					const arrayOfScores = Object.keys(level)
					const CurrentLevelScore = arrayOfScores.find(x => x > score)
					const CurrentLevel = level[CurrentLevelScore] - 1

					const percentage = Math.floor((score/CurrentLevelScore) * 100)

					const card = await jimp.read('./pics/rank_card.png')
					let avatar = await jimp.read(msg.author.avatarURL({format:'png', size: 128}))

					const leftEmpty = await jimp.read('./pics/rank_bar/left_empty.png')
					const leftFull = await jimp.read('./pics/rank_bar/left_full.png')
					const middleEmpty = await jimp.read('./pics/rank_bar/middle_empty.png')
					const middleFull = await jimp.read('./pics/rank_bar/middle_full.png')
					const rightEmpty = await jimp.read('./pics/rank_bar/right_empty.png')
					const rightFull = await jimp.read('./pics/rank_bar/right_full.png')

					avatar.resize(100, 100)
					avatar.circle();

					const nameFont = await jimp.loadFont('./Fonts/lobster_nameText.fnt');
					const mainText = await jimp.loadFont('./Fonts/lobster_subText.fnt');

					card.blit(avatar , 250, 10)

					// card.blit(leftEmpty , 20, 85)
					// card.blit(middleEmpty , 70, 85)
					// card.blit(middleEmpty , 120, 85)
					// card.blit(rightEmpty , 170, 85)

					card.print(nameFont	, 20, 15, {
					    text: msg.author.username,
					    alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
					    alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
				  	}, 200, 40)

				  	card.print(mainText	, 22, 60, {
					    text: `Level ${CurrentLevel}\n\t\t\t\t${score}/${CurrentLevelScore}\t${percentage}%`,
					    alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
					    alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
				  	}, 172, 35)
				  	
					card.write('./pics/EditedPic.png')
				}


				if (score != undefined) {
					makeCard(score)
					.then(() => {
						const rankCard = new discord.MessageAttachment('./pics/EditedPic.png', 'rank-card.png')
						msg.channel.send(rankCard)
					})
				} else {
					makeCard(0)
				}
			} catch {
				return
			}
			
		})
	}
}