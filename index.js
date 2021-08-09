const {token} = require('./config.js');
const discord = require('discord.js');
const {keepAlive} = require('./server.js');
const fs = require('fs');
const {updatePoint, startDb} = require('./misc/chatPoints')
const {updateLevel} = require('./misc/levels.js')


const {prefix} = require('./config.js')
const client = new discord.Client();

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

		else if (command == 'help') {
			const helpEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Commands')
			    .setDescription('You can see the commands of GRIM BOT here')
			    .addFields(commands)
			    .setImage('https://thumbs.dreamstime.com/z/help-11277.jpg')
			    .setFooter('Developed by the InspaStorm Team @DeadlineBoss & @Ranger');
			
			msg.channel.send(helpEmbed);
		}

    else if (command == 'achivements') {
      const achivementsEmbed = new discord.MessageEmbed()
        .setColor('#00ffff')
        .setTitle('Achivement Unlocked')
        .addFields(achivementsDone)
        .setThumbnail(msg.author.avatarURL())
      
      msg.reply(achivementsEmbed);   
    }
	}

  if(lowerCasedMsg == 'hmm') {
    console.log(hmmGoBrrr);
		if(hmmGoBrrr == 0) {
      const hmmGoBrrrEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Achivement Unlocked')
          .addFields(
		        { name: 'The Perfect hmm', value: 'hmm go BRRRRRRRR' }
          )

			msg.reply(hmmGoBrrrEmbed);
			hmmGoBrrr = hmmGoBrrr + 1;
      achivementsDone.push({ name: 'The Perfect hmm', value: 'hmm go BRRRRRRRR' })
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

	else if(msg.guild.id == 802904126312808498) {
		if(officalServerMsg == 0) {
      const officalServerMsgEmbed = new discord.MessageEmbed()
			    .setColor('#00ffff')
			    .setTitle('Achivement Unlocked')
          .addFields(
		        { name: 'Chat with the devs!!', value: 'Message in the offical InspaStorm Server' }
          )

			msg.reply(officalServerMsgEmbed);
			officalServerMsg = officalServerMsg + 1;
      achivementsDone.push({ name: 'Chat with the devs!!', value: 'Message in the offical InspaStorm Server' })
		}
	}
});

keepAlive()
client.login(token)