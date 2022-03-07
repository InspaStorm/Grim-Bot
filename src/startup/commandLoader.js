import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {collectCmdInfo} from '../helpers/prepareCmdInfo.js'

class Command {
	constructor(name,aliases, cmdCode, interactionCode) {
		this.name = name;
		this.aliases = aliases;
		this.cmdExecutable = cmdCode
		this.handler = interactionCode
	}

	async run(msg, args, author, isInteraction) {
		const res = await this.cmdExecutable(msg, args, author, isInteraction)
		return res
	}

	async handle(interaction) {
		const res = await this.handler(interaction)
		return res
	}
}

class CmdManager {
	constructor() {
		this.commands = [];
		this.availableCommands = [];
	}

	addCmd(code) {
		let cmd = new Command(code.name.toLowerCase(), code.alias, code.run, code.handle)

		this.commands.push(cmd)
		this.availableCommands.push(code.name, ...code.alias)

	}

	reloadCmd(name, newCode) {r
		let cmdIndex = this.commands.findIndex(cmd => cmd.name == name);

		this.commands.splice(cmdIndex, 1)

		let refreshedCmd = new Command(name,newCode.alias, newCode)
		this.commands.push(refreshedCmd)
	}

	async runCmd(name, msg, args, author, isInteraction) {
		try {
			const exe = await this.commands.find(cmd => cmd.name == name || cmd.aliases.includes(name)).run(msg, args, author, isInteraction)
			return exe
		} catch(err) {
			console.log(err);
		}
	}

	async handle(name, interaction) {
		const exe = await this.commands.find(cmd => cmd.name == name || cmd.aliases.includes(name)).handle(interaction)
	}
}

// Specify the paths Commands folder from this file
const __filename = fileURLToPath(import.meta.url);
const pathToCmds = `${path.dirname(__filename)}/../commands`
const commandFiles = fs.readdirSync(pathToCmds);

export async function cmdLoader() {
	const executableCmd = new CmdManager()
	for (const folder of commandFiles) {

		const commandFolders = fs.readdirSync(`${pathToCmds}/${folder}`)

		for (const file of commandFolders) {
			if (path.extname(file) == '.js') {

				let obj = await import(`${pathToCmds}/${folder}/${file}?update=${new Date()}`)
				// Fetches exported values and create command from it
				executableCmd.addCmd(obj.default)

				await collectCmdInfo(obj.default, folder)

			}
		}
	}

	return executableCmd
}
