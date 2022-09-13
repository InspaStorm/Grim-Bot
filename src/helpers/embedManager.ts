import { ColorResolvable, EmbedBuilder, EmbedField } from "discord.js";

/**
 * @param {string} color Color to be set to embed
 * @param {string} thumbnail Image to be set as thumbnail
 * @param {string} footer text to be set as footer
 */
export function makeEmbed(
  title: string,
  description?: string,
  fields?: EmbedField[],
  color?: ColorResolvable,
  thumbnailUrl?: string,
  footer?: string
) {
  const embed = new EmbedBuilder().setTitle(title);

  if (description) embed.setDescription(description);
  if (fields) embed.addFields(fields);
  if (thumbnailUrl) embed.setThumbnail(thumbnailUrl);
  if (color) embed.setColor(color);
  if (footer) embed.setFooter({ text: footer });

  return embed;
}
