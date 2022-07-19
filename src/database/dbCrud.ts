import { cwd } from 'node:process';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Collection } from 'mongodb';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default class dbManager {
    collection!: Collection | null;

    constructor(name: string) {
        if (cwd() == path.resolve(`${__dirname}/../..`)) {
            this.init(name)
        } else {
            this.collection = null;
        }
    }

    async init(name: string) {
        const dbFile = await import(`${__dirname}/../startup/database.js`)
        const db = dbFile.db
        this.collection = db.collection(name)
    }
    
    async singleFind(query: Object) {
        
        const res = await this.collection!.findOne(query)
    
        return res;
    }
    
    async multiFind(query: Object, returnArr = true) {
      
        const res = await this.collection!.find(query)
    
        if (returnArr) {
            const arr = res.toArray()
            return arr;
        }
        return res;
    }
    
    async singleUpdate(query: Object, updateValue: Object) {
        return await this.collection!.updateOne(query, updateValue)
    }
    
    async singleInsert(insertValue: Object) {
      
        await this.collection!.insertOne(insertValue)
    }

    async executeCustom(callback: CallableFunction) {
        const result = await callback(this.collection);
        return result
    }

}

