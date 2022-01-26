export default {
	
	name: 'ping',
	description:'pong',

	async run(msg, args, author, isInteraction = false) {
		return ({content: 'pong'})
	}

}