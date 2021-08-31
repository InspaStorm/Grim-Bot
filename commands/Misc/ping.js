module.exports = {
	
	name: 'ping',
	description:'pong',

	run(msg, args) {
		msg.channel.send({content: 'pong'})
	}

}