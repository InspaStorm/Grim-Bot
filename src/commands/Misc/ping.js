export default {

	name: 'ping',
	description:'pong',

	async run(msg, args, author, isInteraction = false) {
		const newMsg = await msg.reply({content:'🧮 Calculating ping...'})
		const botLatency = newMsg.createdTimestamp - msg.createdTimestamp
		await newMsg.delete();
		return ({content: `The ping was found to be ${botLatency} ms`})
	}

}
