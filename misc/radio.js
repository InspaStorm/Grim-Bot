const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

async function playRadio(client) {
	try {
		const authorVc = await client.channels.fetch('894967573278511155')

		const connection = joinVoiceChannel({
			channelId: authorVc.id,
			guildId: authorVc.guild.id,
			adapterCreator: authorVc.guild.voiceAdapterCreator
		})

		const audioPlayer = new createAudioPlayer()

		const radioStation = createAudioResource('https://coderadio-relay-blr.freecodecamp.org/radio/8010/low.mp3')
		
		audioPlayer.play(radioStation)

		connection.subscribe(audioPlayer)
	} catch(e) {
		console.log("Error while starting the 24/7 radio:\n\t", e);
	}

}

module.exports = {playRadio}