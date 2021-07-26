const {token} = require('./config.js');
const discord = require('discord.js');
const {keepAlive} = require('./server.js');
const fs = require('fs');
const tasks = require('./tasks.json')

const client = new discord.Client();

client.on('ready' , () => console.log('Grim Bot logged on!'))

client.on('message', msg => {
	const lowerCasedMsg = msg.content.toLowerCase()
	if (lowerCasedMsg == 'task') {
		const authorID = msg.author.id
		if (tasks.userIds.includes(msg.author.id)) {

			try {

				const tasksList = tasks[authorID].tasks.join('\n');
				const name = tasks[authorID].name;

				const tasksEmbed = new discord.MessageEmbed()
					.setTitle(`Tasks for ${name}`)
					.setDescription('Tasks assigned to YOU!')
					.addField('Tasks', tasksList)
					.setThumbnail(msg.author.avatarURL())

				msg.channel.send(tasksEmbed)
			} catch (err) {

				console.error(err)
				msg.channel.send('Something went wrong on my side =/')

			}

		}
	}
});

client.on('message', (message) =>{
	if(message.author.bot) return;
	if(message.content === 'hello') {
		message.reply('hello');
	}
});

keepAlive()
client.login(token)
