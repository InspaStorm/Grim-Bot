import discord from 'discord.js';

export default {

	name: 'invite',
	description:'Invite links for the bot and support server',
	alias: [],

	async run(msg, args, author = msg.author, isInteraction = false) {

		const button = new discord.MessageActionRow()
			.addComponents(
				new discord.MessageButton()
					.setURL('https://discord.gg/27qtUTyHhs')
					.setLabel('Join InspaStorm (support Server)')
					.setStyle('LINK'),
				new discord.MessageButton()
					.setURL('https://discord.com/api/oauth2/authorize?client_id=796625057391837185&permissions=2150960192&scope=bot%20applications.commands')
					.setLabel('Invite Grim Bot')
					.setStyle('LINK')
			);
    	const serverLink = new discord.MessageEmbed()
		    .setColor('#00ffff')
		    .setTitle('Thanks for supporting us')
		    .setDescription('Links for inviting the bot as well as for support server')
   		  	.addFields(

		        { name: 'Support Server', value: 'This bot is devoloped as a part of a game studio - `InspaStorm`\nWe are mostly working on 2D games (it might change)' },
		        {name: 'Invite Grim Bot', value: "Grim bot is a unique entertainment bot, Which gets regular updates\nFor any suggestions join the support server and lets us know"}
      		)

		return ({embeds: [serverLink], components: [button]})
	}

}
