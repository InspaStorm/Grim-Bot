import { createSpinner } from 'nanospinner';
import gradient from 'gradient-string';
import figlet from 'figlet'
import chalk from 'chalk';

import {cmdLoader} from'./commandLoader.js';
import initLock from './featureLocks.js'
import {startDb} from'../startup/database.js';
// import {updateLeader} from'../loops/leaderboard.js';

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

    const loadingDb = createSpinner("Connecting to database..").start()

    await startDb(true)
    loadingDb.success({text: 'Connected to Database'});

    const cmdLoading = createSpinner('Loading commands..').start();
    await cmdLoader(client.commands);
    cmdLoading.success({text: 'Commands got loaded'})

    await initLock(client)
    loadingBot.start();
    client.login(token)

}

export async function startAsProduction (client, token) {

  console.log('✅  Index file got started');

  console.log('🔃  Database is being loaded..')

  await startDb(false)
  console.log('📊  Connected to Database');

  await cmdLoader(client.commands);
  console.log('📨  Commands got loaded ')

  await initLock(client)
  await client.login(token)
  // .then(updateLeader(client))

}
