import { replier, editReply } from "../helpers/apiResolver.js";
// Executes the commands
export async function executeCommand(commandName, cmdParams) {
    if (global.cmdManager.availableCommands.includes(commandName)) {
        // if (cmdParams.isInteraction) {
        //   cmdParams.msg.deferReply();
        //   wait(500);
        // }
        const ans = await global.cmdManager.runCmd(commandName, cmdParams.msg, cmdParams.args, cmdParams.author, cmdParams.isInteraction);
        // selfRun property means that it will handle the sending / replying on its own
        if (ans?.selfRun)
            return;
        if (ans?.followUp) {
            const reply = ans.followUp;
            delete ans.followUp;
            await editReply(reply, ans, cmdParams.isInteraction);
        }
        else {
            await replier(cmdParams.msg, ans);
        }
    }
}
