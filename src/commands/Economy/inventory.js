import dbManager from '../../helpers/dbCrud.js';
import Table from 'text-table';


const inv = new dbManager('inventory')

function alteredLook(e) {
	const alias = {chm: "✉️ Custom Hmm Message Token",}

	if (Object.keys(alias).includes(e)) {
		return alias[e]
	}

	return e
}

export default {

	name: 'inventory',
	description:'Get a look inside of your inventory',
	alias: ['e', 'pocket'],
	options: [],

	/**
     * 
     * @param {Message} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(msg, args, author = msg.author, isInteraction = false) {
        const user =author
        const items = await inv.singleFind({id: user.id})

		const config = {
			border: {
			  topBody: `─`,
			  topJoin: `┬`,
			  topLeft: `┌`,
			  topRight: `┐`,
		  
			  bottomBody: `─`,
			  bottomJoin: `┴`,
			  bottomLeft: `└`,
			  bottomRight: `┘`,
		  
			  bodyLeft: `│`,
			  bodyRight: `│`,
			  bodyJoin: `│`,
		  
			  joinBody: `─`,
			  joinLeft: `├`,
			  joinRight: `┤`,
			  joinJoin: `┼`
			}
		  };
		
		// [`**${user.username}'s Inventory:**\n\n`]
		let list = [];
		list.push([`\`\`\`${user.username}'s Inventory:\`\`\``])
        
        if (items != null) {
            ['id', '_id'].forEach(key => delete items[key])

            Object.keys(items).forEach(e => list.push([`> **${alteredLook(e)}**`, `${items[e]}`]));

			list.push(['\u200b'], ['*NB: This feature is not yet completely usable =(*'])
        } else list.push(['**Empty Inventory**'])
		

		const data = Table(list, {hsep: '  **-**  '})

        return {content: data}
	}

}
