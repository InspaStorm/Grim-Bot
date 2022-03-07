import discord from 'discord.js';
import {db} from './database.js';


export async function lockLevel(client, isInitialize = false) {

    client.locks.delete('level')

    const collection = db.collection('server-conf');

    const dbEntry = await collection.find({}).toArray();

    const levelEnabledGuild = [];

    for (let guild of dbEntry) {
    if (guild.level == 'on') levelEnabledGuild.push(guild.guildId);
    }

    client.locks.set('level', levelEnabledGuild)
}

export default async function initAllLocks(client) {
  client.locks.clear();

  await lockLevel(client, true)
  await lockAchievements(client, true)

}

export async function lockAchievements(client, isInitialize = false) {

    client.locks.delete('achievement')

    const collection = db.collection('level');

    const dbEntry = await collection.find({}).toArray();

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

    client.locks.set('achievement', userDetails)
}
