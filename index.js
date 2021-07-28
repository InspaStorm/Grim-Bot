const {token} = require('./config.js');
const discord = require('discord.js');
const {keepAlive} = require('./server.js');
const fs = require('fs');
const tasks = require('./tasks.json')

const {prefix} = require('./config.js')
const client = new discord.Client();

client.on('ready' , () => {

	client.user.setPresence({
        	activity: {
        		name: 'Grim Town',
        		type: "PLAYING",
        	},
        	status: 'idle'
	})
		.then(console.log(`${client.user.tag} logged on!`))
		.catch(err => console.log(err))
});

client.on('message', msg => {
	const lowerCasedMsg = msg.content.toLowerCase()
	
	if(msg.author.bot) return;

	if (lowerCasedMsg.startsWith(prefix)) {

		const command = lowerCasedMsg.substr(2)

		if (command == 'task') {

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

		else if (command == 'myavatar') {
			const avatarEmbed = new discord.MessageEmbed()
			.setImage(msg.author.avatarURL());

			msg.channel.send(avatarEmbed)
		}
		
		else if (command == 'ping') {
			msg.channel.send('pong');
		}
		
		else if (command == 'help') {
			const helpEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Commands')
			    .setDescription('You can see the commands of GRIM BOT here')
			    .addFields(
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Help', value: 'You can use this command to see all the commands ;p' },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Hello', value: 'Say hello to bot for it to respond back so your never lonely'},
				{ name: 'Ping', value: 'Pong'},
				{ name: 'Task', value: 'You know if you know'},
			    )
			    .setImage('https://thumbs.dreamstime.com/z/help-11277.jpg')
			    .setFooter('Developed by @DeadlineBoss & @Ranger');
			
			msg.channel.send(helpEmbed);
		}
	} else if (lowerCasedMsg.match(/hi*|hello*|hey*/)) {
		const randInt = Math.floor(Math.random() * 5)
		const greetBack = lowerCasedMsg.slice(0, -1) + (lowerCasedMsg.substr(-1).repeat(randInt))
		msg.reply(greetBack);
	}

});

keepAlive()
client.login(token)
