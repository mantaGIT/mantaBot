const process = require('node:process');
require('dotenv').config();

const { stages, rules } = require(process.env.LANGUAGE);
const { gamemode } = require(process.env.GAMEMODE_KR);
const _ = require('lodash');

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
const { GAMEMODE } = require(process.env.API_DATA_SCHEMA);
const { createStagesImg, createModeImg } = require(path.join(process.env.SCRIPTS, 'data/image-processor.js'));

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
		// const mode = GAMEMODE['REGULAR'];
		const optionValue = GAMEMODE[interaction.options.getString('mode')];

		const schedulesFilePath = path.join(process.env.RESOURCES, `data/schedules/${optionValue.id}.json`);
		const schedulesFile = fs.readFileSync(schedulesFilePath);
		const schedules = JSON.parse(schedulesFile);

		const timeNow = Date.now();
		// const curr = schedules[0];
		const curr = schedules.find((schedule) => timeNow >= new Date(schedule.startTime) && timeNow < new Date(schedule.endTime));
		const dateFormat = {
			dateStyle: 'long',
			timeStyle: 'short',
			timeZone: 'Asia/Seoul',
		};
		const mode = _.get(gamemode, `${curr.mode}.name`);
		const startTime = new Intl.DateTimeFormat('ko-KR', dateFormat).format(new Date(curr.startTime));
		const endTime = new Intl.DateTimeFormat('ko-KR', dateFormat).format(new Date(curr.endTime));
		const rule = _.get(rules, `${curr.rule.id}.name`);
		const [ stage1, stage2 ] = curr.stages.map(x => _.get(stages, `${x.id}.name`));

		// const msg = `모드: ${mode}\n${startTime} ~ ${endTime}\n룰: ${rule}\n맵: ${stage1}, ${stage2}`;
		const [ stageImgUrl1, stageImgUrl2 ] = curr.stages.map(x => x.image.url);
		const stagesImg = await createStagesImg(stageImgUrl1, stageImgUrl2);
		const modeImg = await createModeImg(curr.mode);

		const scheduleInfoEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(mode)
			// .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
			.setDescription(`${startTime} ~ ${endTime}`)
			.setThumbnail(`attachment://${modeImg.name}`)
			.addFields({ name: '룰', value: `${rule}` })
			.addFields({ name: '스테이지', value: `${stage1} / ${stage2}` })
			.setImage(`attachment://${stagesImg.name}`)
			.setTimestamp();
			// .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

		await interaction.reply({
			embeds: [ scheduleInfoEmbed ],
			files: [ stagesImg, modeImg ],
		});

	},
};