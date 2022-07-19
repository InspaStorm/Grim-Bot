import { Collection } from 'discord.js';
import { CmdManager } from '../startup/commandLoader';

declare global {
    var locks: Collection<"level" | "achievement" | "custom_reply", Array<any>>;
    var cmdManager: CmdManager;
}