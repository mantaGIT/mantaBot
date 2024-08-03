const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('명령어를 실행한 유저에게 Hello 메세지를 보냅니다.'),
    async execute(interaction) {
        // console.dir(interaction); // debug
        await interaction.reply(`Hello, ${interaction.user.globalName}!`);
    }
};