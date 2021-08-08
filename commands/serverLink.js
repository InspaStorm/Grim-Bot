const tasks = require('../tasks.json');
const discord = require('discord.js');

module.exports = {
	
	name: 'server',
	description:'Get the link to the offical InspaStorm Server where you can chat with the devs',

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