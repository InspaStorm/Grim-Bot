const {MongoClient} = require('mongodb')
const {dbUrl} = require('../config.js')

const mongo = new MongoClient(dbUrl)
const db = mongo.db('Grim-Town')

function openDb() {
    mongo.connect()
    .then(console.log('Database is open!'))
}

function updatePoints(user) {

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

module.exports = {
    updatePoint: updatePoints,
    startDb: openDb,
    db: db
}