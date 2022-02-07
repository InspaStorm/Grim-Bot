import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Specify the paths Commands folder from this file
const __filename = fileURLToPath(import.meta.url);
const pathToCmds = `${path.dirname(__filename)}/../commands`
const commandFiles = fs.readdirSync(pathToCmds);

// Loading all the commands and Setting up all things for help command

let regularUserCommands;
let staffCommands;

async function checkCategoryName(path, folderName) {

	let categoryName;

	if (fs.existsSync(path)) {
		const configFile = await fs.readFileSync(path)

		const arr = configFile.toString().replace(/\r\n/g,'\n').split('\n');

    categoryName = arr[0] //arr[0] represents 1st line of th file

	} else categoryName = folderName

	return categoryName
}

export async function cmdLoader(collection) {
	collection.clear()

	let i = -1;
	let q = -1;
	let commandsInfo = [];
	let staffSpecial = [];
	let categoryNames = [];
	for (const folder of commandFiles) {

		const commandFolders = fs.readdirSync(`${pathToCmds}/${folder}`)

		for (const file of commandFolders) {
			if (path.extname(file) == '.js') {

				let obj = await import(`${pathToCmds}/${folder}/${file}?update=${new Date()}`)
				let command = obj.default
				collection.set(command.name,command)

				let infoFormat = `\n**${command.name}** \`Aliases [${command.alias}]\`:
				${command.description}\n`;

				const categoryName = await checkCategoryName(`${pathToCmds}/${folder}/config.txt`, folder)

				// Setting up help commmand dynamically

				// Looks if the category name has already been added
				if (Object.values(commandsInfo).some(r => r.name == categoryName)) {
					commandsInfo[i].value += infoFormat

				} else if (Object.values(staffSpecial).some(r => r.name == categoryName)) {

					staffSpecial[q].value += infoFormat

				} else {
					// creating new category
					const newCmdObjects = {
						name: `${categoryName}`,
						value: infoFormat
					}
					if (command.isStaff) {
						staffSpecial.push(newCmdObjects)
						q ++;
					} else {
						commandsInfo.push(newCmdObjects)
						i ++;
					}

					categoryNames.push(categoryName)
				}
			}
		}
	}
	regularUserCommands = commandsInfo;
	staffCommands = commandsInfo.concat(staffSpecial);
}

export function getCmdDetails() {
  return {userCommands: regularUserCommands, staffCommands: staffCommands}
}
