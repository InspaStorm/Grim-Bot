const tasks = require('../tasks.json');
const discord = require('discord.js');
const fs = require('fs');

module.exports = {
	
	name: 'removetask',
	description:'Removes a task to the existing user',

	run(msg, args) {
		const authorID = msg.author.id

		if (tasks.userIds.includes(msg.author.id)) {

			if (!isNaN(args[0])) {
				const taskNumber = args[0]

				fs.readFile('./tasks.json', (err, rawData) => {
					if (err) {
						msg.channel.send('Something went wrong when reading the file')
					}

					let fileData = JSON.parse(rawData)
					
					if (fileData[authorID].tasks.length < 4) {

						const taskIndex = taskNumber - 1
						const removedTask = fileData[authorID].tasks[taskIndex]
						const removeTask = fileData[authorID].tasks.splice(taskIndex , 1)

						const updatedFile = JSON.stringify(fileData, null , 4)

						fs.writeFile('./tasks.json', updatedFile, (err) => {

							if (err) {
								console.error('on writing file:' + err)
							} else msg.channel.send(`Removed the task at position \`${taskNumber}\``)
						})
					} else {
						msg.channel.send('Your task slots are full, Wait untill the next deadline')
					}
				})
			} else {
				msg.channel.send('Please provide the `Number` of the task to be removed')
			}
		}
	}

}