import {db} from '../startup/database.js'

export async function singleFind(collectionName, query) {
    const collection = db.collection(collectionName)

    const res = await collection.findOne(query)

    return res;
}

export async function multiFind(collectionName, query, returnArr = true) {
    const collection = db.collection(collectionName)

    const res = await collection.find(query)

    if (returnArr) {
        const arr = res.toArray()
        return arr;
    }
    return res;
}

export async function singleUpdate(collectionName, query, updateValue) {
    const collection = db.collection(collectionName)

    await collection.updateOne(query, updateValue)
}

export async function singleInsert(collectionName, insertValue) {
    const collection = db.collection(collectionName)

    await collection.insertOne(insertValue)
}
