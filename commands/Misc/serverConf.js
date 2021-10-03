const {db} = require('../../misc/initializer.js');
const discord = require('discord.js');
const collection = db.collection('server-conf')

module.exports = {
	name: 'serverconf',
	description: 'Manage the bot settings of your server!',
	run (msg, args) {
		const changableSettings = ['level']
		
		if (changableSettings.includes(args[0])) {
			// if (args[1] == true|| args[1] == true)
		} else {
			msg.channel.send(`hmm.. I think that setting does not exists, Valid settings are:\n\`${changableSettings.join('\n')}\``)
		}
		// collection.findOne({ guild: msg.guild.id })
		// .then(data => {
		// 	if (data != undefined) {

		// 	} else {
		// 		const newGuild = {
		// 			guild: msg.guild.id,
		// 			settings: {
		// 				level: false,
		// 			}
		// 		}
		// 	}
		// })
	}
}