const discord = require('discord.js');
const {memberCheck} = require('../../helpers/member.js');

module.exports = {
	
	name: 'avatar',
	description:'Shows off your avatar',
	options: [
		{name: "user", desc: "Mention the user/give the user's name", required: false, type: "USER"},
	],

	run(msg, args, author=msg.author) {

		async function mentionCheck(msg) {

			if (args.length > 0) {
				const member = await memberCheck(msg, args[0])
				if (typeof member != 'string' && typeof member != 'undefined') {
					return {name: member.user.username, image: member.user.displayAvatarURL({dynamic: true,size: 256})}
				} else if (typeof member == undefined) {
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

		mentionCheck(msg, args)
		.then(check => {
			if (typeof check == 'string') {
				
				msg.channel.send(check)

			} else {
				const name  = check.name
				const img = check.image
				const avatarEmbed = new discord.MessageEmbed()
				.setDescription(name)
				.setImage(img);

				msg.reply({embeds:[avatarEmbed] })
			}
		})

	}

}