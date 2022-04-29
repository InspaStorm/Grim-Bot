import dbManager from '../../helpers/dbCrud.js';

class TableCreator {

	constructor() {
		this.items = [];
		this.padding;
		this.table = [];
	}

	addItem(label, quantity) {
		const newItem = {name: label, quantity: quantity};

		this.items.push(newItem);
	}

	fixPadding() {
		let maxLen = 0;
		
		for (let item of this.items) {
			let nameLength = item.name.length
			if (nameLength > maxLen) maxLen = nameLength
		}

		this.padding = maxLen
		return this.padding
	}

	createTable() {

		this.fixPadding()

		for (let item of this.items) {

			if (item.quantity == false) {
				this.table.push(item.name)
				continue
			}

			let nameLength = item.name.length
			if (nameLength < this.padding) {
				item.name += ' '.repeat(this.padding - nameLength)
			}

			this.table.push(`> **${item.name}** **>>** ${item.quantity}`)
		}
	}
}


const inv = new dbManager('inventory')

const alias = {
	chm: 'Custom Hm Message Token'
}

function alteredLook(e) {

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
		
		const table = new TableCreator()

		table.addItem(`\`\`\`${user.username}'s Inventory:\`\`\``, false)
        
        if (items != null) {
            ['id', '_id'].forEach(key => delete items[key])
            Object.keys(items).forEach(e => table.addItem(alteredLook(e), items[e]));

        } else table.addItem('**Empty Inventory**', false)

		table.createTable()

        return {content: table.table.join('\n')}
	}

}
