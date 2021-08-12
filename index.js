const {token} = require('./config.js');
const discord = require('discord.js');
const {keepAlive} = require('./server.js');
const fs = require('fs');
const {startDb, updatePoint} = require('./misc/chatPoints')
const {updateLevel} = require('./misc/levels')
const {initAchievement, lookForAchievement} = require('./misc/achievementCheck.js')

const path = require('path')

const {prefix} = require('./config.js')
const client = new discord.Client();

const lockAchievements = new Set();
//Declaring variables for achivements
var hmmGoBrrr = 0;
var officalServerMsg = 0;
var achivementsDone = [];

client.on('ready' , () => {

	client.user.setPresence({
        	activity: {
        		name: 'Grim Town | g!help',
        		type: "PLAYING",
        	},
        	status: 'idle'
	})
		.then(console.log(`${client.user.tag} logged on!`))
		.catch(err => console.log(err));
	startDb()
});

const commandFiles = fs.readdirSync('./commands')

client.commands = new discord.Collection();

// Loading all the commands
let commandsInfo = []
let i = -1
for (const folder of commandFiles) {

	const commandFolders = fs.readdirSync(`./commands/${folder}`)
	i ++

	for (const file of commandFolders) {

		if (path.extname(`./commands/${folder}/${file}`) == '.js') {

			const command = require(`./commands/${folder}/${file}`)

			client.commands.set(command.name,command)

			// Setting up help commmand dynamically
			if (Object.values(commandsInfo).some(r => r.name == folder)) {

				commandsInfo[i].value += `\n\`${command.name}:\`\n${command.description}\n`
			} else {
				const newCmdObjects = {
					name: `${folder}`,
					value: `\n\`${command.name}:\`\n${command.description}\n`
				}
				commandsInfo.push(newCmdObjects)
			}
		}
	}

}

client.once('message', () => initAchievement(lockAchievements))

client.on('message', msg => {
	const lowerCasedMsg = msg.content.toLowerCase()

	if(msg.author.bot) return;
	
	updateLevel(msg);

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

		else if (command == 'help') {
			const helpEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Commands')
			    .setDescription('You can see the commands of GRIM BOT here')
			    .addFields(commandsInfo)
			    .setImage('https://thumbs.dreamstime.com/z/help-11277.jpg')
			    .setFooter('Developed by the InspaStorm Team @DeadlineBoss & @Ranger');
			
			msg.channel.send(helpEmbed);
		}
	}

  
  	if (lowerCasedMsg.startsWith('hm')) {
		const randInt = Math.floor(Math.random() * 5);
		const luck = Math.floor(Math.random() * 101);

		const customReplies = [
			'hmmm hmmmmm huh?!?!',
			'HMMMMMMMMMM!!!!!',
			'hmm :l',
			'hmmmmmm hmmm hm hmm :( [Translation: Steve took my bed :(]',
			'hmmmmmmm hmmm hmmm >:3'
		]

		if(luck > 5) {
			const greetBack = lowerCasedMsg.slice(0, -1) + (lowerCasedMsg.substr(-1).repeat(randInt))
			msg.channel.send(greetBack)
			updatePoint(msg.author);
		}

		else if(luck <= 5) {
			msg.channel.send(customReplies[luck - 1])
		}
	}
});

keepAlive()
client.login(token)