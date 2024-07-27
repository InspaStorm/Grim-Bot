import { Collection } from 'mongodb';
import dbManager from '../database/dbCrud.js';

const serverConfigDb = new dbManager('server-conf');
const achievementDb = new dbManager('level');


export default async function initAllLocks() {
    global.locks.clear();
    
    await lockLevel(true);
    await lockAchievements(true);
    await lockCustomReplies(true);
}

export async function lockLevel(isInitialize = false) {

    global.locks.delete('level')

    const dbEntry = await serverConfigDb.executeCustom((collection: Collection) => collection.find({}).toArray());

    const levelEnabledGuild: string[] = [];

    for (let guild of dbEntry) {
        if (guild.level == 'on') levelEnabledGuild.push(guild.guildId);
    }

    global.locks.set('level', levelEnabledGuild)
}

export async function lockAchievements(isInitialize = false) {

    global.locks.delete('achievement')

    const dbEntry = await achievementDb.executeCustom((collection: Collection) => collection.find({}).toArray());

    type userEntry = {
        id: string,
        achievements: number[]
    }

    let userDetails: userEntry[] = [];

    let user;
    for (user of dbEntry) {

        if (user.achievements.length > 0) {


            let eachUser: userEntry = {id: user.id, achievements: []}
            let achievement;

            for (achievement of user.achievements) {
                eachUser.achievements.push(achievement)
            }

            userDetails.push(eachUser)
        }
    }

    global.locks.set('achievement', userDetails)
}

export async function lockCustomReplies(isInitialize = false) {

    global.locks.delete('custom_reply')

    const dbEntry = await serverConfigDb.executeCustom((collection: Collection) => collection.find({}).toArray());

    const customRepliableGuilds: number[] = [];

    for (let guild of dbEntry) {
        if (guild.custom_replies == 'on') customRepliableGuilds.push(guild.guildId);
    }

    global.locks.set('custom_reply', customRepliableGuilds)
}