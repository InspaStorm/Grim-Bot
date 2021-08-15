const discord = require('discord.js')
const ytdl = require('ytdl-core')
const { YTSearcher } = require('ytsearcher');
const {gApi} = require('../../config.js')

const searcher = new YTSearcher(gApi);

module.exports = {
	
	name: 'play',
	description: 'Plays some Jam music',

	run(msg, args) {
		const query = args.join(" ");
		async function play(query) {
			let result = await searcher.search(query);

			const voiceChannel = await msg.member.voice.channel.join()
			const music = voiceChannel.play(ytdl(result.first.url))
			music.setVolumeLogarithmic(5 / 5);
			msg.channel.send(`Playing \`${result.first.title}\`:\n ${result.first.url}`)
		}

		play(query)

	}
}