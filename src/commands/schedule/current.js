const process = require('node:process');
require('dotenv').config();

const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { MODE } = require(path.join(process.env.RESOURCES, 'data/schedule-data.js'));

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
		const mode = MODE[interaction.options.getString('mode')];

		const schedulesFilePath = path.join(process.env.RESOURCES, `data/${mode.id}.json`);
		const schedulesFile = fs.readFileSync(schedulesFilePath);
		const schedules = JSON.parse(schedulesFile);

		const curr = schedules[0];
		const dateFormat = {
			dateStyle: 'long',
			timeStyle: 'short',
			timeZone: 'Asia/Seoul',
		};
		const startTime = new Intl.DateTimeFormat('ko-KR', dateFormat).format(new Date(curr.startTime));
		const endTime = new Intl.DateTimeFormat('ko-KR', dateFormat).format(new Date(curr.endTime));
		const msg = `모드: ${curr.mode}\n${startTime} ~ ${endTime}\n룰: ${curr.rule.name}\n맵: ${curr.stages[0].name}, ${curr.stages[1].name}`;
		// console.log(msg);
		await interaction.reply(msg);
	},
};