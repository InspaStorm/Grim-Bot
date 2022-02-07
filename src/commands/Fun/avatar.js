import discord from 'discord.js';
import {memberCheck} from '../../helpers/member.js';

export default {

	name: 'avatar',
	description:'Shows off your avatar',
	alias: [],
	options: [
		{name: "user", desc: "Mention the user/give the user's name", required: false, type: "user"},
	],

	async run(msg, args, author = msg.author, isInteraction = false) {

		async function mentionCheck(msg, arg) {
			if (isInteraction) {
				const user = args.getUser('user')
				if (user) {
					return {
						name: user.username,
						image: user.displayAvatarURL({dynamic: true,size: 256})
					}
				} else {
					return {
						name: author.username,
						image: author.displayAvatarURL({dynamic: true,size: 256})
					}
				}
			} else if (arg.length > 0) {
				const member = await memberCheck(msg, arg[0])

				if (typeof member != 'string' && typeof member != 'undefined') {
					return {name: member.user.username, image: member.user.displayAvatarURL({dynamic: true,size: 256})}
				} else if (typeof member == 'undefined') {
					return `No user found with name: \`${args[0]}\``
				} else {
					return member
				}
			} else {
				return {
					name: author.username,
					image: author.displayAvatarURL({dynamic: true,size: 256})
				}
			}
		}

		const check = await mentionCheck(msg, args)

		if (typeof check == 'string') {

			return {content: check}

		} else {
			const name  = check.name
			const img = check.image
			const avatarEmbed = new discord.MessageEmbed()
			.setDescription(name)
			.setImage(img);

			return ({embeds:[avatarEmbed] })
		}

	}

}
