// const path = require('node:path');
// const mainPath = path.dirname(path.dirname(path.dirname(__dirname)));

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('오픈스케줄')
		.setDescription('스플래툰3 카오폴리스 매치 (오픈) 스케줄 정보를 알려줍니다.'),
	async execute(interaction) {
		await interaction.deferReply();

		const exampleEmbed = new EmbedBuilder()
			.setTitle(`현재 시간 : ${new Date(Date.now())}`);

		const scheduleTimes = ['08/19, 9:00 ~ 08/19, 11:00', '08/19, 11:00 ~ 08/19, 13:00', '08/19, 13:00 ~ 08/19, 15:00'];
		const select = new StringSelectMenuBuilder()
			.setCustomId('scheduleTime')
			.setPlaceholder('스케줄 시간을 선택해주세요.')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel(`${scheduleTimes[0]}`)
					.setDescription('해당 시간대의 카오폴리스 매치(오픈) 스케줄을 확인합니다.')
					.setValue(`[${scheduleTimes[0]}] 스케줄 데이터`),
				new StringSelectMenuOptionBuilder()
					.setLabel(`${scheduleTimes[1]}`)
					.setDescription('해당 시간대의 카오폴리스 매치(오픈) 스케줄을 확인합니다.')
					.setValue(`[${scheduleTimes[1]}] 스케줄 데이터`),
				new StringSelectMenuOptionBuilder()
					.setLabel(`${scheduleTimes[2]}`)
					.setDescription('해당 시간대의 카오폴리스 매치(오픈) 스케줄을 확인합니다.')
					.setValue(`[${scheduleTimes[2]}] 스케줄 데이터`),
			);

		const row = new ActionRowBuilder()
			.addComponents(select);

		const response = await interaction.editReply({
			embeds: [ exampleEmbed ],
			components: [ row ],
		});

		// 응답 가능 시간 : 30초
		const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 30_000 });

		collector.on('collect', async i => {
			if (i.member.id != interaction.user.id) {
				return i.reply({ content: '선택은 명령어 사용자만 가능합니다.', ephemeral: true });
			}
			// console.log(i);
			const selection = i.values[0];
			const editEmbed = new EmbedBuilder().setTitle(`스케줄 : ${selection}`);
			i.deferUpdate();
			await response.edit({ embeds: [ editEmbed ] });
		});
		collector.on('end', () => {
			interaction.editReply({ content: '선택 가능 시간이 만료되었습니다.' });
		});
	},
};