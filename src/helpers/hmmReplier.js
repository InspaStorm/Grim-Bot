import { updatePoint } from '../misc/chatPoints.js';

export function replyHm(triggerWord, user){
  const randInt = Math.floor(Math.random() * 5);
  const luck = Math.floor(Math.random() * 101);

  const customReplies = [
    'hmmm hmmmmm huh?!?!',
    'HMMMMMMMMMM!!!!!',
    'hmm :l',
    'hmmmmmm hmmm hm hmm :( [Translation: Steve took my bed :(]',
    'hmmmmmmm hmmm hmmm >:3'
  ];

  if(luck > 5) {
    const greetBack = triggerWord.slice(0, -1) + (triggerWord.substr(-1).repeat(randInt))
    updatePoint(user);
    return greetBack
  }

  else if(luck <= 5) {
    updatePoint(user);
    return customReplies[luck - 1]
  }
}

export default {replyHm : replyHm}