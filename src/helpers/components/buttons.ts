import discord from 'discord.js';

export const CHOICE_BUTTONS_ROW = new discord.MessageActionRow()
			.addComponents(
				new discord.MessageButton()
					.setCustomId('shop 1')
					.setLabel('Yes')
					.setStyle('SUCCESS'),
				new discord.MessageButton()
					.setCustomId('shop 2')
					.setLabel('No')
					.setStyle('DANGER')
			);