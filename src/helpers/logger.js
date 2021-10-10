const chalk = require('chalk')

function errorLogger(err) {

	if (err instanceof Error) {
		const info = err.stack.toString().split('\n');
		const stack = [];

		let i = 0;
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
	} else {
		console.log(chalk.yellow('Provided a non-error arg'))
	}
}

module.exports = {logger: errorLogger}