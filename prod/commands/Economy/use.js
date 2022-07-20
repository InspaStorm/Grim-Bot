import { MessageActionRow, MessageButton, Modal, TextInputComponent } from 'discord.js';
import dbManager from '../../database/dbCrud.js';
import { editReply, replier } from '../../helpers/apiResolver.js';
import { SHOP_ITEMS } from '../../commandHelpers/economy/shopItems.js';
import ItemUsageManager from '../../commandHelpers/economy/usageManager.js';
const userInvDb = new dbManager('inventory');
const serverConf = new dbManager('server-conf');
const YES_BUTTON = 1, NO_BUTTON = 2, MODAL_SUBMIT = 3;
const usageManager = new ItemUsageManager();
export default {
    name: 'use',
    description: 'Use the things in your inventory',
    alias: [],
    options: [
        { name: "item", desc: "Item to use", required: true, type: "string", choices: SHOP_ITEMS }
    ],
    /**
    *
    * @param {CommandInteraction} msg message
    * @param {String[]} args array of args
    * @param {GuildMember} author author of the message
    * @param {Boolean} isInteraction whether the message is from interaction or not
    */
    async run(msg, args, author = msg.author, isInteraction = false) {
        const userId = author.id;
        const userInv = await userInvDb.singleFind({ id: userId });
        const itemToBeUsed = msg.options.getString('item');
        if (userInv) {
            ['id', '_id'].forEach(key => delete userInv[key]);
            const itemCount = userInv[itemToBeUsed];
            if (itemCount) {
                const CHOICE_BUTTONS_ROW = new MessageActionRow()
                    .addComponents(new MessageButton()
                    .setCustomId(`use ${YES_BUTTON}`)
                    .setLabel('Yes')
                    .setStyle('SUCCESS'), new MessageButton()
                    .setCustomId(`use ${NO_BUTTON}`)
                    .setLabel('No')
                    .setStyle('DANGER'));
                usageManager.addNewEntry(userId, itemToBeUsed);
                const confirmation = await replier(msg, { content: `Do you wanna use 1 of your ${userInv[itemToBeUsed]} ${itemToBeUsed}`, components: [CHOICE_BUTTONS_ROW] });
                return { selfRun: true };
            }
            else {
                return { content: `You don't have **${itemToBeUsed}** in your inventory` };
            }
        }
    },
    /**
     *
     * @param {ButtonInteraction} msg
     * @returns
     */
    async handle(msg) {
        const userId = msg.user.id;
        const args = msg.customId.split(" ");
        args.shift();
        if (args[0] == YES_BUTTON) {
            if (!usageManager.has(userId)) {
                msg.reply('Hmm?');
                return;
            }
            usageManager.remove(userId);
            const modal = new Modal()
                .setCustomId('use 3')
                .setTitle('Custom Reply');
            const customReplyInput = new TextInputComponent()
                .setCustomId('customReplyInput')
                // The label is the prompt the user sees for this input
                .setLabel("Enter your short custom reply:")
                // Short means only a single line of text
                .setStyle('SHORT');
            const actionRow = new MessageActionRow().addComponents(customReplyInput);
            modal.addComponents(actionRow);
            await msg.showModal(modal);
            await editReply(msg.message, { content: "Opening a text input..", components: [] }, true);
        }
        if (args[0] == NO_BUTTON) {
            return 0;
        }
        if (args[0] == MODAL_SUBMIT) {
            const newCustomReply = msg.fields.getTextInputValue('customReplyInput');
            userInvDb.singleUpdate({ id: userId }, { "$inc": { "Custom Reply": -1 } });
            serverConf.singleUpdate({ guildId: msg.guild.id }, { "$push": { "custom_replies_list": newCustomReply } });
            msg.reply("Added your custom reply!");
        }
    }
};
