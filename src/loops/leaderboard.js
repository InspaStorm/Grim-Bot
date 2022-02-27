import discord from 'discord.js';
import {db} from '../startup/database.js';
const collection = db.collection('Chat');
import {fetchMember} from '../helpers/member.js';

export async function updateLeader(client) {
	const channel = await client.channels.fetch('887904218491539467');
	const msg = await channel.messages.fetch('887927692232634398');
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
			    .setFooter({text: `Lastly updated on: ${Date().toString().split(' ').splice(0, 6).join(' ')} | update every 30 mins`})

			    msg.edit({embeds:[leaderboard] });
		    })

		});
	}, 1.8e+6)
}
