const path = require('node:path');
// eslint-disable-next-line no-undef
const mainPath = path.dirname(path.dirname(path.dirname(__dirname)));
const { SlashCommandBuilder } = require('discord.js');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const { GAMEMODE } = require(path.join(mainPath, 'scripts/data/schema/api-data-mapping.js'));
const schedHandler = require(path.join(mainPath, 'scripts/data/schedule-data-handler.js'));
const embedSchedBuilder = require(path.join(mainPath, 'scripts/reply-builders/embed-schedule-builder.js'));


module.exports = {
	data: new SlashCommandBuilder()
		.setName('현재스케줄')
		.setDescription('현재 스플래툰3 스케줄 정보를 알려줍니다.')
		.addStringOption(option =>
			option.setName('mode')
				.setDescription('원하는 게임 모드를 선택합니다. ex.레귤러, 오픈')
				.setRequired(true)
				.addChoices(
					{ name: '레귤러', value: 'REGULAR' },
					{ name: '챌린지', value: 'CHALLENGE' },
					{ name: '오픈', value: 'OPEN' },
					{ name: '엑매', value: 'X' },
				)),
	async execute(interaction) {
		await interaction.deferReply();

		const optionValue = GAMEMODE[interaction.options.getString('mode')];
		const schedules = schedHandler.loadScheduleJson(optionValue);
		if (schedules === undefined) throw new Error('cannot load schedule json file.');

		const scheduleNow = schedHandler.getScheduleNow(schedules);
		if (scheduleNow === undefined) throw new Error('cannot find schedule now.');

		const embedSched = await embedSchedBuilder.embedScheduleBuilder(scheduleNow);

		const next = new ButtonBuilder()
			.setCustomId('next')
			.setLabel('다음 스케줄 확인하기')
			.setStyle(ButtonStyle.Primary);

		const actionRow = new ActionRowBuilder().addComponents(next);

		const response = await interaction.editReply({
			embeds: embedSched.embeds,
			files: embedSched.files,
			components: [ actionRow ],
		});

		const collectorFilter = i => i.user.id === interaction.user.id;

		try {
			// 버튼 응답 가능 시간 : 3분 (time: ms) => 3 * 60 * 1000
			const clickedButton = await response.awaitMessageComponent({ filter: collectorFilter, time: 180_000 });

			if (clickedButton.customId === 'next') {
				const nextSched = schedHandler.getScheduleByNode(schedules, scheduleNow.node + 1);
				const editEmbed = await embedSchedBuilder.embedScheduleBuilder(nextSched);
				actionRow.components[0].setDisabled(true);
				await clickedButton.update({
					embeds: editEmbed.embeds,
					files: editEmbed.files,
					components: [ actionRow ],
				});
			}
		}
		// eslint-disable-next-line no-unused-vars
		catch (error) {
			console.log('/현재스케줄 command button timeout.');
		};
	},
};