import {cmdLoader} from '../../startup/commandLoader.js'

export default {
	name: 'reloadcmd',
	description: 'reloads Command',
	alias: ['r', 'reload'],
	isStaff: true,

	async run(msg, args, author, isInteraction) {
		if (author.id != "599489300672806913") return {content: 'Currently only Ranger can use this command =)'}
    await cmdLoader(msg.client.commands)
    return {content: 'Commands got reloaded'}
	}
}
