import {MongoClient} from 'mongodb'
import config from '../../config.js'

let dbUrl;
const devolopment = false

if (devolopment) {
	dbUrl = config.test_dbUrl
} else {
	dbUrl = config.main_dbUrl
}

const mongo = new MongoClient(dbUrl)
export const db = mongo.db('Grim-Town')

export async function startDb(devolopment) {

    await mongo.connect()
}
