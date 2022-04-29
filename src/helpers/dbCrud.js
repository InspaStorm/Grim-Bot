import {db} from '../startup/database.js'

export default class dbManager {
    /**
     * @param {string} name name of the collection present in db
     */
    constructor(name) {
        this.collection = db.collection(name)
    }
    
    async singleFind(query) {
      
        const res = await this.collection.findOne(query)
    
        return res;
    }
    
    async multiFind(query, returnArr = true) {
      
        const res = await this.collection.find(query)
    
        if (returnArr) {
            const arr = res.toArray()
            return arr;
        }
        return res;
    }
    
    async singleUpdate(query, updateValue, options) {
        if (options) return await this.collection.updateOne(query, updateValue)
        return await this.collection.updateOne(query, updateValue)
    }
    
    async singleInsert(insertValue) {
      
        await this.collection.insertOne(insertValue)
    }

}

