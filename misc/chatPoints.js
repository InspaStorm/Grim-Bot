const {MongoClient} = require('mongodb')
const {dbUrl} = require('../config.js')

const client = new MongoClient(dbUrl)

function updatePoints(user) {
    
    client.connect(()=> {
        
        const db = client.db('Grim-Town')
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
        .then(client.close())
    })
}

module.exports = {updatePoint: updatePoints}