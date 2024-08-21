const { SlashCommandBuilder, ActionRowBuilder } = require('discord.js');
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } = require('discord.js');

const { GAMEMODE } = require('../../../scripts/data/schema/api-data-mapping.js');
const schedHandler = require('../../../scripts/data/schedule-data-handler.js');
const schedEmbedBuilder = require('../../reply-builders/schedule-embedBuilder.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('오픈')
		.setDescription('스플래툰3 카오폴리스 매치 (오픈) 스케줄 정보를 알려줍니다.'),
	async execute(interaction) {
		await interaction.deferReply();

		const schedules = schedHandler.loadScheduleJson(GAMEMODE.OPEN);
		if (schedules === undefined) throw new Error('cannot load schedule json file.');

		const scheduleNow = schedHandler.getScheduleNow(schedules);
		if (scheduleNow === undefined) throw new Error('cannot find schedule now.');

		const schedEmbed = await schedEmbedBuilder.embedScheduleBuilder(scheduleNow);

		// 스케줄의 시작 시간만 표시, 2024년 08월 20일 21:00와 같은 형식
		const dateFormat = {
			dateStyle: 'long',
			timeStyle: 'short',
			hour12: false,
			timeZone: 'Asia/Seoul',
		};
		const schedTimeList = schedules.map((schedule) => {
			const startTime = new Intl.DateTimeFormat('ko-KR', dateFormat).format(new Date(schedule.startTime));
			return { node: String(schedule.node), time: `${startTime}` };
		}).filter((schedTime) => schedTime.node >= scheduleNow.node);

		const schedTimeMenu = new StringSelectMenuBuilder()
			.setCustomId('scheduleTime')
			.setPlaceholder('스케줄 시작 시간을 선택해주세요.')
			.addOptions(schedTimeList.map((schedTime) => {
				return new StringSelectMenuOptionBuilder()
					.setLabel(schedTime.time)
					.setValue(schedTime.node);
			}));

		const actionRow = new ActionRowBuilder().addComponents(schedTimeMenu);

		const response = await interaction.editReply({
			embeds: schedEmbed.embeds,
			files: schedEmbed.files,
			components: [ actionRow ],
		});

		// 응답 가능 시간 : 10분 (time: ms) => 10 * 60 * 1000
		const collector = response.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 600_000,
		});

		collector.on('collect', async i => {
			if (i.member.id !== interaction.user.id) {
				return i.reply({ content: '스케줄 시간 선택은 명령어 사용자만 가능합니다.', ephemeral: true });
			}
			if (i.customId === 'scheduleTime') {
				const selectedSched = schedHandler.getScheduleByNode(schedules, parseInt(i.values[0]));
				const editEmbed = await schedEmbedBuilder.embedScheduleBuilder(selectedSched);
				i.deferUpdate();
				await interaction.editReply(editEmbed);
			}
		});
		collector.on('end', () => {
			interaction.editReply({ content: '스케줄 선택 가능 시간이 만료되었습니다.' });
		});
	},
};