const {token} = require('./config.js')
const discord = require('discord.js');
const keys = require('./token.json')
const {keepAlive} = require('./server.js')

const client = new discord.Client();

client.on('message', msg => {
	const lowerCasedMsg = msg.content.toLowerCase()

	if (lowerCasedMsg == 'task') {
		msg.channel.send('No tasks!')
	}
})

keepAlive()
client.login(token)