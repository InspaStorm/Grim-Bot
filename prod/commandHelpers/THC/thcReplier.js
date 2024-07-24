import { updateThcPoint } from "./thcPoints.js";
import dbManager from "../../database/dbCrud.js";
const serverConfDb = new dbManager("server-conf");
function getBasicReply(inputSentence) {
    const MAX_RECURTION = 5;
    const timesToBeRecurred = Math.floor(Math.random() * MAX_RECURTION);
    const formattedSentence = inputSentence.slice(0, -1) +
        inputSentence.substring(-1).repeat(timesToBeRecurred);
    return formattedSentence;
}
async function getCustomReply(msgGuildId) {
    const guildInfo = await serverConfDb.singleFind({
        guildId: msgGuildId,
    });
    const customReply = guildInfo.custom_replies_list[Math.floor(Math.random() * guildInfo.custom_replies_list.length)];
    return `*${customReply}*`;
}
export async function replyHm(triggerWord, user, guild) {
    const luck = Math.floor(Math.random() * 101);
    const customReplies = [
        "Haha hmm go brrr",
        "hmmm hmmmmm huh?!?!",
        "HMMMMMMMMMM!!!!!",
        "hmm :l",
        "hmmmmmm hmmm hm hmm :( [Translation: Raccoon took my bed :(]",
        "hmmmmmmm hmmm hmmm >:3",
    ];
    updateThcPoint(user);
    if (luck > 90) {
        if (!global.locks.get("custom_reply").includes(guild.id)) {
            const greetBack = getBasicReply(triggerWord);
            return greetBack;
        }
        const customReply = await getCustomReply(guild.id);
        return customReply;
    }
    else if (luck > 5) {
        const greetBack = getBasicReply(triggerWord);
        return greetBack;
    }
    else if (luck <= 5) {
        return customReplies[Math.floor(Math.random() * customReplies.length)];
    }
}
