import discord from 'discord.js';
import {db} from '../../startup/database.js';

const collection = db.collection('thc')

export default {

	name: 'leaderboard',
	description:'Preview the chad chatters',
	alias: [],
	options: [],

	async run(msg, args, author = msg.author, isInteraction = false) {

		const res = await collection.find().sort({count: -1}).limit(10).toArray()
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

		if (i <= 2) placeHolders = '----'

	    const user = await msg.client.users.fetch(userId)
	    leaderboard
	    .setTitle(`THC Leaderboard`)
	    .setDescription('\u200b')
	    .setThumbnail(user.displayAvatarURL())
	    .addField(crownHolder, placeHolders)
	    .setColor('#FFFF00')
	    .setFooter({text: `These points might have a use in future ;p`})

	    return {embeds:[leaderboard] }
	}

}
