import discord from 'discord.js';
import {db} from './database.js';

const collection = db.collection('server-conf');

export async function lockLevel(client, dbEntry, isInitialize = false) {
  client.locks.clear();
  if (!isInitialize) dbEntry = await collection.find({}).toArray();

  const levelEnabledGuild = [];

  for (let guild of dbEntry) {
    if (guild.level == 'on') levelEnabledGuild.push(guild.guildId);
  }

  client.locks.set('level', levelEnabledGuild)
}

export default async function initAllLocks(client) {
  const dbData = await collection.find({}).toArray();

  await lockLevel(client, dbData, true)
}
