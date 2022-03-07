import {db} from '../startup/database.js';
const recentMsg = new Set();

const collection = db.collection('thc')

async function createNewEntry(collection, user) {
    const pointInit = {
        id: user.id,
        name: user.username,
        count: 1
    }

    await collection.insertOne(pointInit)
}

export async function updateThcPoint(user) {
    if (recentMsg.has(user.id)) return;

    recentMsg.add(user.id)
    setTimeout(() => {recentMsg.delete(user.id)}, 1500)

    const res = await collection.findOne({id: user.id})
    if (res == null) {
        await createNewEntry(collection, user)
        return;
    }

    if (typeof res.id != 'undefined') {
        if (res.name != user.username) collection.updateOne({id: user.id}, {$set: {name: user.username}})
        collection.updateOne({id: `${user.id}`}, {$inc: {count: 1}})
    } else await createNewEntry(collection, user)
}
