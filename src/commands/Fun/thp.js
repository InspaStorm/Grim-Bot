import dbManager from '../../helpers/dbCrud.js';
import discord from 'discord.js';
import {inputMemberCheck} from '../../helpers/member.js';

const db = new dbManager('thc')

export default {

	name: 'thp',
	description:'View your hard earned THP(s)!',
	alias: ['point', 'points'],
	options: [
        {name: "user", desc: "Mention the user/give the user's name", required: false, type: "user"},
    ],

	async run(msg, args, author = msg.author, isInteraction = false) {
		const userInfo = await inputMemberCheck(msg, author, args, isInteraction)

		if (typeof userInfo == 'string') return {content: userInfo}
        const res = await db.singleFind({id: userInfo.id})

        const score = (res != null) ? res.count.toString() : '0';

	    const thpEmbed = new discord.MessageEmbed()
	    .setTitle(`The Hmm Points of ${userInfo.username}`)
	    .setDescription(score)
	    .setThumbnail(userInfo.displayAvatarURL())
	    .setColor('#FFFF00')
	    .setFooter({text: `Redeem the points using g!shop`})

        return {embeds: [thpEmbed]}
	}

}