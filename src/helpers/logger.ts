import chalk from 'chalk';

export function logger(err: Error) {
	if (err instanceof Error) {
		
		const info = err.stack!.toString().split('\n');
		const stack: string[] = [];

		let i = 0;
		let level;

		for (const line of info) {
			let moddedLine = line.trim()

			if (i == 0) {
				const firstLineAsArr = moddedLine.split(" ")
				level = moddedLine.split(" ")[0]
				firstLineAsArr.shift()
				moddedLine = firstLineAsArr.join(" ")
				stack.push(moddedLine + "\n")
			}

			if (moddedLine.startsWith('at')) {

				stack.push(moddedLine)
			}

			i++;
		}

		console.log('\n' + chalk.red("[Logger] " + level) + ' ' + chalk.hex('#FCC3C3')(stack.join('\n\t')))
	} else {
		console.log(chalk.yellow('Provided a non-error arg'))
	}
}
