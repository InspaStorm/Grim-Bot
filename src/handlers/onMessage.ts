import { executeCommand } from "./commandRunner.js";
import { updateLevel } from "../commandHelpers/level/updateLevel.js";
import { replyHm } from "../commandHelpers/THC/thcReplier.js";

const prefix: string = "g!";

import { lookForAchievement } from "../commandHelpers/achievements/achievementCheck.js";
import achievementList from "../commandHelpers/achievements/achievementList.js";
import { Message } from "discord.js";

// Checks if user has completed all achievements if not looks for if he completed any achievements
function lookingAchievements(msg: Message, authorID: string) {
  try {
    const userData = global.locks.get("achievement")!.find((user) => {
      return user.id == authorID;
    });
    if (
      userData == undefined ||
      userData.achievements.length != achievementList.length
    ) {
      lookForAchievement(msg, authorID, userData);
    }
  } catch (err) {
    console.log("error: ", err);
  }
}

export async function handleMessage(msg: Message) {
  console.log(msg.content);
  const lowerCasedMsg = msg.content.toLowerCase();

  if (msg.author.bot) return;
  if (global.locks.get("level")!.includes(msg.guild!.id))
    await updateLevel(msg.author, msg.guild!.id, msg);
  lookingAchievements(msg, msg.author.id);

  if (lowerCasedMsg.startsWith(prefix)) {
    const commandName = lowerCasedMsg.split(" ")[0].substr(2);

    // if (commandName == 'ping') {
    // 	const args = lowerCasedMsg.split(" ");
    // 	args.shift();

    // 	executeCommand(commandName, {msg: msg, author: msg.user, isInteraction: false, args: args});

    // 	return;
    // }

    msg.reply(
      "Commands can now only be accessed via slash(/) commands\nType `/` and then select the command!\n**Got stuck? Read:**\nhttps://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ"
    );
  }

  if (lowerCasedMsg.startsWith("hm")) {
    const res = await replyHm(lowerCasedMsg, msg.author, msg.guild!);
    msg.channel.send(res!);
  }

  if (
    msg.mentions.has(msg.client.user!) &&
    !msg.mentions.everyone &&
    !msg.mentions.repliedUser
  )
    msg.reply({ content: `Refer **/help** for help =)` });
}
