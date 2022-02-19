import {db} from '../startup/database.js';
const recentMsg = new Set();

export async function updateThcPoint(user) {
    if (recentMsg.has(user.id)) return;

    recentMsg.add(user.id)
    setTimeout(() => {recentMsg.delete(user.id)}, 1500)
    const collection = db.collection('Chat')

    const res = await collection.findOne({id: user.id})
    if (typeof res != 'null' && typeof res.id != 'undefined') {
        if (res.name != user.username) collection.updateOne({id: user.id}, {$set: {name: user.username}})
        collection.updateOne({id: `${user.id}`}, {$inc: {count: 1}})
    } else {
        const pointInit = {
            id: user.id,
            name: user.username,
            count: 1
        }

        await collection.insertOne(pointInit)
    }
}
