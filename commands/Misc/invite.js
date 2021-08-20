const discord = require('discord.js');

module.exports = {
	
	name: 'invite',
	description:'Invite links for the bot and support server',

	run(msg, args) {
    const serverLink = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Join Our Server')
			    .setDescription('Wanna Chat with the Devs & Support us? Join our server with the link below')
          .addFields(
		        { name: 'Link =>', value: 'https://discord.gg/27qtUTyHhs' }
          )

		msg.channel.send(serverLink)
	}

}