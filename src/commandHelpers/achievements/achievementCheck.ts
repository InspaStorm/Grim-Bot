import { EmbedBuilder, Message } from "discord.js";
import dbManager from "../../database/dbCrud.js";
import achievementList from "./achievementList.js";
import { replier } from "../../helpers/apiResolver.js";
import { lockAchievements } from "../../startup/featureLocks.js";

const collection = new dbManager("level");

let resolvingFoundAchievement = new Map();

interface userAchievementDoc {
  achievements: number[];
}

export async function lookForAchievement(
  msg: Message,
  userID: string,
  userData: userAchievementDoc
) {
  async function makeEmbed(
    index: number,
    userID: string,
    userAchievements: userAchievementDoc
  ) {
    resolvingFoundAchievement.set(userID, index);
    let amountOfUnlockedAwards;
    if (typeof amountOfUnlockedAwards != "undefined") {
      userAchievements.achievements.length + 1;
    } else amountOfUnlockedAwards = 1;
    const unlockedEmbed = new EmbedBuilder()
      .setColor("#00ffff")
      .setTitle("<:achievement:939468591395377213> Achivement Unlocked")
      .addFields(achievementList[index])
      .setFooter({
        text: `Found ${amountOfUnlockedAwards} out of ${
          Object.keys(achievementList).length
        } achievements`,
      });

    await collection.singleUpdate(
      { id: userID },
      { $addToSet: { achievements: index } }
    );
    replier(msg, { embeds: [unlockedEmbed] });
    await lockAchievements();
  }

  if (userData == undefined || !userData.achievements.includes(0)) {
    if (msg.guild!.id === "802904126312808498") {
      await makeEmbed(0, userID, userData);
      return "Achievement Found";
    }
  } else return "None Found";

  if (userData == undefined || !userData.achievements.includes(1)) {
    if (msg.content.toLowerCase().startsWith("hm")) {
      await makeEmbed(1, userID, userData);
      return "Achievement Found";
    }
  } else return "None Found";
}
