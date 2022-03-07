import {db} from '../../startup/database.js';
import {replier, followUp} from '../../helpers/apiResolver.js';
import discord from 'discord.js';

const shop_items = ['chm']

const item_details = [
	{itemName: 'chm', cost: 1000},
]

class item {
	constructor(buyer, name, cost) {
		this.owner = buyer
		this.name = name
		this.cost = cost
	}
}

class items {
	constructor() {
		this.pending = [];
	}

	has(buyer) {
		return this.pending.find(item => item.owner == buyer)
	}

	add(buyer, name) {
		const itemCost = item_details.find(x => x.itemName = item).cost
		
		let newItem = new item(buyer, name, itemCost)

		this.pending.push(newItem)

		return newItem
	}

	remove(buyer) {
		const indexOfPending = this.pending.findIndex(x => x.owner == buyer)

		this.pending.splice(indexOfPending, 1)

		return 'Successfull'
	}

	proceedPurchase(buyer) {
		
	}
}

const register = new items()

export default {

	name: 'shop',
	description:'Exchange THC for some spicy items',
	alias: ['redeem'],
	options: [
		{name: "item", desc: "Item to be purchased", required: true, type: "string", choices: shop_items},
	],

	async run(msg, args, author = msg.author, isInteraction = false) {
		return {content: 'WIP 🚧'}
		let item;
		if (isInteraction) {

			item = msg.options.getString('item')

		} else {
			item = args[0]
			const cmdFormat = 'Command format: `g!shop <shop item>`\nEg: **g!shop chm**'
			
			if (typeof item == 'undefined' || !shop_items.includes(item)) return {content: `**${item}** is not an available item\nitems include: \`${shop_items.join(', ')}\`\n\n${cmdFormat}`};
		}

		const pendingDeal = register.add(author.id, item)

		const buttons = new discord.MessageActionRow()
			.addComponents(
				new discord.MessageButton()
					.setCustomId('shop 1')
					.setLabel('Yes')
					.setStyle('SUCCESS'),
				new discord.MessageButton()
					.setCustomId('shop 2')
					.setLabel('No')
					.setStyle('DANGER')
			);

		return ({content: `Are you sure on buying **${pendingDeal.name}** from **${pendingDeal.cost} THP(s)**?`, components: [buttons]})

    },

	async handle(msg) {
		const args = msg.customId.split(" ")
		args.shift()

		if (args[0] == 1){
			if (register.has(msg.user.id)) {
				register.remove(msg.user.id)
				msg.update({content: 'Purchase Verified', components: []})
			}
			
		} else msg.update({content: 'Purchase Cancelled', components: []})
	}
}
