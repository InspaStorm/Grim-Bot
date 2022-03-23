import {MessageEmbed} from 'discord.js';

/**
 * 
 * @param {string} title Title to be set on the embed
 * @param {string} description description to be set on the embed
 * @param {Object[]} fields Array of fields to be set on the embed
 * @param {string} color Color to be set to embed
 * @param {string} thumbnail Image to be set as thumbnail
 * @param {string} footer text to be set as footer
 */
export function makeEmbed(title, description = '\u200b', fields, color , thumbnail = false, footer = false) {
    const embed = new MessageEmbed()
	    .setTitle(title)
	    .setDescription(description)
	    .addFields(fields)

    if (thumbnail) embed.setThumbnail(thumbnail)
    if (color) embed.setColor(color)
    if (footer) embed.setFooter({text: footer})

    return embed
}