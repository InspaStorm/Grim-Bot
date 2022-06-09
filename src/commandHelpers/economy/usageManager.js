import { Collection } from "discord.js";

export default class ItemUsageManager {
    constructor() {
        this.confirmationPending = new Collection();
    }

    addNewEntry(ownerId, itemDetails) {
        this.confirmationPending.set(ownerId, itemDetails)
        setTimeout(() => this.remove(ownerId), 30_000)
    }

    get(ownerId) {
        const itenDetails = this.confirmationPending.get(ownerId)
    }

    has(ownerId) {
		return this.confirmationPending.has(ownerId)
	}

    remove(ownerId) {
        this.confirmationPending.delete(ownerId)
    }

}