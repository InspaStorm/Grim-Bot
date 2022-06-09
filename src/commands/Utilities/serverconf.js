import dbManager from '../../helpers/dbCrud.js';
import {lockLevel} from '../../startup/featureLocks.js'

const collection = new dbManager('server-conf');

const currentFeatures = ['level', 'custom_replies']
const validDecisions = ['on', 'off']

export default {
	name: 'serverconf',
	description: 'Edit server config of this bot',
	alias: ['sc'],
	options: [
    {name: "feature", desc: "Name of the feature to be changed", required: true,type: "string", choices: currentFeatures},
	{name: "decision", desc: "Your decision on how to change it", required: true, type: "string", choices: validDecisions},
  ],

	/**
     * 
     * @param {Message} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(msg, args, author = msg.author, isInteraction = false) {
    	if (!msg.member.permissions.has('MANAGE_GUILD')) return {content: 'You are lacking permission of: `Manage Server` =/'}
		let featureName;
		let decision;
		if (isInteraction) {

			featureName = msg.options.getString('feature')
			decision = msg.options.getString('decision')

		} else {
			featureName = args[0]
			decision = args[1]
			const cmdFormat = 'Command format: `g!server-conf <feature name> <decision>`\nEg: **g!server-conf level on**'

			if (!currentFeatures.includes(featureName)) return {content: `**${featureName}** is not an available feature\nfeatures include: \`${currentFeatures.join(', ')}\`\n\n${cmdFormat}`};
			if (!validDecisions.includes(decision)) return {content: `**${decision}** is not a valid option\nValid options: \`${validDecisions.join(', ')}\`\n\n${cmdFormat}`};
		}

		const entry = await collection.singleFind({guildId: msg.guild.id});

		if (entry != null) {

			await collection.singleUpdate({guildId: msg.guild.id}, {$set: {[featureName]: decision}})

			await lockLevel(msg.client)
			return {content: `**${featureName} system** has been turned **${decision}** for this server!`}

		} else {
			const newGuildEntry = {
				guildId: msg.guild.id,
				level: 'on',
				custom_replies: 'on'
			}

			newGuildEntry[featureName] = decision

			await collection.singleInsert(newGuildEntry)
			return {content: `🎉 **${featureName}** has been turned **${decision}** on this server for the 1st time!`}
		}
	}
}
