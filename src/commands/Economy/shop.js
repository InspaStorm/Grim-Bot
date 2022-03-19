import dbManager from '../../helpers/dbCrud.js';
import discord from 'discord.js';

const shop_items = ['chm']

const item_details = [
	{itemName: 'chm', cost: 1000},
]

const thc = new dbManager('thc')
const inventory = new dbManager('inventory')

class item {
	constructor(buyer, name, cost) {
		this.owner = buyer
		this.name = name
		this.cost = cost
	}
}

class Market {
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

		setTimeout(() => this.remove(buyer), 30_000)
	
		return newItem
	}

	remove(buyer) {
		const indexOfPending = this.pending.findIndex(x => x.owner == buyer)

		this.pending.splice(indexOfPending, 1)

		return {content: "Cancelled your order"}
	}

	async process(buyer) {
		let item = this.has(buyer)
		if (!item) return {content: 'Start a new session using `g!shop <item>`'}

		this.remove(buyer)
		const availablePoints = await thc.singleFind({id: item.owner})
		if (availablePoints == null) return {content: 'It seems you dont have much THP, gather some by sending `hmm` in chat'}

		if (availablePoints.count < item.cost) return {content: `You are short by **${item.cost - availablePoints.count} THP**!`}
		await thc.singleUpdate({id: buyer}, {$inc :{count: -item.cost}})
		const receipt = await this.purchase(buyer, item)
		return receipt
	}

	async purchase(buyer, itemDetails) {
		const userInventory = await inventory.singleFind({id: buyer})

		if (userInventory != null) {
			await inventory.singleUpdate({id: buyer}, {$inc: {[itemDetails.name]: 1}})
		} else {
			const newEntry = {
				id: buyer
			}

			for (let thing in shop_items) newEntry[thing] = 0;

			inventory.singleInsert(newEntry)

		}
		return {content: `You purchased **${itemDetails.name}** for **${itemDetails.cost}**!\n\nCheck it out using: **g!inventory**`}
	}
}

const register = new Market()

export default {

	name: 'shop',
	description:'Exchange THC for some spicy items',
	alias: ['redeem'],
	options: [
		{name: "item", desc: "Item to be purchased", required: true, type: "string", choices: shop_items},
	],

	async run(msg, args, author = msg.author, isInteraction = false) {
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
				const res = await register.process(msg.user.id)
				res.components = []
				msg.update(res)
			}
			
		} else {
			if (register.has(msg.user.id)) {
				const res = await register.process(msg.user.id)
				res.components = []
				msg.update(res)
			}
		}
	}
}
