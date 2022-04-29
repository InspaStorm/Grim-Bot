import {MongoClient} from 'mongodb';

const mongoClient = new MongoClient(process.env.dbKey)

export const db = mongoClient.db('Grim-Town')

export async function startDb() {    
    await mongoClient.connect()
}