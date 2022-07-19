import { executeCommand } from './commandRunner.js'
import { ButtonInteraction, Interaction, ModalSubmitInteraction, SelectMenuInteraction } from 'discord.js';

async function handleFollowUp(interaction: SelectMenuInteraction | ButtonInteraction | ModalSubmitInteraction , name: string) {
	const ans = await global.cmdManager.handle(name, interaction)
}

export function handleInteraction(interaction: Interaction | SelectMenuInteraction | ButtonInteraction | ModalSubmitInteraction) {
    if (interaction.isCommand()) {
        const args = interaction.options
        executeCommand(interaction.commandName, interaction, args, interaction.user, true)
    } else if (interaction.isSelectMenu()) {
        handleFollowUp(interaction, interaction.customId)
    } else if (interaction.isButton()) {
        handleFollowUp(interaction, interaction.customId.split(" ")[0])
    } else if (interaction.isModalSubmit()) {
        handleFollowUp(interaction, interaction.customId.split(" ")[0])
    } else return;
}