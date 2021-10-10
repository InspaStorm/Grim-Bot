const discord = require('discord.js');
const {db} = require('../../misc/initializer');

module.exports = {
	
	name: 'leaderboard',
	description:'Preview the chad chatters',

	async run(msg, args, author = msg.author, isInteraction = false) {

        const collection = db.collection('Chat')

        collection.find().sort({count: -1}).limit(10).toArray()
        .then(res => {
            let i = 1;
            let placeHolders= '';
            for (let entry of res) {
                placeHolders = placeHolders + `${i}. ${entry.name} - ${entry.count}\n`
                i ++
            }
            
            const leaderboard = new discord.MessageEmbed()
            .setTitle(`Chad Chatters!`)
            .setDescription('Placeholders in chatting \`Hmm\`')
            .addField('Leaderboard', placeHolders)
            .setColor('#FF0000')

            return ({embeds:[leaderboard] })
        })
	}

}