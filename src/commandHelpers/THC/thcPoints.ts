import { User } from 'discord.js';
import dbManager from '../../database/dbCrud.js';
const recentMsg = new Set();

const collection = new dbManager('thc')

async function createNewEntry(collection: dbManager, user: User) {
    const pointInit = {
        id: user.id,
        name: user.username,
        count: 1
    }

    await collection.singleInsert(pointInit)
}

export async function updateThcPoint(user: User) {
    if (recentMsg.has(user.id)) return;

    recentMsg.add(user.id)
    setTimeout(() => {recentMsg.delete(user.id)}, 1500)

    const res = await collection.singleFind({id: user.id})
    if (res == null) {
        await createNewEntry(collection, user)
        return;
    }

    if (typeof res.id != 'undefined') {
        if (res.name != user.username) collection.singleUpdate({id: user.id}, {$set: {name: user.username}})
        collection.singleUpdate({id: `${user.id}`}, {$inc: {count: 1}})
    } else await createNewEntry(collection, user)
}
