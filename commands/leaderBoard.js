const tasks = require('../tasks.json');
const discord = require('discord.js');
const {dbUrl} = require('../config');
const {MongoClient} = require('mongodb')

module.exports = {
	
	name: 'leaderboard',
	description:'Preview the chad chatters',

	run(msg, args) {
        const client = new MongoClient(dbUrl)

        const sentMessage = msg.channel.send('Preparing leaderboard...')
		client.connect(err => {

            const db = client.db('Grim-Town')
            const collection = db.collection('Chat')

            collection.find().sort({count: -1}).limit(10).toArray()
            .then(res => {
                let i = 1;
                let placeHolders= '';
                for (let entry of res) {
                    placeHolders = placeHolders + `${i}.${entry.name} - ${entry.count}\n`
                    i ++
                }
                
                const leaderboard = new discord.MessageEmbed()
                .setTitle(`Chad Chatters!`)
                .setDescription('Placeholders in chatting \`Hmm\`')
                .addField('Tasks', placeHolders)

                sentMessage.delete()
                msg.channel.send(leaderboard)
            })
        })
	}

}