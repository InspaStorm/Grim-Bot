const discord = require('discord.js');

module.exports = {
	
	name: 'invite',
	description:'Invite links for the bot and support server',

	run(msg, args) {
    const serverLink = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Join Our Server')
			    .setDescription('Links for inviting the bot as well as for support server =)')
          .addFields(

		        { name: 'Support Server', value: 'https://discord.gg/27qtUTyHhs' },
		        {name: 'Invite Grim Bot', value: "https://discord.com/api/oauth2/authorize?client_id=796625057391837185&permissions=3525696&scope=bot"}
          )

		msg.channel.send({embeds: [serverLink]})
	}

}