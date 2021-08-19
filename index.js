const {token} = require('./config.js');
const discord = require('discord.js');
const {keepAlive} = require('./server.js');
const fs = require('fs');
const {startDb, updatePoint} = require('./misc/chatPoints');
const {updateLevel} = require('./misc/levels');
const {initAchievement, lookForAchievement} = require('./misc/achievementCheck.js'); 
const music = require('./music/music.js');
const achievementList = require('./commands/Achievements/achievementList.json');
const path = require('path');

const {prefix} = require('./config.js')
const client = new discord.Client();

// Currently available music commands
const musicCmds = ['play', 'leave']

var lockAchievements;

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

// Loading all the commands and Setting up all things for help command
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

commandsInfo.push({
	name: `Music`,
	value: `\n\`Play:\`\nPlays The specified music\n\n\`Leave:\`\nLeaves The author's VC\n`
})

// Checks if user has completed all achievements if not looks for if he completed any achievements
function lookingAchievements(msg, author, lockAchievements) {
	try {
		const achievements = lockAchievements.get(author.id)
		if (achievements == undefined || achievements.achievements.length != achievementList.length) {
			let res = lookForAchievement(msg, author, lockAchievements)
			if (res == 'Achievement Found') initAchievement()
		}
	} catch (err) {
		 console.log('error: ', err)
	}
}

client.on('message', msg => {
	const lowerCasedMsg = msg.content.toLowerCase()

	if(msg.author.bot) return;

	lookingAchievements(msg, msg.author, lockAchievements)
	
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
			const attachment = new discord.MessageAttachment('./pics/embed/help.png', 'help.png')
			const helpEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Commands')
			    .setDescription('You can see the commands of GRIM BOT here')
			    .addFields(commandsInfo)
			    .attachFiles(attachment)
			    .setImage('attachment://help.png')
			    .setFooter('Developed by the InspaStorm Team @DeadlineBoss & @Ranger');
			
			msg.channel.send(helpEmbed);
		}

		else if (musicCmds.includes(command)) {
			music.command(command, msg, args)
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

startDb()

setTimeout(async () => {
	lockAchievements = initAchievement()
}, 2000)

setTimeout(() => client.login(token), 2000)