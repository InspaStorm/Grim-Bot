import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
export const CHOICE_BUTTONS_ROW = new ActionRowBuilder().addComponents(new ButtonBuilder()
    .setCustomId("shop 1")
    .setLabel("Yes")
    .setStyle(ButtonStyle.Success), new ButtonBuilder()
    .setCustomId("shop 2")
    .setLabel("No")
    .setStyle(ButtonStyle.Danger));
