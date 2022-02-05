import {db} from '../startup/database.js';
const recentMsg = new Set();

export async function updatePoint(user) {
    if (recentMsg.has(user.id)) return;

    else {

        recentMsg.add(user.id)
        setTimeout(() => {recentMsg.delete(user.id)}, 1500)
        const collection = db.collection('Chat')

        const res = await collection.find({id: `${user.id}`}).toArray()
        if (res.length > 0) {
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
}
