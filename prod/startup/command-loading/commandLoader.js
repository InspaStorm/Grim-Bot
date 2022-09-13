import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { collectCmdInfo } from "./prepareCmdInfo.js";
class Command {
    constructor(name, aliases, cmdCode, interactionCode) {
        this.name = name;
        this.aliases = aliases;
        this.cmdExecutable = cmdCode;
        this.handler = interactionCode;
    }
    async run(cmdParams) {
        const res = await this.cmdExecutable(cmdParams);
        return res;
    }
    async handle(interaction) {
        const res = await this.handler(interaction);
        return res;
    }
}
export class CmdManager {
    constructor() {
        this.commands = [];
        this.availableCommands = [];
    }
    addCmd(code) {
        let cmd = new Command(code.name.toLowerCase(), code.alias, code.run, code.handle);
        this.commands.push(cmd);
        this.availableCommands.push(code.name, ...code.alias);
    }
    reloadCmd(name, newCode) {
        let cmdIndex = this.commands.findIndex((cmd) => cmd.name == name);
        this.commands.splice(cmdIndex, 1);
        let refreshedCmd = new Command(name, newCode.alias, newCode.run, newCode.handle);
        this.commands.push(refreshedCmd);
    }
    async runCmd(name, msg, args, author, isInteraction) {
        const exe = await this.commands
            .find((cmd) => cmd.name == name || cmd.aliases.includes(name))
            .run({
            msg: msg,
            args: args,
            author: author,
            isInteraction: isInteraction,
        });
        return exe;
    }
    async handle(name, interaction) {
        const exe = await this.commands
            .find((cmd) => cmd.name == name || cmd.aliases.includes(name))
            .handle(interaction);
    }
}
// Specify the paths Commands folder from this file
const __filename = fileURLToPath(import.meta.url);
const pathToCmds = path.normalize(path.dirname(__filename) + "/../../commands");
const cmdFolder = fs.readdirSync(pathToCmds);
export async function cmdLoader() {
    const executableCmd = new CmdManager();
    for (const folder of cmdFolder) {
        const commandFolder = fs.readdirSync(`${pathToCmds}/${folder}`);
        for (const file of commandFolder) {
            if (path.extname(file) == ".js") {
                // for dynamic updation: `${pathToCmds}/${folder}/${file}?update=${new Date()}`
                let obj;
                try {
                    obj = await import(`${pathToCmds}/${folder}/${file}`);
                }
                catch (err) {
                    console.error(err);
                }
                executableCmd.addCmd(obj.default);
                await collectCmdInfo(obj.default, folder);
            }
        }
    }
    return executableCmd;
}
