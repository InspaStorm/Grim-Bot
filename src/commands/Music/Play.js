const discord = require('discord.js');
const { vid } = require('../../music/ytSearch')
const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

global.connectedGuilds = new Map();

class Track {
	constructor(msg, vcId, connection, songs) {
		this.vcId = vcId;
		this.audioPlayer = new createAudioPlayer();
		this.queue = songs;
		this.connection = connection;

		this.audioPlayer.on('stateChange', (oldState, newState)=> {
			if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
				const queue = connectedGuilds.get(msg.guild.id).queue
				if (queue.length > 0) {
					const nextSong = createAudioResource(ytdl(queue[0].url))
					return (`going to play: \`${queue[0].title}\``)
					this.audioPlayer.play(nextSong)
					connectedGuilds.get(msg.guild.id).queue.shift();
				}
			}
		});

        this.audioPlayer.on('error', err => {
            console.log(err)
        })

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

module.exports = {

    name: 'play',
    description: 'Plays the specified music',
    options: [
        {name: 'song', desc:'The name / Yt url of the song you want to play',required: true, type: 'string'}
    ],

    async run(msg, args, author = msg.author, isInteraction = false) {
        
        let query;

        if (isInteraction) {
            query = args.getString('song');
        } else {
            query = args.join(" ");
        }
        if (msg.guild.id == '802904126312808498') {
            return ("I can't play any songs in this server (coz Am playing some lofi beats 24/7), Why not add me to your server and play the songs there ;)")
        } else if (msg.member.voice.channel) {
    
            const authorVc = msg.member.voice.channel;

            if (connectedGuilds.has(msg.guild.id) && connectedGuilds.get(msg.guild.id).vcId != authorVc.id) {
        
                return ('Im active in another vc =/');
        
            } else {

                let searchResult = [];
  
                searchResult.push(await vid(query))
        
                // checking if a video/playlist was found or not
                if (typeof searchResult[0] == 'string' || typeof searchResult[0].title == 'undefined') {
                    return ('Thats not a valid video')
                    return
                }
                const connection = joinVoiceChannel({
                    channelId: authorVc.id,
                    guildId: authorVc.guild.id,
                    adapterCreator: authorVc.guild.voiceAdapterCreator
                })
        
                
        
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
                        return (`**Queue:**\n\`\`\`${songNames.join('\n')}\`\`\``);
                    } else {
                        return (`Added ${searchResult[0].title} to queue`)
                    }
                // Creates a new instance for track class and plays the music
                } else {
        
                    const trackInfo = new Track(msg, authorVc.id, connection, [])
        
                    connectedGuilds.set(msg.guild.id, trackInfo)
                    for (let videoDetails of searchResult) {
                        connectedGuilds.get(msg.guild.id).queue.push(videoDetails)
                    }
                    const player = connectedGuilds.get(msg.guild.id).audioPlayer
                    const song = createAudioResource(ytdl(searchResult[0].url))
                    return (`going to play: \`${searchResult[0].title}\``)
                    player.play(song)
        
                    connection.subscribe(player)
                    connectedGuilds.get(msg.guild.id).queue.shift();
                }
        
            }
    
        } else return ('You have to be in a Voice Channel to run this command')
    }
}