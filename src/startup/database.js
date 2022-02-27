import {MongoClient} from 'mongodb'
import config from '../../config.js'

const test_dbUrl = config.test_dbUrl
const main_dbUrl = config.main_dbUrl

const test_mongo = new MongoClient(test_dbUrl)
const main_mongo = new MongoClient(main_dbUrl)
export const db = main_mongo.db('Grim-Town')

export async function startDbAsDev() {

    await test_mongo.connect()
}

export async function startDbAsProd() {

    await main_mongo.connect()
}
