export default {
    name: "about",
    description: "Get some details about Mr. Grim",
    alias: [],
    options: [],
    /**
     *
     * @param {Interaction} msg message
     * @param {String[]} args array of args
     * @param {GuildMember} author author of the message
     * @param {Boolean} isInteraction whether the message is from interaction or not
     */
    async run(invokeParams) {
        return { content: `Guilds:\n${invokeParams.msg.client.guilds.cache.size}` };
    },
};
