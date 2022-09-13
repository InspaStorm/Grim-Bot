import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Collection,
  ActivityType,
} from "discord.js";
import {
  startAsDevolopment,
  startAsProduction,
} from "./startup/botLauncher.js";
import { createSpinner } from "nanospinner";

export const client = new Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
});
global.locks = new Collection();

const isDevolopment = process.env.IS_DEVOLOPMENT;
const startingBot = createSpinner("Starting the bot...");
isDevolopment
  ? startAsDevolopment(client, process.env.BOT_TOKEN, startingBot)
  : startAsProduction(client, process.env.BOT_TOKEN);

import { logger } from "./helpers/logger.js";
import chalk from "chalk";
import { handleInteraction } from "./handlers/onInteraction.js";
import { handleMessage } from "./handlers/onMessage.js";

client.once("ready", () => {
  client.user!.setPresence({
    activities: [
      {
        name: "InspArmy",
        type: ActivityType.Watching,
      },
    ],
    status: "idle",
  });
  if (isDevolopment) {
    startingBot.success({
      text: chalk.yellow.bold(`${client.user!.tag} logged on!`),
      mark: "🎉",
    });
  } else {
    console.log(chalk.yellow.bold(`🎉  ${client.user!.tag} logged on!`));
  }
});

client.on("error", (e) => logger(e));
process.on("uncaughtException", (e) => logger(e));

// Slash commands handler
client.on("interactionCreate", (interaction) => {
  handleInteraction(interaction);
});

// Event triggered on getting a message from any channel of guild
client.on("messageCreate", async (msg) => {
  handleMessage(msg);
});
