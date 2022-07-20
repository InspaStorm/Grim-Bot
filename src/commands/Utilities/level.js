import level from '../../commandHelpers/level/levelList.js';
import dbManager from '../../database/dbCrud.js';
import {replier} from '../../helpers/apiResolver.js';
import { fetchMember } from '../../helpers/member.js';
import { updateLevel } from '../../commandHelpers/level/updateLevel.js';

const collection = new dbManager('level')

function prepareLevelInfo(scoreOfUser) {

	const arrayOfScores = Object.keys(level)
	const CurrentLevelScore = arrayOfScores.find(x => x > scoreOfUser)
	const CurrentLevel = level[CurrentLevelScore] - 1

	const userLevelInfoFormat = `Level **${CurrentLevel}**    [ **${(scoreOfUser/CurrentLevelScore) * 100}%** ]\n\n${scoreOfUser} out of ${CurrentLevelScore}`;

	return userLevelInfoFormat
}

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
				
				const userLevelInfo = prepareLevelInfo(score);

				return {
					content: userLevelInfo,
					followUp: reply
				}
				
			} else {
				const reply = await replier(msg, {content: '**Making a new level card** <a:loading:944275536274935835>'}, isInteraction)
				
				const userLevelInfo = prepareLevelInfo(0);

				return {
					content: userLevelInfo,
					followUp: reply
				}
			}
		} catch (err){
			updateLevel(msg.user, msg.guild.id);

			const reply = await replier(msg, {content: '**Making a new level card** <a:loading:944275536274935835>'}, isInteraction)
				
			const userLevelInfo = prepareLevelInfo(0);

			return {
				content: userLevelInfo,
				followUp: reply
			}
		}
	}
}
