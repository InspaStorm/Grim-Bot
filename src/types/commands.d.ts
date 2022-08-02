import { CommandInteractionOption, CacheType, CommandInteraction, CommandInteractionOptionResolver, User } from "discord.js";

export interface CommandParamType {
    msg: CommandInteraction,
    args: readonly CommandInteractionOption<CacheType>[],
    author: User = msg.user,
    isInteraction: boolean = false
}