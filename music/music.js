const discord = require('discord.js');
const ytdl = require('ytdl-core');
const {vid, searchPlaylist} = require('./ytSearch.js')

const connectedGuilds = new Map();

async function play(msg, args) {
	const authorVc = msg.member.voice.channel;

	if (connectedGuilds.has(msg.guild.id) && connectedGuilds.get(msg.guild.id).vc != authorVc.id) {
		msg.channel.send('Im active in another vc =/')
	} else {
		const channelInfo = {vc: authorVc.id}
		connectedGuilds.set(msg.guild.id, channelInfo)
		console.log(connectedGuilds.get(msg.guild.id).vc)

		const vc = await authorVc.join();
		const query = args.join(" ");
		let result = await vid(query)

		const music = vc.play(ytdl(result.first.url))

		music.setVolumeLogarithmic(5 / 5);
		msg.channel.send(`Playing \`${result.first.title}\`:\n ${result.first.url}`)
	}
}

async function playlist(msg, args) {

	if (connectedGuilds.has(msg.guild.id) && connectedGuilds.get(msg.guild.id).vc != msg.member.voice.channel.id) {
		msg.channel.send('Im active in another vc =/')
	} else {
		const channelInfo = {vc: msg.member.voice.channel.id}
		connectedGuilds.set(msg.guild.id, channelInfo)
		console.log(connectedGuilds.get(msg.guild.id).vc)

		const vc = await msg.member.voice.channel.join();
		const query = args.join(" ");
		let result = await searchPlaylist(query)

		console.log(result)
		const music = vc.play(ytdl(result[0]))

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

async function check(cmd, msg, args) {

	if (msg.member.voice.channel) {

		if (cmd == 'play') {
			await play(msg, args)
		} else if(cmd == 'leave') {
			await leave(msg, args)
		} else if (cmd == 'playlist') {
			await playlist(msg, args)
		}
	} else msg.channel.send('You have to be in a Voice Channel to run this command')
}
module.exports = {
	command: check
}