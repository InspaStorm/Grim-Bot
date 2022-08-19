import dbManager from "../../database/dbCrud.js";
import { CommandParamType } from "../../types/commands.js";

interface Items {
  name: string;
  quantity: number;
}

class TableCreator {
  items: Items[];
  padding: number;
  table: string[];

  constructor() {
    this.items = [];
    this.padding = 0;
    this.table = [];
  }

  addTitle(title: string) {
    const titleFormat = "```" + title + "```";

    this.table.push(titleFormat);
  }

  addItem(label: string, quantity: number) {
    const newItem: Items = { name: label, quantity: quantity };

    this.items.push(newItem);
  }

  fixPadding() {
    let maxLen = 0;

    for (let item of this.items) {
      let nameLength = item.name.length;
      if (nameLength > maxLen) maxLen = nameLength;
    }

    this.padding = maxLen;
    return this.padding;
  }

  createTable(title: string) {
    this.fixPadding();
    this.addTitle(title);

    if (this.items.length < 1) {
      this.table.push("||Psst... Your inventory is empty =(||");
      return;
    }

    for (let item of this.items) {
      let nameLength = item.name.length;
      if (nameLength < this.padding) {
        item.name += " ".repeat(this.padding - nameLength);
      }

      this.table.push(`> **${item.name}** **>>** ${item.quantity}`);
    }
  }
}

const inv = new dbManager("inventory");

const alias: { [key: string]: string } = {
  chm: "Custom Hm Message Token",
};

function alteredLook(e: string) {
  if (Object.keys(alias).includes(e)) {
    return alias[e];
  }

  return e;
}

export default {
  name: "inventory",
  description: "Get a look inside of your inventory",
  alias: ["e", "pocket"],
  options: [],

  /**
   *
   * @param {Message} msg message
   * @param {String[]} args array of args
   * @param {GuildMember} author author of the message
   * @param {Boolean} isInteraction whether the message is from interaction or not
   */
  async run(invokeParams: CommandParamType) {
    const user = invokeParams.author;

    const items = await inv.singleFind({ id: user.id });

    const table = new TableCreator();

    if (items != null) {
      // Deleting id & _id field found in the document(Database)
      ["id", "_id"].forEach((key) => delete items[key]);

      Object.keys(items).forEach((e: string) =>
        table.addItem(alteredLook(e), items[e])
      );
    }

    table.createTable(`${user.username}'s inventory:`);

    return { content: table.table.join("\n") };
  },
};
