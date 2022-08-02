import { MessageActionRow } from "discord.js";

export interface BasicGameInfoType {
    msgId: string,
    playerId: string,
    playerName: string,
    answer: number | null,
    components: MessageActionRow[] | null,
    endCallback: CallableFunction
}