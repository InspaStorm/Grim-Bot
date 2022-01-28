import {MongoClient} from 'mongodb'
import config from '../../config.js'

const dbUrl = config.dbUrl

const mongo = new MongoClient(dbUrl)
export const db = mongo.db('Grim-Town')

export async function startDb() {
    await mongo.connect()
}
