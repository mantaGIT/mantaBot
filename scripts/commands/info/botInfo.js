const { SlashCommandBuilder } = require("discord.js");
const botInfoEmbedBuilder = require("../../../scripts/reply-builders/botInfo-embedBuilder.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("만타봇")
        .setDescription("만타봇 정보를 알려줍니다."),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const botInfoEmbed = await botInfoEmbedBuilder.botInfoEmbedBuilder();
        await interaction.editReply(botInfoEmbed);
    },
};
