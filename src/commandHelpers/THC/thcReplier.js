import { updateThcPoint } from './thcPoints.js';
import dbManager from '../../helpers/dbCrud.js';

const serverConfDb = new dbManager('server-conf');

async function getCustomReply(msgGuildId) {
  const guildInfo = await serverConfDb.singleFind({guildId: msgGuildId}); 
  const customReply = guildInfo.custom_replies_list[Math.floor(Math.random()*guildInfo.custom_replies_list.length)];
  return `*${customReply}*`
}

export async function replyHm(triggerWord, user, guild){
  const randInt = Math.floor(Math.random() * 5);
  const luck = Math.floor(Math.random() * 101);

  const customReplies = [
    'Haha hmm go brrr',
    'hmmm hmmmmm huh?!?!',
    'HMMMMMMMMMM!!!!!',
    'hmm :l',
    'hmmmmmm hmmm hm hmm :( [Translation: Raccoon took my bed :(]',
    'hmmmmmmm hmmm hmmm >:3'
  ];

  updateThcPoint(user);

  if (luck > 90) {
    const customReply = await getCustomReply(guild.id)
    return customReply
  } else if(luck > 5) {
    const greetBack = triggerWord.slice(0, -1) + (triggerWord.substr(-1).repeat(randInt))
    return greetBack
  } else if(luck <= 5) {
    return customReplies[Math.floor(Math.random()* customReplies.length)]
  }
}
