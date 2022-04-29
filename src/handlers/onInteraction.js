import { executeCommand } from './commandRunner.js'

async function handleFollowUp(interaction, name) {
	const ans = await global.cmdManager.handle(name, interaction)
}

export function handleInteraction(interaction) {
    if (interaction.isCommand()) {
        const args = interaction.options
        executeCommand(interaction.commandName, interaction, args, interaction.user, true)
    } else if (interaction.isSelectMenu()) {
        handleFollowUp(interaction, interaction.customId)
    } else if (interaction.isButton()) {
        handleFollowUp(interaction, interaction.customId.split(" ")[0])
    } else return;
}