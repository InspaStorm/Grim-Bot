import { CommandInteraction, CommandInteractionOptionResolver, Message } from "discord.js";
import { replier, editReply } from "../helpers/apiResolver.js";

// Executes the commands
export async function executeCommand(commandName: string, msg: CommandInteraction | Message, args: string[] | CommandInteractionOptionResolver | any, author: CommandInteraction["user"], isInteraction = false) {
	if (global.cmdManager.availableCommands.includes(commandName)) {

		if(!isInteraction) msg.channel!.sendTyping();
		
		const ans = await global.cmdManager.runCmd(commandName, msg, args, author, isInteraction)

		// selfRun property means that it will handle the sending / replying on its own
		if (ans?.selfRun) return;

		if (ans?.followUp) {
			const reply = ans.followUp
			delete ans.followUp;
			await editReply(reply, ans, isInteraction);
		} else {
			await replier(msg, ans)
		}
	}
}