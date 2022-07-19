import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const pathToCmds = `${path.dirname(__filename)}/../../commands`

// Loading all the commands and Setting up all things for help command

type commandFile = {
	name: string,
    description: string,
	alias: string[],
    isStaff: boolean,
	run: CallableFunction,
	handle: CallableFunction
}

type cmdDetails = {
    name: string,
    value: string
}

let regularUserCommands: Array<cmdDetails>;
let staffCommands: Array<cmdDetails>;
const categoryDetails = new Map();

async function checkCategoryInfo(path: string, folderName: string) {

    type categoryData = {
        name: string,
        description: string,
        moreDetails: string,
        value: string
    }

	let categoryInfo: categoryData = {
        name: folderName,
        description: 'None',
        moreDetails: 'None',
        value: folderName
    }

	if (fs.existsSync(path)) {
		const configFile = await fs.readFileSync(path)

		const arr = configFile.toString().replace(/\r\n/g,'\n').split('\n');

    	categoryInfo.name = arr[0] //arr[0] represents 1st line of the file
		categoryInfo.description = arr[1] || 'None'
        arr.splice(0, 2)
        categoryInfo.moreDetails = arr.join('\n') || categoryInfo.description

	}
	return categoryInfo
}

let i = -1;
let q = -1;
let commandsInfo: Array<cmdDetails> = [];
let staffSpecial: Array<cmdDetails> = [];
let categoryNames = [];

export async function collectCmdInfo(command: commandFile, folder: string) {

    let infoFormat = `\n__**${command.name}**__ \`Aliases [${command.alias}]\`:
    ${command.description}\n`;

    const categoryData = await checkCategoryInfo(`${pathToCmds}/${folder}/config.txt`, folder)
    // Setting up help commmand dynamically

    // Looks if the category name has already been added
    if (Object.values(commandsInfo).some(r => r.name == categoryData.name)) {
        categoryDetails.get(folder).cmdInfo += infoFormat

    } else if (Object.values(staffSpecial).some(r => r.name == categoryData.name)) {

        categoryDetails.get(folder).cmdInfo += infoFormat

    } else {
    // creating new category
    const newCmdObjects: cmdDetails = {
        name: categoryData.name,
        value: categoryData.description
    }
    if (command.isStaff) {
        staffSpecial.push(newCmdObjects)
        q ++;
    } else {
        commandsInfo.push(newCmdObjects)
        i ++;
    }

    categoryDetails.set(folder, {label: categoryData.name, description:categoryData.description, value: categoryData.value, detail: categoryData.moreDetails,cmdInfo:infoFormat})
    categoryNames.push(categoryData.name)
    
    }
	regularUserCommands = commandsInfo;
	staffCommands = commandsInfo.concat(staffSpecial);

}


export function getCmdDetails() {
    return {userCommands: regularUserCommands, staffCommands: staffCommands, categoryDetails: categoryDetails}
}