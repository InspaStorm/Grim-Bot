export default {

	name: 'ping',
	description:'pong',
	alias: [''],

	async run(msg, args, author, isInteraction = false) {
		if (isInteraction) return {content: 'Oopsie, send `g!ping` in chat to check my ping..'}
		const newMsg = await msg.reply({content:'🧮 Calculating ping...'})
		const botLatency = newMsg.createdTimestamp - msg.createdTimestamp
		await newMsg.delete();
		return ({content: `The ping was found to be ${botLatency} ms`})
	}

}
