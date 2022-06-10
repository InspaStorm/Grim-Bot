import dbManager from '../helpers/dbCrud.js';

const serverConfigDb = new dbManager('server-conf');
const achievementDb = new dbManager('level');


export default async function initAllLocks(client) {
    global.locks.clear();
    
    await lockLevel(client, true);
    await lockAchievements(client, true);
    await lockCustomReplies(client, true);
    
}

export async function lockLevel(client, isInitialize = false) {

    global.locks.delete('level')

    const dbEntry = await serverConfigDb.executeCustom(collection => collection.find({}).toArray());

    const levelEnabledGuild = [];

    for (let guild of dbEntry) {
        if (guild.level == 'on') levelEnabledGuild.push(guild.guildId);
    }

    global.locks.set('level', levelEnabledGuild)
}

export async function lockAchievements(client, isInitialize = false) {

    global.locks.delete('achievement')

    const dbEntry = await achievementDb.executeCustom(collection => collection.find({}).toArray());

    let userDetails = [];

    let user;
    for (user of dbEntry) {

        if (user.achievements.length > 0) {

            let eachUser = {id: user.id, achievements: []}
            let achievement;

            for (achievement of user.achievements) {
                eachUser.achievements.push(achievement)
            }

            userDetails.push(eachUser)
        }
    }

    global.locks.set('achievement', userDetails)
}

export async function lockCustomReplies(client, isInitialize = false) {

    global.locks.delete('custom_reply')

    const dbEntry = await serverConfigDb.executeCustom(collection => collection.find({}).toArray());

    const customRepliableGuilds = [];

    for (let guild of dbEntry) {
        if (guild.custom_replies == 'on') customRepliableGuilds.push(guild.guildId);
    }

    global.locks.set('custom_reply', customRepliableGuilds)
}