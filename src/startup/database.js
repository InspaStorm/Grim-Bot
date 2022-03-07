import {MongoClient} from 'mongodb'
import fs from 'fs';
import config from '../../config.js'

const dbUrl = (fs.existsSync('./.dev')) ? config.test_dbUrl : config.main_dbUrl;

const mongoClient = new MongoClient(dbUrl)

export const db = mongoClient.db('Grim-Town')

export async function startDb() {    
    await mongoClient.connect()
}