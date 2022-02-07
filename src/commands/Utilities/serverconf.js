import {db} from '../../startup/database.js';

export default {
	name: 'serverconf',
	description: 'Edit server config of this bot',
	alias: ['sc'],

	async run(msg, args, author = msg.author, isInteraction = false) {
    const collection = db.collection('server-conf')
    if (!msg.member.permissions.has('MANAGE_GUILD')) return {content: 'You are lacking permission of: `Manage Server` =/'}

    return{content:'hi'}
	}
}
