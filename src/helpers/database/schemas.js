import dbManager from "../dbCrud.js";

export class Inventory extends dbManager {
    constructor(userId) {
        super('inventory');
        this.id = userId;
        this.items = [];

        this.validItems = ["chm"]
    }

    async find() {
        const doc = await this.singleFind({id: this.userId});
        if (!doc) return doc

        this.items = doc.items

        return doc
    }

    async addItem(item) {
        const isValidItem = this.validItems.includes(item.toLowerCase())

        if (!isValidItem) return 'Thats not a valid item';
        await this.singleUpdate({id: this.id,"items.name": item.toLowerCase()},{$inc: {"items.$.quantity": 1}})

        return true;
    }
}