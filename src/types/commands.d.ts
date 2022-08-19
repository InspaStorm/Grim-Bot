import {
  CommandInteractionOption,
  CacheType,
  CommandInteraction,
  CommandInteractionOptionResolver,
  User,
} from "discord.js";

export interface CommandParamType {
  msg: CommandInteraction;
  args: any;
  author: User = msg.user;
  isInteraction: boolean = false;
}
