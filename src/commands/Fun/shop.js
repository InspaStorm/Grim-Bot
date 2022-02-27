
export default {

	name: 'shop',
	description:'Exchange THC for some spicy items',
	alias: ['redeem'],
	options: [],

	async run(msg, args, author = msg.author, isInteraction = false) {
        return {content: 'It seems shop is out of stock ||Yikes||'}
    }
}
