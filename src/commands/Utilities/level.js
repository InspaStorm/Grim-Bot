import {db} from '../../startup/database.js';
import level from '../../level/levelScore.js';
import canvacord from 'canvacord';
import {replier} from '../../helpers/apiResolver.js';
import {fetchMember, inputMemberCheck} from '../../helpers/member.js';

async function makeCard(score, user) {
	const arrayOfScores = Object.keys(level)
	const CurrentLevelScore = arrayOfScores.find(x => x > score)
	const CurrentLevel = level[CurrentLevelScore] - 1
	const img = user.displayAvatarURL({format: 'png',size: 256});

	const rank = new canvacord.Rank()
	    .setAvatar(img)
		.setLevel(parseInt(CurrentLevel))
	    .setCurrentXP(score)
		.setOverlay('grey', 0.7, false)
		.setBackground('IMAGE', './src/pics/level_card_bg.jpg')
	    .setRequiredXP(parseInt(CurrentLevelScore))
	    .setStatus("online")
	    .setProgressBar(["#df75ec", "#f90a0a"], "GRADIENT")
	    .setUsername(user.username)
	    .setDiscriminator(user.discriminator)
		.setRank(0, 'No Rank', false);

	return await rank.build()
}

const collection = db.collection('level')

export default {
	name: 'level',
	description: 'Shows the chatting xp of the author',
	alias: [],
	options: [
		{name: "user", desc: "Mention the user/give the user's name", required: false, type: "user"},
	],

	/**
     * 
     * @param {Message} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(msg, args, author = msg.author, isInteraction = false) {
		if (!msg.client.locks.get('level').includes(msg.guild.id)) return {content: '**Level system is off** in this server =(\n\nAdmins can turn it on using: `g!serverconf level on`'}


		async function mentionCheck(msg,author, args, isInteraction) {
			if (isInteraction) {
				const user = args.getUser('user')
				if (user) {
					return user
				} else {
					return author
				}
			} else if (args.length > 0) {
				const member = await fetchMember(msg, args[0])

				if (typeof member != 'string' && typeof member != 'undefined') {
					return member.user
				} else if (typeof member == 'undefined') {
					return `No user found with name: \`${args[0]}\``
				} else {
					return member
				}
			} else {
				return author
			}
		}

		const userToBeChecked = await mentionCheck(msg, author, args, isInteraction)

		if (typeof userToBeChecked == 'string') {

			return {content: userToBeChecked}

		}

		const data = await collection.findOne({id: userToBeChecked.id})
		try {
			const score = (data != null) ? data.scores.find(x => x.guild == msg.guild.id).score : undefined
			if (score != undefined) {
				const reply = await replier(msg, {content: `**Processing ${userToBeChecked.username}'s card** <a:loading:944275536274935835>`}, isInteraction)
				const levelCard = await makeCard(score, userToBeChecked)
				return ({
					content: '\u200b',
					followUp: reply,
					files: [{
					attachment: levelCard,
					name: 'rank-card.png'
				}],
				})
			} else {
				const reply = await replier(msg, {content: '**Making a new level card** <a:loading:944275536274935835>'}, isInteraction)
				const levelCard = await makeCard(0, userToBeChecked)
				return ({
					content: '\u200b',
					followUp: reply,
					files: [{
					attachment: levelCard,
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
