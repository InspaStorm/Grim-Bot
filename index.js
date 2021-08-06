const {token} = require('./config.js');
const discord = require('discord.js');
const {keepAlive} = require('./server.js');
const fs = require('fs');
const {updatePoint} = require('./misc/chatPoints')

const {prefix} = require('./config.js')
const client = new discord.Client();

client.on('ready' , () => {

	client.user.setPresence({
        	activity: {
        		name: 'Grim Town | g!help',
        		type: "PLAYING",
        	},
        	status: 'idle'
	})
		.then(console.log(`${client.user.tag} logged on!`))
		.catch(err => console.log(err))
});

const commandFiles = fs.readdirSync('./commands')

client.commands = new discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)

	client.commands.set(command.name, command)
}

let commands = []

for (const command of client.commands) {
	commands.push({name: command[1].name, value: command[1].description})
}

client.on('message', msg => {
	const lowerCasedMsg = msg.content.toLowerCase()

	if(msg.author.bot) return;

	if (lowerCasedMsg.startsWith(prefix)) {
		const eachWord = lowerCasedMsg.split(" ")
		const command = eachWord[0].substr(2)
		eachWord.shift()
		const args = eachWord

		if (client.commands.has(command)) {
			try {
				client.commands.get(command).run(msg, args)
			} catch (err) {
				console.log(`Something went wrong executing command: ${err}`)
			}
		}
		
		else if (command == 'ping') {
			msg.channel.send('pong');
		}
		
		else if (command == 'help') {
			const helpEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Commands')
			    .setDescription('You can see the commands of GRIM BOT here')
			    .addFields(commands)
			    .setImage('https://thumbs.dreamstime.com/z/help-11277.jpg')
			    .setFooter('Developed by @DeadlineBoss & @Ranger');
			
			msg.channel.send(helpEmbed);
		}
	} else if (lowerCasedMsg.startsWith('hm')) {
		const randInt = Math.floor(Math.random() * 5)
		const greetBack = lowerCasedMsg.slice(0, -1) + (lowerCasedMsg.substr(-1).repeat(randInt))
		msg.channel.send(greetBack)
		updatePoint(msg.author);
	}
});

client.on('messageReactionAdd', (reaction, user) => {
	if (reaction.message.id == 873024241791012904) {
		reaction.message.channel.guild.roles.fetch(873026246030811167)
		.then()
	}
})

keepAlive()
client.login(token)
