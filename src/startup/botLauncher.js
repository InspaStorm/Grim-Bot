import { createSpinner } from 'nanospinner';
import gradient from 'gradient-string';
import figlet from 'figlet'
import chalk from 'chalk';

import {cmdLoader} from'./commandLoader.js';
import {initAchievement} from'../misc/achievementCheck.js';
import initLock from './featureLocks.js'
import {updateLeader} from'../loops/leaderboard.js';
import {startDb} from'../startup/database.js';

// wait for some time (default = 2 secs)
const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

export async function startAsDevolopment (client, token, loadingBot) {

    console.clear();
    await figlet('Mr. Grim',{
    	font: "Epic",
    }, (err, data) => {
    	console.log(gradient.rainbow.multiline(data))
    });
    // wait for the text to be rendered
    await sleep(1000);

    const cmdLoading = createSpinner('Loading commands..').start();
    await cmdLoader(client.commands);
    cmdLoading.success({text: 'Commands got loaded'})

    const loadingDb = createSpinner("Connecting to database..").start()

    await startDb()
    loadingDb.success({text: 'Connected to Database'});
    const lockAchievements = initAchievement();
    await initLock(client)
    loadingBot.start();
    client.login(token)

  return lockAchievements

}

export async function startAsProduction (client, token) {

  console.log('✅  Index file got started');

  await cmdLoader(client.commands);
  console.log('📨  Commands got loaded ')

  console.log('🔃  Database is being loaded..')

  await startDb()
	console.log('📊  Connected to Database');
  const lockAchievements = initAchievement();
  await initLock(client)
  await client.login(token)
  // .then(updateLeader(client))

  return lockAchievements

}
