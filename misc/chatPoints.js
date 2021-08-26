const {db} = require('./initializer.js');
const recentMsg = new Set();

function updatePoints(user) {
    if (recentMsg.has(user.id)) return;

    else {

        recentMsg.add(user.id)
        setTimeout(() => {recentMsg.delete(user.id)}, 1500)
        const collection = db.collection('Chat')

        collection.find({id: `${user.id}`}).toArray()
        .then( res => {
            if (res.length > 0) {
                collection.updateOne({id: `${user.id}`}, {$inc: {count: 1}})
            } else {
                const pointInit = {
                    id: user.id,
                    name: user.username,
                    count: 1
                }

                collection.insertOne(pointInit)
            }
        })
    }
}

module.exports = {
    updatePoint: updatePoints
}