module.exports = {
	
	name: 'ping',
	description:'pong',

	run(msg, args, author=author) {
		msg.reply({content: 'pong'})
	}

}