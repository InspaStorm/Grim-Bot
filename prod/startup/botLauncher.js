import { createSpinner } from 'nanospinner';
import gradient from 'gradient-string';
import figlet from 'figlet';
import { cmdLoader } from './command-loading/commandLoader.js';
import initLock from './featureLocks.js';
import { startDb } from './database.js';
// wait for some time (default = 2 secs)
const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));
export async function startAsDevolopment(client, token, loadingBot) {
    console.clear();
    figlet('Mr. Grim', {
        font: "Small Slant",
    }, (_err, data) => {
        console.log(gradient.rainbow.multiline(data));
    });
    // wait for the text to be rendered
    await sleep(1000);
    const loadingDb = createSpinner("Connecting to local database..").start();
    await startDb();
    loadingDb.success({ text: 'Connected to Database' });
    const cmdLoading = createSpinner('Loading commands..').start();
    global.cmdManager = await cmdLoader();
    cmdLoading.success({ text: 'Commands got loaded' });
    await initLock();
    loadingBot.start();
    await client.login(token);
}
export async function startAsProduction(client, token) {
    console.log('✅  Index file got started');
    console.log('🔃  Database is being loaded..');
    await startDb();
    console.log('📊  Connected to Database');
    global.cmdManager = await cmdLoader();
    console.log('📨  Commands got loaded ');
    await initLock();
    await client.login(token);
}
