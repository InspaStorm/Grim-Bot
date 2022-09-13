import { cwd } from "node:process";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
export default class dbManager {
    constructor(name) {
        if (cwd() == path.resolve(`${__dirname}/../..`)) {
            this.init(name);
        }
        else {
            this.collection = null;
        }
    }
    async init(name) {
        const dbFile = await import(`${__dirname}/../startup/database.js`);
        const db = dbFile.db;
        this.collection = db.collection(name);
    }
    async singleFind(query) {
        const res = await this.collection.findOne(query);
        return res;
    }
    async multiFind(query, returnArr = true) {
        const res = await this.collection.find(query);
        if (returnArr) {
            const arr = res.toArray();
            return arr;
        }
        return res;
    }
    async singleUpdate(query, updateValue) {
        return await this.collection.updateOne(query, updateValue);
    }
    async singleInsert(insertValue) {
        await this.collection.insertOne(insertValue);
    }
    async executeCustom(callback) {
        const result = await callback(this.collection);
        return result;
    }
}
