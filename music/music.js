const discord = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const {vid, searchPlaylist} = require('./ytSearch.js')

const connectedGuilds = new Map();

class Track {
	constructor(vcId, audioPlayer, songs) {
		this.vcId = vcId;
		this.audioPlayer = audioPlayer;
		this.queue = songs;
	}

	skip() {
		if (this.queue.length > 0){
			const queueSong = this.queue[0];
			this.queue.shift();
			return queueSong;
		} else {
			this.audioPlayer.stop();
		}
	}

	stop() {
		this.queue.clear();
		this.audioPlayer.stop();
	}
}

async function play(msg, args, playlist) {
	const authorVc = msg.member.voice.channel;

	if (connectedGuilds.has(msg.guild.id) && connectedGuilds.get(msg.guild.id).vcId != authorVc.id) {

		msg.channel.send('Im active in another vc =/');

	} else {
		const query = args.join(" ");

		let searchResult = [];

		if (playlist) {
			const queriedPlaylist = await searchPlaylist(query)
			for (let video of queriedPlaylist) {
				searchResult.push({title: video.title, url: video.url})
			}
		} else {
			searchResult.push(await vid(query))
		}

		// checking if a video/playlist was found or not
		if (typeof searchResult[0] == 'string' || typeof searchResult[0].title == 'undefined') {
			msg.channel.send('Thats not a valid video/playlist (url is not supportedd yet =( ))')
			return
		}
		const connection = joinVoiceChannel({
			channelId: authorVc.id,
			guildId: authorVc.guild.id,
			adapterCreator: authorVc.guild.voiceAdapterCreator
		})

		const player = new createAudioPlayer();

		// Check if the author is in the same vc as the bot
		if (connectedGuilds.has(msg.guild.id) && connectedGuilds.get(msg.guild.id).vcId == authorVc.id) {

			for (let videoDetails of searchResult) {
				connectedGuilds.get(msg.guild.id).queue.push(videoDetails)
			}
			const songDatas = connectedGuilds.get(msg.guild.id).queue

			const songNames = [];

			if (songDatas.length > 0) {
				for (let i of songDatas) {
					songNames.push(i.title)
				}
				msg.channel.send(`**Queue:**\n\`\`\`${songNames.join('\n')}\`\`\``);
			} else {
				msg.channel.send(`Added ${searchResult[0].title} to queue`)
			}
		// Creates a new instance for track class and plays the music
		} else {

			const trackInfo = new Track(authorVc.id, player, [])

			connectedGuilds.set(msg.guild.id, trackInfo)

			for (let videoDetails of searchResult) {
				connectedGuilds.get(msg.guild.id).queue.push(videoDetails)
			}
			
			const song = createAudioResource(ytdl(searchResult[0].url))
			msg.channel.send(`going to play: \`${searchResult[0].title}\``)
			player.play(song)

			connection.subscribe(player)
			connectedGuilds.get(msg.guild.id).queue.shift();
		}

		player.on(AudioPlayerStatus.stateChange, (oldState, newState)=> {
			console.log('complete=====', oldState, '===>', newState)
			if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
				console.log('complete!!!!!!!!!!1')
				const queue = connectedGuilds.get(msg.guild.id).songs
				if (queue.length > 0) {
					const nextSong = createAudioResource(ytdl(queue[0].url))
					msg.channel.send(`going to play: \`${queue[0].title}\``)
					player.play(nextSong)
					connectedGuilds.get(msg.guild.id).songs.shift();
				}
			}
		})

	}
}

async function skip(msg,args) {
	if (connectedGuilds.has(msg.guild.id) && connectedGuilds.get(msg.guild.id).vcId != msg.member.voice.channel.id) {

		msg.channel.send('Im not in your vc =/');

	} else {
		const queue = connectedGuilds.get(msg.guild.id).queue
		const player = connectedGuilds.get(msg.guild.id).audioPlayer
		if (queue.length > 0) {
			const nextSong = createAudioResource(ytdl(queue[0].url))
			msg.channel.send(`going to play: \`${queue[0].title}\``)
			player.play(nextSong)
			connectedGuilds.get(msg.guild.id).queue.shift();
		} else {
			player.stop();
			msg.channel.send('There are no songs in the queue!')
		}
	}
}

async function leave(msg, args) {
	if (connectedGuilds.has(msg.guild.id) && connectedGuilds.get(msg.guild.id).vcId != msg.member.voice.channel.id) {

		msg.channel.send('Im not in your vc =/');

	} else {
		const player = connectedGuilds.get(msg.guild.id).player
		const connection = getVoiceConnection(msg.guild.id)
		player.stop();
		connection.destroy();
		connectedGuilds.delete(msg.guild.id)
	}
}

async function check(cmd, msg, args) {

	if (msg.member.voice.channel) {

		if (cmd == 'play') {
			await play(msg, args, false)
		} else if(cmd == 'leave') {
			await leave(msg, args)
		} else if (cmd == 'playlist') {
			await play(msg, args, true)
		} else if (cmd == 'skip') {
			await skip(msg, args)
		}

	} else msg.channel.send('You have to be in a Voice Channel to run this command')
}
module.exports = {
	command: check
}