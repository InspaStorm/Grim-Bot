const discord = require('discord.js')
const ytdl = require('ytdl-core')
const { YTSearcher } = require('ytsearcher');
const {gApi} = require('../config.js')

const searcher = new YTSearcher(gApi);
const connectedGuilds = new Map();

function check(cmd, msg, args) {

	async function play(msg, args) {
		const authorVc = msg.member.voice.channel;

		if (connectedGuilds.has(msg.guild.id) && connectedGuilds.get(msg.guild.id).vc != authorVc.id) {
			msg.channel.send('Im active in another vc =/')
		} else {
			const channelInfo = {vc: authorVc.id}
			connectedGuilds.set(msg.guild.id, channelInfo)
			console.log(connectedGuilds)
			console.log(connectedGuilds.get(msg.guild.id).vc)

			const vc = await authorVc.join();
			const query = args.join(" ");
			let result = await searcher.search(query);

			const music = vc.play(ytdl(result.first.url))

			music.setVolumeLogarithmic(5 / 5);
			msg.channel.send(`Playing \`${result.first.title}\`:\n ${result.first.url}`)
		}
	}

	async function leave(msg, args) {
		try {
			msg.member.voice.channel.leave();
			connectedGuilds.delete(msg.guild.id);
		} catch {msg.channel.send('We are not in the same VC, Bruh...')}
	}

	if (msg.member.voice.channel) {

		if (cmd == 'play') play(msg, args)
		else if (cmd == 'leave') leave(msg, args)
	} else msg.channel.send('You have to be in a Voice Channel to run this command')
}
module.exports = {
	command: check
}