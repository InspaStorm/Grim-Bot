const { token } = require('./config.js');
const discord = require('discord.js');
const {keepAlive} = require('./server.js');
const {updatePoint} = require('./misc/chatPoints');
const {startDb} = require('./misc/initializer');
const {updateLevel} = require('./misc/levels');
const {initAchievement, lookForAchievement} = require('./misc/achievementCheck.js'); 
const music = require('./music/music.js');
const achievementList = require('./commands/Achievements/achievementList.json');
const {cmdLoader} = require('./commands/Misc/help.js');
const winston = require('winston'); // winston is A logger (customized console.log)

const {prefix} = require('./config.js')
const client = new discord.Client({intents: [discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_VOICE_STATES, discord.Intents.FLAGS.GUILDS]});
const customText = winston.format.combine(
	winston.format.colorize(),
	winston.format.printf(
		info => `[${info.level}] - ${info.message}`,
	),
);
const logger = winston.createLogger({
	transports: [
		new winston.transports.Console({ format: winston.format.combine(winston.format.colorize(), customText) }),
		new winston.transports.File({ filename: 'ConsoleLogs' }),
	],

	format: winston.format.combine(
		winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
	),
});

winston.addColors({
	error: 'red',
	warn: 'yellow',
	info: 'green',
});

client.on('warn', m => logger.log('warn', m));
client.on('error', m => logger.log('error', m));

process.on('uncaughtException', error => logger.log('error', error))

// Currently available music commands
const musicCmds = ['play', 'leave', 'playlist', 'skip']
const levelEnabledGuild = ['802904126312808498', '869218454127923220']

client.commands = new discord.Collection();
cmdLoader(client.commands);
var lockAchievements;

client.once('ready', () => {

	client.user.setPresence({
    	activities: [{
			name: 'Grim Town | g!help'
		}],
    	status: 'idle'
	});
	logger.log('info',`${client.user.tag} logged on!`)
});

// Checks if user has completed all achievements if not looks for if he completed any achievements
function lookingAchievements(msg, author, lockAchievements) {
	try {
		const achievements = lockAchievements.get(author.id)
		if (achievements == undefined || achievements.achievements.length != achievementList.length) {
			lookForAchievement(msg, author, lockAchievements)
			.then(res => {
				if (res == 'Achievement Found') initAchievement()
			})
		}
	} catch (err) {
		 console.log('error: ', err)
	}
}

client.on('messageCreate', msg => {
	const lowerCasedMsg = msg.content.toLowerCase()

	if(msg.author.bot) return;

	lookingAchievements(msg, msg.author, lockAchievements)
	
	if (levelEnabledGuild.includes(msg.guild.id)){
		updateLevel(msg);
	}

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
.then(() => {lockAchievements = initAchievement()})

keepAlive()
setTimeout(() => client.login(token), 2000)