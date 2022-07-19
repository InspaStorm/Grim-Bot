import {ColorResolvable, EmbedFieldData, MessageEmbed} from 'discord.js';

/**
 * @param {string} color Color to be set to embed
 * @param {string} thumbnail Image to be set as thumbnail
 * @param {string} footer text to be set as footer
 */
export function makeEmbed(title: string, description: string, fields: EmbedFieldData, color: ColorResolvable , thumbnailUrl: string, footer: string) {
    
    if (!description) description  = '\u200b'
    
    const embed = new MessageEmbed()
	    .setTitle(title)
	    .setDescription(description)
	    .addFields(fields)

    if (thumbnailUrl) embed.setThumbnail(thumbnailUrl)
    if (color) embed.setColor(color)
    if (footer) embed.setFooter({text: footer})

    return embed
}