const discord = require('discord.js');
const {memberCheck} = require('../../helpers/member.js');

module.exports = {
	
	name: 'avatar',
	description:'Shows off your avatar',

	run(msg, args) {

		async function mentionCheck(msg, args) {

			if (args.length > 0) {
				const member = await memberCheck(msg, args[0])
				if (typeof member != 'string'){
					return {name: member.user.username, image: member.user.displayAvatarURL({dynamic: true,size: 256})}
				} else {
					return member
				}
			} else {
				return {
					name: msg.author.username,
					image: msg.author.displayAvatarURL({dynamic: true,size: 256})
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

				msg.channel.send({embeds:[avatarEmbed] })
			}
		})

	}

}