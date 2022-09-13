import dbManager from "../../database/dbCrud.js";
import discord, {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import {
  SHOP_ITEMS,
  ITEM_DETAILS,
} from "../../commandHelpers/economy/shopItems.js";
import { GRIMS_EMOJI } from "../../helpers/emojis.js";
import { CommandParamType } from "../../types/commands.js";

const thc = new dbManager("thc");
const inventory = new dbManager("inventory");

class Item {
  owner: string;
  name: string;
  cost: number;

  constructor(buyer: string, name: string, cost: number) {
    this.owner = buyer;
    this.name = name;
    this.cost = cost;
  }
}

class Market {
  pending: Item[];
  constructor() {
    this.pending = [];
  }

  has(buyer: string) {
    return this.pending.find((item) => item.owner == buyer);
  }

  add(buyer: string, name: string) {
    const itemCost = ITEM_DETAILS.find((x) => (x.name = name))!.cost;

    let newItem = new Item(buyer, name, itemCost);

    this.pending.push(newItem);

    setTimeout(() => this.remove(buyer), 30_000);

    return newItem;
  }

  remove(buyer: string) {
    const indexOfPending = this.pending.findIndex((x) => x.owner == buyer);

    this.pending.splice(indexOfPending, 1);

    return { content: "Cancelled your order" };
  }

  async process(buyer: string) {
    let item = this.has(buyer);
    if (!item)
      return { content: "Start a new session using `/shop`", components: [] };

    this.remove(buyer);
    const availablePoints = await thc.singleFind({ id: item.owner });
    if (availablePoints == null)
      return {
        content:
          "It seems you dont have much Grims, gather some by sending `hmm` in chat",
        components: [],
      };

    if (availablePoints.count < item.cost)
      return {
        content: `You are short by ${GRIMS_EMOJI}**${
          item.cost - availablePoints.count
        }**!`,
        components: [],
      };
    await thc.singleUpdate({ id: buyer }, { $inc: { count: -item.cost } });
    const receipt = await this.purchase(buyer, item);
    return receipt;
  }

  async purchase(buyer: string, itemDetails: Item) {
    const userInventory = await inventory.singleFind({ id: buyer });

    if (userInventory != null) {
      await inventory.singleUpdate(
        { id: buyer },
        { $inc: { [itemDetails.name]: 1 } }
      );
    } else {
      const newEntry: { [key: string]: number | string } = {
        id: buyer,
      };

      newEntry[itemDetails.name] = 1;

      inventory.singleInsert(newEntry);
    }
    return {
      content: `You purchased **${itemDetails.name}** for ${GRIMS_EMOJI}**${itemDetails.cost}**!\n\nCheck it out using: **/inventory**`,
      components: [],
    };
  }
}

const register = new Market();

export default {
  name: "shop",
  description: "Exchange Grims for some spicy items",
  alias: ["redeem"],
  options: [
    {
      name: "item",
      desc: "Item to be purchased",
      required: true,
      type: ApplicationCommandOptionType.String,
      choices: SHOP_ITEMS,
    },
  ],

  /**
   *
   * @param {Message} msg message
   * @param {String[]} args array of args
   * @param {GuildMember} author author of the message
   * @param {Boolean} isInteraction whether the message is from interaction or not
   */
  async run(invokeParams: CommandParamType) {
    let item = invokeParams.msg.options.get("item")?.value! as string;

    const pendingDeal = register.add(invokeParams.author.id, item);

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new discord.ButtonBuilder()
        .setCustomId("shop 1")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success),
      new discord.ButtonBuilder()
        .setCustomId("shop 2")
        .setLabel("No")
        .setStyle(ButtonStyle.Danger)
    );

    return {
      content: `Are you sure on buying **${pendingDeal.name}** from ${GRIMS_EMOJI}**${pendingDeal.cost}**?`,
      components: [buttons],
    };
  },

  async handle(msg: any) {
    const args = msg.customId.split(" ");
    args.shift();

    if (args[0] == 1) {
      if (register.has(msg.user.id)) {
        const res = await register.process(msg.user.id);
        msg.update(res);
      }
    } else {
      if (register.has(msg.user.id)) {
        const res = await register.process(msg.user.id);
        msg.update(res);
      }
    }
  },
};
