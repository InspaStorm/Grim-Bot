const {MongoClient} = require('mongodb')
const {dbUrl} = require('../../config')

const mongo = new MongoClient(dbUrl)
const db = mongo.db('Grim-Town')

async function openDb() {
    await mongo.connect()
    console.log('Database is open!')
}

module.exports = {
    startDb: openDb,
    db: db
}