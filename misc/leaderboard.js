const discord = require('discord.js');
const {db} = require('./initializer');
const collection = db.collection('Chat');
const {memberCheck} = require('../helpers/member.js');

async function updateLeader(client) {
	const channel = await client.channels.fetch('');
	const msg = await channel.messages.fetch('');
	setInterval(() => {
		collection.find().sort({count: -1}).limit(10).toArray()
		.then(res => {
		    let i = 1;
		    let placeHolders= '';
		    const leaderboard = new discord.MessageEmbed()
		    for (let entry of res) {
		    	if (i == 1) {
		    		var userId = entry.id
		    		var crownHolder = `👑 ${entry.name} - ${entry.count}`;
		    		i ++;
		    	} else {
			        placeHolders = placeHolders + `${i}. ${entry.name} - ${entry.count}\n`;
			        i ++;
		        }
		    }

		    client.users.fetch(userId)
		    .then(user => {
			    leaderboard
			    .setTitle(`THC Leaderboard`)
			    .setDescription('\u200b')
			    .setThumbnail(user.displayAvatarURL())
			    .addField(crownHolder, placeHolders)
			    .setColor('#FFFF00')
			    .setFooter(`Lastly updated on: ${Date().toString().split(' ').splice(0, 6).join(' ')} | update every 30 mins`)

			    msg.edit({embeds:[leaderboard] });
		    })

		});
	}, 1.8e+6)
}

module.exports = {updateLeader: updateLeader}