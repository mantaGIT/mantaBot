const { SlashCommandBuilder } = require("discord.js");

const { GAMEMODE } = require("../../data/schema/api-data-mapping.js");
const replyBuilder = require("../../reply-builders/replyBuilder.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("엑매")
        .setDescription("스플래툰3 X 매치 스케줄을 알려줍니다."),
    async execute(interaction) {
        await replyBuilder.scheduleReply(interaction, GAMEMODE.X);
    },
};