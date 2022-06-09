import level from '../../commandHelpers/level/levelScore.js';
import dbManager from '../../helpers/dbCrud.js';
import {replier} from '../../helpers/apiResolver.js';
import {fetchMember, inputMemberCheck} from '../../helpers/member.js';

const collection = new dbManager('level')

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
		if (!global.locks.get('level').includes(msg.guild.id)) return {content: '**Level system is off** in this server =(\n\nAdmins can turn it on using: `/serverconf level on`'}


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

		const data = await collection.singleFind({id: userToBeChecked.id})
		try {
			const score = (data != null) ? data.scores.find(x => x.guild == msg.guild.id).score : undefined
			if (score != undefined) {
				
				const reply = await replier(msg, {content: `**Processing ${userToBeChecked.username}'s card** <a:loading:944275536274935835>`}, isInteraction)
				const arrayOfScores = Object.keys(level)
				const CurrentLevelScore = arrayOfScores.find(x => x > score)
				const CurrentLevel = level[CurrentLevelScore] - 1

				return {
					content: `Level **${CurrentLevel}**    [ **${(score/CurrentLevelScore) * 100}%** ]\n\n${score} out of ${CurrentLevelScore}`,
					followUp: reply
				}
				
			} else {
				const reply = await replier(msg, {content: '**Making a new level card** <a:loading:944275536274935835>'}, isInteraction)
				const arrayOfScores = Object.keys(level)
				const CurrentLevelScore = arrayOfScores.find(x => x > 0)
				const CurrentLevel = level[CurrentLevelScore] - 1
				return {
					content: `Level **${CurrentLevel}** [ **${(score/CurrentLevelScore) * 100}%** ]\n\n${score} out of ${CurrentLevelScore}`,
					followUp: reply
				}
			}
		} catch (err){
			console.log(err)
			return ({content: 'Encountered An error =/'})
		}
	}
}
