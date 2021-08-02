const tasks = require('../tasks.json');
const discord = require('discord.js');
const fs = require('fs');

module.exports = {
	
	name: 'addtask',
	description:'Adds a task to the existing user',

	run(msg, args) {
		const authorID = msg.author.id

		if (tasks.userIds.includes(msg.author.id)) {

			const newTask = args.join(' ')

			fs.readFile('./tasks.json', (err, rawData) => {
				if (err) {
					msg.channel.send('Something went wrong when reading the file')
				}

				let fileData = JSON.parse(rawData)
				
				if (fileData[authorID].tasks.length < 4) {
					const newTaskObject = {name: newTask, status: 1}
					const tasks = fileData[authorID].tasks

					tasks.push(newTaskObject)

					const updatedFile = JSON.stringify(fileData, null , 4)

					fs.writeFile('./tasks.json', updatedFile, (err) => {

						if (err) {
							console.error('on writing file:' + err)
						} else msg.channel.send(`Added \`${args}\` as a task`)
					})
				} else {
					msg.channel.send('Your task slots are full, Wait untill the next deadline')
				}
			})

		}
	}

}