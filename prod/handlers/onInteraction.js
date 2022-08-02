import { executeCommand } from './commandRunner.js';
async function handleFollowUp(interaction, name) {
    const ans = await global.cmdManager.handle(name, interaction);
}
export function handleInteraction(interaction) {
    if (interaction.isCommand()) {
        const cmdArguments = interaction.options.data;
        executeCommand(interaction.commandName, { msg: interaction, author: interaction.user, isInteraction: true, args: cmdArguments });
    }
    else if (interaction.isSelectMenu()) {
        handleFollowUp(interaction, interaction.customId);
    }
    else if (interaction.isButton()) {
        handleFollowUp(interaction, interaction.customId.split(" ")[0]);
    }
    else if (interaction.isModalSubmit()) {
        handleFollowUp(interaction, interaction.customId.split(" ")[0]);
    }
    else
        return;
}
