import chalk from 'chalk';
import fs from 'fs';
import util from 'util';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const pathToCurrentFile = `${path.dirname(__filename)}/`;
const log_file = fs.createWriteStream(pathToCurrentFile + '../error.log', {flags : 'w'});

export function logger(err) {

	if (err instanceof Error) {
		const info = err.stack.toString().split('\n');
		const stack = [];

		let i = 0;
		console.log(err)
		let level;

		for (const line of info) {
			let moddedLine = line.trim()

			if (i == 0) {
				level = moddedLine.split(" ")[0]
				moddedLine = moddedLine.split(" ").pop().toString()
			}

			if (moddedLine.startsWith('at')) {

				stack.push(moddedLine)
				break;
			} else {
				stack.push(moddedLine)
			}

			i++;
		}

		console.log(chalk.red(level) + ' ' + chalk.hex('#FCC3C3')(stack.join('\n')))
		log_file.write(util.format(stack.join('\n')) + '\n');

	} else {
		console.log(chalk.yellow('Provided a non-error arg'))
	}
}
